'use client'

import { findMeridianPosition } from "@/app/constants";
import SessionWrapper from "@/app/SessionWrapper";
import Button from "@/components/utils/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Symptom {
  name: string;
  description: string;
  line: string;
  acupoints: string[]; // 新增穴位字段
}

interface Department {
  _id: string;
  name: string;
  symptoms: Symptom[];
}

export default function Symptoms() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null); // 改为存储整个症状对象
  const router = useRouter();

  useEffect(() => {
    fetch("/api/departments")
      .then((res) => res.json())
      .then((data) => setDepartments(data));
  }, []);

  const getLine = (): string | undefined => {
    return selectedSymptom?.line;
  };

  return (
    <SessionWrapper>
      <div className="flex min-h-screen">
        {/* 左侧菜单 - 保持原样 */}
        <div className="w-80 bg-zinc-800 flex">
          <div className="w-1/2 border-r border-zinc-700">
            <div className="flex items-center p-4">
              <button
                onClick={() => router.push("/menu")}
                className="mr-2 text-white hover:text-gray-300"
              >
                《
              </button>
              <h2 className="text-white font-semibold text-lg">科室选择</h2>
            </div>
            <ul>
              {departments.map((dept) => (
                <li
                  key={dept._id}
                  className={`px-4 py-2 cursor-pointer hover:bg-zinc-700 ${
                    selectedDepartment?._id === dept._id ? "bg-zinc-700" : ""
                  }`}
                  onClick={() => {
                    setSelectedDepartment(dept);
                    setSelectedSymptom(null);
                  }}
                >
                  <span className="text-white text-md">{dept.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-1/2">
            <h2 className="p-4 text-white font-semibold text-lg">症状列表</h2>
            <ul>
              {selectedDepartment &&
                selectedDepartment.symptoms.map((symptom) => (
                  <li
                    key={symptom.name}
                    className={`px-4 py-2 text-white text-md hover:bg-zinc-700 cursor-pointer ${
                      selectedSymptom?.name === symptom.name ? "bg-zinc-700" : ""
                    }`}
                    onClick={() => setSelectedSymptom(symptom)}
                  >
                    {symptom.name}
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* 主要内容区域 - 仅添加穴位显示 */}
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-semibold text-white mb-8">
            {selectedDepartment
              ? selectedDepartment.name + " 相关症状"
              : "请在左侧选择科室"}
          </h1>

          {selectedDepartment && selectedSymptom ? (
            <>
              <p className="text-xl text-white mb-4">{selectedSymptom.name}</p>
              <p className="text-gray-200 mb-2">
                症状描述：{selectedSymptom.description}
              </p>
              <p className="text-gray-200 mb-2">对应经络：{getLine()}</p>
              
              {/* 新增穴位显示 - 保持原有样式 */}
              <p className="text-gray-200 mb-2">
                推荐穴位：{selectedSymptom.acupoints?.join("、")}
              </p>

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
              <p className="text-gray-400">请在左侧选择具体症状以查看详细信息</p>
            )
          )}
        </div>
      </div>
    </SessionWrapper>
  );
}