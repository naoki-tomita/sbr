import React, { FC, ReactElement, createContext, useContext, useState } from "react";
import { Position } from "types";

const PositionHistoryContext = createContext<ReturnType<typeof usePositionHistoryOriginal>>({} as any);
export const PositionHistoryProvider: FC<{ children: ReactElement | ReactElement[] }> = ({ children }) => {
  const value = usePositionHistoryOriginal();
  return <PositionHistoryContext.Provider value={value} >{children}</PositionHistoryContext.Provider>
}

type Positions = {
  [id: string]: Position[];
}

function usePositionHistoryOriginal() {
  const [positions, setPositions] = useState<Positions>({});
  return {
    positions,
    addPosition(id: string, position: Position) {
      setPositions(s => ({
        ...s,
        [id]: [...s[id] ?? [], position],
      }));
    },
    resetPositions() {
      setPositions({});
    }
  }
}
export function usePositionHistory() {
  return useContext(PositionHistoryContext);
}
