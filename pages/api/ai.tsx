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

// Clean AI response to prevent mixing categories
function cleanAIResponse(parsed: any, query: string): any {
  console.log('🧹 Cleaning AI response for query:', query);
  
  const q = query.toLowerCase().trim();
  
  // List of common country names
  const countries = [
    'uruguay', 'brazil', 'argentina', 'spain', 'france', 'germany',
    'england', 'portugal', 'italy', 'netherlands', 'belgium', 'mexico',
    'usa', 'ecuador', 'colombia', 'chile', 'peru', 'croatia', 'switzerland',
    'japan', 'south korea', 'australia', 'morocco', 'egypt', 'nigeria'
  ];
  
  // List of common club names
  const clubs = [
    'real madrid', 'barcelona', 'manchester city', 'manchester united',
    'bayern munich', 'chelsea', 'liverpool', 'arsenal', 'tottenham',
    'psg', 'juventus', 'ac milan', 'inter milan', 'atletico madrid'
  ];
  
  // Determine what the query MOST LIKELY is
  const isCountry = countries.some(country => q === country);
  const isClub = clubs.some(club => q.includes(club));
  const isWorldCup = q.includes('world cup') || q.includes('worldcup');
  
  console.log('Query analysis:', { isCountry, isClub, isWorldCup });
  
  // If AI returned mixed data, enforce single category
  const hasPlayer = !!parsed.playerInfo;
  const hasTeam = !!parsed.teamInfo;
  const hasWorldCup = !!parsed.worldCupInfo;
  
  const dataTypes = [hasPlayer ? 'player' : null, hasTeam ? 'team' : null, hasWorldCup ? 'worldCup' : null].filter(Boolean);
  
  if (dataTypes.length > 1) {
    console.warn('⚠️ AI returned multiple data types:', dataTypes);
    
    // Force single type based on query analysis
    if (isCountry || isClub) {
      console.log('→ Forcing TEAM only (country/club query)');
      return {
        ...parsed,
        playerInfo: null,
        worldCupInfo: null,
        teamInfo: parsed.teamInfo || {
          name: `${query} ${isCountry ? 'National Team' : 'FC'}`,
          ranking: 'N/A',
          coach: 'Unknown',
          stadium: 'Unknown',
          league: isCountry ? 'International' : 'Unknown',
          founded: 'Unknown',
          achievements: [],
          keyPlayers: []
        }
      };
    } else if (isWorldCup) {
      console.log('→ Forcing WORLD CUP only');
      return {
        ...parsed,
        playerInfo: null,
        teamInfo: null,
        worldCupInfo: parsed.worldCupInfo || {
          year: 2026,
          host: 'USA, Canada, Mexico',
          details: 'FIFA World Cup information',
          qualifiedTeams: [],
          venues: []
        }
      };
    } else {
      // Assume player query if not country/club/worldcup
      console.log('→ Forcing PLAYER only (likely player query)');
      return {
        ...parsed,
        teamInfo: null,
        worldCupInfo: null,
        playerInfo: parsed.playerInfo || null
      };
    }
  }
  
  return parsed;
}

