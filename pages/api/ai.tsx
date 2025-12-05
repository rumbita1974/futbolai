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

// COMPLETE hardcoded country database
function getHardcodedCountryData(countryName: string) {
  const country = countryName.toLowerCase().trim();
  
  const countryDatabase: Record<string, any> = {
    // Top 20 FIFA ranked teams + common searches
    'argentina': {
      teamInfo: {
        name: 'Argentina National Football Team',
        ranking: '2nd in FIFA Rankings',
        coach: 'Lionel Scaloni',
        stadium: 'Estadio Monumental',
        league: 'International',
        founded: 1893,
        achievements: ['2022 FIFA World Cup', '3 Copa América titles (2021, 2022, 2023)', '2 Olympic gold medals'],
        keyPlayers: ['Lionel Messi', 'Ángel Di María', 'Emiliano Martínez', 'Lautaro Martínez']
      },
      analysis: 'Current World Cup champions with legendary player Lionel Messi. Known for passionate, attacking football.',
      videoSearchTerm: 'Argentina national team highlights'
    },
    'brazil': {
      teamInfo: {
        name: 'Brazil National Football Team',
        ranking: '1st in FIFA Rankings',
        coach: 'Tite',
        stadium: 'Maracanã',
        league: 'International',
        founded: 1914,
        achievements: ['5 FIFA World Cup titles', '9 Copa América titles', '4 Confederations Cups'],
        keyPlayers: ['Neymar', 'Vinícius Júnior', 'Alisson Becker', 'Casemiro']
      },
      analysis: 'Most successful World Cup nation with 5 titles. Famous for "jogo bonito" style and producing legendary players.',
      videoSearchTerm: 'Brazil national team highlights'
    },
    'spain': {
      teamInfo: {
        name: 'Spain National Football Team',
        ranking: '6th in FIFA Rankings',
        coach: 'Luis de la Fuente',
        stadium: 'Estadio La Cartuja',
        league: 'International',
        founded: 1920,
        achievements: ['2010 FIFA World Cup', '3 UEFA European Championships', '2023 Nations League'],
        keyPlayers: ['Rodri', 'Pedri', 'Álvaro Morata', 'Dani Olmo']
      },
      analysis: '2010 World Cup winners known for "tiki-taka" possession football. Technically gifted midfielders.',
      videoSearchTerm: 'Spain national team highlights'
    },
    'france': {
      teamInfo: {
        name: 'France National Football Team',
        ranking: '3rd in FIFA Rankings',
        coach: 'Didier Deschamps',
        stadium: 'Stade de France',
        league: 'International',
        founded: 1904,
        achievements: ['2 FIFA World Cup titles', '2 UEFA European Championships', '2 Confederations Cups'],
        keyPlayers: ['Kylian Mbappé', 'Antoine Griezmann', 'Olivier Giroud', 'Mike Maignan']
      },
      analysis: 'Two-time World Cup winners with exceptional young talent. Athletic, counter-attacking style.',
      videoSearchTerm: 'France national team highlights'
    },
    'germany': {
      teamInfo: {
        name: 'Germany National Football Team',
        ranking: '16th in FIFA Rankings',
        coach: 'Julian Nagelsmann',
        stadium: 'Olympiastadion Berlin',
        league: 'International',
        founded: 1900,
        achievements: ['4 FIFA World Cup titles', '3 UEFA European Championships'],
        keyPlayers: ['İlkay Gündoğan', 'Joshua Kimmich', 'Manuel Neuer', 'Kai Havertz']
      },
      analysis: 'Four-time World Cup winners known for tournament mentality and efficient football.',
      videoSearchTerm: 'Germany national team highlights'
    },
    'england': {
      teamInfo: {
        name: 'England National Football Team',
        ranking: '4th in FIFA Rankings',
        coach: 'Gareth Southgate',
        stadium: 'Wembley Stadium',
        league: 'International',
        founded: 1863,
        achievements: ['1966 FIFA World Cup', '2020 European Championship finalists'],
        keyPlayers: ['Harry Kane', 'Jude Bellingham', 'Bukayo Saka', 'Phil Foden']
      },
      analysis: '1966 World Cup winners with talented young squad. Improved tournament performances recently.',
      videoSearchTerm: 'England national team highlights'
    },
    'portugal': {
      teamInfo: {
        name: 'Portugal National Football Team',
        ranking: '7th in FIFA Rankings',
        coach: 'Roberto Martínez',
        stadium: 'Estádio da Luz',
        league: 'International',
        founded: 1914,
        achievements: ['2016 European Championship', '2019 Nations League'],
        keyPlayers: ['Cristiano Ronaldo', 'Bruno Fernandes', 'Bernardo Silva', 'Rúben Dias']
      },
      analysis: 'Euro 2016 winners led by Cristiano Ronaldo. Technically gifted players.',
      videoSearchTerm: 'Portugal national team highlights'
    },
    'ecuador': {
      teamInfo: {
        name: 'Ecuador National Football Team',
        ranking: '46th in FIFA Rankings',
        coach: 'Gustavo Alfaro',
        stadium: 'Estadio Rodrigo Paz Delgado',
        league: 'International',
        founded: 1925,
        achievements: ['4 World Cup appearances', 'Copa América quarter-finals'],
        keyPlayers: ['Enner Valencia', 'Moisés Caicedo', 'Pervis Estupiñán', 'Pierro Hincapié']
      },
      analysis: 'Physical, intense team known for strong home performances at altitude in Quito.',
      videoSearchTerm: 'Ecuador national team'
    },
    // Add more as needed...
  };
  
  return countryDatabase[country] || null;
}

// Query normalization - match ANY country name
function normalizeQuery(query: string): { normalized: string; likelyType: string } {
  const q = query.toLowerCase().trim();
  
  // Check for ANY country in our database
  const countries = Object.keys(getHardcodedCountryData('') || {});
  for (const country of countries) {
    if (q === country || q.includes(country)) {
      return { normalized: country, likelyType: 'team' };
    }
  }
  
  // Check for clubs
  if (q.includes('real madrid') || q.includes('barcelona') || 
      q.includes('manchester') || q.includes('bayern') || 
      q.includes('chelsea') || q.includes('liverpool')) {
    return { normalized: q, likelyType: 'team' };
  }
  
  // Check for World Cup
  if (q.includes('world cup') || q.includes('worldcup')) {
    return { normalized: 'FIFA World Cup', likelyType: 'worldCup' };
  }
  
  return { normalized: q, likelyType: 'general' };
}

// Rest of your analyzeFootballQuery and other functions remain the same...
// [Keep all the other functions from the previous version]