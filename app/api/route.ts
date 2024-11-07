import { NextResponse } from 'next/server';
import { Position } from '../games/snake-game';
import { z } from 'zod';

const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const requestBodySchema = z.object({
  snake: z.array(positionSchema),
});

let snakeData: Position[] = [];

export async function GET() {
  console.log('GET-DATA:', snakeData);
  return NextResponse.json(snakeData);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    requestBodySchema.parse(body);

    snakeData = body.snake; 

    console.log('POST-DATA:', snakeData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log('Error:', error);
    return NextResponse.json(
      { success: false, message: 'Invalid data format' },
      { status: 400 }
    );
  }
}
