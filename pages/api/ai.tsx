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
  {
    id: 4,
    name: 'Erling Haaland',
    position: 'Forward',
    nationality: 'Norway',
    club: 'Manchester City',
    age: 24,
    goals: 218,
    assists: 53,
    appearances: 278,
    rating: 8.8,
  },
  {
    id: 5,
    name: 'Kevin De Bruyne',
    position: 'Midfielder',
    nationality: 'Belgium',
    club: 'Manchester City',
    age: 33,
    goals: 164,
    assists: 262,
    appearances: 604,
    rating: 9.0,
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
  {
    id: 4,
    name: 'England',
    region: 'Europe',
    worldCupWins: 1,
    fifaRanking: 3,
    coach: 'Gareth Southgate',
  },
  {
    id: 5,
    name: 'Spain',
    region: 'Europe',
    worldCupWins: 1,
    fifaRanking: 8,
    coach: 'Luis de la Fuente',
  },
];

// Process query with Groq AI
async function processQueryWithAI(query: string) {
  try {
    const groq = getGroqClient();
    
    if (!groq) {
      console.log('Groq client not available, using fallback');
      return processQueryFallback(query);
    }
    
    const prompt = `Analyze this football query and extract key information: "${query}"
    
    Respond with ONLY JSON in this exact format:
    {
      "intent": "player_search" | "team_search" | "world_cup" | "general_question",
      "playerName": "specific player name or null",
      "teamName": "specific team name or null",
      "keywords": ["array", "of", "relevant", "keywords"],
      "isHighlightRequest": true or false,
      "searchForVideo": true or false
    }
    
    Rules:
    - If query mentions a player, set intent to "player_search"
    - If query mentions a team/country, set intent to "team_search"  
    - If query mentions World Cup, set intent to "world_cup"
    - Extract player/team names accurately
    - For highlight/goal/video requests, set isHighlightRequest: true
    - Always set searchForVideo: true for player/team searches
    - Keep keywords relevant (max 5)`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'mixtral-8x7b-32768',
      temperature: 0.3,
      max_tokens: 300,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    console.log('🤖 Groq AI response:', content);
    
    try {
      const result = JSON.parse(content);
      return { ...result, originalQuery: query };
    } catch (parseError) {
      console.error('Failed to parse Groq response:', parseError);
      return processQueryFallback(query);
    }
  } catch (error) {
    console.error('Groq AI error:', error);
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
      keywords: ['messi', 'argentina'],
      isHighlightRequest: true,
      searchForVideo: true,
      originalQuery: query,
    };
  } else if (queryLower.includes('ronaldo') || queryLower.includes('cr7')) {
    return {
      intent: 'player_search',
      playerName: 'Cristiano Ronaldo',
      teamName: null,
      keywords: ['ronaldo', 'portugal'],
      isHighlightRequest: true,
      searchForVideo: true,
      originalQuery: query,
    };
  } else if (queryLower.includes('mbappe') || queryLower.includes('mbappé')) {
    return {
      intent: 'player_search',
      playerName: 'Kylian Mbappé',
      teamName: null,
      keywords: ['mbappe', 'france'],
      isHighlightRequest: true,
      searchForVideo: true,
      originalQuery: query,
    };
  } else if (queryLower.includes('haaland')) {
    return {
      intent: 'player_search',
      playerName: 'Erling Haaland',
      teamName: null,
      keywords: ['haaland', 'norway'],
      isHighlightRequest: true,
      searchForVideo: true,
      originalQuery: query,
    };
  } else if (queryLower.includes('argentina')) {
    return {
      intent: 'team_search',
      playerName: null,
      teamName: 'Argentina',
      keywords: ['argentina', 'messi'],
      isHighlightRequest: true,
      searchForVideo: true,
      originalQuery: query,
    };
  } else if (queryLower.includes('brazil')) {
    return {
      intent: 'team_search',
      playerName: null,
      teamName: 'Brazil',
      keywords: ['brazil', 'neymar'],
      isHighlightRequest: true,
      searchForVideo: true,
      originalQuery: query,
    };
  } else if (queryLower.includes('france')) {
    return {
      intent: 'team_search',
      playerName: null,
      teamName: 'France',
      keywords: ['france', 'mbappe'],
      isHighlightRequest: true,
      searchForVideo: true,
      originalQuery: query,
    };
  } else if (queryLower.includes('world cup')) {
    return {
      intent: 'world_cup',
      playerName: null,
      teamName: null,
      keywords: ['world', 'cup', '2026'],
      isHighlightRequest: true,
      searchForVideo: true,
      originalQuery: query,
    };
  } else {
    return {
      intent: 'general_question',
      playerName: null,
      teamName: null,
      keywords: queryLower.split(' ').filter(k => k.length > 0),
      isHighlightRequest: false,
      searchForVideo: false,
      originalQuery: query,
    };
  }
}

