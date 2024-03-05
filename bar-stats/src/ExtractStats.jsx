export const findWinLoss = (processedReplays) => {
  const wins = processedReplays.filter((game) => game.didWin === true);
  const winCount = wins.length;
  return {
    wins: winCount,
    games: processedReplays.length,
    losses: processedReplays.length - winCount,
    winRatio: winCount / processedReplays.length,
  };
};
