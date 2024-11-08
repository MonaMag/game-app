import { Position } from '@/app/games/snake-game';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'snakeHistory.json');

//let snakeHistory: Position[] = [];

const gameData = {
  history: [] as Position[],
  current: [] as Position[],
};

const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const requestBodySchema = z.array(positionSchema);

export async function GET() {
  try {
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
     
      gameData.history = JSON.parse(fileContents);
    }

    console.log('GET-HISTORY:', gameData);
    return NextResponse.json(gameData.history);
  } catch (error) {
    console.log('Error reading history:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to read history' },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: Position[] = await request.json();
    requestBodySchema.parse(body);

    //snakeHistory = body;
    gameData.history = body;

    fs.writeFileSync(filePath, JSON.stringify(gameData.history, null, 2));

    console.log('POST-HISTOTY:', gameData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log('Error writing history:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to write history' },
      { status: 400 }
    );
  }
}
