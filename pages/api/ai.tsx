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

// Use Groq to analyze query and generate football insights
async function analyzeFootballQuery(query: string) {
  console.log('🤖 Starting AI analysis for:', query);
  const groq = getGroqClient();
  
  const prompt = `You are FutbolAI, an expert football analyst. Analyze: "${query}"

Return ONLY valid JSON with this exact structure:
{
  "analysis": "Detailed football analysis...",
  "playerInfo": {
    "name": "Lionel Messi",
    "position": "Forward",
    "nationality": "Argentinian",
    "currentClub": "Inter Miami",
    "stats": {
      "goals": 821,
      "assists": 357,
      "appearances": 1042
    },
    "marketValue": "€35 million",
    "achievements": ["8x Ballon d'Or", "World Cup 2022", "4x Champions League"]
  } or null,
  "teamInfo": null or {
    "name": "Team Name",
    "ranking": "Rank",
    "coach": "Coach Name"
  },
  "worldCupInfo": null or {
    "year": 2026,
    "host": "USA, Canada, Mexico",
    "details": "Details here"
  },
  "videoSearchTerm": "messi highlights 2024",
  "confidenceScore": 0.95
}

IMPORTANT: Return ONLY JSON, no extra text.`;

  try {
    console.log('🚀 Calling Groq with model: llama-3.3-70b-versatile');
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.4,
      max_tokens: 800,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    console.log('📄 Raw AI response:', content);
    
    // Try to parse
    const parsed = JSON.parse(content);
    console.log('✅ JSON parsed successfully');
    return parsed;
    
  } catch (error: any) {
    console.error('❌ Groq error:', error.message);
    console.error('Error stack:', error.stack);
    throw error; // Re-throw to see actual error
  }
}

// [Keep the rest of your existing functions: searchYouTube, generateFallbackVideoUrl]

// Main API handler - MODIFIED TO SHOW ERRORS
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
      console.log('✅ AI Analysis SUCCESS:', aiAnalysis);
      
      const searchTerm = aiAnalysis.videoSearchTerm || query;
      const youtubeUrl = await searchYouTube(searchTerm);
      
      const response = {
        success: true,
        query: query,
        timestamp: new Date().toISOString(),
        players: aiAnalysis.playerInfo ? [aiAnalysis.playerInfo] : [],
        teams: aiAnalysis.teamInfo ? [aiAnalysis.teamInfo] : [],
        worldCupInfo: aiAnalysis.worldCupInfo,
        youtubeUrl: youtubeUrl,
        analysis: aiAnalysis.analysis,
        playerInfo: aiAnalysis.playerInfo,
        teamInfo: aiAnalysis.teamInfo,
        confidence: aiAnalysis.confidenceScore || 0.8,
        source: 'Groq AI',
        debug: 'AI_SUCCESS' // Flag to show AI worked
      };

      console.log('📤 Sending AI response');
      return res.status(200).json(response);
      
    } catch (error: any) {
      console.error('❌ API CATCH BLOCK ERROR:', error.message);
      console.error('Full error:', error);
      
      // Return the ACTUAL error instead of fallback
      return res.status(200).json({
        success: false,
        query: query,
        error: error.message,
        errorDetails: error.toString(),
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        isFallback: false, // This is an actual error, not fallback
        timestamp: new Date().toISOString()
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
        '/api/ai?action=search&query=Argentina',
        '/api/ai?action=search&query=World Cup 2026'
      ]
    }
  });
}

// [Add your existing searchYouTube and generateFallbackVideoUrl functions here]