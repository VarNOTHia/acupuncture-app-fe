'use client'

import { findMeridianPosition } from "@/app/constants";
import SessionWrapper from "@/app/SessionWrapper";
import Button from "@/components/utils/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Symptom {
  name: string;
  description: string;
  line: string;
}

interface Department {
  name: string;
  symptoms: Symptom[];
}

// 告诉 TS 这是一个 “键 名 -> Department” 的映射
const departmentSymptoms: Record<string, Department> = {
  "耳鼻喉科": {
    name: "耳鼻喉科",
    symptoms: [
      { name: "鼻塞", description: "鼻腔内黏膜肿胀，导致鼻腔通气不畅。", line: "手太阴肺经" },
      { name: "耳鸣", description: "出现耳鸣、听力下降等症状",    line: "手太阳小肠经" },
    ]
  },
  "内科": {
    name: "内科",
    symptoms: [
      { name: "腹泻", description: "出现腹泻症状", line: "足太阴脾经" },
      { name: "咳嗽", description: "咳嗽、咳痰等症状", line: "手太阴肺经" },
    ]
  },
};

export default function Symptoms() {
  type DeptKey = keyof typeof departmentSymptoms;
  const [selectedDepartment, setSelectedDepartment] = useState<DeptKey | null>(null);
  const [selectedSymptom,   setSelectedSymptom  ] = useState<string | null>(null);
  const router = useRouter();

  const getLine = (): string | undefined => {
    if (!selectedDepartment || !selectedSymptom) return undefined;
    const dept = departmentSymptoms[selectedDepartment];
    const found = dept.symptoms.find((s) => s.name === selectedSymptom);
    return found?.line;
  };

  return (
    <SessionWrapper>
      <div className="flex min-h-screen">
        {/* 侧边栏 */}
        <div className="w-80 bg-zinc-800 flex">
          {/* 科室列表 */}
          <div className="w-1/2 border-r border-zinc-700">
            <div className="flex items-center p-4">
              <button 
                onClick={() => router.push('/menu')} 
                className="mr-2 text-white hover:text-gray-300"
              >《</button>
              <h2 className="text-white font-semibold text-lg">科室选择</h2>
            </div>
            <ul>
              {Object.keys(departmentSymptoms).map((dept) => (
                <li
                  key={dept}
                  className={`px-4 py-2 cursor-pointer hover:bg-zinc-700 ${
                    selectedDepartment === dept ? "bg-zinc-700" : ""
                  }`}
                  onClick={() => {
                    setSelectedDepartment(dept as DeptKey);
                    setSelectedSymptom(null); // 切换科室时重置症状
                  }}
                >
                  <span className="text-white text-md">{dept}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 症状列表 */}
          <div className="w-1/2">
            <h2 className="p-4 text-white font-semibold text-lg">症状列表</h2>
            <ul>
              {selectedDepartment &&
                departmentSymptoms[selectedDepartment].symptoms.map((symptom) => (
                  <li
                    key={symptom.name}
                    className={`px-4 py-2 text-white text-md hover:bg-zinc-700 cursor-pointer ${
                      selectedSymptom === symptom.name ? "bg-zinc-700" : ""
                    }`}
                    onClick={() => setSelectedSymptom(symptom.name)}
                  >
                    {symptom.name}
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-semibold text-white mb-8">
            {selectedDepartment
              ? departmentSymptoms[selectedDepartment].name + ' 相关症状'
              : '请在左侧选择科室'}
          </h1>

          {selectedDepartment && selectedSymptom ? (
            <>
              <p className="text-xl text-white mb-4">{selectedSymptom}</p>
              <p className="text-gray-200 mb-2">
                症状描述：{
                  // 这里用非空断言，因为 selectedSymptom 一定是有效值
                  departmentSymptoms[selectedDepartment]
                    .symptoms.find((s) => s.name === selectedSymptom)!
                    .description
                }
              </p>
              <p className="text-gray-200 mb-4">对应经络：{getLine()}</p>
              <Button
                onClick={() => {
                  const line = getLine();
                  if (line) {
                    const pos = findMeridianPosition(line);
                    if (pos) {
                      router.push(
                        `/therapy?direction=${pos.direction}&index=${pos.index}`
                      );
                    }
                  }
                }}
              >
                前往治疗
              </Button>
            </>
          ) : (
            selectedDepartment && (
              <p className="text-gray-400">
                请在左侧选择具体症状以查看详细信息
              </p>
            )
          )}
        </div>
      </div>
    </SessionWrapper>
  );
}
