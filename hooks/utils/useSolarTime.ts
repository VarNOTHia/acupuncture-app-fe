import { calculateSolarTime } from "@/utils/solarTime";
import { useState, useEffect } from "react";


export function useSolarTime(latitude: number, longitude: number) {
  const [solarTime, setSolarTime] = useState<string>("--:--:--"); // 初始值设置为占位符

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDate = new Date();
      const calculatedSolarTime = calculateSolarTime(latitude, longitude, currentDate);
      
      // 确保太阳时格式正确，例如转换为时:分:秒格式
      const hours = Math.floor(calculatedSolarTime);
      const minutes = Math.floor((calculatedSolarTime - hours) * 60);
      const seconds = Math.floor(((calculatedSolarTime - hours) * 60 - minutes) * 60);
      
      const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      setSolarTime(formattedTime); // 更新太阳时
    }, 1000); // 每秒更新一次

    return () => clearInterval(intervalId); // 清理定时器
  }, [latitude, longitude]); // 依赖经纬度变化

  return solarTime; // 返回太阳时
}
