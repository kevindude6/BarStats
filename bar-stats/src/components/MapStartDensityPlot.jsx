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

    const filename = `url(https://api.bar-rts.com/maps/${data.filename}/texture-mq.jpg)`;

    const targetWidth = 450;
    const widthScale = targetWidth / mapWidth;
    const targetHeight = mapHeight * widthScale;

    const plot = Plot.plot({
      inset: 0,
      margin: 0,
      width: targetWidth,
      height: targetHeight,
      style: {
        background: filename,
        backgroundSize: "100% 100%",
        backgroundColor: "gray",
        backgroundRepeat: "no-repeat",
        color: "white",
      },
      marks: [
        //Plot.frame(),
        Plot.density(data.startPositions, {
          x: "x",
          y: (d) => mapHeight - d.z,
          weight: () => 1,
          fill: "density",
          fillOpacity: 0.4,
          thresholds: 10,
        }),
        Plot.dot(data.startPositions, { x: "x", y: (d) => mapHeight - d.z, fill: "white", stroke: "black" }),
        //Plot.dot(corners, { x: "x", y: "z", fill: "red" }),
      ],
      x: {
        domain: [0, mapWidth],
        type: "linear",
      },
      y: {
        domain: [0, mapHeight],
        type: "linear",
        grid: false,
      },
    });
    containerRef.current.append(plot);
    return () => plot.remove();
  }, [data, shouldRender]);

  return <div className="" ref={containerRef} />;
};
