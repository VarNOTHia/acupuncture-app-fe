// pages/about.tsx 或 app/about/page.tsx

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="p-8 text-white max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">快速入门</h1>
      <p className="mb-2">
        本项目是一个兼容多种模式的经络治疗学习平台。包含一个治疗模块，常规对症治疗、<Link className="text-blue-300" href="https://zh.wikipedia.org/wiki/%E5%AD%90%E5%8D%88%E6%B5%81%E6%B3%A8">子午流注</Link>和自由模式。
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">使用说明</h2>
      <ol className="list-decimal list-inside mb-4 text-gray-300">
        <li>采集位置信息进行太阳时的计算，以便通过「子午流注」智能选择经络。</li>
        <li>在治疗目录里面可以选择常规对症治疗、子午流注治疗和自由模式。</li>
        <li>进入治疗模式的时候可以选择不同的波形和穴位，每次电脉冲都会生成数据。</li>
        <li>每次治疗之前都需要收集患者信息，以便与前面电脉冲的数据生成报告。可以在用户页面查看并导出。</li>
      </ol>
      <h2 className="text-xl font-semibold mt-6 mb-2">免责声明</h2>
      <p className="text-gray-400">
        所有症状与经络关联基于中医理论，使用请自行甄别。
      </p>
    </div>
  );
}
