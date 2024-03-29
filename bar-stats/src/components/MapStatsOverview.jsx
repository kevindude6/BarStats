import React, { useState } from "react";
import { msToString } from "../helper/timeFuncs";
import { THEMECOLORS } from "../helper/colors";
import { bin } from "d3-array";
import { scaleUtc } from "d3-scale";
import { BarChart, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer } from "recharts";
import { MapStartDensityPlot } from "./MapStartDensityPlot";

export const MapStatsOverview = (props) => {
  const { data } = props;
  const [openMapName, setOpenMapName] = useState("");
  const [openRadio, setOpenRadio] = useState(null);
  if (data.hasData === false) return <p> no data :c </p>;

  const thresholdTime = (n) => {
    return (data, min, max) => {
      return scaleUtc().domain([min, max]).ticks(n);
    };
  };

  const getMapDurationBins = (map) => {
    const binner = bin().thresholds(thresholdTime(10));
    const bins = binner(map.durations);
    return bins;
  };
  const getDurationBarChart = (bins) => {
    return bins.map((v) => {
      const high = msToString(v.x1);
      const low = msToString(v.x0);
      return { range: `${low}-${high}`, count: v.length };
    });
  };
  const collapseClicked = (e) => {
    if (e.target === openRadio) {
      e.target.checked = false;
      setOpenRadio(null);
      setOpenMapName("");
    }
  };
  const collapseChanged = (e, mapName) => {
    if (e.target.checked === true) {
      setOpenRadio(e.target);
      setOpenMapName(mapName);
    }
  };
  const createMapArea = (map) => {
    const durStat = map.durationStats;
    const bins = getMapDurationBins(map);
    const barChartData = getDurationBarChart(bins);
    return (
      <div key={map.cleanName} className="collapse collapse-arrow bg-base-200">
        <input
          type="radio"
          name="my-accordion-2"
          onClick={collapseClicked}
          onChange={(e) => collapseChanged(e, map.cleanName)}
        />
        <div className="collapse-title text-xl font-medium">
          {map.cleanName} - {map.wins} wins, {map.count} games ({((map.wins / map.count) * 100).toFixed(0)}%)
        </div>
        <div className="collapse-content w-full prose max-w-none">
          <div className="flex w-full gap-8">
            <div className="flex-grow basis-1/5">
              <h4 className="mt-2">Average game length: </h4>
              <span>{msToString(durStat.mean)}</span>
              <h4>Median game length: </h4>
              <p>{msToString(durStat.median)}</p>
              <h4>Game length variance: </h4>
              <p>{durStat.variance}</p>
              <h4>Game length deviation: </h4>
              <p>{durStat.deviation}</p>
              <h4>Game length lower quartile: </h4>
              <p>{msToString(durStat.lowerQuartile)}</p>
              <h4>Game length upper quartile: </h4>
              <p>{msToString(durStat.upperQuartile)}</p>
            </div>
            <div className="flex-grow basis-1/3">
              <div className="flex flex-col h-full">
                <div className="text-center ">
                  <h3 className="mt-0">Game Durations</h3>
                </div>
                <div className="flex-grow">
                  <ResponsiveContainer>
                    <BarChart data={barChartData}>
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill={THEMECOLORS.primary} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="flex-grow basis-1/3">
              <MapStartDensityPlot data={map} shouldRender={openMapName == map.cleanName} />
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-3xl font-extrabold text-secondary">Map Stats</h2>
        {Object.values(data.mapStats)
          .sort((a, b) => a.count < b.count)
          .map((map) => createMapArea(map))}
      </div>
    </div>
  );
};
