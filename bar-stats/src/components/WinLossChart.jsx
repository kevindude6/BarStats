import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import {THEMECOLORS} from '../helper/colors';
export const WinLossChart = (props) => {
  const {data} = props;
  if(data.hasData === false)
    return (<p> no data :c </p>);
  
    const pieData = [
    { name: "Wins", value: data.winStats.wins },
    { name: "Losses", value: data.winStats.losses },
  ];
  
  const PieColors = [THEMECOLORS.primary, THEMECOLORS.secondary];

  const RADIAN = Math.PI / 180;

  // this is taken from recharts example
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

  return (<>
    <div className="stat-title">Win/Loss</div>
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <PieChart width={400} height={400}>
        <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" label={renderCustomizedLabel} labelLine={false}>
          {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PieColors[index]} />
            ))}
        </Pie>
        <Tooltip></Tooltip>
      </PieChart>
    </ResponsiveContainer>
    <div className="stat-desc">{data.winStats.wins}/{data.winStats.games}</div>
    </>
  )
}