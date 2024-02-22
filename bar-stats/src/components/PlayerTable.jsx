import React, { useState, useEffect, useMemo } from "react";
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

const PAGESIZE = 15;

export const PlayerTable = (props) => {
  const { data } = props;

  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir] = useState("ASC");
  const [page, setPage] = useState(0);

  const requestSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === "ASC" ? "DESC" : "ASC");
    } else {
      setSortField(field);
    }
  };
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

  const getIcon = (field) => {
    if (field !== sortField) return <></>;

    return sortDir === "ASC" ? (
      <AiOutlineArrowUp className="float-right" />
    ) : (
      <AiOutlineArrowDown className="float-right" />
    );
  };

  const columnHeader = (name, field) => (
    <th className="cursor-pointer hover:bg-base-200 w-1/5" onClick={() => requestSort(field)}>
      {name}
      {getIcon(field)}
    </th>
  );

  const nextPage = () => {
    const maxPage = Math.floor(sortedData.length / PAGESIZE);
    setPage(Math.min(maxPage, page + 1));
  };
  const prevPage = () => {
    setPage(Math.max(0, page - 1));
  };

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            {columnHeader("Name", "name")}
            {columnHeader("Ally Games", "allyCount")}
            {columnHeader("Wins With", "winWith")}
            {columnHeader("Enemy Games", "enemyCount")}
            {columnHeader("Wins Against", "winAgainst")}
          </tr>
        </thead>
        <tbody>
          {sortedData.slice(page * PAGESIZE, (page + 1) * PAGESIZE).map((v) => (
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
      <div className="flex w-full justify-end items-center">
        <button className="mt-1 mr-2" onClick={() => prevPage()}>
          <AiOutlineArrowLeft />
        </button>
        <p className="flex-grow-0 w-20 text-center">
          {page * PAGESIZE + 1} - {(page + 1) * PAGESIZE}
        </p>
        <button className="mt-1 ml-2" onClick={() => nextPage()}>
          <AiOutlineArrowRight />
        </button>
      </div>
    </div>
  );
};
