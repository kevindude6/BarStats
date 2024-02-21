import React, { useState, useEffect, useMemo } from "react";

export const PlayerTable = (props) => {
  const { data } = props;

  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir] = useState("ASC");

  const compareFunc = (a, b) => {
    if (a[sortField] < b[sortField]) {
      return sortDir === "ASC" ? -1 : 1;
    }
    if (a[sortField] > b[sortField]) {
      return sortDir === "ASC" ? 1 : -1;
    }
    return 0;
  };

  const sortedData = useMemo(() => {
    const arr = Object.values(data.playerData.playerCounts);
    arr.sort(compareFunc);
    return arr;
  }, [data, sortField, sortDir]);

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Ally Games</th>
            <th>Wins With</th>
            <th>Enemy Games</th>
            <th>Wins Against</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((v) => (
            <tr key={v.name}>
              <td>{v.name}</td>
              <td>{v.allyCount}</td>
              <td>{v.winWith}</td>
              <td>{v.enemyCount}</td>
              <td>{v.winAgainst}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
