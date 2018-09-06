import React, { Component } from "react";
import ServiceMonitor from "./ServiceMonitor";

//import { SERVER_URL, CLIENT_VERSION, REACT_VERSION } from "./config";
import "whatwg-fetch";

class Deployment extends Component {
  state = {
    deploymentInfo: [],
    appsInfo: [],
    error: false
  };

  fetchDeployment = () => {
    fetch(`${this.props.server}/omar-eureka-server/env`)
      .then(function(response) {
        // if (!response.ok) {
        //   throw Error(response.statusText);
        // }
        return response.json();
      })
      .then(deploymentJson => {
        //console.log("deploymentJson: ", deploymentJson['configService:file:/home/omar/configs/application.yml']);
        const deployment =
          deploymentJson[
            "configService:file:/home/omar/configs/application.yml"
          ];
        //console.log("deployment: ", deployment);
        this.setState({ deploymentInfo: deployment });
      })
      .catch(error => {
        console.error(`[Fetch Deployments Error] connecting to ${this.props.server} with ${error}`);
        this.setState({ error: true });
      });
  };

  fetchApps = () => {
    setInterval(() => {
      //console.log("fetching apps...");
      fetch(`${this.props.server}/omar-eureka-server/eureka/apps`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(function(response) {
          return response.json();
        })
        .then(eurekaJson => {
          const Apps = eurekaJson;
          this.setState({ appsInfo: Apps });
        })
        .catch(error => console.error(`[Fetch Apps Error] connecting to ${this.props.server} with ${error}`));
    }, 5000);
  };

  componentDidMount() {
    //console.log(AppParams); // Passed down from .gsp
    //console.log("Deployment server:", this.props.server);
    this.fetchDeployment();
    this.fetchApps();
  }

  render() {
    if (this.state.appsInfo.length === 0 && this.state.error === false) {
      return (
        <div className="progress">
          <div className="indeterminate" />
        </div>
      );
    }
    else if (this.state.appsInfo.length === 0 && this.state.error === true) {
      return (<div className="deployment"><p className="chip red lighten-1"><span className="white-text">There was an error fetching the details of the {this.props.server} deployment</span></p></div>)
    }

    return (
      <div className="deployment">
        <section>
          <a href={this.props.server}>{this.props.server}</a>
          <p className="deployment-version">
          Version: {this.state.deploymentInfo.releaseNumber} (
            {this.state.deploymentInfo.releaseName})
          </p>

            {this.state.appsInfo.applications.application.map((app, i) => {
              return (
                <div className="col s2 z-depth-2 service" key={i}>
                  <ServiceMonitor server={this.props.server} app={app} />
                </div>
              );
            })}

        </section>
      </div>
    );
  }
}

export default Deployment;
