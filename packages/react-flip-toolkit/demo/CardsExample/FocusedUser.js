import React, { Component } from "react";
import { Flipped } from "../../";
import anime from "animejs";

class FocusedUser extends Component {
  hideElements = el => {
    const elements = [].slice.apply(el.querySelectorAll("*[data-fade-in]"));
    elements.forEach(el => (el.style.opacity = "0"));
  };
  animateIn = el => {
    anime({
      targets: el.querySelectorAll("*[data-fade-in]"),
      translateY: [-30, 0],
      opacity: [0, 1],
      duration: 250,
      easing: "easeOutSine",
      delay: (d, i) => i * 75
    });
  };

  render() {
    const { data, index, close } = this.props;
    const parentFlipId = `card-${index}`;

    if (typeof index !== "number") return null;

    return (
      <div className="focusedItemBackground" key={parentFlipId}>
        <Flipped
          flipId={parentFlipId}
          onStart={this.hideElements}
          onComplete={this.animateIn}
        >
          <div
            className="gridItem gridItemFocused"
            role="button"
            ref={el => (this.el = el)}
          >
            <Flipped inverseFlipId={parentFlipId}>
              <div>
                <div>
                  <button
                    className="gridItemFocusedClose"
                    onClick={close}
                    data-fade-in
                  >
                    ✖
                  </button>
                  <h2 className="gridItemTitle" data-fade-in>
                    {data.name}
                  </h2>
                  <Flipped flipId={`${parentFlipId}-avatar`}>
                    <img
                      src={data.avatar}
                      alt={`user profile for ${data.name}`}
                      className="gridItemAvatar"
                    />
                  </Flipped>

                  <h2 data-fade-in className="gridItemJob">
                    {data.job}
                  </h2>
                  <p data-fade-in className="gridItemDescription">
                    {data.text}
                  </p>
                  <Flipped flipId={`${parentFlipId}-background`}>
                    <div
                      className="gridItemBackground"
                      style={{ backgroundColor: data.color }}
                    />
                  </Flipped>
                </div>
              </div>
            </Flipped>
          </div>
        </Flipped>
      </div>
    );
  }
}

export default FocusedUser;
