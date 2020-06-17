import React, { Component } from "react";
import moment from "moment";

class Instance extends Component {
  state = {
    instanceInfo: null,
    instanceMetrics: this.props.data.leaseInfo.serviceUpTimestamp,
  };

  fetchInstanceInfo = () => {
    const app = this.props.data.app.toLowerCase();
    // making request to?
    fetch(`${this.props.server}/${app}/actuator/info`)
    // get the JSON from response
      .then(function (response) {
        return response.json();
      })
      // JSON is returned as instance JSON
      .then((instanceJson) => {
        //console.log('instanceJson:', instanceJson);
        // accessing the app block
        // app:
        //   grailsVersion: "4.0.1"
        //   name: "omar-stager-app"
        //   version: "2.0.0-SNAPSHOT"
        const instanceInfo = instanceJson.app;
        //console.log("App:", instanceInfo);
        this.props.getVersion(instanceInfo.version);
        this.setState({ instanceInfo });
      })
      .catch((error) =>
        console.error(
          `[Fetch ${app} InstanceInfo Error] connecting to ${this.props.server} with ${error}`
        )
      );
  };

  // what does this mean?
  componentDidMount() {
    this.fetchInstanceInfo();
    // Set new thresholds
    moment.relativeTimeThreshold("s", 59);
    moment.relativeTimeThreshold("m", 59);
    moment.relativeTimeThreshold("h", 24);
    moment.relativeTimeThreshold("d", 30);
    moment.relativeTimeThreshold("M", 12);
  }
  
  // what are props?
  componentWillReceiveProps(nextProps) {
    // Update the state when new props are passed in from the parent component
    this.setState({
      instanceMetrics: nextProps.data.leaseInfo.serviceUpTimestamp,
    });
  }

  getUptime(time) {
    let now = moment(new Date()); // todays date
    let timeStamp = moment(time); // instance serviceUpTimestamp
    let duration = moment.duration(now.diff(timeStamp));
    let upTime = duration.humanize();
    return upTime;
  }

  getInstanceStatus(time) {
    let now = moment(new Date()); // todays date
    let timeStamp = moment(time); // instance serviceUpTimestamp
    let duration = moment.duration(now.diff(timeStamp));
    return duration.asHours();
  }

  render() {
    const instanceTimeUp = this.state.instanceMetrics ? (
      <div>{this.getUptime(this.state.instanceMetrics)}</div>
    ) : (
      <div>No Metrics</div>
    );
    
    /* Determin the actual colors
     for services by choisng the correct class name for css */
    let metrics = parseFloat(
      this.getInstanceStatus(this.state.instanceMetrics)
    );
    //console.log(`metrics ${this.props.data.instanceId}:`, metrics);

    if (metrics < 1) {
      return (
        <div className="left pod pod-orange z-depth-1">{instanceTimeUp}</div>
      );
    } else if (metrics >= 1 && metrics < 24) {
      return (
        <div className="left pod pod-lightgreen z-depth-1">
          {instanceTimeUp}
        </div>
      );
    } else if (metrics >= 24 && metrics < 48) {
      return (
        <div className="left pod pod-green z-depth-1">{instanceTimeUp}</div>
      );
    } else if (metrics >= 48) {
      return (
        <div className="left pod pod-blue z-depth-1">{instanceTimeUp}</div>
      );
    }
  }
}

export default Instance;
