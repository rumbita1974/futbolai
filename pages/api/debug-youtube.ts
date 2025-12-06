import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    return res.status(200).json({
      success: false,
      error: 'NO_YOUTUBE_API_KEY',
      message: 'YouTube API key not set in environment variables'
    });
  }

  const searchTerms = [
    'Real Madrid football highlights 2024',
    'Spain national team football highlights 2024',
    'Brazil national team football highlights 2024',
    'football highlights 2024'
  ];

  const results = [];

  for (const term of searchTerms) {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: term,
          type: 'video',
          maxResults: 1,
          key: apiKey,
          videoEmbeddable: 'true',
          safeSearch: 'strict',
        },
      });

      results.push({
        searchTerm: term,
        success: true,
        videosFound: response.data.items?.length || 0,
        videoId: response.data.items?.[0]?.id?.videoId,
        status: response.status
      });
    } catch (error: any) {
      results.push({
        searchTerm: term,
        success: false,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  }

  res.status(200).json({
    success: true,
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey?.length || 0,
    tests: results,
    suggestion: results.every(r => r.success) 
      ? 'YouTube API is working correctly' 
      : 'Check YouTube API quota or permissions'
  });
}