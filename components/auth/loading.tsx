'use client';

import { Loader2 } from "lucide-react"; // 图标：记得已安装 lucide-react

export default function Loading({ text = "加载中...", className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 min-h-[50vh] text-white ${className}`}>
      <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
      <p className="text-lg font-medium opacity-80">{text}</p>
    </div>
  );
}
