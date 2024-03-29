import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { SearchBar } from "./components/SearchBar.jsx";
import { WinLossChart } from "./components/WinLossChart.jsx";
import { WinLossStats } from "./components/WinLossStats.jsx";
import { FactionStats } from "./components/FactionStats.jsx";
import { usePlayerData } from "./helper/usePlayerData.jsx";
import { FactionGamesChart } from "./components/FactionGamesChart.jsx";
import { MapStatsOverview } from "./components/MapStatsOverview.jsx";
import { AwardsOverview } from "./components/AwardsOverview.jsx";
import { PlayerOverview } from "./components/PlayerOverview.jsx";

function App() {
  const [targetPlayer, setTargetPlayer] = useState("");
  const [limit, setLimit] = useState(25);
  const processedData = usePlayerData(targetPlayer, limit);

  const DataDisplay = () => {
    if (!processedData.hasData) return <></>;
    return (
      <>
        <div className="col-span-4 h-56 overflow-hidden">
          <div className="stats shadow w-full h-full">
            <div className="stat">
              <WinLossChart data={processedData} />
            </div>
          </div>
        </div>
        <div className="col-span-8 h-56">
          <WinLossStats data={processedData} />
        </div>
        <div className="col-span-6 h-56">
          <FactionStats data={processedData} targetFaction={"Cortex"} />
        </div>
        <div className="col-span-6 h-56">
          <FactionStats data={processedData} targetFaction={"Armada"} />
        </div>
        <div className="col-span-6 h-56">
          <FactionStats data={processedData} targetFaction={"Legion"} />
        </div>
        <div className="col-span-6 h-56">
          <FactionGamesChart data={processedData} />
        </div>
        <div className="col-span-12">
          <MapStatsOverview data={processedData} />
        </div>
        <div className="col-span-12">
          <AwardsOverview data={processedData} />
        </div>
        <div className="col-span-12">
          <PlayerOverview data={processedData} />
        </div>
      </>
    );
  };

  const LoadingDisplay = () => {
    if (!processedData.isLoading) return <></>;
    return (
      <div className="col-span-12 h-96 flex flex-col justify-center items-center">
        <div className="loading loading-dots loading-lg"></div>
        <h2>
          Loading {processedData.loadingCurrent} / {processedData.loadingAll}
        </h2>
        <h2>{processedData.loadingFeedback}</h2>
      </div>
    );
  };

  const ErrorDisplay = () => {
    if (processedData.error == null || processedData.error === "") return <></>;
    return (
      <div className="col-span-12 h-96 flex flex-col justify-center items-center">
        <h2>Error: {processedData.error}</h2>
      </div>
    );
  };

  return (
    <>
      <SearchBar setPlayerId={setTargetPlayer} setLimit={setLimit}></SearchBar>
      <div className="container mx-auto my-40 grid grid-cols-12 gap-4">
        <LoadingDisplay />
        <DataDisplay />
        <ErrorDisplay />
      </div>
    </>
  );
}

export default App;
