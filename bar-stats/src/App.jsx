import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { mockDataForPlayer } from './mockData.js';
import { findWinLoss } from './ExtractStats.jsx';
import { SearchBar } from './components/SearchBar.jsx';

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

  const mockData = mockDataForPlayer.data;

  return (
    <>
      <SearchBar setPlayerId={setTargetPlayer}></SearchBar>
      <div className='container mx-auto my-32'>
        <div className="card">
          <h2 className='text-3xl font-bold underline'>Enter player id:</h2>
          <button className='btn btn-primary' onClick={() => setTargetPlayer("__Bear__")}>
            Query
          </button>
        </div>
        {processedData.hasData && (
          <div>
            {processedData.winStats.winRatio}
          </div>
        )}
      </div>
      </>
  )
}

export default App
