import React, { Component } from "react";
import Instance from "./Instance";

import "whatwg-fetch";

class ServiceMonitor extends Component {
  state = {
    instances: [],
    version: null
  };

  fetchServices = () => {
    setInterval(() => {
      const appName = this.props.app.name.toLowerCase();
      //console.log('appName: ', appName);
      fetch(`${this.props.server}/omar-eureka-server/eureka/vips/${appName}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(function(response) {
          return response.json();
        })
        .then(instanceJson => {
          //console.log('instanceJson', instanceJson);
          const instances = instanceJson.applications.application[0].instance;

          this.setState({ instances: instances });
          //console.log('State in the ServiceMonitor', this.state);
        })
        .catch(error => console.error(`[Fetch Services Error] connecting to ${this.props.server} with ${error}`));
    }, 7500);
  };

  getVersion = version => {
    this.setState({ version });
  };

  componentDidMount() {
    //console.log('ServiceMonitor Props: ', this.props);
    this.fetchServices();
  }

  render() {
    if (this.state.instances.length === 0) {
      return <p>Loading service...</p>;
    }

    return (
      <React.Fragment>
        <p className="service-name">
          {this.props.app.name} {this.state.version}
        </p>
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
        {/* <img
          className="right"
          src="https://jenkins.ossim.io/buildStatus/icon?job=omar-oms-dev"
          alt=""
        /> */}
      </React.Fragment>
    );
  }
}

export default ServiceMonitor;
