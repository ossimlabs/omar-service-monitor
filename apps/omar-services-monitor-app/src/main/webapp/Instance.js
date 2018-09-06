import React, { Component } from "react";
import moment from "moment";

class Instance extends Component {
  state = {
    instanceInfo: null,
    instanceMetrics: null
  };

  fetchInstanceInfo = () => {
    const app = this.props.data.app.toLowerCase();
    fetch(`${this.props.server}/${app}/info`)
      .then(function(response) {
        return response.json();
      })
      .then(instanceJson => {
        //console.log('instanceJson:', instanceJson);
        const instanceInfo = instanceJson.app;
        //console.log("App:", instanceInfo);
        this.props.getVersion(instanceInfo.version);

        this.setState({ instanceInfo });
      })
      .catch(error =>
        console.error(
          `[Fetch InstanceInfo Error] connecting to ${
            this.props.server
          } with ${error}`
        )
      );
  };

  fetchInstanceMetrics = () => {
    const app = this.props.data.app.toLowerCase();
    fetch(`${this.props.server}/${app}/metrics`)
      .then(function(response) {
        return response.json();
      })
      .then(instanceMetricsJson => {
        console.log("instanceMetricsJson:", instanceMetricsJson);
        const instanceMetrics = instanceMetricsJson;
        //      console.log("Metrics (uptime):", instanceMetricsJson.uptime);
        //this.props.getVersion(instanceInfo.version);

        this.setState({ instanceMetrics });
      })
      .catch(error =>
        console.error(
          `[Fetch InstanceMetrics Error] connecting to ${
            this.props.server
          } with ${error}`
        )
      );
  };

  componentDidMount() {
    console.log("Instance props:", this.props);
    this.fetchInstanceInfo();
    this.fetchInstanceMetrics();
  }

  getUptime(time) {
    let duration = moment.duration(time, "milliseconds").humanize();
    console.log("duration: ", duration);
    //let days = duration.asDays();
    //console.log(days);
    return duration;
  }

  render() {
    const instanceMetrics = this.state.instanceMetrics ? (
      <div>{this.getUptime(this.state.instanceMetrics.uptime)}</div>
    ) : (
      <div>No Metrics</div>
    );

    const instanceInfo =
      this.props.data.status === "UP" ? (
        <div className="left">
          <div className="pod pod-up">
            <span>{instanceMetrics}</span>
          </div>
        </div>
      ) : (
        <div className="left">
          <div className="pod pod-down">Pod</div>
        </div>
      );

    return <div>{instanceInfo}</div>;
  }
}

export default Instance;
