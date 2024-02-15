export const GetReplay = async (replayId) => {
  return await fetch(`https://api.bar-rts.com/replays/${replayId}`, { cache: "force-cache" });
};
export const GetForPlayer = async (playerId) => {
  return await fetch(
    `https://api.bar-rts.com/replays?page=1&limit=100000&hasBots=false&endedNormally=true&preset=team&players=${playerId}`
  );
};