// Search YouTube for football videos
async function searchYouTube(query: string, isHighlightRequest: boolean = true) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    if (!apiKey) {
      console.warn('YouTube API key not set, using fallback videos');
      return getFallbackVideo(query);
    }

    // Build search query
    let searchQuery = query;
    if (isHighlightRequest) {
      searchQuery = `${query} football highlights 2024`;
    } else {
      searchQuery = `${query} football`;
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: searchQuery,
        type: 'video',
        maxResults: 1,
        key: apiKey,
        relevanceLanguage: 'en',
        videoEmbeddable: 'true',
        safeSearch: 'strict',
      },
    });

    if (response.data.items && response.data.items.length > 0) {
      const videoId = response.data.items[0].id.videoId;
      const videoUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
      console.log(`🎬 Found YouTube video: ${videoUrl}`);
      return videoUrl;
    }
    
    return getFallbackVideo(query);
  } catch (error) {
    console.error('YouTube search error:', error);
    return getFallbackVideo(query);
  }
}

// Fallback videos when YouTube API fails
function getFallbackVideo(query: string) {
  const queryLower = query.toLowerCase();
  
  const videoMap: Record<string, string> = {
    'messi': 'https://www.youtube.com/embed/ZO0d8r_2qGI',
    'ronaldo': 'https://www.youtube.com/embed/OUKGsb8CpF8',
    'mbappe': 'https://www.youtube.com/embed/RdGpDPLT5Q4',
    'haaland': 'https://www.youtube.com/embed/4XqQpQ8KZg4',
    'argentina': 'https://www.youtube.com/embed/eJXWcJeGXlM',
    'brazil': 'https://www.youtube.com/embed/6MfLJBHjK0k',
    'france': 'https://www.youtube.com/embed/J8LcQOHtQKs',
    'world cup': 'https://www.youtube.com/embed/dZqkf1ZnQh4',
  };

  for (const [key, videoUrl] of Object.entries(videoMap)) {
    if (queryLower.includes(key)) {
      return videoUrl;
    }
  }

  // Default football highlights
  return 'https://www.youtube.com/embed/dZqkf1ZnQh4';
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { action, query } = req.query;

  if (action === 'search' && query && typeof query === 'string') {
    console.log(`🔍 Football search: "${query}"`);
    
    try {
      // Process query with AI
      const queryUnderstanding = await processQueryWithAI(query);
      console.log('🎯 Query understanding:', queryUnderstanding);

      // Search players
      const playerResults = mockPlayers.filter(player => {
        if (queryUnderstanding.playerName && 
            player.name.toLowerCase().includes(queryUnderstanding.playerName.toLowerCase())) {
          return true;
        }
        
        const searchStr = `${player.name} ${player.position} ${player.nationality}`.toLowerCase();
        return queryUnderstanding.keywords.some((keyword: string) =>
          searchStr.includes(keyword.toLowerCase())
        );
      });

      // Search teams
      const teamResults = mockTeams.filter(team => {
        if (queryUnderstanding.teamName && 
            team.name.toLowerCase().includes(queryUnderstanding.teamName.toLowerCase())) {
          return true;
        }
        
        const searchStr = `${team.name} ${team.region}`.toLowerCase();
        return queryUnderstanding.keywords.some((keyword: string) =>
          searchStr.includes(keyword.toLowerCase())
        );
      });

      // Get YouTube video if needed
      let youtubeUrl = '';
      if (queryUnderstanding.searchForVideo) {
        youtubeUrl = await searchYouTube(query, queryUnderstanding.isHighlightRequest);
      }

      // World Cup info
      const worldCupInfo = queryUnderstanding.intent === 'world_cup' ? {
        year: 2026,
        host: 'USA, Canada, Mexico',
        teams: 48,
        groups: 16,
        startDate: 'June 2026',
        qualifiers: 'Ongoing',
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
      console.log(`🎬 YouTube URL: ${youtubeUrl}`);
      
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
    message: 'FutbolAI API v1.0 🏆',
    endpoints: {
      search: 'GET /api/ai?action=search&query=your-query',
      examples: [
        '/api/ai?action=search&query=Messi',
        '/api/ai?action=search&query=Ronaldo highlights',
        '/api/ai?action=search&query=Argentina team',
        '/api/ai?action=search&query=World Cup 2026',
      ]
    },
    note: 'Add GROQ_API_KEY and YOUTUBE_API_KEY environment variables for full functionality',
  });
}