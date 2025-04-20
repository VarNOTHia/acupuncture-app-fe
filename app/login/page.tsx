'use client'
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/utils/button';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 用于禁用按钮，防止重复点击

  const handleLogin = async () => {
    // Reset error message on each attempt
    setError('');
    setIsLoading(true); // 开始登录请求

    const res = await signIn('credentials', {
      redirect: false,
      username,
      password
    });
    
    if (res?.ok) {
      // 登录成功，跳转到首页
      router.push('/');
    } else {
      // 登录失败，设置错误信息
      setError('登录失败，用户名或密码错误');
    }
    
    setIsLoading(false); // 请求完成后，重新启用按钮
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

        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center gap-4 mt-8">
          <Button
            onClick={handleLogin}
            color="blue"
            disabled={isLoading} // 登录中时禁用按钮
          >
            {isLoading ? '登录中...' : '登录'}
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
