package omar.services.dashboard

import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConfigurationPropertiesBinding
import org.springframework.core.convert.converter.Converter
import groovy.transform.ToString

@ConfigurationProperties(prefix="omar.app", ignoreInvalidFields=true)
@ToString(includeNames=true)
class DeploymentsConfig
{
  List<Deployment> deployments

  @ToString(includeNames=true)
  static class Deployment {
    String url
    String profile
  }

  @ConfigurationPropertiesBinding
  static class DeploymentsDeploymentConverter implements Converter<Map <String, String>, Deployment>
  {
    @Override
    Deployment convert(Map<String,String> map){
      return new Deployment( map )
    }

  }

}