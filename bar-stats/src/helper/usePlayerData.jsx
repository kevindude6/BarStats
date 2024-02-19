import React, { useState, useEffect } from "react";
import { findWinLoss } from "../ExtractStats";
import { mockDataForPlayer } from "../mockData.js";
import { GetReplay } from "../ApiEndpoints";
import { extent, mode, sum, mean, median, quantile, variance, deviation } from "d3-array";

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

      const processedReplays = Object.values(allReplayData).map((replay) => processReplay(replay, playerId));

      //downloadData(allReplayData);
      // Process data
      const processedData = {};
      processedData.winStats = findWinLoss(receivedData, playerId);
      processedData.factionStats = countFactions(processedReplays);
      processedData.mapStats = countMaps(processedReplays);

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

const countFactions = (remappedData) => {
  //const outObj = { Cortex: 0, Armada: 0, Legion: 0, CortexWin: 0, ArmadaWin: 0, LegionWin: 0 };

  const outObj = remappedData.reduce(
    (accum, current) => {
      if (current.faction === "Cortex") {
        accum.Cortex += 1;
        if (current.didWin) accum.CortexWin += 1;
      } else if (current.faction === "Armada") {
        accum.Armada += 1;
        if (current.didWin) accum.ArmadaWin += 1;
      } else if (current.faction === "Legion") {
        accum.Legion += 1;
        if (current.didWin) accum.LegionWin += 1;
      } else if (current.faction === "Unknown") {
        accum.Unknown += 1;
        if (current.didWin) accum.UnknownWin += 1;
      }
      return accum;
    },
    {
      Cortex: 0,
      Armada: 0,
      Legion: 0,
      CortexWin: 0,
      ArmadaWin: 0,
      LegionWin: 0,
      Unknown: 0,
      UnknownWins: 0,
    }
  );

  return outObj;
};

const cleanMapName = (mapName) => {
  const index = mapName.lastIndexOf(" ");
  if (index === -1) return mapName;
  else return mapName.slice(0, index);
};

const countMaps = (remappedData) => {
  const outObj = remappedData.reduce((out, replay) => {
    const cleanName = cleanMapName(replay.mapName);
    if (!(cleanName in out)) {
      out[cleanName] = { cleanName: cleanName, count: 0, wins: 0, startTimes: [], durations: [] };
    }
    out[cleanName].count += 1;
    out[cleanName].wins += replay.didWin ? 1 : 0;
    out[cleanName].startTimes.push(replay.startTime);
    out[cleanName].durations.push(replay.durationMs);
    return out;
  }, {});

  for (const mapName in outObj) {
    outObj[mapName].startTimes.sort((a, b) => {
      return new Date(b) - new Date(a);
    });
  }

  for (const mapName in outObj) {
    const mapObj = outObj[mapName];
    mapObj.durationStats = {};
    mapObj.durationStats.mean = mean(mapObj.durations);
    mapObj.durationStats.median = median(mapObj.durations);
    mapObj.durationStats.variance = variance(mapObj.durations);
    mapObj.durationStats.deviation = deviation(mapObj.durations);
    mapObj.durationStats.lowerQuartile = quantile(mapObj.durations, 0.25);
    mapObj.durationStats.upperQuartile = quantile(mapObj.durations, 0.75);
  }

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
// returns a data row
const processReplay = (gameData, targetPlayer) => {
  // initialize output
  const outObj = { replayId: gameData.id, startTime: gameData.startTime, durationMs: gameData.durationMs };

  // find player / did team win
  for (const team of gameData.AllyTeams) {
    const player = team.Players.find((p) => p.name == targetPlayer);
    if (player != null) {
      outObj.playerId = player.playerId;
      outObj.didWin = team.winningTeam;
      outObj.startPos = player.startPos;
      outObj.faction = player.faction;
      break;
    }
  }

  // find awards
  outObj.econDestroyedAward = gameData.awards.econDestroyed[0].teamId == outObj.playerId;
  outObj.unitsDestroyedAward = gameData.awards.fightingUnitsDestroyed[0].teamId == outObj.playerId;
  outObj.resourceEfficiencyAward = gameData.awards.resourceEfficiency[0].teamId == outObj.playerId;
  outObj.cow = gameData.awards.cow.teamId == outObj.playerId;

  // find map
  outObj.mapId = gameData.Map.id;
  outObj.mapName = gameData.Map.scriptName;
  return outObj;
};

/*
const addTargetPlayerIds = (replayData, targetPlayer) => {
  replayData.forEach((replay) => {
    const foundId = findTargetPlayerId(replay, targetPlayer);
    replay.TARGETPLAYER = foundId;
  });
};
*/

// dataobj needs
// didWin
// replayId
// faction
// startpos
// map
// duration
// startTime
// econDestroyed award (t/f)
// fightingUnitsDestroyed award (t/f)
// resourceEfficiency award (t/f)
// cow (t/f)
// mostResourcesProduced (t/f)
// mostDamageTaken (t/f)
// longest sleep
// spectactor count
// allied player names []
// enemy player names []
