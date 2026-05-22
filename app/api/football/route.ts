import { NextRequest, NextResponse } from 'next/server';

const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY;

function getMockCompetitions() {
  return {
    competitions: [
      { id: 2021, name: 'Premier League', emblem: 'https://crests.football-data.org/PL.png' },
      { id: 2014, name: 'La Liga', emblem: 'https://crests.football-data.org/laliga.png' },
      { id: 2002, name: 'Bundesliga', emblem: 'https://crests.football-data.org/BL1.png' },
      { id: 2019, name: 'Serie A', emblem: 'https://crests.football-data.org/SA.png' },
      { id: 2015, name: 'Ligue 1', emblem: 'https://crests.football-data.org/FL1.png' },
      { id: 2001, name: 'UEFA Champions League', emblem: 'https://crests.football-data.org/CL.png' },
    ],
  };
}

function getMockLiveMatches() {
  return {
    matches: [
      {
        id: 1001,
        homeTeam: { name: 'Manchester United', crest: 'https://crests.football-data.org/66.png', id: 66 },
        awayTeam: { name: 'Liverpool FC', crest: 'https://crests.football-data.org/64.png', id: 64 },
        score: { fullTime: { home: 2, away: 1 }, halfTime: { home: 1, away: 0 } },
        status: 'IN_PLAY',
        utcDate: new Date().toISOString(),
        minute: 67,
        competition: { name: 'Premier League', emblem: 'https://crests.football-data.org/PL.png', id: 2021 },
      },
      {
        id: 1002,
        homeTeam: { name: 'Real Madrid CF', crest: 'https://crests.football-data.org/86.png', id: 86 },
        awayTeam: { name: 'FC Barcelona', crest: 'https://crests.football-data.org/81.png', id: 81 },
        score: { fullTime: { home: 1, away: 1 }, halfTime: { home: 0, away: 1 } },
        status: 'IN_PLAY',
        utcDate: new Date().toISOString(),
        minute: 45,
        competition: { name: 'La Liga', emblem: 'https://crests.football-data.org/laliga.png', id: 2014 },
      },
      {
        id: 1003,
        homeTeam: { name: 'Inter Milan', crest: 'https://crests.football-data.org/108.png', id: 108 },
        awayTeam: { name: 'AC Milan', crest: 'https://crests.football-data.org/98.png', id: 98 },
        score: { fullTime: { home: 0, away: 0 }, halfTime: { home: 0, away: 0 } },
        status: 'IN_PLAY',
        utcDate: new Date().toISOString(),
        minute: 32,
        competition: { name: 'Serie A', emblem: 'https://crests.football-data.org/SA.png', id: 2019 },
      },
    ],
  };
}

function getMockSchedule() {
  return {
    matches: [
      {
        id: 1001,
        homeTeam: { name: 'Manchester United', crest: 'https://crests.football-data.org/66.png', id: 66 },
        awayTeam: { name: 'Liverpool FC', crest: 'https://crests.football-data.org/64.png', id: 64 },
        score: { fullTime: { home: 2, away: 1 }, halfTime: { home: 1, away: 0 } },
        status: 'IN_PLAY',
        utcDate: new Date().toISOString(),
        minute: 67,
        competition: { name: 'Premier League', emblem: 'https://crests.football-data.org/PL.png', id: 2021 },
      },
      {
        id: 1002,
        homeTeam: { name: 'Real Madrid CF', crest: 'https://crests.football-data.org/86.png', id: 86 },
        awayTeam: { name: 'FC Barcelona', crest: 'https://crests.football-data.org/81.png', id: 81 },
        score: { fullTime: { home: 1, away: 1 }, halfTime: { home: 0, away: 1 } },
        status: 'IN_PLAY',
        utcDate: new Date().toISOString(),
        minute: 45,
        competition: { name: 'La Liga', emblem: 'https://crests.football-data.org/laliga.png', id: 2014 },
      },
      {
        id: 1003,
        homeTeam: { name: 'Inter Milan', crest: 'https://crests.football-data.org/108.png', id: 108 },
        awayTeam: { name: 'AC Milan', crest: 'https://crests.football-data.org/98.png', id: 98 },
        score: { fullTime: { home: 0, away: 0 }, halfTime: { home: 0, away: 0 } },
        status: 'IN_PLAY',
        utcDate: new Date().toISOString(),
        minute: 32,
        competition: { name: 'Serie A', emblem: 'https://crests.football-data.org/SA.png', id: 2019 },
      },
      {
        id: 1004,
        homeTeam: { name: 'Arsenal FC', crest: 'https://crests.football-data.org/57.png', id: 57 },
        awayTeam: { name: 'Chelsea FC', crest: 'https://crests.football-data.org/61.png', id: 61 },
        score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } },
        status: 'TIMED',
        utcDate: new Date(Date.now() + 7200000).toISOString(),
        minute: null,
        competition: { name: 'Premier League', emblem: 'https://crests.football-data.org/PL.png', id: 2021 },
      },
      {
        id: 1005,
        homeTeam: { name: 'Bayern Munich', crest: 'https://crests.football-data.org/5.png', id: 5 },
        awayTeam: { name: 'Borussia Dortmund', crest: 'https://crests.football-data.org/4.png', id: 4 },
        score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } },
        status: 'TIMED',
        utcDate: new Date(Date.now() + 10800000).toISOString(),
        minute: null,
        competition: { name: 'Bundesliga', emblem: 'https://crests.football-data.org/BL1.png', id: 2002 },
      },
      {
        id: 1006,
        homeTeam: { name: 'Paris Saint-Germain', crest: 'https://crests.football-data.org/524.png', id: 524 },
        awayTeam: { name: 'Olympique Marseille', crest: 'https://crests.football-data.org/516.png', id: 516 },
        score: { fullTime: { home: 3, away: 1 }, halfTime: { home: 2, away: 0 } },
        status: 'FINISHED',
        utcDate: new Date(Date.now() - 7200000).toISOString(),
        minute: null,
        competition: { name: 'Ligue 1', emblem: 'https://crests.football-data.org/FL1.png', id: 2015 },
      },
    ],
  };
}

