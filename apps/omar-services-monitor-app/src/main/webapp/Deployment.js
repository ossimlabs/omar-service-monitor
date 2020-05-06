import React, { Component } from "react";
import ServiceMonitor from "./ServiceMonitor";

import "whatwg-fetch";

class Deployment extends Component {
  state = {
    deploymentInfo: [],
    deploymentReleaseName: null,
    deploymentReleaseNumber: null,
    appsInfo: [],
    error: false,
  };

  fetchDeployment = () => {
    // Need to set a variable for this so that we can still access
    // 'this' for props and state inside the setInterval callback
    // function
    let _this = this;

    let profile;
    if (_this.props.profile == null || _this.props.profile == "") {
      profile = "";
    } else {
      profile = `-${_this.props.profile}`;
    }
    console.log("profile is: " + profile);
    let deploymentTimer = setInterval(function fetchDeploymentData() {
      fetch(`${_this.props.server}/omar-wfs/actuator/env`)
        .then(function (response) {
          return response.json();
        })
        .then((deploymentJson) => {
          const deploymentReleaseName =
            deploymentJson.propertySources[1].properties["about.releaseName"]
              .value;

          const deploymentReleaseNumber =
            deploymentJson.propertySources[1].properties["about.releaseNumber"]
              .value;

          // We need to check to see that the application<PROFILE>.yml with exists.
          // If it doesn't we need to log an error to the console.
          //if (deployment !== undefined) {
          if (
            deploymentReleaseName !== undefined &&
            deploymentReleaseNumber !== undefined
          ) {
            //_this.setState({ deploymentInfo: deployment });
            _this.setState({
              deploymentReleaseNumber: deploymentReleaseNumber,
            });
            _this.setState({ deploymentReleaseName: deploymentReleaseName });
            _this.setState({ error: false });
          } else {
            console.error(
              `[Fetch Deployments Profile Error] connecting to ${_this.props.server}`
            );
            _this.setState({ error: true });
          }
        })
        .catch((error) => {
          console.error(
            `[Fetch Deployments Error] connecting to ${_this.props.server} with ${error}`
          );
          _this.setState({ error: true });
        });

      // Clear the initial 1 second pole interval
      clearInterval(deploymentTimer);

      // Set a new pole interval to use what is passed in from the app configuration.
      // The default from the configuration is every 90 seconds.
      deploymentTimer = setInterval(
        fetchDeploymentData,
        AppParams.params.deploymentPoleTime
      );
    }, 1000); // Intial pole for deployments is after 1 second
  };

  fetchApps = () => {
    // Need to set a variable for this so that we can still access
    // 'this' for props and state inside the setInterval callback
    // function
    let _this = this;

    let appsTimer = setInterval(function fetchAppsData() {
      fetch(`${_this.props.server}/omar-eureka-server/eureka/apps`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then(function (response) {
          return response.json();
        })
        .then((eurekaJson) => {
          const Apps = eurekaJson.applications.application;
          _this.setState({ appsInfo: Apps });
        })
        .catch((error) =>
          console.error(
            `[Fetch Apps Error] connecting to ${_this.props.server} with ${error}`
          )
        );

      // Clear the initial 3 second pole interval
      clearInterval(appsTimer);

      // Set a new pole interval to use what is passed in from the app configuration.
      // The default from the configuration is every 60 seconds.
      appsTimer = setInterval(fetchAppsData, AppParams.params.appsPoleTime);
    }, 3000); // Intial pole for deployments is after 3 seconds
  };

  componentDidMount() {
    this.fetchDeployment();
    console.log(
      `Fetching Deployments with pole time of: ${AppParams.params.deploymentPoleTime}`
    );
    this.fetchApps();
    console.log(
      `Fetching Apps with pole time of: ${AppParams.params.appsPoleTime}`
    );
  }

  render() {
    const AppsList = this.state.appsInfo.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    console.log("AppsList: ", AppsList);
    if (this.state.appsInfo.length === 0 && this.state.error === false) {
      return (
        <div className="progress">
          <div className="indeterminate" />
        </div>
      );
    } else if (this.state.error === true) {
      return (
        <div>
          <div className="deployment">
            <p className="deployment-info">
              <a href={this.props.server}>{this.props.server}</a>
            </p>
            <p className="chip red lighten-1 z-depth-2">
              <span className="white-text">
                There was an error fetching the details for this deployment.
              </span>
            </p>
          </div>
        </div>
      );
    }

    return (
      <React.Fragment>
        <div className="deployment">
          <section>
            <p className="deployment-info">
              <a href={this.props.server}>{this.props.server}</a>
              <span className="deployment-release">
                {this.state.deploymentReleaseNumber} (
                {this.state.deploymentReleaseName})
              </span>
            </p>
            {AppsList.map((app, i) => {
              return (
                <div className="col s2 z-depth-3 service" key={i}>
                  <ServiceMonitor server={this.props.server} app={app} />
                </div>
              );
            })}
          </section>
        </div>
      </React.Fragment>
    );
  }
}

export default Deployment;
