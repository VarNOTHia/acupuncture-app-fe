'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/utils/button';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: Implement login logic here
    if (username && password) {
      router.push('/');
    }
  };

  return (
    <div className="flex items-center justify-center p-4 min-h-screen">
      <div className="max-w-sm w-full bg-zinc-900/50 rounded-lg shadow-lg p-8 space-y-6 pb-12">
        <h1 className="text-2xl text-center font-semibold text-white mb-8">
          登录
        </h1>
        
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mt-8">
          <Button
            onClick={handleLogin}
            color="blue"
          >
            登录
          </Button>
          
          <button
            onClick={() => router.push('/register')}
            className="text-zinc-400 hover:text-white text-sm"
          >
            还没有账号？立即注册
          </button>
        </div>
      </div>
    </div>
  );
}