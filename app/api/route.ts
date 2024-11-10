import { NextResponse } from 'next/server';
import { GameDataType, Position } from '../snake/SnakeGame';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'snakeGameData.json');

const gameData = {
  history: [] as Position[],
  current: [] as Position[],
};

const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const gameDataSchema = z.object({
  current: z.array(positionSchema),
  history: z.array(positionSchema),
});

export async function GET() {
  try {
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      //gameData.current = JSON.parse(fileContents);
      Object.assign(gameData, JSON.parse(fileContents));
    }

    console.log('GET-DATA:', gameData);
    return NextResponse.json(gameData);
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
    const body: GameDataType = await request.json();
    gameDataSchema.parse(body);

    gameData.current = body.current;
    gameData.history = body.history;

    fs.writeFileSync(filePath, JSON.stringify(gameData, null, 2));

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
