import { Position } from '@/app/games/snake-game';
import { NextResponse } from 'next/server';
import { z } from 'zod';

let snakeHistory: Position[] = [];
const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const requestBodySchema = z.array(positionSchema);

export async function GET() {
  console.log('GET-HISTOTY:', snakeHistory);
  return NextResponse.json(snakeHistory);
}

export async function POST(request: Request) {
  try {
    const body: Position[] = await request.json();
    requestBodySchema.parse({ body });

    snakeHistory = body;

    console.log('POST-HISTOTY:', snakeHistory);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log('Error:', error);
    return NextResponse.json(
      { success: false, message: 'Invalid data format' },
      { status: 400 }
    );
  }
}
