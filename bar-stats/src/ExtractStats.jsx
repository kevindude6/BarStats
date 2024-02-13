export const findWinLoss = (data, targetPlayer) => {
  let winCount = 0;
  for(let i = 0; i < data.length; i++){
    const winTeam = data[i].AllyTeams.find((v) => v.winningTeam === true);
    if(winTeam.Players.find((v) => v.name === targetPlayer) != undefined)
      winCount++;
  }
  return {
    wins: winCount,
    games: data.length,
    losses: data.length-winCount,
    winRation: winCount/data.length,
  };
}