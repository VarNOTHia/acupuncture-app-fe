"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold text-center">
        经络可视化治疗软件
      </h1>
        <button 
          onClick={() => {
            router.push('/graph');
          }} 
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          查看经络 / 穴位
        </button>
        <button 
          onClick={() => {

          }} 
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          对症开穴治疗
        </button>
    </div>
  );
}
