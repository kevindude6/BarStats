import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { THEMECOLORS } from "../helper/colors";
export const FactionGamesChart = (props) => {
  const { data } = props;
  if (data.hasData === false) return <p> no data :c </p>;

  const pieData = [
    { name: "Cortex", value: data.factionStats.Cortex },
    { name: "Armada", value: data.factionStats.Armada },
    { name: "Legion", value: data.factionStats.Legion },
  ];

  const PieColors = ["#ff1a1a", "#3cacec", "#00FF00"];

  const RADIAN = Math.PI / 180;

  // this is taken from recharts example
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.35;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="stats shadow w-full h-full text-3xl">
      <div className="stat">
        <div className="stat-title">Games per Faction</div>
        <ResponsiveContainer width={"100%"} height={"100%"} className="text-sm">
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={60}
              fill="#8884d8"
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PieColors[index]} />
              ))}
            </Pie>
            <Tooltip></Tooltip>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
