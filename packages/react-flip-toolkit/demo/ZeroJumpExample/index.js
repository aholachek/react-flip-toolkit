import React, { useState } from "react";
import { Flipper, Flipped } from "react-flip-toolkit";
import shuffle from "lodash.shuffle";

export default function TransformZeroExample  () {
  const [data, setData] = useState([...Array(200).keys()]);
  const shuffleList = () => setData(shuffle(data));

  // Say user has filtered to only show multiples of 50
  const n = 50;

  return (
    <Flipper flipKey={data.join("")}>
      <button onClick={shuffleList}> shuffle</button>
      <div style={{ fontFamily: "Arial", fontSize: "2.5rem" }}>
        {data.map((d) => (
          <Flipped key={d} flipId={d} translate>
            <div style={{ height: d % n === 0 ? 50 : 0 }}>
              {d % n === 0 ? d : null}
            </div>
          </Flipped>
        ))}
      </div>
    </Flipper>
  );
}
