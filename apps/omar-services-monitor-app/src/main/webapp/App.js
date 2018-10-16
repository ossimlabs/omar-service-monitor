import React, { Component } from "react";
import ErrorBoundary from "./ErrorBoundary";
import Deployment from "./Deployment";

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <nav>
          <div className="nav-wrapper black">
            <div className="">
              <a href="#" className="brand-logo center">
                O2 Services Monitor
              </a>
            </div>
          </div>
        </nav>
        <div>
          <p className="services-description">
            View realtime information on applications that have been installed
            in given O2 deployments
            <span className="legend right">
              Instances Legend&nbsp;
              <span className="legend-pod pod pod-red z-depth-1">Error</span>
              <span className="legend-pod pod pod-orange z-depth-1">
                &lt; 1 hr
              </span>
              <span className="legend-pod pod pod-lightgreen z-depth-1">
                &gt; 1hr & &lt; 24 hrs
              </span>
              <span className="legend-pod pod pod-green z-depth-1">
                &gt; 24hrs & &lt; 48 hrs
              </span>
              <span className="legend-pod pod pod-blue z-depth-1">
                &gt; 48hr
              </span>
            </span>
          </p>
        </div>
        {// AppParams is a global passed down from application.yml
        // through the .gsp
        AppParams.deployments.map((deployment, i) => {
          return (
            <div className="row" key={i}>
              <Deployment
                server={deployment.url}
                profile={deployment.profile}
              />
            </div>
          );
        })}
      </ErrorBoundary>
    );
  }
}

export default App;
