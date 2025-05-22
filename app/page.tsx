"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCurrentTime } from "../hooks/utils/useCurrentTime";
import { useSolarTime } from "../hooks/utils/useSolarTime";
import Link from "next/link";
import Modal from "@/components/utils/modal";
import { signOut, useSession } from "next-auth/react";
import Button from "@/components/utils/button";
import Loading from "@/components/auth/loading";
import { useUserStore } from "@/store/useUserStore";

export default function Home() {
  const router = useRouter();
  const [location, setLocation] = useState<string>("北京");
  const [latitude, setLatitude] = useState<number>(39.90);
  const [longitude, setLongitude] = useState<number>(116.40);
  const [loading, setLoading] = useState(10);
  // 提前设置 mounted 状态，防止 SSR 与客户端不同步
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();

  // 只有组件挂载后才调用这些 Hook
  const currentTime = useCurrentTime();
  const [solarTime, rawSolarTime] = useSolarTime(latitude, longitude);
  
  // 控制是否展示“定位说明弹窗”
  const [showLocationNotice, setShowLocationNotice] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  const setCurrentLocation = useUserStore((state) => state.setLocation);

  useEffect(() => {
    setMounted(true); // 组件已经挂载

    if (!hasPermission && !sessionStorage.getItem("hasShownNotice")) {
      setLoading(0);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setCurrentLocation(
          position.coords.latitude,
          position.coords.longitude
        );
        // 调用 API 获取具体城市信息
        fetch(
          `/api/regeo?lat=${position.coords.latitude}&lon=${position.coords.longitude}`
        )
          .then((response) => response.json())
          .then((data: any) => {
            console.log(data);
            setLocation(data.city || "Unknown City");
          })
          .catch((error) => {
            console.error("获取城市信息失败:", error);
            setLocation("获取城市信息失败");
          });
      },
      (error) => {
        console.error("获取定位失败:", error);
        setLocation("无法获取位置信息");
      }
    );

    const timer = setInterval(() => {
      setLoading((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasPermission]);

  // 在 sessionStorage 当中设计一个字段，从而阻止弹窗在用户确认之后反复调起。
  useEffect(() => {
    const hasShownNotice = sessionStorage.getItem("hasShownNotice");
    if (hasShownNotice) {
      setShowLocationNotice(false);
    }
  }, []);

  useEffect(() => {
    if (mounted && status === "unauthenticated") {
      router.push("/login");
    }
  }, [mounted, status, router]);

  // 如果尚未挂载，返回占位内容，避免水合问题
  if (!mounted || status === "loading") {
    return <Loading />;
  }

  return (
    <div className="flex items-center justify-center p-4 min-h-screen">
      <div className="max-w-sm w-full bg-zinc-900/50 rounded-lg shadow-lg p-8 space-y-4 pb-12">
      {/* 弹窗提示组件 */}
      {showLocationNotice && (
        <Modal 
          title = "定位权限收集"
          description={['经络开穴治疗需要依赖具体的地理位置判断如何治疗。为了根据您所在的地区提供更精准的经络 / 穴位治疗方案，我们需要获取您的地理位置（经纬度）。',
            '该信息仅用于本地展示，不会上传或保存。',
            '如果不提供定位权限，将默认按照您所在的时区进行计算。',
          ]}
          rejectText = "拒绝"
          acceptText = "我已知晓，使用定位"
          rejectHandler = {() => {
            setShowLocationNotice(false);
            setHasPermission(false);
            sessionStorage.setItem("hasShownNotice", "true");
          }}
          acceptHandler = {() => {
            setShowLocationNotice(false);
            setHasPermission(true);
            sessionStorage.setItem("hasShownNotice", "true");
          }}
          warn = {false}
        />
      )}

      <h1 className="text-3xl font-bold text-center">
        经络子午流注治疗软件
      </h1>
      
      <p>您的 ID：{session?.user?.name}</p>
      <p>当前时间：{currentTime}</p>
      <p>当前太阳时：{solarTime}</p>

      {loading === 0 ? (
        <div>
          <p>您所在的位置是：{location}</p>
          <p>经纬度：({latitude.toFixed(3)}, {longitude.toFixed(3)})</p>
        </div>
      ) : (
        <p>正在定位，请稍后...（{loading}s）</p>
      )}
      <div className="flex flex-col items-center gap-4 mt-6">
        <Button
          onClick={() => {
            router.push("/menu");
          }}
        >
          启动治疗程序
        </Button>

        <Button
          onClick={() => router.push("/about")}
        >
          查看操作说明
        </Button>

        <Button
          onClick={() => router.push("/graph")}
        >
          经络 / 穴位图
        </Button>

        <Button
          onClick={() => window.open("https://zh.wikipedia.org/wiki/%E5%AD%90%E5%8D%88%E6%B5%81%E6%B3%A8", "_blank")}
          color="orange"
        >
          了解「子午流注」
        </Button>

        <Button
          color="green"
          onClick={
            () => {
              router.push('/log');
            }
          }
        >
          查看治疗日志
        </Button>


        <Button 
          onClick={() => {signOut({
            redirect: false,
            callbackUrl: "/login",
          })}}
          color="gray"
        >
          登出
        </Button>
      </div>
      </div>
    </div>
  );
}
