"use client"
import React, { useState } from "react";
import { MAX_GROUP_OF, MERIDIANS_NAME } from "@/app/constants";
import AnnotatedImage from "@/components/visualization/AnnotatedImage";
import { useRouter } from "next/navigation";
import DualButton from "@/components/utils/dual-button";
import WaveForm from "@/components/visualization/WaveForm";

const SCALE = 0.55;

interface WaveFormOption {
  type: "sine" | "square" | "triangle" | "flat";
  frequency: number;
  amplitude: number;
  duration: number;
  width?: number;
  height?: number;
  isPlaying?: boolean;
}

export default function Graph() {
  const stageWidth = 1200 * SCALE;
  const stageHeight = 1600 * SCALE;
  
  // 状态管理
  const [imgType, setImgType] = useState<'front' | 'side' | 'back'>('front');
  const [imgIndex, setImgIndex] = useState(1);
  const [targetName, setTargetName] = useState<string>('');
  const [showText, setShowText] = useState<boolean>(false);
  const [currentAcupoints, setCurrentAcupoints] = useState<string[]>([]);
  const [isLaunched, setIsLaunched] = useState<boolean>(false);
  const [waveFormOption, setWaveFormOption] = useState<WaveFormOption>({
    type: "flat",
    frequency: 5,
    amplitude: 0.1,
    duration: 3,
  });

  // 波形类型选项
  const WAVE_TYPES = [
    { value: "sine", label: "正弦波" },
    { value: "square", label: "方波" },
    { value: "triangle", label: "三角波" },
    { value: "flat", label: "平直线" }
  ];

  // 参数更新处理
  const handleParamChange = (param: keyof WaveFormOption) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : parseFloat(e.target.value);
    setWaveFormOption(prev => ({
      ...prev,
      [param]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row">
        {/* 左侧图片展示部分保持不变 */}
        <div className="md:w-2/3">
          <AnnotatedImage 
            type={imgType} 
            index={imgIndex} 
            width={stageWidth} 
            height={stageHeight} 
            handleName={(name) => setTargetName(name)}
            handleCurrentList={setCurrentAcupoints}
            scale={SCALE}
            showText={showText}
            targetName={targetName}
          />
        </div>

        {/* 右侧控制面板 */}
        <div className="md:w-1/3 flex flex-col mt-3 md:mt-0 md:ml-8 space-y-4">
          {/* 波形显示 */}
          <div className="bg-white p-4 rounded-lg shadow">
            <WaveForm
              {...waveFormOption}
              width={300}
              height={150}
              isPlaying={isLaunched}
            />
          </div>

          {/* 波形参数控制 */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">波形参数</h3>

            {/* 波形类型选择 */}
            <div className="grid grid-cols-2 gap-2">
              {WAVE_TYPES.map((wave) => (
                <label key={wave.value} className="flex items-center space-x-2 p-2 bg-white rounded border">
                  <input
                    type="radio"
                    name="waveType"
                    value={wave.value}
                    checked={waveFormOption.type === wave.value}
                    onChange={() => setWaveFormOption(prev => ({...prev, type: wave.value}))}
                    className="radio radio-primary radio-xs"
                  />
                  <span className="text-sm">{wave.label}</span>
                </label>
              ))}
            </div>

            {/* 振幅控制 */}
            <div>
              <label className="block text-sm font-medium mb-1">
                强度: {waveFormOption.amplitude.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={waveFormOption.amplitude}
                onChange={handleParamChange('amplitude')}
                className="range range-primary range-xs"
              />
            </div>

            {/* 频率控制 */}
            <div>
              <label className="block text-sm font-medium mb-1">
                频率: {waveFormOption.frequency} Hz
              </label>
              <input
                type="range"
                min="0.1"
                max="20"
                step="0.1"
                value={waveFormOption.frequency}
                onChange={handleParamChange('frequency')}
                className="range range-primary range-xs"
              />
            </div>

            {/* 持续时间控制 */}
            <div>
              <label className="block text-sm font-medium mb-1">
                持续时间: {waveFormOption.duration}s
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={waveFormOption.duration}
                onChange={handleParamChange('duration')}
                className="range range-primary range-xs"
              />
            </div>
          </div>

          {/* 其他原有控制项 */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h2 className="text-xl font-bold">当前操作经络：{MERIDIANS_NAME[imgType][imgIndex]}</h2>
            <p className="text-sm">目前选中穴位：{targetName || '无'}</p>

            {/* 经络选择 */}
            <select
              className="select select-bordered w-full"
              value={`${imgType}-${imgIndex}`}
              onChange={(e) => {
                const [type, index] = e.target.value.split('-');
                setImgType(type as any);
                setImgIndex(parseInt(index));
                setTargetName('');
              }}
            >
              {Object.entries(MERIDIANS_NAME).map(([type, meridians]) =>
                Object.entries(meridians)
                  .filter(([idx]) => idx !== '0')
                  .map(([idx, name]) => (
                    <option key={`${type}-${idx}`} value={`${type}-${idx}`}>{name}</option>
                  ))
              )}
            </select>

            {/* 穴位选择 */}
            <select
              className="select select-bordered w-full"
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
            >
              <option value="">选择穴位</option>
              {currentAcupoints.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>

            {/* 操作按钮组 */}
            <div className="flex flex-col space-y-2">
              <button 
                className="btn btn-outline btn-primary"
                onClick={() => setShowText(!showText)}
              >
                {showText ? '隐藏经络文字' : '显示经络文字'}
              </button>
              <DualButton 
                untriggeredText="启动电脉冲"
                triggeredText="停止电脉冲"
                onClick={() => setIsLaunched(!isLaunched)}
                triggeredColor="gray"
                unTriggeredColor="red"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}