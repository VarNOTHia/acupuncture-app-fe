// app/api/auth/register/route.ts
import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: '缺少用户名或密码' }, { status: 400 });
  }

  const db = await getDb();
  const users = db.collection('users');

  // 检查用户名是否已存在
  const existingUser = await users.findOne({ username });
  if (existingUser) {
    return NextResponse.json({ error: '用户名已存在' }, { status: 409 });
  }

  // 使用 bcrypt 加密密码
  const saltRounds = 10; // 可以根据需求调整
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // 插入到数据库，存储加密后的密码
  await users.insertOne({ username, password: hashedPassword });

  return NextResponse.json({ success: true });
}
