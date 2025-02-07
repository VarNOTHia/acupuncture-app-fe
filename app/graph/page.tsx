"use client"
import React, { useEffect, useState } from "react";
import { MAX_GROUP_OF, MERIDIANS_NAME } from "./constants";

const SCALE = 0.6;
import AnnotatedImage from "./AnnotatedImage";

export default function Graph() {

  useEffect(() => {

  }, []);
  const stageWidth = 1200 * SCALE;
  const stageHeight = 1600 * SCALE;
  const [imgType, setImgType] = useState<'front' | 'side' | 'back'>('front');
  const [imgIndex, setImgIndex] = useState(1);
  const [targetName, setTargetName] = useState<string>('');
  const handleName = (name: string) => {
    setTargetName(name);
  }

  const handleContinue = () => {
    if (imgIndex < MAX_GROUP_OF[imgType]) {
      setImgIndex(imgIndex + 1);
      return;
    }
  
    // 定义切换逻辑
    const nextImgTypeMap: Record<'front' | 'side' | 'back', 'front' | 'side' | 'back'> = {
      front: 'side',
      side: 'back',
      back: 'front', // 最终类型不再切换
    };
  
    const nextImgType = nextImgTypeMap[imgType];
  
    setImgType(nextImgType);
    setImgIndex(1); // 切换类型时，重置 `imgIndex` 到初始值
  };

  return (
    <div
      className="container mx-auto px-4 py-8"
    >
      <div className="flex flex-col md:flex-row">
        {/* 左侧：使用 Konva 显示带标注的图片 */}
        <div className="md:w-2/3">
          <AnnotatedImage 
            type={imgType} 
            index={imgIndex} 
            width={stageWidth} 
            height={stageHeight} 
            handleName={handleName}
            scale={SCALE}
          />
        </div>
        {/* 右侧：图片说明 */}
        <div className="md:w-1/3 flex flex-col justify-center mt-3 md:mt-0 md:ml-8">
          <h2 className="text-2xl font-bold mb-3">当前操作经络：{MERIDIANS_NAME[imgType][imgIndex]}</h2>
          <p className="mb-3">目前选中穴位：{targetName}</p>
          <button className="bg-blue-500 text-white py-2 px-4 rounded mb-2 hover:bg-blue-700">电击治疗</button>
          <button className="bg-blue-500 text-white py-2 px-4 rounded mb-2 hover:bg-blue-700">加入收藏夹</button>
          <button 
            onClick={handleContinue}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >下一张</button>
        </div>
      </div>
    </div>
  );
}
