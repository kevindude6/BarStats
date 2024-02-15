import React, { useState, useEffect } from "react";
import { findWinLoss } from "../ExtractStats";
import { mockDataForPlayer } from "../mockData.js";

export const usePlayerData = (targetPlayerId) => {
  const [processedData, setProcessedData] = useState({ hasData: false, isLoading: false });

  useEffect(() => {
    const fetchAndProcess = async (playerId) => {
      const initialData = {
        hasData: false,
        isLoading: true,
      };
      setProcessedData(initialData);

      // This will be a query
      const receivedData = mockDataForPlayer.data;

      // Process data
      const processedData = {};
      processedData.winStats = findWinLoss(receivedData, playerId);

      processedData.hasData = true;
      processedData.isLoading = false;
      setProcessedData(processedData);
    };

    if (targetPlayerId != "") fetchAndProcess(targetPlayerId);
  }, [targetPlayerId]);

  return processedData;
};
