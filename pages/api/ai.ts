import type { NextApiRequest, NextApiResponse } from 'next';
import { Groq } from 'groq-sdk';
import axios from 'axios';

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getFromCache(key: string): any | null {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const { data, timestamp } = cached;
  if (Date.now() - timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return data;
}

function setInCache(key: string, data: any): void {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

// Initialize Groq client
function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is required.');
  }
  return new Groq({ apiKey });
}

// Smart type detection using AI
async function detectQueryTypeWithAI(query: string): Promise<string> {
  const groq = getGroqClient();
  
  const prompt = `Analyze this football query: "${query}"
  
Is this query about:
1. A football PLAYER (individual person)
2. A football CLUB (team like Real Madrid, Barcelona, Manchester United)
3. A NATIONAL TEAM (country like Brazil, Argentina, Spain)
4. WORLD CUP (tournament)

Return ONLY one word: "player", "club", "national", or "worldcup"
Do not include any explanations or additional text.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      max_tokens: 10,
    });

    const response = completion.choices[0]?.message?.content?.toLowerCase().trim() || 'player';
    
    // Validate response
    const validTypes = ['player', 'club', 'national', 'worldcup'];
    const cleanResponse = response.replace(/"/g, '').replace(/'/g, '');
    
    if (validTypes.includes(cleanResponse)) {
      return cleanResponse;
    }
    
    // Fallback based on keywords
    const queryLower = query.toLowerCase();
    if (queryLower.includes('world cup')) return 'worldcup';
    if (queryLower.includes('fc') || queryLower.includes('cf ') || queryLower.includes(' united') || 
        queryLower.includes(' city') || queryLower.includes(' club')) return 'club';
    
    return 'player'; // Default
  } catch (error) {
    console.error('AI type detection error, using fallback:', error);
    // Fallback to simple detection
    const queryLower = query.toLowerCase();
    if (queryLower.includes('world cup')) return 'worldcup';
    return 'player'; // Default to player for simplicity
  }
}

// Simple JSON parsing
function safeParseJSON(content: string, query: string) {
  try {
    let cleaned = content.trim();
    
    // Remove markdown
    if (cleaned.startsWith('```json')) cleaned = cleaned.substring(7);
    if (cleaned.startsWith('```')) cleaned = cleaned.substring(3);
    if (cleaned.endsWith('```')) cleaned = cleaned.substring(0, cleaned.length - 3);
    
    // Find JSON
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}') + 1;
    
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      cleaned = cleaned.substring(jsonStart, jsonEnd);
    }
    
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('JSON parse error:', error);
    const currentYear = new Date().getFullYear();
    return { 
      analysis: "Analysis available", 
      videoSearchTerm: `${query} highlights ${currentYear}` 
    };
  }
}

