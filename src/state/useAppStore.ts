import { create } from "zustand";
import { searchForCompId, sortPasswords } from "../logic/organizer";

interface AppState {
  sorted: boolean;
  competitionId: string;
  passwords: string;
  setCompetitionId: (competitionId: string) => void;
  setPasswords: (passwords: string) => void;
  processPasswords: (wasDropped: boolean, passwords?: string) => Promise<void>;
}

export const useAppStore = create<AppState>()((set, get) => ({
  sorted: false,
  competitionId: "",
  passwords: "",
  setCompetitionId: (competitionId) => set(() => ({ competitionId, sorted: false })),
  setPasswords: (passwords) => set(() => ({ passwords, sorted: false })),
  processPasswords: async (wasDropped: boolean, passwords?: string) => {
    let passwordData: string | undefined = undefined;
    if (passwords) {
      passwordData = passwords;
      set(() => ({passwords}))
    } else {
      passwordData = get().passwords;
    }
    if (!passwordData) return;

    const compName = passwordData.split("\n")[1].trim();
    const idData: string = get().competitionId 
      || passwordData.includes('SECRET SCRAMBLE SET PASSCODES') && (await searchForCompId(compName)|| compName.replace(/\s/g, ''))
      || "";
    
    if (!idData) return;

    const sort = await sortPasswords(wasDropped, idData, passwordData);
    if (!sort.ok) {
      console.log(sort.error);
      return;
    }
    set(() => ({competitionId: idData, passwords: sort.value, sorted: true}))
  }
}));
