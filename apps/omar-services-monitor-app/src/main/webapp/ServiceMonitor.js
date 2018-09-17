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
        //console.log("################# services ############## ");

        const appName = _this.props.app.name.toLowerCase();
        //console.log('appName: ', appName);
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
            // console.log(
            //   `${
            //     _this.props.server
            //   }/omar-eureka-server/eureka/vips/${appName} JSON`,
            //   instances
            // );

            _this.setState({ instances: instances });
            //console.log("State in the ServiceMonitor", this.state);
          })
          .catch(error =>
            console.error(
              `[Fetch Services Error] connecting to ${
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
    //console.log('ServiceMonitor Props: ', this.props);
    this.fetchServices();
  }

  render() {
    if (this.state.instances.length === 0) {
      return <div>Fetching service info...</div>;
    }

    return (
      <React.Fragment>
        <p className="service-name">
          {this.props.app.name} {this.state.version}<br/ >
          <hr/>
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

      </React.Fragment>
    );
  }
}

export default ServiceMonitor;
