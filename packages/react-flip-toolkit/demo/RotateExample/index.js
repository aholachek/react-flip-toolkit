import React, { Component } from "react";
import { Flipper, Flipped } from "../../src/index";
import "./index.css";

const color = "#ff4f66";

class RotateExample extends Component {
  state = { focused: undefined };

  render() {
    return (
      <div className="rotate">
        <Flipper flipKey={!!this.state.focused} applyTransformOrigin={false}>
          <Flipped flipId={color}>
            <div
              className={`rotate-square ${color === this.state.focused
                ? "rotate-square--focused"
                : ""}`}
              key={color}
              style={{ backgroundColor: color }}
              onClick={() =>
                this.setState({
                  focused: this.state.focused === color ? null : color
                })}
            />
          </Flipped>
          <Flipped flipId={color}>
            <div
              style={{ backgroundColor: "blue", width: "50px", height: "50px" }}
            />
          </Flipped>

          <Flipped flipId={color}>
            <div
              style={{ backgroundColor: "blue", width: "50px", height: "50px" }}
            />
          </Flipped>
        </Flipper>
      </div>
    );
  }
}

export default RotateExample;
