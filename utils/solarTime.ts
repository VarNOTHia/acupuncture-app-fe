// utils/solarTime.ts
export function calculateSolarTime(latitude: number, longitude: number, date: Date): number {
  // 获取日期中的年、月、日（用于太阳时计算）
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 月份从0开始，所以 +1
  const day = date.getDate();

  // 计算年度中的第 n 天（简化计算，不考虑闰年更精确校正）
  const n = Math.floor((275 * month) / 9) - 2 * Math.floor((month + 9) / 12) + day - 81;

  // 计算与太阳时间相关的角度 B（单位：度）
  const B = (360 / 365) * (n - 81);
  
  // 计算"方程时差"（分钟）
  const equationOfTime = 229.18 * (
    0.000075 +
    0.001868 * Math.cos(B * Math.PI / 180) -
    0.032077 * Math.sin(B * Math.PI / 180) -
    0.014615 * Math.cos(2 * B * Math.PI / 180) -
    0.040849 * Math.sin(2 * B * Math.PI / 180)
  );

  // 标准时区经度（这里以东八区为例，中央经度为 120°）
  const standardLongitude = 120;

  // 根据经度差计算时差（1小时对应15度）
  const localTimeOffset = (longitude - standardLongitude) / 15;

  // 将当前时间的秒数纳入计算
  const totalHours = date.getHours() + 
    date.getMinutes() / 60 + 
    date.getSeconds() / 3600; // 新增秒的转换

  // 使用 totalHours 替代原计算方式
  const localTime = totalHours + localTimeOffset + equationOfTime / 60;

  return localTime;
}

// 将浮点数小时转换为 HH:MM:SS 格式的字符串
export function formatSolarTime(hours: number): string {
  // 将小时转换到 [0,24) 范围内（防止负数或超过24小时）
  const normalized = ((hours % 24) + 24) % 24;

  const h = Math.floor(normalized);
  const m = Math.floor((normalized - h) * 60);
  const s = Math.floor((((normalized - h) * 60) - m) * 60);

  // 使用 padStart 确保数字两位显示
  const hh = h.toString().padStart(2, '0');
  const mm = m.toString().padStart(2, '0');
  const ss = s.toString().padStart(2, '0');

  return `${hh}:${mm}:${ss}`;
}
