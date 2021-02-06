import "./App.css";
import axios from "axios";
import { Component } from "react";
import { RoomGroup } from "./component/room-group/room-group.component";

const HUE_SERVICE_URL = process.env.REACT_APP_SERVICE_URL;

class App extends Component {
  constructor() {
    super();

    this.state = {
      isFetching: false,
      lights: [],
      scenes: [],
      groups: [],
    };
  }

  componentDidMount() {
    require('dotenv').config();
    this.loadData(); // also load one immediately
    this.timer = setInterval(() => this.loadDateWithAxiosandAsync(), 2000000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  async loadDateWithAxiosandAsync() {
    try {
      this.setState({ ...this.state, isFetching: true });
      const res = await axios.get(HUE_SERVICE_URL)
      this.setState({ lights: res.data.lights, groups: res.data.groups, scenes:res.data.scenes, isFetching: true });
    }
      catch (e) {
        console.log(e);
        this.setState({ ...this.state, isFetching: false });
       };
  };

  loadDateWithAxios = () => {
    this.setState({ ...this.state, isFetching: true });

    axios
      .get(HUE_SERVICE_URL)
      .then((res) => {
        this.setState({ lights: res.data.lights, groups: res.data.groups, scenes:res.data.scenes, isFetching: true });
      })
      .catch((e) => {
        console.log(e);
        this.setState({ ...this.state, isFetching: false });
      });
  };

  loadData() {
    fetch(HUE_SERVICE_URL)
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          lights: response.lights,
          groups: response.groups,
          scenes: response.scenes,
        });
      });
  }

  render() {
    const { groups } = this.state;
    return (
      <div className="App">
        <RoomGroup groups={groups} />
      </div>
    );
  }
}

export default App;
