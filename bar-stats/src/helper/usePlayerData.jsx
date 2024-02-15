import React, { useState, useEffect } from "react";
import { findWinLoss } from "../ExtractStats";
import { mockDataForPlayer } from "../mockData.js";
import { GetReplay } from "../ApiEndpoints";

const BATCHSIZE = 5;

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

      const allReplayIds = receivedData.map((game) => game.id);
      const allReplayData = await queryAllReplays(allReplayIds, null);

      //downloadData(allReplayData);
      // Process data
      const processedData = {};
      processedData.winStats = findWinLoss(receivedData, playerId);
      processedData.factionStats = countFactions(allReplayData, playerId);

      processedData.hasData = true;
      processedData.isLoading = false;
      setProcessedData(processedData);
    };

    if (targetPlayerId != "") fetchAndProcess(targetPlayerId);
  }, [targetPlayerId]);

  return processedData;
};

const queryAllReplays = async (allReplayIds, outputObj) => {
  if (outputObj == null || outputObj == undefined) outputObj = {};
  for (let i = 0; i < allReplayIds.length; i += BATCHSIZE) {
    const endIndex = Math.min(i + BATCHSIZE, allReplayIds.length - 1);
    console.log(`querying replays ${i} to ${endIndex}`);
    const promises = [];
    let x = i;
    while (x <= endIndex) {
      promises.push(GetReplay(allReplayIds[x]));
      x += 1;
    }
    const responses = await Promise.all(promises);
    const jsonPromises = responses.map((response) => response.json());
    const details = await Promise.all(jsonPromises);
    details.forEach((detail) => (outputObj[detail.id] = detail));
  }
  return outputObj;
};

const downloadData = (replays) => {
  const blob = new Blob([JSON.stringify(replays)]);
  const link = document.createElement("a");
  document.body.appendChild(link);
  const url = window.URL.createObjectURL(blob);
  link.href = url;
  link.download = "test.json";
  link.click();
  document.removeChild(link);
};

const countFactions = (replayData, targetPlayer) => {
  const outObj = { Cortex: 0, Armada: 0, Legion: 0 };
  Object.values(replayData).forEach((game) => {
    const player = findTargetPlayerObj(game, targetPlayer);
    outObj[player.faction] = outObj[player.faction] + 1;
  });
  return outObj;
};

const findTargetPlayerId = (gameData, targetPlayer) => {
  for (const team of gameData.AllyTeams) {
    const player = team.Players.find((p) => p.name == targetPlayer);
    if (player != null) return player.playerId;
  }
  return -1;
};
const findTargetPlayerObj = (gameData, targetPlayer) => {
  for (const team of gameData.AllyTeams) {
    const player = team.Players.find((p) => p.name == targetPlayer);
    if (player != null) return player;
  }
};

/*
const addTargetPlayerIds = (replayData, targetPlayer) => {
  replayData.forEach((replay) => {
    const foundId = findTargetPlayerId(replay, targetPlayer);
    replay.TARGETPLAYER = foundId;
  });
};
*/
