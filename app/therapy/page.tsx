"use client"
import React, { useState } from "react";
import { MAX_GROUP_OF, MERIDIANS_NAME } from "@/app/constants";
import AnnotatedImage from "@/components/visualization/AnnotatedImage";
import { useRouter } from "next/navigation";
import DualButton from "@/components/utils/dual-button";
import WaveForm from "@/components/visualization/WaveForm";

const SCALE = 0.55;

interface WaveFormOption {
  type: "sine" | "square" | "triangle" | "flat"; // 添加flat类型
  frequency: number;
  amplitude: number;
  duration?: number;
  width?: number;
  height?: number;
  isPlaying?: boolean;
}

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

  // 是否启动电刺激的 state。
  const [isLaunched, setIsLaunched] = useState<boolean>(false);
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
  
  const launchPulse = () => {
    if (isLaunched) {
      setIsLaunched(false);
    } else {
      setIsLaunched(true);
    }
  }

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


        <div className="md:w-1/3 flex flex-col justify-center mt-3 md:mt-0 md:ml-8">
          <WaveForm
            type="sine"
            frequency={5}          // 5 Hz
            amplitude={0.1}         // 强度
            duration={3}           // 横轴时间为 1 秒
            isLaunched={isLaunched} // 控制播放状态
          />

          <h2 className="text-2xl font-bold mb-3 mt-3">
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
          <DualButton 
            untriggeredText="启动电脉冲"
            triggeredText="停止电脉冲"
            onClick={launchPulse}
            triggeredColor="gray"
            unTriggeredColor="red"
          />
        </div>
      </div>
    </div>
  );
}
