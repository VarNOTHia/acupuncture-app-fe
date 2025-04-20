interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  color?: "blue" | "red" | "green" | "gray" | "orange"; // 可扩展
  disabled?: boolean; // 可选属性
}

const colorMap = {
  blue: "bg-blue-500 hover:bg-blue-700",
  red: "bg-red-500 hover:bg-red-700",
  green: "bg-green-500 hover:bg-green-700",
  gray: "bg-gray-500 hover:bg-gray-700",
  orange: "bg-orange-500 hover:bg-orange-700",
};

export default function Button({ children, onClick, color = "blue", disabled }: ButtonProps) {
  const colorClass = colorMap[color] || colorMap.blue;

  return (
    <button
      onClick={onClick}
      className={`text-white py-2 px-4 rounded mb-2 ${colorClass}`}
      disabled={disabled} // 添加 disabled 属性
    >
      {children}
    </button>
  );
}