// Use Groq to analyze query and generate football insights
async function analyzeFootballQuery(query: string) {
  console.log('🤖 Starting AI analysis for:', query);
  const groq = getGroqClient();
  
  const prompt = `You are FutbolAI, an expert football analyst. Analyze this query: "${query}"

CRITICAL RULES - YOU MUST FOLLOW THESE:

1. CATEGORY DETERMINATION:
   - If query is a COUNTRY NAME (Uruguay, Brazil, Spain, Germany, etc.) → RETURN TEAM DATA ONLY
   - If query is a CLUB NAME (Real Madrid, Barcelona, etc.) → RETURN TEAM DATA ONLY
   - If query is a PLAYER NAME (Luis Suárez, Messi, Mbappé, etc.) → RETURN PLAYER DATA ONLY
   - If query includes "World Cup" → RETURN WORLD CUP DATA ONLY
   - Otherwise → RETURN GENERAL ANALYSIS ONLY

2. ABSOLUTE PROHIBITIONS:
   - NEVER return both playerInfo and teamInfo
   - NEVER return both teamInfo and worldCupInfo
   - NEVER return both playerInfo and worldCupInfo
   - NEVER mix categories

3. CLEAR EXAMPLES:
   - Query: "Uruguay" → OUTPUT: teamInfo about Uruguay national team ONLY
   - Query: "Luis Suarez" → OUTPUT: playerInfo about Luis Suárez player ONLY
   - Query: "Real Madrid" → OUTPUT: teamInfo about Real Madrid club ONLY
   - Query: "World Cup 2026" → OUTPUT: worldCupInfo ONLY
   - Query: "best strikers" → OUTPUT: general analysis ONLY

4. IMPORTANT: Country names refer to NATIONAL TEAMS, not players from that country.

Return JSON with ONLY ONE of these structures:

FOR TEAMS (countries or clubs) - USE THIS WHEN QUERY IS COUNTRY OR CLUB NAME:
{
  "playerInfo": null,
  "teamInfo": {
    "name": "Team Full Name",
    "ranking": "Current Ranking",
    "coach": "Current Coach",
    "stadium": "Home Stadium",
    "league": "League/International",
    "founded": 1900,
    "achievements": ["Achievement 1", "Achievement 2"],
    "keyPlayers": ["Key Player 1", "Key Player 2"]
  },
  "worldCupInfo": null,
  "analysis": "Detailed team analysis focusing on history, style, and current status...",
  "videoSearchTerm": "team highlights 2024",
  "confidenceScore": 0.95
}

FOR PLAYERS - USE THIS WHEN QUERY IS PLAYER NAME:
{
  "playerInfo": {
    "name": "Player Full Name",
    "position": "Position",
    "nationality": "Nationality",
    "currentClub": "Current Club",
    "stats": {"goals": 0, "assists": 0, "appearances": 0},
    "marketValue": "Market Value",
    "achievements": ["Achievement 1", "Achievement 2"]
  },
  "teamInfo": null,
  "worldCupInfo": null,
  "analysis": "Detailed player analysis focusing on career, style, and achievements...",
  "videoSearchTerm": "player highlights 2024",
  "confidenceScore": 0.95
}

FOR WORLD CUP - USE THIS WHEN QUERY INCLUDES "WORLD CUP":
{
  "playerInfo": null,
  "teamInfo": null,
  "worldCupInfo": {
    "year": 2026,
    "host": "Host Countries",
    "details": "Tournament details...",
    "qualifiedTeams": ["Team 1", "Team 2"],
    "venues": ["Venue 1", "Venue 2"]
  },
  "analysis": "Detailed World Cup analysis...",
  "videoSearchTerm": "World Cup 2026",
  "confidenceScore": 0.95
}

FOR GENERAL QUERIES - USE THIS FOR ALL OTHER QUERIES:
{
  "playerInfo": null,
  "teamInfo": null,
  "worldCupInfo": null,
  "analysis": "General football analysis...",
  "videoSearchTerm": "football highlights 2024",
  "confidenceScore": 0.8
}

Return ONLY the JSON object. No explanations, no extra text.`;

  try {
    console.log('🚀 Calling Groq with STRICT prompt');
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1, // Very low temperature for consistent responses
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    console.log('📄 Raw AI response (first 300 chars):', content.substring(0, 300) + '...');
    
    let parsed;
    try {
      parsed = JSON.parse(content);
      console.log('✅ JSON parsed successfully');
    } catch (e) {
      console.error('❌ JSON parse failed:', e);
      // Return safe fallback
      parsed = {
        playerInfo: null,
        teamInfo: null,
        worldCupInfo: null,
        analysis: `Analysis of ${query}.`,
        videoSearchTerm: query,
        confidenceScore: 0.5
      };
    }
    
    // Clean the response to ensure no mixed data
    const cleaned = cleanAIResponse(parsed, query);
    
    console.log('🧹 Final cleaned data:', {
      type: cleaned.playerInfo ? 'PLAYER' : cleaned.teamInfo ? 'TEAM' : cleaned.worldCupInfo ? 'WORLD_CUP' : 'GENERAL',
      playerName: cleaned.playerInfo?.name,
      teamName: cleaned.teamInfo?.name,
      worldCupYear: cleaned.worldCupInfo?.year
    });
    
    return cleaned;
    
  } catch (error: any) {
    console.error('❌ Groq error:', error.message);
    return {
      playerInfo: null,
      teamInfo: null,
      worldCupInfo: null,
      analysis: `AI analysis for "${query}".`,
      videoSearchTerm: query,
      confidenceScore: 0.5
    };
  }
}