// Get current Wikipedia data - ENHANCED VERSION
async function getWikipediaData(query: string, type: string): Promise<any> {
  const cacheKey = `wikipedia_${query.toLowerCase()}_${type}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    // Clean the query for Wikipedia
    const cleanQuery = query
      .replace(/FC\s+/gi, '')
      .replace(/\s+club$/gi, '')
      .replace(/\s+team$/gi, '')
      .trim();
    
    let wikipediaQuery = cleanQuery.replace(/\s+/g, '_');
    
    // Special handling for common queries - UPDATED
    const specialCases: Record<string, string> = {
      'real madrid': 'Real_Madrid_CF',
      'realmadrid': 'Real_Madrid_CF',
      'barcelona': 'FC_Barcelona',
      'fc barcelona': 'FC_Barcelona',
      'manchester united': 'Manchester_United_F.C.',
      'manchester united fc': 'Manchester_United_F.C.',
      'liverpool': 'Liverpool_F.C.',
      'liverpool fc': 'Liverpool_F.C.',
      'bayern munich': 'FC_Bayern_Munich',
      'bayern': 'FC_Bayern_Munich',
      'psg': 'Paris_Saint-Germain_F.C.',
      'paris saint-germain': 'Paris_Saint-Germain_F.C.',
      'juventus': 'Juventus_F.C.',
      'ac milan': 'A.C._Milan',
      'inter milan': 'Inter_Milan',
      'chelsea': 'Chelsea_F.C.',
      'chelsea fc': 'Chelsea_F.C.',
      'arsenal': 'Arsenal_F.C.',
      'arsenal fc': 'Arsenal_F.C.',
      'tottenham': 'Tottenham_Hotspur_F.C.',
      'tottenham hotspur': 'Tottenham_Hotspur_F.C.',
      'manchester city': 'Manchester_City_F.C.',
      'mancity': 'Manchester_City_F.C.',
      'atletico madrid': 'Atl%C3%A9tico_Madrid',
      'atlético madrid': 'Atl%C3%A9tico_Madrid',
      'borussia dortmund': 'Borussia_Dortmund',
      'ajax': 'AFC_Ajax',
      'afc ajax': 'AFC_Ajax',
      'dani olmo': 'Dani_Olmo',
      'daniel olmo': 'Dani_Olmo',
      'messi': 'Lionel_Messi',
      'lionel messi': 'Lionel_Messi',
      'ronaldo': 'Cristiano_Ronaldo',
      'cristiano ronaldo': 'Cristiano_Ronaldo',
      'mbappe': 'Kylian_Mbapp%C3%A9',
      'kylian mbappe': 'Kylian_Mbapp%C3%A9',
      'spain': 'Spain_national_football_team',
      'spain national team': 'Spain_national_football_team',
      'brazil': 'Brazil_national_football_team',
      'brazil national team': 'Brazil_national_football_team',
      'argentina': 'Argentina_national_football_team',
      'argentina national team': 'Argentina_national_football_team',
      'france': 'France_national_football_team',
      'france national team': 'France_national_football_team',
      'germany': 'Germany_national_football_team',
      'germany national team': 'Germany_national_football_team',
      'england': 'England_national_football_team',
      'england national team': 'England_national_football_team',
      'portugal': 'Portugal_national_football_team',
      'portugal national team': 'Portugal_national_football_team',
      'italy': 'Italy_national_football_team',
      'italy national team': 'Italy_national_football_team',
      'netherlands': 'Netherlands_national_football_team',
      'netherlands national team': 'Netherlands_national_football_team',
    };
    
    if (specialCases[query.toLowerCase()]) {
      wikipediaQuery = specialCases[query.toLowerCase()];
    } else if (type === 'club') {
      // Try common suffixes for clubs
      const suffixes = ['_CF', '_FC', '_(football_club)', '_F.C.'];
      for (const suffix of suffixes) {
        try {
          const testQuery = wikipediaQuery + suffix;
          const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${testQuery}`;
          const response = await axios.get(url, { timeout: 3000 });
          if (response.data?.extract) {
            wikipediaQuery = testQuery;
            break;
          }
        } catch {
          continue;
        }
      }
    } else if (type === 'national') {
      // Add national team suffix
      wikipediaQuery += '_national_football_team';
    }

    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${wikipediaQuery}`;
    console.log(`📚 Wikipedia API: ${url}`);
    
    const response = await axios.get(url, { timeout: 5000 });
    
    if (response.data?.extract) {
      const wikipediaData = {
        title: response.data.title,
        extract: response.data.extract,
        description: response.data.description,
        thumbnail: response.data.thumbnail?.source,
        url: response.data.content_urls?.desktop?.page,
        timestamp: new Date().toISOString(),
        lastRevised: response.data.timestamp
      };
      
      console.log(`📚 Wikipedia found: ${wikipediaData.title}`);
      setInCache(cacheKey, wikipediaData);
      return wikipediaData;
    }
  } catch (error) {
    console.error('Wikipedia API error:', error);
  }
  
  console.log(`📚 Wikipedia not found for: ${query}`);
  return {
    extract: '',
    timestamp: new Date().toISOString()
  };
}

// Different prompts for different types - ENHANCED for detailed trophies
async function analyzeWithPrompt(query: string, type: string, wikipediaData?: any) {
  const groq = getGroqClient();
  
  let prompt = '';
  const currentYear = new Date().getFullYear();
  
  // Build Wikipedia context
  const wikiContext = wikipediaData?.extract 
    ? `Wikipedia Context: ${wikipediaData.extract.substring(0, 500)}`
    : '';
  
  if (type === 'player') {
    prompt = `Analyze football player: "${query}" (Current year: ${currentYear})
    
${wikiContext}

IMPORTANT: Use ONLY factual, current information up to ${currentYear}. Do not make up statistics.
If you don't know current information, state "Current information not available".

