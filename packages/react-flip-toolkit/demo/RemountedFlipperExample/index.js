import React, { Component } from "react";
import { Flipper, Flipped } from "../../src/index";

export default class AnimatedSquare extends Component {
  state = { showFlip: false };

  componentDidMount = () => {
    setTimeout(() => {
      this.setState({
        showFlip: true
      });
    }, 1);
  };

  render() {
    return this.state.showFlip
      ? <Flipper flipKey={this.state.showFlip}>
        <Flipped flipId="foo">
          <div>hi</div>
        </Flipped>
      </Flipper>
      : <Flipped flipId="foo">
        <div>hi</div>
      </Flipped>;
  }
}
