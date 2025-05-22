import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="p-8 text-white max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        经络治疗系统说明​
      </h1>
      <p className="mb-2">
        本项目是一个兼容多种模式的经络治疗平台。包含一个治疗模块，常规对症治疗、
          <Link className="text-blue-300" href="https://zh.wikipedia.org/wiki/%E5%AD%90%E5%8D%88%E6%B5%81%E6%B3%A8">
            子午流注
          </Link>
        和自由模式。
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">
        使用说明
      </h2>
      <ol className="list-decimal list-inside mb-4 text-gray-300">
        <li>使用之前请谨记下文 <strong className="text-red-600">安全原则</strong>，请 <strong className="text-red-600">务必</strong> 在 <strong className="text-red-600">确认安全</strong> 的前提下进行治疗。</li>
        <li>采集位置信息进行太阳时的计算，以便通过「子午流注」智能选择经络。</li>
        <li>在治疗目录里面可以选择常规对症治疗、子午流注治疗和自由模式。</li>
        <li>进入治疗模式的时候可以选择不同的波形和穴位，每次电脉冲都会生成数据。</li>
        <li>每次治疗之前都需要收集患者信息，以便与前面电脉冲的数据生成报告。可以在用户页面查看并导出。</li>
      </ol>
        <h2 className="text-xl font-semibold mt-6 mb-2">
        安全原则
        </h2>
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4">
          <h3 className="font-medium text-red-300 mb-2">⚠️ 重要安全警告 ⚠️</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>本设备为<strong>医疗级设备</strong>，使用前必须接受专业培训</li>
            <li>出于安全原则，治疗记录默认<strong>留痕</strong>，患者与治疗人员信息均进行收集，以备上报</li>
            <li>禁止用于以下人群：
              <ul className="list-circle list-inside ml-5 mt-1">
                <li>装有心脏起搏器患者</li>
                <li>孕妇（尤其妊娠早期）</li>
                <li>癫痫或精神疾病患者</li>
                <li>皮肤破损/炎症部位</li>
              </ul>
            </li>
            <li>电流强度应以患者耐受为度，治疗过程中出现眩晕、心悸等不适反应<strong>立即停止</strong></li>
            <li>设备使用后必须<strong>彻底消毒</strong>，防止交叉感染</li>
            <li>电刺激部位<strong>不得置于</strong>心前区、颈动脉窦等危险区域</li>
          </ul>
          
          <div className="mt-4 p-3 bg-black/30 rounded text-sm">
            <h4 className="font-medium text-yellow-200 mb-1">操作员资质要求：</h4>
            <p>必须持有《中医执业医师资格证书》或《康复治疗师资格证书》，并完成本设备专项培训。</p>
          </div>
        </div>
        {/* <div className="text-xs text-gray-500 mt-6">
          <p>※ 本系统所有功能设计均遵循GB 9706.1-2020《医用电气设备》安全标准</p>
        </div> */}
      
    </div>
  );
}
