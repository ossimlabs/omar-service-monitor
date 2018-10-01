package omar.services.dashboard

class DashboardController {

    DeploymentsConfig deploymentsConfig

    def index() {

      //println 'deploymentsConfig: ' + deploymentsConfig

      [
        clientConfig: [
          params: grailsApplication.config.omar.app,
          deployments: deploymentsConfig.deployments
        ]
      ]

    }
}
