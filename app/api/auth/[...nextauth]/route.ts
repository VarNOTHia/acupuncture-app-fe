import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getDb } from '@/lib/db';
import { compare } from 'bcryptjs';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: '用户名', type: 'text' },
        password: { label: '密码', type: 'password' }
      },
      async authorize(credentials) {
        const db = await getDb();
        const user = await db.collection('users').findOne({ username: credentials!.username });

        if (!user) return null;

        // 比较密码
        const isValid = await compare(credentials!.password, user.password);
        if (!isValid) return null;

        // 返回用户数据（会作为 session.user）
        return {
          id: user._id.toString(),
          name: user.username,
        };
      }
    })
  ],
  pages: {
    signIn: '/login', // 自定义登录页
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
