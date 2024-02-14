import React from "react";

export const WinLossStats = (props) => {
  const {data} = props;
  if(data.hasData === false)
    return (<p> no data :c </p>);

  return (
     <div className="stats shadow w-full h-full text-3xl ">
        <div className="stat">
          <div className="stat-title">Wins</div>
          <div className="stat-value text-primary text-8xl">{data.winStats.wins}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Losses</div>
          <div className="stat-value text-secondary text-7xl">{data.winStats.losses}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Games</div>
          <div className="stat-value text-7xl">{data.winStats.games}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Ratio</div>
          <div className="stat-value text-7xl">{data.winStats.winRatio.toFixed(2)*100 + "%"}</div>
        </div>
      </div>
  )
}