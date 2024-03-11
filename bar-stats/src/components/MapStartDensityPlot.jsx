import * as Plot from "@observablehq/plot";
import { useEffect, useRef } from "react";

export const MapStartDensityPlot = (props) => {
  const { data, shouldRender } = props;
  const containerRef = useRef();

  useEffect(() => {
    //this might not need to be an effect
    if (data === undefined) return;
    if (shouldRender === false) return;

    const mapWidth = data.mapSize.width * 512;
    const mapHeight = data.mapSize.height * 512;

    const filename = `url(https://api.bar-rts.com/maps/${data.filename}/texture-thumb.jpg)`;

    const plot = Plot.plot({
      inset: 0,
      margin: 0,
      width: 450,
      height: 450,
      style: {
        background: filename,
        backgroundSize: "cover",
      },
      marks: [
        //Plot.frame(),
        Plot.density(data.startPositions, {
          x: "x",
          y: "z",
          weight: () => 1,
          fill: "density",
          fillOpacity: 0.4,
          thresholds: 10,
        }),
        Plot.dot(data.startPositions, { x: "x", y: "z", fill: "white", stroke: "black" }),
        //Plot.dot(corners, { x: "x", y: "z", fill: "red" }),
      ],
      x: {
        domain: [mapWidth, 0],
      },
      y: {
        domain: [0, mapHeight],
      },
    });
    containerRef.current.append(plot);
    return () => plot.remove();
  }, [data, shouldRender]);

  return <div className="" ref={containerRef} />;
};
