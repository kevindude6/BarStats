import React from "react";

export const SearchBar = (props) => {

  return (
    <div className="fixed top-0 left-0 right-0 px-6 pt-3 h-32 bg-base-200">
      <div className="prose w-full">
        <h2 className="text-base-content">BAR Player Search</h2>
      </div>
      <div className="flex w-full gap-6 mt-2">
        <input placeholder="Enter player id..." className="input input-bordered flex-grow"></input>
        <button className="btn btn-primary w-40">Search</button>
      </div>
    </div>
  )
}