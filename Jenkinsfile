properties([
    parameters ([
        string(name: 'BUILD_NODE', defaultValue: 'POD_LABEL', description: 'The build node to run on'),
        booleanParam(name: 'CLEAN_WORKSPACE', defaultValue: true, description: 'Clean the workspace at the end of the run'),
        string(name: 'DOCKER_REGISTRY_DOWNLOAD_URL', defaultValue: 'nexus-docker-private-group.ossim.io', description: 'Repository of docker images')
    ]),
    pipelineTriggers([
            [$class: "GitHubPushTrigger"]
    ]),
    [$class: 'GithubProjectProperty', displayName: '', projectUrlStr: 'https://github.com/ossimlabs/omar-services-monitor'],
    buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '3', daysToKeepStr: '', numToKeepStr: '20')),
    disableConcurrentBuilds()
])
podTemplate(
  containers: [
    containerTemplate(
      name: 'docker',
      image: 'docker:latest',
      ttyEnabled: true,
      command: 'cat',
      privileged: true
    ),
    containerTemplate(
      image: "${DOCKER_REGISTRY_DOWNLOAD_URL}/omar-builder:latest",
      name: 'builder',
      command: 'cat',
      ttyEnabled: true
    )
  ],
  volumes: [
    hostPathVolume(
      hostPath: '/var/run/docker.sock',
      mountPath: '/var/run/docker.sock'
    ),
  ]
)
{
  node(POD_LABEL){

      stage("Checkout branch $BRANCH_NAME")
      {
          checkout(scm)
      }

      stage("Load Variables")
      {
        withCredentials([string(credentialsId: 'o2-artifact-project', variable: 'o2ArtifactProject')]) {
          step ([$class: "CopyArtifact",
            projectName: o2ArtifactProject,
            filter: "common-variables.groovy",
            flatten: true])
          }
          load "common-variables.groovy"
      }
      stage ("Build") {
          container('builder') {
              dir('apps/omar-services-monitor-app'){
                  sh """
                  apt-get install -y build-essential libpng-dev
                  
                  """
              }
            sh """
            
            ./gradlew assemble \
                -PossimMavenProxy=${MAVEN_DOWNLOAD_URL}
            ./gradlew copyJarToDockerDir \
                -PossimMavenProxy=${MAVEN_DOWNLOAD_URL}
            """
            archiveArtifacts "apps/*/build/libs/*.jar"
          }
    }
    stage('Docker build') {
      container('docker') {
        withDockerRegistry(credentialsId: 'dockerCredentials', url: "https://${DOCKER_REGISTRY_DOWNLOAD_URL}") {  //TODO
          sh """
            docker build --build-arg BASE_IMAGE=nexus-docker-public-hosted.ossim.io/ossim-runtime-alpine-minimal --network=host -t "${DOCKER_REGISTRY_PUBLIC_UPLOAD_URL}"/omar-services-monitor:${BRANCH_NAME} ./docker
          """
        }
      }
      stage('Docker push'){
        container('docker') {
          withDockerRegistry(credentialsId: 'dockerCredentials', url: "https://${DOCKER_REGISTRY_PUBLIC_UPLOAD_URL}") {
          sh """
              docker push "${DOCKER_REGISTRY_PUBLIC_UPLOAD_URL}"/omar-services-monitor:${BRANCH_NAME}
          """
          }
        }
      }
    }
    stage("Clean Workspace"){
      if ("${CLEAN_WORKSPACE}" == "true")
        step([$class: 'WsCleanup'])
    }
  }
}
