import { create } from "zustand";

interface TherapyState {
  username?: string;
  patient?: {
    name: string,
    gender?: string,
    age?: number
  }
  startTime?: Date;
  selectedData: {
    lineId: number,
    dotId: number
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
  setStartTime: (time: Date) => void;
  setSelectedData: (lineId: number, dotId: number) => void;
  updateTherapyData: (data: Partial<TherapyState["therapyData"]>) => void;
  resetTherapyData: () => void;
}

export const useTherapyStore = create<TherapyState>((set) => ({
  username: undefined,
  patientData: undefined,
  startTime: undefined,
  selectedData: {
    lineId: 0,
    dotId: 0
  },
  therapyData: {
    duration: undefined,
    waveType: '',
    freq: 0,
    amp: 0
  },

  setUsername: (username) => set({ username }),
  setPatient: (data: { name: string; gender?: string; age?: number }) => set({ patient: data }),  
  setStartTime: (time) => set({ startTime: time }),
  setSelectedData: (lineId, dotId) => set({ selectedData: { lineId, dotId } }),
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
