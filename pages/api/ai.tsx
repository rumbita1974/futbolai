import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { Groq } from 'groq-sdk';

// Initialize Groq client
function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is required. Add it in Vercel environment variables.');
  }
  return new Groq({ apiKey });
}

// Improved JSON parsing with error handling
function safeParseJSON(content: string) {
  console.log('🔄 Attempting to parse JSON, length:', content.length);
  
  // Remove any markdown code blocks
  let cleaned = content.trim();
  
  // Remove ```json and ``` markers
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  }
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  
  // Remove any non-JSON text before or after
  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}') + 1;
  
  if (jsonStart !== -1 && jsonEnd > jsonStart) {
    cleaned = cleaned.substring(jsonStart, jsonEnd);
  }
  
  console.log('🧹 Cleaned content (first 300 chars):', cleaned.substring(0, 300));
  
  try {
    const parsed = JSON.parse(cleaned);
    console.log('✅ JSON parsed successfully');
    return parsed;
  } catch (parseError: any) {
    console.error('❌ JSON parse error:', parseError.message);
    
    // Try to fix common JSON issues
    try {
      // Try to fix trailing commas
      const fixed = cleaned.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      const reparsed = JSON.parse(fixed);
      console.log('✅ JSON re-parsed after fixing trailing commas');
      return reparsed;
    } catch (e) {
      console.error('❌ Still cannot parse JSON');
      
      // Return a simple fallback structure
      return {
        playerInfo: null,
        teamInfo: null,
        worldCupInfo: null,
        analysis: "AI analysis available",
        videoSearchTerm: "football highlights",
        confidenceScore: 0.5
      };
    }
  }
}

// Use Groq to analyze query and generate football insights
async function analyzeFootballQuery(query: string) {
  console.log('🤖 Starting AI analysis for:', query);
  const groq = getGroqClient();
  
  // SIMPLER PROMPT - Less complex JSON structure
  const prompt = `Analyze this football query: "${query}"

Return ONLY this JSON format:
{
  "playerInfo": {
    "name": "Full name",
    "position": "Position",
    "nationality": "Nationality",
    "currentClub": "Current club",
    "stats": {"goals": 0, "assists": 0, "appearances": 0},
    "achievements": []
  },
  "teamInfo": null,
  "worldCupInfo": null,
  "analysis": "Brief analysis here",
  "videoSearchTerm": "${query} football highlights 2024",
  "confidenceScore": 0.9
}

If "${query}" is a TEAM (club or national), set playerInfo to null and use:
{
  "playerInfo": null,
  "teamInfo": {
    "name": "Team name",
    "type": "club or national",
    "coach": "Coach name",
    "stadium": "Stadium",
    "achievements": []
  },
  "worldCupInfo": null,
  "analysis": "Brief analysis here",
  "videoSearchTerm": "${query} football highlights 2024",
  "confidenceScore": 0.9
}

If "${query}" is about WORLD CUP:
{
  "playerInfo": null,
  "teamInfo": null,
  "worldCupInfo": {
    "year": 2026,
    "host": "Host country"
  },
  "analysis": "Brief analysis here",
  "videoSearchTerm": "World Cup 2026 highlights",
  "confidenceScore": 0.9
}

Return ONLY the JSON, no other text or explanations.`;

  try {
    console.log('🚀 Calling Groq with model: llama-3.3-70b-versatile');
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 800,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    console.log('📄 Raw AI response received');
    
    // Use safe JSON parsing
    const parsed = safeParseJSON(content);
    
    // Ensure required fields exist
    if (!parsed.analysis) parsed.analysis = `Analysis of ${query}`;
    if (!parsed.videoSearchTerm) parsed.videoSearchTerm = `${query} football highlights`;
    if (!parsed.confidenceScore) parsed.confidenceScore = 0.8;
    
    return parsed;
    
  } catch (error: any) {
    console.error('❌ Groq API error:', error.message);
    
    // Return a fallback response that won't break the frontend
    return {
      playerInfo: null,
      teamInfo: null,
      worldCupInfo: null,
      analysis: `Could not analyze "${query}" at this time.`,
      videoSearchTerm: `${query} football highlights`,
      confidenceScore: 0.3,
      error: error.message
    };
  }
}

// Search YouTube for relevant videos
async function searchYouTube(searchTerm: string) {
  console.log('🎬 Searching YouTube for:', searchTerm);
  
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    if (!apiKey) {
      console.warn('YouTube API key not set');
      return 'https://www.youtube.com/embed/dZqkf1ZnQh4';
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${searchTerm} football highlights`,
        type: 'video',
        maxResults: 1,
        key: apiKey,
        videoEmbeddable: 'true',
        safeSearch: 'strict',
      },
    });

    if (response.data.items?.length > 0) {
      const videoId = response.data.items[0].id.videoId;
      return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch (error) {
    console.error('YouTube search error:', error);
  }
  
  return 'https://www.youtube.com/embed/dZqkf1ZnQh4';
}

// Main API handler with better error handling
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { action, query } = req.query;

  if (action === 'search' && query && typeof query === 'string') {
    console.log(`\n=== NEW REQUEST: "${query}" ===`);
    
    try {
      // Try AI analysis
      const aiAnalysis = await analyzeFootballQuery(query);
      console.log('✅ AI Analysis completed');
      
      // Check if AI returned an error
      if (aiAnalysis.error) {
        console.log('⚠️ AI returned error, using fallback');
        throw new Error(aiAnalysis.error);
      }
      
      // Determine response type
      let responseType = 'general';
      if (aiAnalysis.playerInfo) responseType = 'player';
      if (aiAnalysis.teamInfo) responseType = 'team';
      if (aiAnalysis.worldCupInfo) responseType = 'worldCup';
      
      console.log(`📊 Response type: ${responseType}`);
      
      const searchTerm = aiAnalysis.videoSearchTerm || query;
      const youtubeUrl = await searchYouTube(searchTerm);
      
      const response = {
        success: true,
        query: query,
        timestamp: new Date().toISOString(),
        type: responseType,
        data: aiAnalysis.playerInfo || aiAnalysis.teamInfo || aiAnalysis.worldCupInfo || null,
        playerInfo: aiAnalysis.playerInfo || null,
        teamInfo: aiAnalysis.teamInfo || null,
        worldCupInfo: aiAnalysis.worldCupInfo || null,
        youtubeUrl: youtubeUrl,
        analysis: aiAnalysis.analysis || `Analysis of ${query}`,
        confidence: aiAnalysis.confidenceScore || 0.8,
        source: 'Groq AI',
        debug: 'AI_SUCCESS'
      };

      console.log('📤 Sending successful response');
      return res.status(200).json(response);
      
    } catch (error: any) {
      console.error('❌ API CATCH BLOCK ERROR:', error.message);
      
      // Return a simple error response that won't break frontend
      return res.status(200).json({
        success: false,
        query: query,
        type: 'error',
        error: 'Failed to process query',
        timestamp: new Date().toISOString(),
        youtubeUrl: 'https://www.youtube.com/embed/dZqkf1ZnQh4',
        analysis: `Could not analyze "${query}". Please try again.`,
        debug: 'AI_FAILED'
      });
    }
  }

  // API docs
  res.status(200).json({
    message: 'FutbolAI API is running! 🏆',
    version: '1.0',
    endpoints: {
      search: 'GET /api/ai?action=search&query=your-query',
      examples: [
        '/api/ai?action=search&query=Messi',
        '/api/ai?action=search&query=Real%20Madrid',
        '/api/ai?action=search&query=World%20Cup%202026'
      ]
    }
  });
}