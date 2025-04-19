'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/utils/button';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // 发送注册请求到后端
  const registerUser = async (username: string, password: string) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || '注册失败');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    // Reset error
    setError('');

    // Validate inputs
    if (!username || !password || !confirmPassword) {
      setError('请填写所有字段');
      return;
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    // Call register API
    const isRegistered = await registerUser(username, password);
    
    if (isRegistered) {
      // Registration successful, navigate to home page
      router.push('/');
    }
  };

  return (
    <div className="flex items-center justify-center p-4 min-h-screen">
      <div className="max-w-sm w-full bg-zinc-900/50 rounded-lg shadow-lg p-8 space-y-6 pb-12">
        <h1 className="text-2xl text-center font-semibold text-white mb-8">
          注册
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

          <div>
            <input
              type="password"
              placeholder="再次确认密码"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 mt-8">
          <Button
            onClick={handleRegister}
            color="blue"
          >
            注册
          </Button>
        </div>
      </div>
    </div>
  );
}
