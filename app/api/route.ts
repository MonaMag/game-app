import { NextResponse } from 'next/server';
import { Position } from '../games/page';

let snakeData: Position[] = [];

export async function GET() {
  return NextResponse.json(snakeData);
}

export async function POST(request: Request) {
  const body = await request.json();
  snakeData = body.snake;
  return NextResponse.json({ success: true });
}
