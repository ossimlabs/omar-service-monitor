import React, { Component } from "react";
import ErrorBoundary from "./ErrorBoundary";
import Deployment from "./Deployment";
<<<<<<< HEAD
import APITest from "./APITest";
=======

>>>>>>> 7bba2dc5ada2264de8cd91417e9186a98e74f561

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <nav>
          <div className="nav-wrapper black">
            <div className="">
              <h1 href="#" className="services-header">
                O2 Services Monitor
              </h1>
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
<<<<<<< HEAD
            {/* <APITest /> */}
=======
>>>>>>> 7bba2dc5ada2264de8cd91417e9186a98e74f561
          </p>
        </div>
        {
          // AppParams is a global passed down from application.yml
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
          })
        }
      </ErrorBoundary>
    );
  }
}

export default App;
