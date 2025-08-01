"use client"
import React, { useEffect, useState } from "react";
import { MAX_GROUP_OF, MERIDIANS_NAME } from "@/app/constants";
import AnnotatedImage from "@/components/visualization/AnnotatedImage";
import { useRouter } from "next/navigation";
import DualButton from "@/components/utils/dual-button";
import WaveForm from "@/components/visualization/WaveForm";
import RequireAuth from "@/components/auth/RequireAuth";

// 获取查询参数，一旦存在查询参数，不能再修改治疗的部位。（初始化）
import { useSearchParams } from "next/navigation";
import { useTherapyStore } from "@/store/useTherapyStore";
import { now } from "next-auth/client/_utils";
import { useSession } from "next-auth/react";

const SCALE = 0.55;
const AMP_SCALE = 10;

type waveType = 'sine' | 'square' | 'sawtooth' | 'triangle' | 'flat' | "pulse";

export default function Therapy() {
  const stageWidth = 1200 * SCALE;
  const stageHeight = 1600 * SCALE;
  const router = useRouter();

  // 埋点上报
  const patientState = useTherapyStore((state) => state.patient);
  const { data: session, status } = useSession();
  

  // 可视化：经络
  const [imgType, setImgType] = useState<'front' | 'side' | 'back'>('front');
  const [imgIndex, setImgIndex] = useState(1);
  const [targetName, setTargetName] = useState<string>('');
  const [showText, setShowText] = useState<boolean>(true);
  const [currentAcupoints, setCurrentAcupoints] = useState<string[]>([]);
  const [isLaunched, setIsLaunched] = useState<boolean>(false);
  
  // 波形可视化的部分
  const [waveType, setWaveType] = useState<waveType>('flat');
  const [freq, setFreq] = useState<number>(5);
  const [amp, setAmp] = useState<number>(0.1);
  const [duration, setDuration] = useState<number>(3);

  // URL 查询参数的部分，如果存在参数则不能再设置部位。
  const searchParams = useSearchParams();
  const [showSelection, setShowSelection] = useState<boolean>(true);

  // 暂存 log。
  const [log, setLog] = useState({});

  useEffect(() => {
    const initialImgType = (searchParams.get('direction') || 'front') as 'front' | 'side' | 'back';
    const initialImgIndex = parseInt(searchParams.get('index') || '1', 10);

    setImgType(initialImgType);
    setImgIndex(initialImgIndex);

    // 假如参数正常，屏蔽选择功能。
    if(searchParams.get('direction') && searchParams.get('index')){
      setShowSelection(false);
    }
  }, [searchParams]);
  
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
    // TODO: 添加埋点上报功能。
    if (isLaunched) {
      const updatedLog = {
        ...log,
        endTime: new Date()
      };
      fetch('/api/therapy/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedLog),
      });
      setIsLaunched(false);
    } else {
      const log = {
        username: session?.user?.name || '',
        patient: patientState,
        startTime: new Date(),
        selectedData: {
          line: MERIDIANS_NAME[imgType][imgIndex] as string,
          dot: targetName,
        },
        therapyData: {
          waveType: waveType,
          freq: freq,
          amp: amp * AMP_SCALE,
          duration: duration,
        },
      }

      setLog(log);
      console.log(log);
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
    <RequireAuth>
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
                  强度: {(amp * AMP_SCALE).toFixed(2)}mA
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
            { showSelection && <select
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
            </select>}
            
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
            
            <div className="mb-2"></div>
            <button 
              className="bg-blue-500 text-white py-2 px-4 rounded mb-2 hover:bg-blue-700"
              onClick={() => setShowText(!showText)}
            >
              显示经络文字
            </button>

            <button 
              className="bg-blue-500 text-white py-2 px-4 rounded mb-2 hover:bg-blue-700"
              onClick={() => router.push('/menu')}
            >
              返回上一页
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
    </RequireAuth>
  );
}
