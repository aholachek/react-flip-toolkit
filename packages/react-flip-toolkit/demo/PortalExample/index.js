import React, { Component } from "react";
import PropTypes from "prop-types";
import "./styles.css";

import IconGrid from "./IconGrid";
import creative1 from "./assets/creative/art_palette.svg";
import creative2 from "./assets/creative/brush.svg";
import creative3 from "./assets/creative/coffee.svg";
import creative4 from "./assets/creative/fountain_pen.svg";

import environment1 from "./assets/environment/bio_energy.svg";
import environment2 from "./assets/environment/eco_friendly_vehicle.svg";
import environment3 from "./assets/environment/energy_saving_lightbulb.svg";
import environment4 from "./assets/environment/global_warming.svg";

const creativeIcons = [creative1, creative2, creative3, creative4];

const environmentIcons = [
  environment1,
  environment2,
  environment3,
  environment4
];

class PortalExample extends Component {

  render() {
    return (
      <div className="portal-grid-container">
        <IconGrid
          icons={creativeIcons}
          portalKey="creative"
          title="Creative Icons"
        />
        <IconGrid
          icons={environmentIcons}
          portalKey="environment"
          title="Environmental Icons"
        />
      </div>
    );
  }
}

export default PortalExample;
