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
              <a href="#" className="brand-logo center">O2 Monitor</a>
            </div>
          </div>
        </nav>
        {
          // AppParams is a global passed down from application.yml
          // through the .gsp
          AppParams.params.deployments.map((deployment, i) => {
            return (<div className="row"key={i}>
              <Deployment server={deployment.url} />
            </div>)
          })
        }
      </ErrorBoundary>
    );
  }
}

export default App;
