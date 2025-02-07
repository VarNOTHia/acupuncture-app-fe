"use client"
import React, { useEffect, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Line, Text, Circle } from "react-konva";
import useImage from "use-image";
import { MERIDIANS_NAME } from "./constants";

const SCALE = 0.6;

const getCoordinate = (coordinate: number[], scale: number) => {
  return coordinate.map(i => i * scale);
}

interface Meridians{
  type: string,
  index: number,
  width: number,
  height: number,
  handleName: Function,
}

// 承接 state 作为该组件的 props 传入。
function AnnotatedImage({ type, index, width, height, handleName }: Meridians) {
  // 加载图片与经络数据。
  const [image] = useImage(`/img/${type}.png`);
  const [meridiansData, setMeridiansData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true); // 加载状态
  const [error, setError] = useState<string | null>(null); // 错误状态
  const [positionList, setPositionList] = useState<any[]>([]);  // 分拆坐标列表
  const [nameList, setNameList] = useState<string[]>([]); // 拆分名称列表
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  useEffect(() => {
    const fetchMeridiansData = async () => {
      try {
        console.log(type, index);
        const response = await fetch(`/position/${type}/${index}.json`);
        
        if (!response.ok) {
          throw new Error("response was not ok");
        }

        const data = await response.json();
        setMeridiansData(data); // 设置加载的 JSON 数据
        setPositionList(data.map((i: any) => [i.x, i.y]));  // 设置坐标
        setNameList(data.map((i: any) => i.name));
        console.log(data.map((i: any) => [i.x, i.y]));
        setSelectedIndex(-1);
      } catch (err) {
        setError("Failed to load the JSON data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeridiansData();
  }, [type, index]); // 依赖项变化时重新请求

  return (
    <Stage width={width} height={height}>
      <Layer>
        {/* 绘制背景图片 */}
        <KonvaImage image={image} width={width} height={height} />

        {/* 连线 */}
        <Line
          points={getCoordinate(positionList.flat(), SCALE)} // 起点和终点的坐标
          stroke="black" // 线条颜色
          strokeWidth={1} // 线条宽度
          lineCap="round" // 线条端点样式
          lineJoin="round" // 线条连接样式
        />

        {/* 遍历每个点，绘制标记和文本 */}
        {positionList.map(([x, y], _index) => {
          let x_pos = x * SCALE;
          let y_pos = y * SCALE;

          return (
            <React.Fragment key={_index}>
              {/* 在点上绘制一个小圆圈 */}
              <Circle
                x={x_pos}
                y={y_pos}
                radius={2} // 圆的半径
                fill={selectedIndex === _index ? "blue" : "red"} // 填充颜色
                onClick={() => {
                  setSelectedIndex(_index);
                }}
              />

              <Text
                x={x_pos + 5} // 偏移文字到圆右侧
                y={y_pos - 1} // 偏移文字到圆上方
                text={nameList[_index]} // 点的编号
                fontSize={12 * SCALE}
                fill="black"
                onClick={() => {
                  setSelectedIndex(_index);
                  handleName(nameList[_index]);
                }}
              />
            </React.Fragment>
          )
        })}
        
      </Layer>
    </Stage>
  );
}

export default function Graph() {
  const stageWidth = 1200 * SCALE;
  const stageHeight = 1600 * SCALE;
  const [imgType, setImgType] = useState<'front' | 'side' | 'back'>('front');
  const [imgIndex, setImgIndex] = useState(6);
  const [targetName, setTargetName] = useState<string>('');
  const handleName = (name: string) => {
    setTargetName(name);
  }

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
          />
        </div>
        {/* 右侧：图片说明 */}
        <div className="md:w-2/3 flex flex-col justify-center mt-3 md:mt-0 md:ml-8">
          <h2 className="text-2xl font-bold mb-3">当前操作经络：{MERIDIANS_NAME[imgType][imgIndex]}</h2>
          <p className="mb-3">目前选中穴位：{targetName}</p>
          <button className="bg-blue-500 text-white py-2 px-4 rounded mb-2 hover:bg-blue-700">电击治疗</button>
          <button className="bg-blue-500 text-white py-2 px-4 rounded mb-2 hover:bg-blue-700">查看穴位简介</button>
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">转身</button>
        </div>
      </div>
    </div>
  );
}
