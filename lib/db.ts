// lib/db.ts
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!; // 在 .env 文件中配置
const client = new MongoClient(uri);
const dbName = 'ziwu-db';   // 自己设定

let cachedClient: MongoClient | null = null;

export async function getDb() {
  if (!cachedClient) {
    await client.connect();
    cachedClient = client;
  }
  return cachedClient.db(dbName);
}
