import React, { useState } from "react";
import { HiQuestionMarkCircle } from "react-icons/hi";

export const SearchBar = (props) => {
  const { setPlayerId, setLimit } = props;
  const [inputContent, setInputContent] = useState("");

  const limits = [25, 100, 500, 1000, 999999];
  const [selectedRange, setSelectedRange] = useState(1);

  const handleSearch = () => {
    setPlayerId(inputContent);
    setLimit(limits[selectedRange]);
  };

  const helpString = "BAR Stats made by Bear. Please contact via discord if you encounter any issues.";

  return (
    <div className="fixed top-0 left-0 right-0 px-6 pt-3 h-32 bg-base-100 z-50">
      <div className="prose w-full flex items-center">
        <h2 className="text-base-content mb-0">BAR Player Search</h2>
        <div className="tooltip tooltip-bottom ml-6" data-tip={helpString}>
          <HiQuestionMarkCircle size="1.5em" className="" />
        </div>
      </div>

      <div className="flex w-full gap-6 mt-2">
        <input
          value={inputContent}
          onChange={(ev) => setInputContent(ev.target.value)}
          placeholder="Enter player id..."
          className="input input-bordered flex-grow"
        ></input>
        <div className="w-72 h-full relative">
          <div className="w-32 absolute top-0 translate-y-[-110%] text-base-content text-xl font-semibold">
            <p>Match Limit:</p>
          </div>
          <input
            type="range"
            min={0}
            max={4}
            value={selectedRange}
            onChange={(c) => setSelectedRange(c.target.value)}
            className="range"
            step={1}
          />
          <div className="w-full flex justify-between text-xs px-2">
            <span>| 25</span>
            <span>| 100</span>
            <span>| 500</span>
            <span>| 1000</span>
            <span>| ALL</span>
          </div>
        </div>
        <button onClick={() => handleSearch()} className="btn btn-primary w-40">
          Search
        </button>
      </div>
    </div>
  );
};