Return a JSON object with these fields:
- name (string): Full current name
- position (string): Current playing position
- nationality (string): Country
- currentClub (string): Current team as of ${currentYear}
- age (number): Current age
- achievementsSummary (object): { 
  worldCupTitles: number, 
  continentalTitles: number, 
  clubDomesticTitles: { leagues: number, cups: number },
  individualAwards: string[] (Ballon d'Or, FIFA awards, etc.)
}
- careerStats (object): {
  club: { totalGoals: number, totalAssists: number, totalAppearances: number },
  international: { caps: number, goals: number, debut: string }
}
- analysis (string): 100 words about CURRENT status, recent achievements (2023-${currentYear}), and playing style
- videoSearchTerm (string): "best highlights goals assists" for YouTube search

Make the analysis focus on RECENT and CURRENT information.`;
  }
  else if (type === 'club') {
    prompt = `Analyze football club: "${query}" (Current date: December 2024)
    
${wikiContext}

CRITICAL: Use ONLY factual, current information from Wikipedia and reliable sources.
For Real Madrid specifically:
- Full name: Real Madrid Club de Fútbol
- Nicknames: Los Blancos, Los Merengues, Los Vikingos
- Founded: 6 March 1902
- Stadium: Estadio Santiago Bernabéu (capacity: 83,186)
- President: Florentino Pérez
- Head coach: Xabi Alonso (as of December 2024)
- League: La Liga
- Current position: 2nd in La Liga (2024-25 season)
- UEFA Champions League titles: 15 (most recent: 2024)
- Key recent trophies: UEFA Champions League 2024, La Liga 2023-24

Return a JSON object with these EXACT fields:
- name (string): Club name
- type (string): Always "club"
- founded (string/number): Year founded
- league (string): Current league (2024-2025 season)
- currentManager (object): { name: string, nationality: string, appointmentYear: number }
- stadium (object): { name: string, capacity: number, location: string }
- achievementsSummary (object): { 
  continentalTitles: number,
  internationalTitles: number,
  domesticTitles: { leagues: number, cups: number }
}
- trophies (object): {
  continental: { competition: string, wins: number, lastWin: number }[],
  international: { competition: string, wins: number, lastWin: number }[],
  domestic: { 
    league: { competition: string, wins: number, lastWin: number }[],
    cup: { competition: string, wins: number, lastWin: number }[]
  }
}
- analysis (string): 150 words about CURRENT performance (2024-25 season), recent achievements, playing style
- videoSearchTerm (string): "best goals 2024 highlights" for YouTube search

IMPORTANT: Be specific with trophy competitions:
- Continental: UEFA Champions League, UEFA Europa League, UEFA Super Cup
- Domestic league: La Liga, Premier League, Bundesliga, Serie A, Ligue 1
- Domestic cup: Copa del Rey, FA Cup, DFB-Pokal, Coppa Italia, Coupe de France`;
  }
  else if (type === 'national') {
    prompt = `Analyze national football team: "${query}" (Current year: ${currentYear})
    
${wikiContext}

IMPORTANT: Use ONLY factual, current information up to ${currentYear}. 
Include CURRENT FIFA ranking, RECENT tournament performance (2020-${currentYear}), CURRENT coach, and home stadium.

Return a JSON object with these fields:
- name (string): Country name
- type (string): Always "national"
- fifaRanking (string/number): Current FIFA ranking (${currentYear})
- currentCoach (object): { name: string, nationality: string, appointmentYear: number }
- stadium (object): { name: string, capacity: number, location: string } (main/home stadium)
- achievementsSummary (object): { 
  worldCupTitles: number, 
  continentalTitles: number,
  olympicTitles: number
}
- trophies (object): {
  worldCup: { wins: number, lastWin: number },
  continental: { competition: string, wins: number, lastWin: number }[] (Copa America, UEFA Euro, AFC Asian Cup, etc.),
  other: { competition: string, wins: number, lastWin: number }[] (FIFA Confederations Cup, UEFA Nations League, etc.)
}
- analysis (string): 120 words about CURRENT team status (${currentYear}), recent performance, coach, and prospects
- videoSearchTerm (string): "best goals highlights ${currentYear}" for YouTube search

Focus on RECENT tournaments (2020-${currentYear}) and CURRENT squad.`;
  }
  else { // worldcup
    prompt = `Analyze: "${query}" (Current year: ${currentYear})
    
${wikiContext}

Return a JSON object with these fields:
- worldCupInfo (object): { 
  year: number, 
  host: string, 
  defendingChampion: string,
  qualifiedTeams: number,
  hostCities: string[]
}
- analysis (string): 100 words about CURRENT tournament status, qualified teams, prospects
- videoSearchTerm (string): "best goals highlights world cup" for YouTube search

Focus on CURRENT information about upcoming or recent World Cups.`;
  }
  
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    return safeParseJSON(content, query);
    
  } catch (error) {
    console.error('Groq error:', error);
    const currentYear = new Date().getFullYear();
    return { 
      analysis: `Data temporarily unavailable. Please try again. (Current: ${currentYear})`,
      videoSearchTerm: `${query} highlights ${currentYear}`
    };
  }
}

// YouTube search - SIMPLIFIED AND WORKING VERSION
async function searchYouTube(searchTerm: string) {
  const cacheKey = `youtube_${searchTerm}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached as string;

  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const currentYear = new Date().getFullYear();
    
    if (!apiKey) {
      console.log('⚠️ No YouTube API key, using reliable fallback videos');
      // Use reliable, always-working football videos
      const fallbacks = [
        'https://www.youtube.com/embed/dZqkf1ZnQh4',  // Football skills compilation
        'https://www.youtube.com/embed/1oQXwV-dKxM',  // Amazing goals
        'https://www.youtube.com/embed/6h7aF0IBmMc',  // Premier League highlights
        'https://www.youtube.com/embed/XfyZ6EueJx8',  // Champions League
        'https://www.youtube.com/embed/3X7XG5KZiUY',  // World Cup
      ];
      const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      setInCache(cacheKey, randomFallback);
      return randomFallback;
    }

    // Use fetch with timeout - simplified search
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const safeSearchTerm = encodeURIComponent(`${searchTerm} football highlights ${currentYear}`);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${safeSearchTerm}&type=video&maxResults=5&key=${apiKey}&videoEmbeddable=true&order=relevance&safeSearch=moderate`;
    
    console.log('🎬 YouTube API URL:', url.replace(apiKey, '***'));
    
    const response = await fetch(url, { signal: controller.signal });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.log('⚠️ YouTube API error:', response.status, response.statusText);
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.items?.length > 0) {
      // Find the first embeddable video
      for (const item of data.items) {
        if (item.id?.videoId) {
          const videoId = item.id.videoId;
          const url = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
          console.log('✅ Found YouTube video:', url);
          setInCache(cacheKey, url);
          return url;
        }
      }
    }
    
    console.log('⚠️ No YouTube results found, using fallback');
    // Use topic-specific fallbacks
    const term = searchTerm.toLowerCase();
    const fallbacks: Record<string, string> = {
      'messi': 'https://www.youtube.com/embed/ZO0d8r_2qGI',
      'ronaldo': 'https://www.youtube.com/embed/OUKGsb8CpF8',
      'cristiano': 'https://www.youtube.com/embed/OUKGsb8CpF8',
      'mbappe': 'https://www.youtube.com/embed/7qOcT4bKKcM',
      'real madrid': 'https://www.youtube.com/embed/XfyZ6EueJx8',
      'barcelona': 'https://www.youtube.com/embed/3X7XG5KZiUY',
      'manchester united': 'https://www.youtube.com/embed/6h7aF0IBmMc',
      'liverpool': 'https://www.youtube.com/embed/6h7aF0IBmMc',
      'bayern': 'https://www.youtube.com/embed/HfQmI1Q5LQc',
      'psg': 'https://www.youtube.com/embed/_Z2Y9Qnqy0M',
      'juventus': 'https://www.youtube.com/embed/kV-uJYRX-dA',
      'chelsea': 'https://www.youtube.com/embed/6h7aF0IBmMc',
      'arsenal': 'https://www.youtube.com/embed/6h7aF0IBmMc',
      'spain': 'https://www.youtube.com/embed/eJXWcJeGXlM',
      'brazil': 'https://www.youtube.com/embed/eJXWcJeGXlM',
      'argentina': 'https://www.youtube.com/embed/mokNgn4i51A',
      'france': 'https://www.youtube.com/embed/0vHh0hHv8oQ',
      'germany': 'https://www.youtube.com/embed/_Fx3zXgQ4kI',
      'england': 'https://www.youtube.com/embed/_Fx3zXgQ4kI',
      'world cup': 'https://www.youtube.com/embed/BMpJztlHx1I',
    };
    
    for (const [key, videoUrl] of Object.entries(fallbacks)) {
      if (term.includes(key)) {
        setInCache(cacheKey, videoUrl);
        return videoUrl;
      }
    }
    
    const defaultFallback = 'https://www.youtube.com/embed/dZqkf1ZnQh4';
    setInCache(cacheKey, defaultFallback);
    return defaultFallback;
    
  } catch (error) {
    console.error('❌ YouTube API error, using fallback:', error);
    const defaultFallback = 'https://www.youtube.com/embed/dZqkf1ZnQh4';
    setInCache(cacheKey, defaultFallback);
    return defaultFallback;
  }
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
    console.log(`\n=== SEARCH: "${query}" ===`);
    
    // Check cache first
    const cacheKey = `search_${query.toLowerCase()}`;
    const cachedResponse = getFromCache(cacheKey);
    if (cachedResponse) {
      console.log('✅ Returning cached response');
      return res.status(200).json(cachedResponse);
    }
    
    try {
      // DETECT TYPE WITH AI
      const detectedType = await detectQueryTypeWithAI(query);
      console.log('🎯 AI detected type:', detectedType);
      
      // GET CURRENT WIKIPEDIA DATA
      const wikipediaData = await getWikipediaData(query, detectedType);
      console.log('📚 Wikipedia data:', wikipediaData.title || 'Not found');
      
      // Get AI analysis WITH Wikipedia context
      const aiAnalysis = await analyzeWithPrompt(query, detectedType, wikipediaData);
      console.log('✅ Got AI analysis with current data');
      
      // Build response based on detected type
      let responseData: any = {
        name: query,
        ...aiAnalysis,
        wikipedia: wikipediaData,
        lastUpdated: new Date().toISOString(),
        currentYear: new Date().getFullYear()
      };
      
      // Ensure consistent structure
      if (detectedType === 'club') {
        responseData.type = 'club';
        // Ensure stadium object exists
        if (!responseData.stadium) {
          responseData.stadium = {
            name: 'Information not available',
            capacity: 0,
            location: 'Information not available'
          };
        }
      } else if (detectedType === 'national') {
        responseData.type = 'national';
        // Ensure stadium object exists for national teams
        if (!responseData.stadium) {
          responseData.stadium = {
            name: 'National Stadium',
            capacity: 0,
            location: 'Information not available'
          };
        }
      } else if (detectedType === 'worldcup') {
        responseData.worldCupInfo = { year: new Date().getFullYear(), ...aiAnalysis };
      }
      
      // Get video with current year context
      const videoSearchTerm = aiAnalysis.videoSearchTerm || `${query} football highlights ${new Date().getFullYear()}`;
      const youtubeUrl = await searchYouTube(videoSearchTerm);
      
      // Build final response
      const response = {
        success: true,
        query: query,
        timestamp: new Date().toISOString(),
        type: detectedType,
        data: responseData,
        playerInfo: detectedType === 'player' ? responseData : null,
        teamInfo: (detectedType === 'club' || detectedType === 'national') ? responseData : null,
        worldCupInfo: detectedType === 'worldcup' ? responseData : null,
        youtubeUrl: youtubeUrl,
        analysis: aiAnalysis.analysis || `Analysis of ${query}`,
        confidence: 0.9,
        source: 'Groq AI + Wikipedia'
      };

      // Cache the response
      setInCache(cacheKey, response);
      
      console.log('🚀 Sending response with type:', detectedType);
      console.log('🎥 YouTube URL:', youtubeUrl);
      return res.status(200).json(response);
      
    } catch (error) {
      console.error('API error:', error);
      
      const errorResponse = {
        success: false,
        query: query,
        type: 'error',
        error: 'Service issue',
        timestamp: new Date().toISOString(),
        youtubeUrl: 'https://www.youtube.com/embed/dZqkf1ZnQh4',
        analysis: `Please try again.`,
      };
      
      return res.status(200).json(errorResponse);
    }
  }

  res.status(200).json({
    message: 'FutbolAI API - AI-Powered Football Intelligence',
    version: '5.0',
    features: ['Wikipedia Integration', 'Current Data', 'YouTube Highlights', 'Detailed Trophy Breakdown']
  });
}