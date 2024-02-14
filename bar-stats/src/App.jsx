import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { mockDataForPlayer } from './mockData.js';
import { findWinLoss } from './ExtractStats.jsx';
import { SearchBar } from './components/SearchBar.jsx';
import { WinLossChart } from './components/WinLossChart.jsx';
import { WinLossStats } from './components/WinLossStats.jsx';

function App() {
  const [processedData, setProcessedData] = useState({hasData: false, isLoading: false});
  const [targetPlayer, setTargetPlayer] = useState("");


  useEffect(() => {
    const fetchAndProcess = async (playerId) => {
      const initialData = { 
        hasData: false,
        isLoading: true,
      }
      setProcessedData(initialData);

      // This will be a query
      const receivedData = mockDataForPlayer.data;

      // Process data
      const processedData = { }
      processedData.winStats = findWinLoss(receivedData, targetPlayer);

      processedData.hasData = true;
      processedData.isLoading = false;
      setProcessedData(processedData);
    }
    if(targetPlayer!= "")
      fetchAndProcess(targetPlayer);
  }, [targetPlayer])


  return (
    <>
      <SearchBar setPlayerId={setTargetPlayer}></SearchBar>
      <div className='container mx-auto my-40 grid grid-cols-12 gap-x-4'>
        {processedData.hasData && (<>
          <div className='col-span-4 h-56'>
            <div className="stats shadow w-full h-full">
              <div className="stat">
                <WinLossChart data={processedData}/>
              </div>
            </div>
          </div>
          <div className='col-span-8 h-56'>
            <WinLossStats data={processedData}/>
          </div>
        </>)}
      </div>
    </>
  )
}

export default App
