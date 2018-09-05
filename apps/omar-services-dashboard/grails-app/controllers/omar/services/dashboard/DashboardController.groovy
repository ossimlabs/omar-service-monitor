package omar.services.dashboard

class DashboardController {

    def index() {

      [
        clientConfig: [
          params: grailsApplication.config.omar.app
        ]
      ]

    }
}
