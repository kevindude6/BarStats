import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { findWinLoss } from "./ExtractStats.jsx";
import { SearchBar } from "./components/SearchBar.jsx";
import { WinLossChart } from "./components/WinLossChart.jsx";
import { WinLossStats } from "./components/WinLossStats.jsx";
import { usePlayerData } from "./helper/usePlayerData.jsx";

function App() {
  const [targetPlayer, setTargetPlayer] = useState("");
  const processedData = usePlayerData(targetPlayer);

  return (
    <>
      <SearchBar setPlayerId={setTargetPlayer}></SearchBar>
      <div className="container mx-auto my-40 grid grid-cols-12 gap-x-4">
        {processedData.hasData && (
          <>
            <div className="col-span-4 h-56">
              <div className="stats shadow w-full h-full">
                <div className="stat">
                  <WinLossChart data={processedData} />
                </div>
              </div>
            </div>
            <div className="col-span-8 h-56">
              <WinLossStats data={processedData} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
