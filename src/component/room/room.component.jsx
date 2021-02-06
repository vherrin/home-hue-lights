import React, { useState } from "react";
import "../../../node_modules/gestalt/dist/gestalt.css";
import { Box, Text, Switch, IconButton } from "gestalt";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";

const HUE_SERVICE_URL = process.env.REACT_APP_SERVICE_URL + `groups/`;

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderCount: 1,
      switched: false,
      selected: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.room.action.on !== this.state.selected) {
      this.setState({ selected: !this.state.selected });
    }
    if (
      prevProps.room.action.effect === "colorloop" &&
      this.state.switched === false
    ) {
      this.setState({ switched: true });
    } else if (
      prevProps.room.action.effect === "none" &&
      this.state.switched === true
    ) {
      this.setState({ switched: false });
    }
  }

  componentDidMount() {
    this.setState({ sliderCount: this.props.room.action.bri });
    this.setState({
      switched: this.props.room.action.effect === "colorloop" ? true : false,
    });
    this.setState({ selected: this.props.room.action.on });
  }

  onSliderChange = (count) => {
    if (count !== this.state.sliderCount) {
      this.setState({ sliderCount: count });
    }
    fetch(HUE_SERVICE_URL + this.props.uniqueID + "/action", {
      method: "put",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        bri: count,
      }),
    });
  };

  onColorLoopChange = () => {
    fetch(HUE_SERVICE_URL + this.props.uniqueID + "/action", {
      method: "put",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        effect: !this.state.switched ? "colorloop" : "none",
        sat: !this.state.switched ? 254 : 0,
      }),
    });
    this.setState({ switched: !this.state.switched });
  };

  onPowerStateChange = () => {
    fetch(HUE_SERVICE_URL + this.props.uniqueID + "/action", {
      method: "put",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        on: !this.state.selected,
      }),
    });
    this.setState({ selected: !this.state.selected });
  };

  render() {
    return (
      <Box
        alignItems="center"
        direction="row"
        display={this.props.isHidden === true ? "visuallyHidden" : "flex"}
        marginStart={1}
        marginEnd={-1}
        maxWidth={600}
        minHeight={120}
        borderStyle="shadow"
        color="white"
        rounding={8}
        paddingY={5}
      >
        <Box paddingX={6}>
          <IconButton
            accessibilityLabel="Open edit modal to edit Board"
            icon="check"
            onClick={() => {
              this.onPowerStateChange();
            }}
            selected={this.state.selected}
          />
        </Box>
        <Box paddingX={1} flex="grow" alignItems="top" className="veh">
          <Text id="display-name" weight="bold" size="lg">
            {this.props.room.name}
          </Text>
          <Box paddingY={4}></Box>
          <Slider
            min={1}
            max={254}
            onChange={this.onSliderChange}
            value={this.state.sliderCount}
          />
        </Box>
        <Box paddingX={4} alignItems="top">
          <Text weight="bold" size="lg">
            Color Loop
          </Text>
          <Box paddingY={3}></Box>
          <Switch
            onChange={() => {
              this.onColorLoopChange();
            }}
            id="colorLoop"
            switched={this.state.switched}
          />
        </Box>
      </Box>
    );
  }
}

export default Room;
