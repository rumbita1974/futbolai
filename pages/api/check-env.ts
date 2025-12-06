// pages/api/check-env.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if variables exist
  const groqKey = process.env.GROQ_API_KEY;
  const youtubeKey = process.env.YOUTUBE_API_KEY;
  
  // Check if they're in the correct format
  const isValidGroqKey = groqKey && groqKey.startsWith('gsk_');
  const isValidYouTubeKey = youtubeKey && youtubeKey.length > 20;
  
  res.status(200).json({
    environment: process.env.NODE_ENV,
    hasGroqKey: !!groqKey,
    groqKeyValid: isValidGroqKey,
    groqKeyLength: groqKey?.length || 0,
    groqKeyPreview: groqKey ? groqKey.substring(0, 10) + '...' : 'Not set',
    
    hasYouTubeKey: !!youtubeKey,
    youtubeKeyValid: isValidYouTubeKey,
    youtubeKeyLength: youtubeKey?.length || 0,
    
    // Check other important env vars
    vercelUrl: process.env.VERCEL_URL,
    nextPublicUrl: process.env.NEXT_PUBLIC_APP_URL,
    
    // List all env vars with GROQ or YOUTUBE in name
    allRelevantEnvVars: Object.keys(process.env)
      .filter(key => key.includes('GROQ') || key.includes('YOUTUBE'))
      .reduce((obj, key) => {
        obj[key] = process.env[key] ? 'Set (hidden)' : 'Not set';
        return obj;
      }, {} as Record<string, string>)
  });
}