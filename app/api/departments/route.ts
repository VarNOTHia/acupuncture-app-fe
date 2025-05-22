// app/api/departments/route.ts
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  const uri = process.env.MONGODB_URI!;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const departments = await db.collection("departments").find().toArray();
    return NextResponse.json(departments);
  } catch (err) {
    console.error("Failed to fetch departments:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await client.close();
  }
}
