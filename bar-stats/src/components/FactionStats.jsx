import React from "react";

export const FactionStats = (props) => {
  const { data, targetFaction } = props;
  if (data.hasData === false) return <p> no data :c </p>;

  const wins = data.factionStats[targetFaction + "Win"];
  const games = data.factionStats[targetFaction];
  return (
    <div className="stats shadow w-full h-full text-3xl ">
      <div className="stat">
        <div className="stat-title">{targetFaction} Wins</div>
        <div className="stat-value text-primary text-8xl">{wins}</div>
      </div>
      <div className="stat">
        <div className="stat-title">{targetFaction} Games</div>
        <div className="stat-value text-7xl">{games}</div>
      </div>
    </div>
  );
};
