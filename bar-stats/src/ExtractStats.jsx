export const findWinLoss = (data, targetPlayer) => {
  const wins = data.filter((game) => {
    const winTeam = game.AllyTeams.find((team) => team.winningTeam === true);
    return winTeam.Players.find((player) => player.name === targetPlayer);
  });
  const winCount = wins.length;
  return {
    wins: winCount,
    games: data.length,
    losses: data.length-winCount,
    winRatio: winCount/data.length,
  };
}