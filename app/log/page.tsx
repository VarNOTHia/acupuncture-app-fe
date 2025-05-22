'use client';
import Button from '@/components/utils/button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface TherapyLog {
  username: string;
  patient: {
    name: string;
    gender: string;
    age: number;
  };
  startTime: string;
  selectedData: {
    line: string;
    dot: string;
  };
  therapyData: {
    waveType: string;
    freq: number;
    amp: number;
    duration: number;
  };
  endTime: string;
}

export default function LogPage() {
  const [logs, setLogs] = useState<TherapyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const {data: session} = useSession();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`/api/therapy/log?username=${session?.user?.name}`);
        const data = await res.json();
        setLogs(data.logs);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const router = useRouter();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = logs.slice(startIndex, endIndex);
  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const getRemaining = (startTime: string, endTime: string): string => {
    let remaining_ms = Date.parse(endTime) - Date.parse(startTime);
    return `${Math.floor(remaining_ms / 60000)} 分钟 ${Math.floor(remaining_ms / 1000) % 60} 秒`;
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = `${session?.user?.name}-therapy-logs.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <div className="w-full bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex justify-between">
          <h2 className="text-xl font-semibold text-gray-700">治疗记录</h2>
          <div className='flex gap-2'>
            <Button onClick={handleExport}>导出 JSON</Button>
            <Button 
              onClick={() => {
                router.push('/');
              }}
            >
              返回首页
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="p-4 text-center">加载中...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">患者姓名</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">治疗开始时间</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">治疗结束时间</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">持续时间</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">经络</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">穴位</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">波形</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">频率(Hz)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">幅值(mA)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-gray-600">
                  {currentLogs.map((log) => (
                    <tr key={log.startTime}>
                      <td className="px-6 py-4 whitespace-nowrap">{log.patient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(log.startTime).toLocaleString('zh-CN')}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(log.endTime).toLocaleString('zh-CN')}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getRemaining(log.startTime, log.endTime)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{log.selectedData.line}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{log.selectedData.dot}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{log.therapyData.waveType}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{log.therapyData.freq}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{log.therapyData.amp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                共 {logs.length} 条记录
              </div>
              <div className="flex space-x-2 text-gray-700">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  上一页
                </button>
                <span className="px-3 py-1">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  下一页
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}