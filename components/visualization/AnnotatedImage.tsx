"use client"
import React, { useEffect, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Line, Text, Circle } from "react-konva";
import useImage from "use-image";

const getCoordinate = (coordinate: number[], scale: number) => {
  return coordinate.map(i => i * scale);
};

interface Meridians {
  type: string,
  index: number,
  width: number,
  height: number,
  handleName: (name: string) => void,
  handleCurrentList: (list: string[]) => void,
  scale: number,
  showText: boolean,
  targetName: string,
}

export default function AnnotatedImage({ type, index, width, height, handleName, handleCurrentList, scale, showText, targetName }: Meridians) {
  const [image] = useImage(`/img/${type}.png`);
  const [linesList, setLinesList] = useState<any[]>([]);
  const [dotList, setDotList] = useState<any[]>([]);
  const [nameList, setNameList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 根据穴位名称列表，计算当前选中的索引
  const selectedIndex = nameList.indexOf(targetName);

  // 用于拆分断点的方法
  const divideBreakpoint = (data: any[]) => {
    let pathes: any[][] = [];
    let currentPath: any[] = [];
  
    for (let i = 0; i < data.length; i++) {
      currentPath.push(data[i]);
      if (data[i].name === '__END') {
        pathes.push(currentPath);
        currentPath = [];
      } else if (data[i].name === '__START') {
        currentPath = [data[i]];
      }
    }
    if (currentPath.length > 0) {
      pathes.push(currentPath);
    }
    return pathes;
  };
  
  useEffect(() => {
    const fetchMeridiansData = async () => {
      try {
        const response = await fetch(`/position/${type}/${index}.json`);
        if (!response.ok) {
          throw new Error("response was not ok");
        }
        const data = await response.json();
        const dividedData = divideBreakpoint(data);
        
        setLinesList(dividedData.map((line) => line.map((i: any) => [i.x, i.y])));
        const newNameList = data
          .filter((item: any) => item.name !== '__START' && item.name !== '__END' && item.name !== '__BYPASS')
          .map(item => item.name);
        setNameList(newNameList);
        // 将穴位名称列表回传给父组件，用于下拉菜单
        handleCurrentList(newNameList);
        setDotList(data
          .filter((item: any) => item.name !== '__START' && item.name !== '__END' && item.name !== '__BYPASS')
          .map((item: any) => [item.x, item.y])
        );
      } catch (err) {
        setError("Failed to load the JSON data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeridiansData();
  }, [type, index]);

  return (
    <Stage width={width} height={height}>
      <Layer>
        <KonvaImage image={image} width={width} height={height} />
        {linesList.map((lineList, lineIndex) => (
          <Line
            key={lineIndex}
            points={getCoordinate(lineList.flat(), scale)}
            stroke="black"
            strokeWidth={1}
            lineCap="round"
            lineJoin="round"
          />
        ))}
        {dotList.map(([x, y], _index) => {
          const x_pos = x * scale;
          const y_pos = y * scale;
          return (
            <React.Fragment key={_index}>
              <Circle
                x={x_pos}
                y={y_pos}
                radius={selectedIndex === _index ? 6 * scale : 4 * scale}
                fill={selectedIndex === _index ? "red" : "blue"}
                onClick={() => {
                  handleName(nameList[_index]);
                }}
              />
              {showText && (
                <Text
                  x={x_pos + 5}
                  y={y_pos - 1}
                  text={nameList[_index]}
                  fontSize={15 * scale}
                  fill="black"
                  onClick={() => {
                    handleName(nameList[_index]);
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </Layer>
    </Stage>
  );
}
