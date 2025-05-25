'use client'
import Button from "@/components/utils/button";
import Input from "@/components/utils/input";
import Modal from "@/components/utils/modal";
import { useTherapyStore } from "@/store/useTherapyStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SessionWrapper from "../SessionWrapper";
import { TIMEMAP } from "../constants";
import { useSolarTime } from "@/hooks/utils/useSolarTime";
import { useUserStore } from "@/store/useUserStore";
import { useSession } from "next-auth/react";
import { Route } from "lucide-react";

export default function Menu(){
  const router = useRouter();
  const { data: session, status } = useSession();

  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const location = useUserStore((state) => state.location);
  const [solarTime, rawSolarTime] = useSolarTime(location?.latitude || 39.90, location?.longitude || 116.40);

  const patient = useTherapyStore((state) => state.patient);
  const setPatient = useTherapyStore((state) => state.setPatient);
  const setUsername = useTherapyStore((state) => state.setUsername);
  // 获取当前时间对应的经络，由于太阳时可能出现不同数据类型，所以用 as number 做转换。
  const getTask = () => TIMEMAP.find(
    t => 
      (rawSolarTime as number) >= t.from 
      && (rawSolarTime as number) < t.to
  )?.name;

  const getDirection = () => TIMEMAP.find(
    t => 
      (rawSolarTime as number) >= t.from 
      && (rawSolarTime as number) < t.to
  )?.graph.direction;

  const getIndex = () => TIMEMAP.find(
    t => 
      (rawSolarTime as number) >= t.from 
      && (rawSolarTime as number) < t.to
  )?.graph.index;

  // 要求填写患者名称和信息才能进行治疗。
  const redirect = (path: string) => {
    if (!patient?.name) {
      setShowPatientModal(true);
      return;
    }
    router.push(path);
  }

  const autoRedirect = () => {
    if (!patient?.name) {
      setShowPatientModal(true);
      return;
    }

    if (!rawSolarTime) {
      alert("未能获取当前太阳时，请稍候或重试。");
      return;
    }
    router.push(`/therapy?direction=${getDirection()}&index=${getIndex()}`);
  }

  useEffect(() => {
    if (!patient?.name) {
      setShowPatientModal(true);
    }
  }, []);

  return (
    <SessionWrapper>
      <div className="flex items-center justify-center p-4 min-h-screen">
        {showPatientModal && <Modal
          title = '设置患者信息'
          rejectText = '取消'
          acceptText = '好'
          rejectHandler={() => {
            setShowPatientModal(false);
            setUsername(session?.user?.name || '');
          }}
          acceptHandler={() => {
            setShowPatientModal(false);
            setUsername(session?.user?.name || '');
          }}
        >
          <p className="text-gray-700 mb-4">为了遵循<Link 
            className="text-red-600 font-bold"
            href={'/about'}
            target="_blank"
          > 安全原则 </Link>，只有确认患者的个人信息才能启动治疗程序。</p>
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
          >
          <p className="text-gray-700 mb-2">该模式不再按照对应症状或子午流注对治疗经络进行强制限制，可以选择不同经络和穴位进行治疗。</p>
          <p className="text-gray-700 mb-4">请再次确认已经理解
            <Link 
            className="text-gray-700 font-bold"
            href={'/about'}
            target="_blank"
          > 使用说明 </Link> 及<Link 
            className="text-red-600 font-bold"
            href={'/about'}
            target="_blank"
          > 安全原则 </Link> 的情况下，再启动治疗程序。</p>
        </Modal>}
        
        {/* Panel */}
        <div className="max-w-sm w-full bg-zinc-800/50 rounded-lg shadow-lg p-8 space-y-4 pb-12">
          <div className="flex flex-col items-center mb-8 gap-4">
            <h3 className="text-2xl font-bold text-center">
              治疗目录
            </h3>
            <p>当前治疗患者：{patient?.name} {patient?.gender && `(${patient.gender} ,`} {patient?.age && `${patient?.age} 岁)`} </p>
            <p>当前真太阳时：{solarTime}</p>
            <p>子午流注对应经络：{getTask()}</p>
          </div>
          <div className="flex flex-col items-center gap-4 mt-6">
            <Button
              onClick={() => setShowPatientModal(true)}
            >
              修改患者信息
            </Button>
            <Button
              onClick={() => redirect("/menu/symptoms")}
              color="blue"  
            >
              匹配症状治疗
            </Button>
            <Button
              onClick={() => autoRedirect()}
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
            <Button
              onClick={() => router.push("/")}
              color="gray"
            >
              返回上级
            </Button>
          </div>
          </div>
      </div>
    </SessionWrapper>
  );
}