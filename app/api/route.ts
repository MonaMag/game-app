import { NextResponse } from 'next/server';
import { Position } from '../games/page';

let snakeData: Position[] = [];

export async function GET() {
  return NextResponse.json(snakeData);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    snakeData = body.snake;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: 'Invalid data format' },
      { status: 400 }
    );
  }
}
