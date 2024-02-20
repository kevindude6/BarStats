import React from "react";
export const AwardsOverview = (props) => {
  const { data } = props;
  if (data.hasData === false) return <p> no data :c </p>;

  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-3xl font-extrabold text-secondary">Awards</h2>
        <div className="stats w-full h-full text-3xl ">
          <div className="stat">
            <div className="stat-title">Cows earned </div>
            <div className="stat-value text-primary text-6xl">{data.awardStats.cows}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Econ Destroyed</div>
            <div className="stat-value text-primary text-6xl">{data.awardStats.econDestroyedAwards}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Units Destroyed</div>
            <div className="stat-value text-primary text-6xl">{data.awardStats.unitsDestroyedAwards}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Resource Efficiency</div>
            <div className="stat-value text-primary text-6xl">{data.awardStats.resourceEfficiencyAwards}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
