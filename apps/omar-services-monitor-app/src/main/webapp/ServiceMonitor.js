import React, { Component } from "react";
import Instance from "./Instance";

import "whatwg-fetch";

class ServiceMonitor extends Component {
  state = {
    instances: [],
    version: null
  };

  fetchServices = () => {
    // Need to set a variable for this so that we can still access
    // 'this' for props and state inside the setInterval callback
    // function
    let _this = this;

    let servicesTimer = setInterval(
      function fetchServicesData() {
        const appName = _this.props.app.name.toLowerCase();
        fetch(
          `${_this.props.server}/omar-eureka-server/eureka/vips/${appName}`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          }
        )
          .then(function(response) {
            return response.json();
          })
          .then(instanceJson => {
            const instances = instanceJson.applications.application[0].instance;
            // Print something here to see if this could be where population on of instance list could

            _this.setState({ instances: instances });
          })
          .catch(error =>
            console.error(
              `[Fetch ${appName} Services Error] connecting to ${
                _this.props.server
              } with ${error}`
            )
          );

        // Clear the initial 3.5 second pole interval
        clearInterval(servicesTimer);

        // Set a new pole interval to use what is passed in from the app configuration.
        // The default from the configuration is every 30 seconds.
        servicesTimer = setInterval(
          fetchServicesData,
          AppParams.params.servicesPoleTime
        );
      }.bind(this),
      3500
    ); // Intial pole for deployments is after 3.5 seconds
  };

  getVersion = version => {
    this.setState({ version });
  };

  componentDidMount() {
    this.fetchServices();
    console.log(
      `Fetching Services with pole time of: ${
        AppParams.params.servicesPoleTime
      }`
    );
  }

  // If there are no instances in the instances list then display fetiching message
  render() {
    if (this.state.instances.length === 0) {
      return <div style={{color: "whitesmoke"}}>Fetching service info...</div>;
    }

    // If the version is not available use place holder otherwise use the
    // instances version 
    let version;
    if(this.state.version === null) {
      version = <p className="service-version">Version: N/A</p>
    }
    else{
      version = <p className="service-version">Version: {this.state.version}</p>
    }

    // return the name of the app and the version
    // then
    return (
      // react fragments ????
      <React.Fragment>
        <span className="service-name">{this.props.app.name}</span>
        <span>{version}</span>
        {this.state.instances.map((instance, i) => {
          return (
            <div key={i}>
              <Instance
                data={instance}
                server={this.props.server}
                getVersion={this.getVersion}
              />
            </div>
          );
        })}
      </React.Fragment>
    );
  }
}

export default ServiceMonitor;
