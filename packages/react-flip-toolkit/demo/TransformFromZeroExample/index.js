import React, { Component } from "react";
import { Flipper, Flipped } from "../../src/index";
import "./styles.css";

const SmallSquare = ({ onClick, ...rest }) =>
  <div className="zero-square" onClick={onClick} {...rest} />;

const BigSquare = ({ onClick, ...rest }) =>
  <div
    className="zero-full-screen-square square"
    onClick={onClick}
    {...rest}
  />;

export default class AnimatedSquare extends Component {
  state = { fullScreen: false };

  toggleFullScreen = () => {
    this.setState(prevState => ({
      fullScreen: !prevState.fullScreen
    }));
  };

  componentDidMount() {
    setInterval(() => {
      this.toggleFullScreen();
    }, 1000);
  }

  render() {
    return (
      <Flipper
        flipKey={this.state.fullScreen}
        className="zero-transform-example-container"
      >
        {this.state.fullScreen
          ? <Flipped flipId="square">
            <BigSquare onClick={this.toggleFullScreen} />
          </Flipped>
          : <Flipped flipId="square">
            <SmallSquare onClick={this.toggleFullScreen} />
          </Flipped>}
      </Flipper>
    );
  }
}
