import { useState, useEffect } from 'react';

// 自定义 Hook：获取当前时间
export function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleString());
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000); // 每秒更新一次

    return () => clearInterval(intervalId); // 清理定时器
  }, []);

  return currentTime;
}
