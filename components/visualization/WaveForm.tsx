import { useRef, useEffect } from "react";

interface WaveFormProps {
  type: "sine" | "square" | "triangle" | "sawtooth" | "flat" | "noise" | "smooth" | "pulse"; // 添加flat类型
  frequency: number;
  amplitude: number;
  duration?: number;
  width?: number;
  height?: number;
  isLaunched?: boolean;
}

export default function WaveForm({
  type,
  frequency,
  amplitude,
  duration = 1,
  width = 600,
  height = 200,
  isLaunched = false,
}: WaveFormProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(0);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime: number;
    const centerY = height / 2;
    const ampScale = (height / 2) * amplitude;

    const animate = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      if (isLaunched && type !== "flat") {  // flat类型不更新相位
        phaseRef.current += deltaTime * frequency * 2 * Math.PI;
        phaseRef.current %= 2 * Math.PI;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();

      for (let x = 0; x < width; x++) {
        let y = 0;
        
        if (type === "flat") {
          y = 0; // 纯直线
        } else {
          const t = (x / width) * duration;
          const phase = phaseRef.current - t * 2 * Math.PI * frequency;
          
          switch (type) {
            case "sine":
              y = Math.sin(phase);
              break;
            case "square":
              y = Math.sign(Math.sin(phase));
              break;
            case "triangle":
              // 调整相位归一化，确保在0到2π之间
              let normalizedPhase = (phase % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
              if (normalizedPhase < Math.PI) {
                y = (2 * normalizedPhase / Math.PI) - 1; // 上升阶段：-1到1
              } else {
                y = 3 - (2 * normalizedPhase / Math.PI); // 下降阶段：1到-1
              }
              break;
            case "sawtooth":
              y = 2 * ((phase / (2 * Math.PI)) % 1);  // 线性上升的锯齿
              break;
            case "noise":
              if(isLaunched){
                y = Math.random() * 2 - 1;
              } else {
                y = 0;
              }
              break;
            case "smooth":
              if(isLaunched){
                const noisePos = (phase / (2 * Math.PI)) % 1000;
                y = Math.sin(noisePos) * Math.random() + 
                    Math.sin(noisePos * 3.7) * Math.random() + 
                    Math.sin(noisePos * 9.3) * Math.random();
              } else {
                y = 0;
              }
              break;
          }
        }

        const scaledY = centerY - y * ampScale;
        if (x === 0) ctx.moveTo(x, scaledY);
        else ctx.lineTo(x, scaledY);
      }

      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.stroke();

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [type, frequency, amplitude, duration, width, height, isLaunched]);

  return <canvas ref={canvasRef} width={width} height={height} className="bg-white rounded shadow" />;
}