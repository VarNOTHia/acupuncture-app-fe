'use client'
import Button from "@/components/utils/button";
import Input from "@/components/utils/input";
import Modal from "@/components/utils/modal";
import { useTherapyStore } from "@/store/useTherapyStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Menu(){
  const router = useRouter();
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);

  const patient = useTherapyStore((state) => state.patient);
  const setPatient = useTherapyStore((state) => state.setPatient);

  // 要求填写患者名称和信息才能进行治疗。
  const redirect = (path: string) => {
    if (!patient?.name) {
      setShowPatientModal(true);
      return;
    }
    router.push(path);
  }

  useEffect(() => {
    if (!patient?.name) {
      setShowPatientModal(true);
    }
  }, []);
  return (
    <div className="flex items-center justify-center p-4 min-h-screen">
      {showPatientModal && <Modal
        title = '设置患者信息'
        description={['只有设置患者的基本信息才能启动治疗程序。']}
        rejectText = '取消'
        acceptText = '好'
        rejectHandler={() => {setShowPatientModal(false);}}
        acceptHandler={() => {setShowPatientModal(false);}}
      >
        <div className="flex flex-col items-center my-4">
          <Input
            type="text"
            placeholder="请输入患者姓名"
            color="light"
            className="w-full mb-4"
            onChange={(e) => {
              setPatient({
                ...patient,
                name: e.target.value,
              });
            }}
          />
          <Input
            type="text"
            placeholder="输入患者性别"
            color="light"
            className="w-full mb-4"
            onChange={(e) => {
              setPatient({
                ...patient,
                name: patient?.name || '',
                gender: e.target.value,
              });
            }}
          />
          <Input
            type="number"
            placeholder="输入患者年龄"
            color="light"
            className="w-full mb-4"
            onChange={(e) => {
              const age = parseInt(e.target.value, 10);
              setPatient({
                ...patient,
                name: patient?.name || '',
                age: isNaN(age) ? undefined : age,
              });
            }}
          />
        </div>
      </Modal>}
      {showWarningModal && <Modal
          title = '安全性警告'
          description = {['本选项绕过了治疗仪推荐的对症功能，将直接对接穴位进行电脉冲治疗。具备医疗人员相关资质方可使用，否则可能造成意外的人身伤害及财产损失。']}
          rejectText = '取消'
          acceptText = '我已知晓'
          rejectHandler = {() => {
            setShowWarningModal(false);
          }}
          acceptHandler = {() => {
            setShowWarningModal(false);
            redirect("/therapy");
          }}
          warn = {true}
        />}

      {/* Panel */}
      <div className="max-w-sm w-full bg-zinc-900/50 rounded-lg shadow-lg p-8 space-y-4 pb-12">
        <div className="flex flex-col items-center mb-8 gap-4">
          <h3 className="text-2xl font-bold text-center">
            治疗目录
          </h3>
          <p>当前治疗患者：{patient?.name} {patient?.gender && `(${patient.gender} ,`} {patient?.age && `${patient?.age} 岁)`} </p>
        </div>
        <div className="flex flex-col items-center gap-4 mt-6">
          <Button
            onClick={() => setShowPatientModal(true)}
          >
            修改患者信息
          </Button>
          <Button
            onClick={() => redirect("/therapy")}
            color="blue"  
          >
            匹配症状治疗
          </Button>
          <Button
            onClick={() => redirect("/therapy")}
            color="orange"  
          >
            子午流注治疗
          </Button>
          <Button
            onClick={() => setShowWarningModal(true)}  
            color="red"
          >
            自由模式
          </Button>
        </div>
        </div>
    </div>
  );
}