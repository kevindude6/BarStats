import React from "react";
import { PlayerTable } from "./PlayerTable";
export const PlayerOverview = (props) => {
  const { data } = props;
  if (data.hasData === false) return <p> no data :c </p>;

  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-3xl font-extrabold text-secondary">Player Stats</h2>
        <PlayerTable data={data} />
      </div>
    </div>
  );
};
