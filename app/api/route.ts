import { NextResponse } from 'next/server';
import { Position } from '../games/snake-game';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'snakeData.json');

//let snakeData: Position[] = [];

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
      gameData.current = JSON.parse(fileContents);
    }

    console.log('GET-DATA:', gameData);
    return NextResponse.json(gameData.current);
  } catch (error) {
    console.log('Error reading data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to read data' },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: Position[] = await request.json();
    requestBodySchema.parse(body);

    //snakeData = body.snake;

    gameData.current = body;

    fs.writeFileSync(filePath, JSON.stringify(gameData.current, null, 2));

    console.log('POST-DATA:', gameData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log('Error:', error);
    return NextResponse.json(
      { success: false, message: 'Invalid data format' },
      { status: 400 }
    );
  }
}
