import { useState } from "react";

interface DualButtonProps {
  untriggeredText: string;
  triggeredText: string;
  triggered?: boolean;      // 强行控制按钮变化，不要用这个
  onClick: () => void;
  triggeredColor: "blue" | "red" | "green" | "gray"; // 可扩展
  unTriggeredColor: "blue" | "red" | "green" | "gray"; // 可扩展
  size?: "small" | "medium" | "large"; // 可扩展
}

const colorMap = {
  blue: "bg-blue-500 hover:bg-blue-700 text-white",
  red: "bg-red-500 hover:bg-red-700 text-white",
  green: "bg-green-500 hover:bg-green-700 text-white ",
  gray: "bg-gray-200 hover:bg-gray-300 text-black",
};

export default function DualButton(props: DualButtonProps) {
  const [triggered, setTriggered] = useState(false);
  const { untriggeredText, triggeredText, onClick, triggeredColor, unTriggeredColor, size } = props;
  const colorClass = colorMap[triggered ? triggeredColor : unTriggeredColor] || colorMap.blue;

  return (
    <button
      onClick={() => {
        setTriggered(!triggered);
        onClick();
      }}
      className={`py-2 px-4 rounded mb-2 ${colorClass}`}
    >
      {triggered ? triggeredText : untriggeredText}
    </button>
  );
}