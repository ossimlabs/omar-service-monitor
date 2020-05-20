package omar.services.dashboard

import org.springframework.beans.factory.annotation.Value;

class DashboardController {

    DeploymentsConfig deploymentsConfig

    @Value('${jenkins.url}')
    String jenkinsUrl

    @Value('${jenkins.auth}')
    String jenkinsAuth

    def index() {

      [
        clientConfig: [
          params: grailsApplication.config.omar.app,
          deployments: deploymentsConfig.deployments
        ]
      ]

    }

    def proxy() {

      // TODO: Refactor, and use REST Client for POST
      def cmd = ['curl', '-LX', 'POST', jenkinsUrl, '--user',
        jenkinsAuth, '--data-urlencode',
        """json='{"parameter": []}'"""
      ]

      // println "*"*40
      // println cmd.join(' ')
      // println "*"*40

      def process = cmd.execute()
		  def stdout = new StringWriter()
		  def stderr = new StringWriter()

      process.consumeProcessOutput(stdout, stderr)

      def exitCode = process.waitFor()
      if ( exitCode == 0 )
      {
          render contentType: 'application/json', text: stdout.toString()
      }
      else
      {
        render contentType: 'text/plain', text: stderr.toString()
      }

    }
}