// Search YouTube for relevant videos
async function searchYouTube(searchTerm: string) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    if (!apiKey) {
      console.warn('YouTube API key not set, using fallback');
      return generateFallbackVideoUrl(searchTerm);
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${searchTerm} football highlights 2024`,
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
  
  return generateFallbackVideoUrl(searchTerm);
}

// Generate fallback video URL based on query
function generateFallbackVideoUrl(query: string) {
  const queryLower = query.toLowerCase();
  
  const videoMap: Record<string, string> = {
    // Countries
    'uruguay': 'https://www.youtube.com/embed/9ILbr0XBp2o',
    'brazil': 'https://www.youtube.com/embed/eJXWcJeGXlM',
    'argentina': 'https://www.youtube.com/embed/eJXWcJeGXlM',
    'spain': 'https://www.youtube.com/embed/6MfLJBHjK0k',
    'france': 'https://www.youtube.com/embed/J8LcQOHtQKs',
    'germany': 'https://www.youtube.com/embed/XfyZ6EueJx8',
    
    // Clubs
    'real madrid': 'https://www.youtube.com/embed/XfyZ6EueJx8',
    'barcelona': 'https://www.youtube.com/embed/3X7XG5KZiUY',
    
    // Players
    'messi': 'https://www.youtube.com/embed/ZO0d8r_2qGI',
    'suarez': 'https://www.youtube.com/embed/6kl7AOKVpCM',
    'ronaldo': 'https://www.youtube.com/embed/OUKGsb8CpF8',
    
    // World Cup
    'world cup': 'https://www.youtube.com/embed/dZqkf1ZnQh4',
  };

  for (const [key, url] of Object.entries(videoMap)) {
    if (queryLower.includes(key)) {
      return url;
    }
  }

  return 'https://www.youtube.com/embed/dZqkf1ZnQh4';
}

// Main API handler
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
      // Get AI analysis
      const aiAnalysis = await analyzeFootballQuery(query);
      
      // Determine response type
      let responseType = 'general';
      if (aiAnalysis.playerInfo) responseType = 'player';
      if (aiAnalysis.teamInfo) responseType = 'team';
      if (aiAnalysis.worldCupInfo) responseType = 'worldCup';
      
      console.log(`🎯 Final response type: ${responseType.toUpperCase()}`);
      
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
        source: 'Groq AI'
      };

      console.log('📤 Sending clean response');
      
      return res.status(200).json(response);
      
    } catch (error: any) {
      console.error('❌ API CATCH BLOCK ERROR:', error.message);
      
      return res.status(200).json({
        success: false,
        query: query,
        type: 'error',
        error: 'Failed to process query',
        timestamp: new Date().toISOString(),
        youtubeUrl: generateFallbackVideoUrl(query),
        analysis: `Could not analyze "${query}". Please try a different search.`
      });
    }
  }

  // API docs
  res.status(200).json({
    message: 'FutbolAI API v3.0 is running! 🏆',
    version: '3.0',
    improvements: ['Fixed mixed data responses', 'Strict category enforcement', 'Better AI prompting'],
    endpoints: {
      search: 'GET /api/ai?action=search&query=your-query',
      examples: [
        '/api/ai?action=search&query=Uruguay',
        '/api/ai?action=search&query=Luis%20Suarez',
        '/api/ai?action=search&query=Real%20Madrid',
        '/api/ai?action=search&query=World%20Cup%202026'
      ]
    }
  });
}