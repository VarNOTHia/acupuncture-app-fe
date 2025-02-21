"use client"
import React, { useEffect, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Line, Text, Circle } from "react-konva";
import useImage from "use-image";
import { MERIDIANS_NAME } from "./constants";

const getCoordinate = (coordinate: number[], scale: number) => {
  return coordinate.map(i => i * scale);
}

interface Meridians{
  type: string,
  index: number,
  width: number,
  height: number,
  handleName: Function,
  scale: number,
  showText: boolean,
}

// 承接 state 作为该组件的 props 传入。
export default function AnnotatedImage({ type, index, width, height, handleName, scale, showText }: Meridians) {
  // 加载图片与经络数据。
  const [image] = useImage(`/img/${type}.png`);
  const [meridiansData, setMeridiansData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true); // 加载状态
  const [error, setError] = useState<string | null>(null); // 错误状态
  /**
   * 分拆直线坐标列表。
   * 该列表是一个二元数组，由 meridiansData 的不同数组分拆而来。
   */
  const [linesList, setLinesList] = useState<any[]>([]);  // 分拆直线坐标列表

  /**
   * 分拆经络点列表。
   * 该列表是一个一元数组，是去除了中断符号（__START __END __BYPASS）的常规点位。
   */
  const [dotList, setDotList] = useState<any[]>([]);
  const [nameList, setNameList] = useState<string[]>([]); // 拆分名称列表
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const handleText = () => {
    
  }
  // 经络坐标设置了可能出现的断点，当出现断点的时候对数组进行拆分。
  const divideBreakpoint = (data: any[]) => {
    // 最后的路径数组，分为几段就代表到时候会渲染几条路径。
    let pathes: any[][] = [];
    // 现在暂存的数组。
    let currentPath: any[] = [];
  
    for (let i = 0; i < data.length; i++) {
      currentPath.push(data[i]);
  
      // 路径结束，将这条路径压入数组中
      if (data[i].name == '__END') {
        pathes.push(currentPath);
        currentPath = []; // 清空 currentPath，准备开始新的一段路径
      } else if (data[i].name == '__START') {
        // 如果遇到 '__START'，重置当前路径为新的一段
        currentPath = [data[i]];
      }
    }
  
    // 如果最后的路径没有以 '__END' 结束，也需要添加到路径数组中
    if (currentPath.length > 0) {
      pathes.push(currentPath);
    }
  
    return pathes;
  };
  

  useEffect(() => {
    const fetchMeridiansData = async () => {
      try {
        console.log(type, index);
        const response = await fetch(`/position/${type}/${index}.json`);
        
        if (!response.ok) {
          throw new Error("response was not ok");
        }

        // 一维 data 数组
        const data = await response.json();
        // 二维 data 数组
        let divided_data = divideBreakpoint(data);
        
        // 把请求得到的 json 分割成一系列的列表后，转换出一系列的坐标列表。
        setLinesList(divided_data.map((line, line_index) => {
          return line.map((i: any) => [i.x, i.y]);
        }))

        // 过滤掉分隔符号之后的穴位列表
        setDotList(data
          .filter((item: any) => item.name !== '__START' && item.name !== '__END' && item.name !== '__BYPASS')
          .map((item: any) => {
            return [item.x, item.y];
          }));
        
        // 穴位对应的名称列表
        setNameList(data
          .filter((item: any) => item.name !== '__START' && item.name !== '__END' && item.name !== '__BYPASS')
          .map(item => item.name)
        );

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

        {linesList.map((lineList, lineIndex) => {
          return (
            <Line
              key={lineIndex}
              points={getCoordinate(lineList.flat(), scale)} // 起点和终点的坐标
              stroke="black" // 线条颜色
              strokeWidth={1} // 线条宽度
              lineCap="round" // 线条端点样式
              lineJoin="round" // 线条连接样式
            />
          )
        })}
        {/* 连线 */}
        

        {/* 遍历每个点，绘制标记和文本 */}
        {dotList.map(([x, y], _index) => {
          let x_pos = x * scale;
          let y_pos = y * scale;

          return (
            <React.Fragment 
              key={_index}
            >
              {/* 在点上绘制一个小圆圈 */}
              <Circle
                x={x_pos}
                y={y_pos}
                radius={selectedIndex === _index ? 6 * scale : 4 * scale} // 圆的半径
                fill={selectedIndex === _index ? "red" : "blue"} // 填充颜色
                onClick={() => {
                  setSelectedIndex(_index);
                  handleName(nameList[_index]); 
                }}
              />

              {showText && <Text
                x={x_pos + 5} // 偏移文字到圆右侧
                y={y_pos - 1} // 偏移文字到圆上方
                text={nameList[_index]} // 点的编号
                fontSize={15 * scale}
                fill="black"
                onClick={() => {
                  setSelectedIndex(_index);
                  handleName(nameList[_index]);
                }}
              />}
            </React.Fragment>
          )
        })}
        
      </Layer>
    </Stage>
  );
}
