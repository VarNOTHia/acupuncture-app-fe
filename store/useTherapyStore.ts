import { create } from "zustand";

interface TherapyState {
  username?: string;
  patient?: {
    name: string,
    gender?: string,
    age?: number
  }
  time?: {
    startTime: Date,
    endTime: Date,
  }
  selectedData: {
    line: string,
    dot: string
  };
  therapyData: {
    duration?: number,  
    waveType: string, // 波形类型
    freq: number,     // 频率
    amp: number       // 脉冲强度
  }

  // actions: 行为
  setUsername: (username: string) => void;
  setPatient: (data: { name: string; gender?: string; age?: number }) => void;
  setTime: (startTime: Date, endTime: Date) => void;
  setSelectedData: (line: string, dot: string) => void;
  updateTherapyData: (data: Partial<TherapyState["therapyData"]>) => void;
  resetTherapyData: () => void;
}

export const useTherapyStore = create<TherapyState>((set) => ({
  username: undefined,
  patient: undefined,
  time: undefined,
  selectedData: {
    line: '',
    dot: ''
  },
  therapyData: {
    duration: undefined,
    waveType: '',
    freq: 0,
    amp: 0
  },

  setUsername: (username) => set({ username }),
  setPatient: (data: { name: string; gender?: string; age?: number }) => set({ patient: data }),  
  setTime: (startTime: Date, endTime: Date) => {
    set({
      time: {
        startTime,
        endTime
      }
    })
  },
  setSelectedData: (line, dot) => set({ selectedData: { line, dot } }),
  updateTherapyData: (data) =>
    set((state) => ({
      therapyData: {
        ...state.therapyData,
        ...data,
      },
    })),
  resetTherapyData: () =>
    set({
      therapyData: {
        waveType: '',
        freq: 0,
        amp: 0,
        duration: undefined,
      },
    }),
}));
