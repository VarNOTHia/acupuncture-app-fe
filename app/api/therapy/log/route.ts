import { getDb } from "@/lib/db";

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = await getDb();
  console.log(body);

  if(
    typeof body.username !== 'string' || typeof body.patient !== 'object'
  ) {
    return NextResponse.json({ error: 'Invalid payload' }, {status: 400} );
  }

  await db.collection("therapyLogs").insertOne(body);

  return NextResponse.json("Log saved", { status: 200 });
}

export async function GET(req: NextRequest) {
  const db = await getDb();
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Missing username' }, { status: 400 });
  }

  const logs = await db
    .collection("therapyLogs")
    .find({ username })
    .sort({ createdAt: -1 }) // 最新在前，每次排序以得到按时间的诊疗记录
    .toArray();

  return NextResponse.json({ logs }, { status: 200 });
}