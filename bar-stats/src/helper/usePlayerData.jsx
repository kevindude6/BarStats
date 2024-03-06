import React, { useState, useEffect } from "react";
import { findWinLoss } from "../ExtractStats";
import { mockDataForPlayer } from "../mockData.js";
import { GetReplay, GetForPlayer } from "../ApiEndpoints";
import { extent, mode, sum, mean, median, quantile, variance, deviation } from "d3-array";

const BATCHSIZE = 10;
//const LIMIT = 50;

export const usePlayerData = (targetPlayerId, limit) => {
  const [processedData, setProcessedData] = useState({ hasData: false, isLoading: false, error: "" });

  useEffect(() => {
    const fetchAndProcess = async (playerId, passedLimit) => {
      const initialData = {
        hasData: false,
        isLoading: true,
        error: "",
        loadingCurrent: 0,
        loadingAll: 0,
        loadingFeedback: "Getting list of all replays...",
      };
      setProcessedData(initialData);

      const replayQuery = await GetForPlayer(playerId);
      const receivedReplays = await replayQuery.json();
      let receivedData = receivedReplays.data.slice(0, passedLimit);

      setProcessedData({ ...initialData, loadingFeedback: "Querying Replays..." });
      const allReplayIds = receivedData.map((game) => game.id);
      const allReplayData = await queryAllReplays(allReplayIds, null, setProcessedData);

      if (allReplayData.length === 0) {
        setProcessedData({ ...initialData, isLoading: false, hasData: false, error: "Player not found :(" });
        return;
      }

      const playerNameDict = {};

      const playerUserId = getPlayerUserId(playerId, allReplayData[0]);
      setProcessedData({ ...processedData, loadingFeedback: "Analyzing Replays..." });
      const processedReplays = allReplayData.map((replay) => processReplay(replay, playerUserId, playerNameDict));

      // Process data
      setProcessedData({ ...processedData, loadingFeedback: "Doing Math..." });
      const outputData = {};
      outputData.winStats = findWinLoss(processedReplays);
      outputData.factionStats = countFactions(processedReplays);
      outputData.mapStats = countMaps(processedReplays);
      outputData.awardStats = countAwards(processedReplays);
      outputData.playerData = countPlayers(processedReplays, playerNameDict);
      outputData.playerNameLookup = playerNameDict;

      outputData.hasData = true;
      outputData.isLoading = false;
      outputData.error = "";
      setProcessedData(outputData);
    };

    if (targetPlayerId != "") fetchAndProcess(targetPlayerId, limit);
  }, [targetPlayerId, limit]);

  return processedData;
};

const queryAllReplays = async (allReplayIds, outputObj, setData) => {
  if (outputObj == null || outputObj == undefined) outputObj = [];
  for (let i = 0; i < allReplayIds.length; i += BATCHSIZE) {
    const endIndex = Math.min(i + BATCHSIZE, allReplayIds.length);
    console.log(`querying replays ${i} to ${endIndex}`);
    const promises = [];
    let x = i;
    while (x < endIndex) {
      promises.push(GetReplay(allReplayIds[x]));
      x += 1;
    }
    const responses = await Promise.all(promises);
    const jsonPromises = responses.map((response) => response.json());
    const details = await Promise.all(jsonPromises);
    details.forEach((detail) => outputObj.push(detail));
    setData({
      hasData: false,
      isLoading: true,
      loadingCurrent: i + BATCHSIZE,
      loadingAll: allReplayIds.length,
    });
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
  else {
    let cleanedName = mapName.slice(0, index);
    if (cleanedName === "Supreme Strait") cleanedName = "Supreme Isthmus";
    return cleanedName;
  }
};

const countMaps = (remappedData) => {
  const outObj = remappedData.reduce((out, replay) => {
    const cleanName = cleanMapName(replay.mapName);
    if (!(cleanName in out)) {
      out[cleanName] = { cleanName: cleanName, count: 0, wins: 0, startTimes: [], durations: [] };
    }
    out[cleanName].count += 1;
    out[cleanName].wins += replay.didWin ? 1 : 0;
    out[cleanName].startTimes.push(new Date(replay.startTime));
    out[cleanName].durations.push(replay.durationMs);
    return out;
  }, {});

  for (const mapName in outObj) {
    outObj[mapName].startTimes.sort();
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

const countAwards = (remappedData) => {
  const outObj = {};
  outObj.cows = remappedData.filter((c) => c.cow === true).length;
  outObj.econDestroyedAwards = remappedData.filter((c) => c.econDestroyedAward === true).length;
  outObj.unitsDestroyedAwards = remappedData.filter((c) => c.unitsDestroyedAward === true).length;
  outObj.resourceEfficiencyAwards = remappedData.filter((c) => c.resourceEfficiencyAward === true).length;

  return outObj;
};

const countPlayers = (remappedData, playerLookup) => {
  const outObj = { playerCounts: {} };
  for (const replay of remappedData) {
    for (const ally of replay.allies) {
      if (!(ally in outObj.playerCounts)) {
        outObj.playerCounts[ally] = {
          name: playerLookup[ally],
          allyCount: 0,
          enemyCount: 0,
          winAgainst: 0,
          winWith: 0,
        };
      }
      outObj.playerCounts[ally].allyCount += 1;
      if (replay.didWin) {
        outObj.playerCounts[ally].winWith += 1;
      }
    }
    for (const enemy of replay.enemies) {
      if (!(enemy in outObj.playerCounts)) {
        outObj.playerCounts[enemy] = {
          name: playerLookup[enemy],
          allyCount: 0,
          enemyCount: 0,
          winAgainst: 0,
          winWith: 0,
        };
      }
      outObj.playerCounts[enemy].enemyCount += 1;
      if (replay.didWin) {
        outObj.playerCounts[enemy].winAgainst += 1;
      }
    }
  }
  Object.keys(outObj.playerCounts).forEach((playerId) => {
    const playerObj = outObj.playerCounts[playerId];
    playerObj.winWithRatio = playerObj.allyCount > 0 ? playerObj.winWith / playerObj.allyCount : "?";
    playerObj.winAgainstRatio = playerObj.enemyCount > 0 ? playerObj.winAgainst / playerObj.enemyCount : "?";
  });
  return outObj;
};
const getPlayerUserId = (playerName, gameData) => {
  for (const team of gameData.AllyTeams) {
    const player = team.Players.find((p) => p.name == playerName);
    if (player != null) {
      return player.userId;
    }
  }
};
// returns a data row
const processReplay = (gameData, targetPlayerUserId, playerLookup) => {
  // initialize output
  const outObj = { replayId: gameData.id, startTime: gameData.startTime, durationMs: gameData.durationMs };

  outObj.enemies = [];
  outObj.allies = [];

  const addPlayerToLookup = (player) => {
    if (!(player.userId in playerLookup)) {
      playerLookup[player.userId] = player.name;
    }
  };

  // find player / did team win
  for (const team of gameData.AllyTeams) {
    const player = team.Players.find((p) => p.userId == targetPlayerUserId);
    if (player != null) {
      outObj.playerId = player.playerId;
      outObj.didWin = team.winningTeam;
      outObj.startPos = player.startPos;
      outObj.faction = player.faction;

      const allies = team.Players.filter((v) => v.userId != targetPlayerUserId);
      allies.forEach((v) => addPlayerToLookup(v));
      outObj.allies = allies.map((v) => v.userId);
    } else {
      team.Players.forEach((v) => addPlayerToLookup(v));
      outObj.enemies = team.Players.map((v) => v.userId);
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
