import React, { FC, ReactElement, createContext, useContext, useState } from "react";
import { Position } from "types";

const PositionHistoryContext = createContext<ReturnType<typeof usePositionHistoryOriginal>>({} as any);
export const PositionHistoryProvider: FC<{ children: ReactElement | ReactElement[] }> = ({ children }) => {
  const value = usePositionHistoryOriginal();
  return <PositionHistoryContext.Provider value={value} >{children}</PositionHistoryContext.Provider>
}
function usePositionHistoryOriginal() {
  const [positions, setPositions] = useState<Position[]>([]);
  return {
    positions,
    addPosition(position: Position) {
      setPositions(s => [...s, position]);
    },
    resetPositions() {
      setPositions([]);
    }
  }
}
export function usePositionHistory() {
  return useContext(PositionHistoryContext);
}
