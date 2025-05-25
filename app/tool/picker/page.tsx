'use client';
import Button from '@/components/utils/button';
import React, { useState, useRef, ChangeEvent, MouseEvent } from 'react';

interface Point {
  x: number;
  y: number;
  label: string;
  position: 'front' | 'side' | 'back';
}

export default function CoordinatePicker() {
  const [image, setImage] = useState<string | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [currentLabel, setCurrentLabel] = useState('');
  const [currentPosition, setCurrentPosition] = useState<'front' | 'side' | 'back'>('front');
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCanvasClick = (e: MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPoint: Point = {
      x,
      y,
      label: currentLabel.trim(),
      position: currentPosition,
    };

    setPoints((prev) => [...prev, newPoint]);
    setCurrentLabel('');
  };

  const exportJSON = () => {
    const json = JSON.stringify(points, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'coordinates.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-900 text-white min-h-screen">
      {/* 左侧图像区域 */}
      <div className="w-full md:w-2/3 bg-gray-800 border border-gray-700 rounded-xl shadow-sm p-4 relative">
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
          />
        </div>

        <div className="relative w-full">
          {image ? (
            <img
              src={image}
              ref={imageRef}
              onClick={handleCanvasClick}
              className="w-full max-h-[70vh] object-contain rounded-md border border-gray-600 cursor-crosshair"
              alt="Uploaded"
            />
          ) : (
            <div className="w-full h-80 flex items-center justify-center text-gray-500 border border-dashed border-gray-600 rounded-md">
              请上传图片
            </div>
          )}
        </div>
      </div>

      {/* 右侧控制栏 */}
      <div className="w-full md:w-1/3 bg-gray-800 border border-gray-700 rounded-xl shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-gray-300 font-medium mb-1">标注当前点</label>
          <input
            type="text"
            value={currentLabel}
            onChange={(e) => setCurrentLabel(e.target.value)}
            placeholder="例如：足三里"
            className="w-full border border-gray-600 bg-gray-900 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 font-medium mb-1">选择部位</label>
          <select
            value={currentPosition}
            onChange={(e) => setCurrentPosition(e.target.value as 'front' | 'side' | 'back')}
            className="w-full border border-gray-600 bg-gray-900 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="front">正面（front）</option>
            <option value="side">侧面（side）</option>
            <option value="back">背面（back）</option>
          </select>
        </div>

        <Button onClick={exportJSON}>
          导出为 JSON
        </Button>

        <div>
          <h2 className="text-lg font-semibold text-gray-200 mb-2">已标注点</h2>
          <ul className="max-h-64 overflow-y-auto text-sm text-gray-400 space-y-1">
            {points.map((p, i) => (
              <li key={i} className="flex justify-between border-b border-gray-700 pb-1">
                <div>
                  [{p.x.toFixed(0)}, {p.y.toFixed(0)}] - <span className="text-blue-400 font-medium">{p.label || '未命名'}</span>
                </div>
                <span className="text-xs text-gray-500 ml-2">({p.position})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
