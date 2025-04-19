"use client"
import React, { useState } from "react";
import { MAX_GROUP_OF, MERIDIANS_NAME } from "@/app/constants";
import AnnotatedImage from "@/components/visualization/AnnotatedImage";
import { useRouter } from "next/navigation";
import DualButton from "@/components/utils/dual-button";
import WaveForm from "@/components/visualization/WaveForm";

const SCALE = 0.55;

type waveType = 'sine' | 'square' | 'sawtooth' | 'triangle' | 'flat' | "pulse";

export default function Graph() {
  const stageWidth = 1200 * SCALE;
  const stageHeight = 1600 * SCALE;
  
  // 可视化：经络
  const [imgType, setImgType] = useState<'front' | 'side' | 'back'>('front');
  const [imgIndex, setImgIndex] = useState(1);
  const [targetName, setTargetName] = useState<string>('');
  const [showText, setShowText] = useState<boolean>(false);
  const [currentAcupoints, setCurrentAcupoints] = useState<string[]>([]);
  const [isLaunched, setIsLaunched] = useState<boolean>(false);

  // 波形可视化的部分
  const [waveType, setWaveType] = useState<waveType>('flat');
  const [freq, setFreq] = useState<number>(5);
  const [amp, setAmp] = useState<number>(0.1);
  const [duration, setDuration] = useState<number>(3);

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

  // 波形类型选项
  const WAVE_TYPES = [
    { value: "sine", label: "正弦波" },
    { value: "square", label: "方波" },
    { value: "triangle", label: "三角波" },
    { value: "sawtooth", label: "锯齿波" },
    { value: "noise", label: "白噪声"},
    { value: "smooth", label: "平滑噪声"},
  ];

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
            type={waveType}
            frequency={freq}          // 5 Hz
            amplitude={amp}         // 强度
            duration={duration}           // 横轴时间为 1 秒
            isLaunched={isLaunched} // 控制播放状态
          />
          {/* 波形参数控制 */}
          <div className="bg-zinc-750 p-4 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">波形参数</h3>

            {/* 波形类型选择 */}
            <div className="grid grid-cols-2 gap-2">
              {WAVE_TYPES.map((wave) => (
                <label key={wave.value} className="flex items-center space-x-2 p-2 bg-zinc-500 rounded border">
                  <input
                    type="radio"
                    name="waveType"
                    value={wave.value}
                    onChange={() => setWaveType(wave.value as waveType)}
                    className="radio radio-primary radio-xs"
                  />
                  <span className="text-sm">{wave.label}</span>
                </label>
              ))}
            </div>

            {/* 振幅控制 */}
            <div>
              <label className="block text-sm font-medium mb-1">
                强度: {(amp * 10).toFixed(2)}mA
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                onChange={(e) => setAmp(parseFloat(e.target.value))}
                className="range range-primary range-xs"
              />
            </div>

            {/* 频率控制 */}
            <div>
              <label className="block text-sm font-medium mb-1">
                频率: {freq} Hz
              </label>
              <input
                type="range"
                min="0.1"
                max="20"
                step="0.1"
                className="range range-primary range-xs"
                onChange={(e) => setFreq(parseFloat(e.target.value))}
              />
            </div>

            {/* 持续时间控制 */}
            <div>
              <label className="block text-sm font-medium mb-1">
                单屏显示波形持续时间: {duration}s
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                className="range range-primary range-xs"
                onChange={(e) => setDuration(parseFloat(e.target.value))}
              />
            </div>
          </div>

          
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
          
          <div className="mb-6"></div>
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