function getMockStandings() {
  const teams = [
    { name: 'Arsenal FC', crest: 'https://crests.football-data.org/57.png', id: 57 },
    { name: 'Manchester City', crest: 'https://crests.football-data.org/65.png', id: 65 },
    { name: 'Liverpool FC', crest: 'https://crests.football-data.org/64.png', id: 64 },
    { name: 'Chelsea FC', crest: 'https://crests.football-data.org/61.png', id: 61 },
    { name: 'Aston Villa', crest: 'https://crests.football-data.org/58.png', id: 58 },
    { name: 'Tottenham Hotspur', crest: 'https://crests.football-data.org/73.png', id: 73 },
    { name: 'Newcastle United', crest: 'https://crests.football-data.org/67.png', id: 67 },
    { name: 'Manchester United', crest: 'https://crests.football-data.org/66.png', id: 66 },
    { name: 'West Ham United', crest: 'https://crests.football-data.org/563.png', id: 563 },
    { name: 'Brighton & Hove Albion', crest: 'https://crests.football-data.org/397.png', id: 397 },
    { name: 'Wolverhampton', crest: 'https://crests.football-data.org/76.png', id: 76 },
    { name: 'Fulham FC', crest: 'https://crests.football-data.org/63.png', id: 63 },
    { name: 'Crystal Palace', crest: 'https://crests.football-data.org/354.png', id: 354 },
    { name: 'Bournemouth', crest: 'https://crests.football-data.org/356.png', id: 356 },
    { name: 'Brentford FC', crest: 'https://crests.football-data.org/402.png', id: 402 },
    { name: 'Nottingham Forest', crest: 'https://crests.football-data.org/345.png', id: 345 },
    { name: 'Everton FC', crest: 'https://crests.football-data.org/62.png', id: 62 },
    { name: 'Leicester City', crest: 'https://crests.football-data.org/338.png', id: 338 },
    { name: 'Ipswich Town', crest: 'https://crests.football-data.org/349.png', id: 349 },
    { name: 'Southampton FC', crest: 'https://crests.football-data.org/340.png', id: 340 },
  ];

  const standings = teams.map((team, index) => ({
    position: index + 1,
    team,
    playedGames: 38,
    won: 30 - index,
    draw: Math.min(8, Math.max(0, 38 - (30 - index) - (4 + Math.floor(index / 3)))),
    lost: Math.max(0, 38 - (30 - index) - Math.min(8, Math.max(0, 38 - (30 - index) - (4 + Math.floor(index / 3))))),
    points: 89 - index * 4 - Math.floor(index / 2),
    goalsFor: 100 - index * 3,
    goalsAgainst: 30 + index * 2,
    goalDifference: (100 - index * 3) - (30 + index * 2),
  }));

  return {
    standings: [{ table: standings }],
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint') || '';

  try {
    if (FOOTBALL_API_KEY) {
      const response = await fetch(`https://api.football-data.org/v4/${endpoint}`, {
        headers: {
          'X-Auth-Token': FOOTBALL_API_KEY,
        } as HeadersInit,
      });

      if (!response.ok) {
        throw new Error(`Football API responded with status ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    }

    // Mock data
    if (endpoint.includes('matches') && endpoint.includes('status=LIVE')) {
      return NextResponse.json(getMockLiveMatches());
    }
    if (endpoint.includes('matches')) {
      return NextResponse.json(getMockSchedule());
    }
    if (endpoint.includes('standings')) {
      return NextResponse.json(getMockStandings());
    }
    if (endpoint.includes('competitions')) {
      return NextResponse.json(getMockCompetitions());
    }

    return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
  } catch (error) {
    console.error('Football API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
