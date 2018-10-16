import omar.services.dashboard.DeploymentsConfig

// Place your Spring DSL code here
beans = {
  deploymentsConfig(DeploymentsConfig)
  deploymentsDeploymentConverter(DeploymentsConfig.DeploymentsDeploymentConverter)
}
