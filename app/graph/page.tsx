"use client"
import React, { useState } from "react";
import { MAX_GROUP_OF, MERIDIANS_NAME } from "./constants";
import AnnotatedImage from "./AnnotatedImage";

const SCALE = 0.6;

export default function Graph() {
  const stageWidth = 1200 * SCALE;
  const stageHeight = 1600 * SCALE;
  
  // 当前显示的经络类型与编号
  const [imgType, setImgType] = useState<'front' | 'side' | 'back'>('front');
  const [imgIndex, setImgIndex] = useState(1);
  
  // 当前选中的穴位名称（由图片点击或者下拉菜单选中）
  const [targetName, setTargetName] = useState<string>('');
  
  // 是否显示文字
  const [showText, setShowText] = useState<boolean>(false);
  
  // 当前穴位列表，由 AnnotatedImage 获取后回传
  const [currentAcupoints, setCurrentAcupoints] = useState<string[]>([]);

  // 当图片上点击穴位时回调
  const handleName = (name: string) => {
    setTargetName(name);
  };

  // 当 AnnotatedImage 获取到穴位列表后回传
  const handleCurrentList = (list: string[]) => {
    setCurrentAcupoints(list);
  };

  // 下拉选择经络（切换图片）
  const handleMeridianChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [type, index] = e.target.value.split('-');
    setImgType(type as 'front' | 'side' | 'back');
    setImgIndex(parseInt(index, 10));
    setTargetName(''); // 切换经络时重置当前穴位
  };

  // 下拉选择穴位（同步更新图片中的选中）
  const handleAcupointChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    setTargetName(selectedName);
  };

  // 下一张图片（支持类型切换）
  const handleContinue = () => {
    if (imgIndex < MAX_GROUP_OF[imgType]) {
      setImgIndex(imgIndex + 1);
      setTargetName('');
      return;
    }
    const nextImgTypeMap: Record<'front' | 'side' | 'back', 'front' | 'side' | 'back'> = {
      front: 'side',
      side: 'back',
      back: 'front',
    };
    setImgType(nextImgTypeMap[imgType]);
    setImgIndex(1);
    setTargetName('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row">
        {/* 左侧：图片展示 */}
        <div className="md:w-2/3">
          <AnnotatedImage 
            type={imgType} 
            index={imgIndex} 
            width={stageWidth} 
            height={stageHeight} 
            handleName={handleName}
            handleCurrentList={handleCurrentList}
            scale={SCALE}
            showText={showText}
            targetName={targetName}  // 传入当前选中穴位
          />
        </div>
        {/* 右侧：下拉菜单及操作按钮 */}
        <div className="md:w-1/3 flex flex-col justify-center mt-3 md:mt-0 md:ml-8">
          <h2 className="text-2xl font-bold mb-3">
            当前操作经络：{MERIDIANS_NAME[imgType][imgIndex]}
          </h2>
          <p className="mb-3">目前选中穴位：{targetName}</p>
          
          {/* 经络下拉菜单 */}
          <select
            className="mb-4 p-2 border rounded bg-white text-gray-700"
            value={`${imgType}-${imgIndex}`}
            onChange={handleMeridianChange}
          >
            {Object.entries(MERIDIANS_NAME).map(([type, meridians]) =>
              Object.entries(meridians)
                .filter(([idx]) => idx !== '0')
                .map(([idx, name]) => (
                  <option key={`${type}-${idx}`} value={`${type}-${idx}`}>
                    {name}
                  </option>
                ))
            )}
          </select>

          {/* 穴位下拉菜单 */}
          <select
            className="mb-4 p-2 border rounded bg-white text-gray-700"
            value={targetName}
            onChange={handleAcupointChange}
          >
            <option value="">选择穴位</option>
            {currentAcupoints.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
          
          <div className="mb-6 mt-6"></div>
          <button 
            className="bg-blue-500 text-white py-2 px-4 rounded mb-2 hover:bg-blue-700"
            onClick={() => setShowText(!showText)}
          >
            显示经络文字
          </button>
          {/* <button className="bg-blue-500 text-white py-2 px-4 rounded mb-2 hover:bg-blue-700">
            加入收藏夹
          </button> */}
          <button 
            onClick={handleContinue}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            查看下个经络
          </button>
        </div>
      </div>
    </div>
  );
}
