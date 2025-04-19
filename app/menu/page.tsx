'use client'
import Button from "@/components/utils/button";
import Modal from "@/components/utils/modal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Menu(){
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex items-center justify-center p-4 min-h-screen">
      {showModal && <Modal
          title = '安全性警告'
          description = {['本选项绕过了治疗仪推荐的对症功能，将直接对接穴位进行电脉冲治疗。具备医疗人员相关资质方可使用，否则可能造成意外的人身伤害及财产损失。']}
          rejectText = '取消'
          acceptText = '我已知晓'
          rejectHandler = {() => {
            setShowModal(false);
          }}
          acceptHandler = {() => {
            setShowModal(false);
            router.push("/therapy");
          }}
          warn = {true}
        />}

      {/* Panel */}
      <div className="max-w-sm w-full bg-zinc-900/50 rounded-lg shadow-lg p-8 space-y-4 pb-12">
        <div className="flex flex-col items-center gap-4 mt-6">
          <Button
            onClick={() => router.push("/")}
            color="blue"  
          >
            匹配症状治疗
          </Button>
          <Button
            onClick={() => router.push("/")}
            color="orange"  
          >
            子午流注治疗
          </Button>
          <Button
            onClick={() => setShowModal(true)}  
            color="red"
          >
            自由模式
          </Button>
        </div>
        </div>
    </div>
  );
}