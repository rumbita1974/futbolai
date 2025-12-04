import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { Groq } from 'groq-sdk';

// Initialize Groq client
function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn('GROQ_API_KEY not set, using mock responses');
    return null;
  }
  return new Groq({ apiKey });
}

// Mock football data
const mockPlayers = [
  {
    id: 1,
    name: 'Lionel Messi',
    position: 'Forward',
    nationality: 'Argentina',
    club: 'Inter Miami',
    age: 36,
    goals: 821,
    assists: 357,
    appearances: 1034,
    rating: 9.3,
  },
  {
    id: 2,
    name: 'Cristiano Ronaldo',
    position: 'Forward',
    nationality: 'Portugal',
    club: 'Al Nassr',
    age: 39,
    goals: 893,
    assists: 268,
    appearances: 1217,
    rating: 9.1,
  },
  {
    id: 3,
    name: 'Kylian Mbappé',
    position: 'Forward',
    nationality: 'France',
    club: 'Paris Saint-Germain',
    age: 25,
    goals: 289,
    assists: 142,
    appearances: 436,
    rating: 8.9,
  },
];

const mockTeams = [
  {
    id: 1,
    name: 'Argentina',
    region: 'South America',
    worldCupWins: 3,
    fifaRanking: 1,
    coach: 'Lionel Scaloni',
  },
  {
    id: 2,
    name: 'Brazil',
    region: 'South America',
    worldCupWins: 5,
    fifaRanking: 5,
    coach: 'Dorival Júnior',
  },
  {
    id: 3,
    name: 'France',
    region: 'Europe',
    worldCupWins: 2,
    fifaRanking: 2,
    coach: 'Didier Deschamps',
  },
];

// Process query with AI or fallback
async function processQueryWithAI(query: string) {
  try {
    const groq = getGroqClient();
    
    if (!groq) {
      // Fallback to simple keyword matching
      return processQueryFallback(query);
    }
    
    const prompt = `Analyze this football query: "${query}"
    
    Respond with JSON only:
    {
      "intent": "player_search" | "team_search" | "world_cup" | "general",
      "playerName": "string or null",
      "teamName": "string or null",
      "keywords": ["array", "of", "keywords"]
    }`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'mixtral-8x7b-32768',
      temperature: 0.3,
      max_tokens: 200,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const result = JSON.parse(content);
    return { ...result, originalQuery: query };
  } catch (error) {
    console.error('AI processing error, using fallback:', error);
    return processQueryFallback(query);
  }
}

// Fallback keyword matching
function processQueryFallback(query: string) {
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('messi')) {
    return {
      intent: 'player_search',
      playerName: 'Lionel Messi',
      teamName: null,
      keywords: ['messi'],
      originalQuery: query,
    };
  } else if (queryLower.includes('ronaldo')) {
    return {
      intent: 'player_search',
      playerName: 'Cristiano Ronaldo',
      teamName: null,
      keywords: ['ronaldo'],
      originalQuery: query,
    };
  } else if (queryLower.includes('argentina')) {
    return {
      intent: 'team_search',
      playerName: null,
      teamName: 'Argentina',
      keywords: ['argentina'],
      originalQuery: query,
    };
  } else if (queryLower.includes('world cup')) {
    return {
      intent: 'world_cup',
      playerName: null,
      teamName: null,
      keywords: ['world', 'cup'],
      originalQuery: query,
    };
  } else if (queryLower.includes('brazil')) {
    return {
      intent: 'team_search',
      playerName: null,
      teamName: 'Brazil',
      keywords: ['brazil'],
      originalQuery: query,
    };
  } else {
    return {
      intent: 'general',
      playerName: null,
      teamName: null,
      keywords: queryLower.split(' ').filter(k => k.length > 0),
      originalQuery: query,
    };
  }
}

// Get YouTube video
async function getYouTubeVideo(query: string) {
  // Default videos based on query
  const queryLower = query.toLowerCase();
  if (queryLower.includes('messi')) return 'https://www.youtube.com/embed/ZO0d8r_2qGI';
  if (queryLower.includes('ronaldo')) return 'https://www.youtube.com/embed/OUKGsb8CpF8';
  if (queryLower.includes('argentina')) return 'https://www.youtube.com/embed/eJXWcJeGXlM';
  return 'https://www.youtube.com/embed/dZqkf1ZnQh4'; // General football
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { action, query } = req.query;

  if (action === 'search' && query && typeof query === 'string') {
    console.log(`🔍 Football search: ${query}`);
    
    try {
      const queryUnderstanding = await processQueryWithAI(query);
      console.log('🎯 Query intent:', queryUnderstanding);

      // Filter players
      const playerResults = mockPlayers.filter(player => {
        const searchStr = `${player.name} ${player.position} ${player.nationality} ${player.club}`.toLowerCase();
        return queryUnderstanding.keywords.some((keyword: string) =>
          searchStr.includes(keyword.toLowerCase())
        );
      });

      // Filter teams
      const teamResults = mockTeams.filter(team => {
        const searchStr = `${team.name} ${team.region}`.toLowerCase();
        return queryUnderstanding.keywords.some((keyword: string) =>
          searchStr.includes(keyword.toLowerCase())
        );
      });

      // Get video
      const youtubeUrl = await getYouTubeVideo(query);

      // World Cup info
      const worldCupInfo = queryUnderstanding.intent === 'world_cup' ? {
        year: 2026,
        host: 'USA, Canada, Mexico',
        teams: 48,
        groups: 16,
      } : null;

      const response = {
        queryUnderstanding,
        players: playerResults,
        teams: teamResults,
        youtubeUrl,
        worldCupInfo,
        timestamp: new Date().toISOString(),
      };

      console.log(`✅ Found ${playerResults.length} players, ${teamResults.length} teams`);
      return res.status(200).json(response);
    } catch (error) {
      console.error('❌ Search error:', error);
      return res.status(200).json({
        players: [],
        teams: [],
        youtubeUrl: 'https://www.youtube.com/embed/dZqkf1ZnQh4',
        error: 'Search failed, showing default results',
      });
    }
  }

  // Default response
  res.status(200).json({
    message: 'FutbolAI API is running! 🏆',
    version: '1.0',
    endpoints: {
      search: 'GET /api/ai?action=search&query=your-query',
      examples: [
        '/api/ai?action=search&query=Messi',
        '/api/ai?action=search&query=Argentina',
        '/api/ai?action=search&query=World Cup 2026',
      ]
    }
  });
}