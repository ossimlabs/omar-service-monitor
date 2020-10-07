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
    ),
    containerTemplate(
      image: "${DOCKER_REGISTRY_DOWNLOAD_URL}/kubectl-aws-helm:latest",
      name: 'kubectl-aws-helm',
      command: 'cat',
      ttyEnabled: true,
      alwaysPullImage: true
    ),
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
          if (BRANCH_NAME == 'master'){
                sh """
                    docker build --build-arg BASE_IMAGE=nexus-docker-public-hosted.ossim.io/ossim-runtime-alpine-minimal --network=host -t "${DOCKER_REGISTRY_PUBLIC_UPLOAD_URL}"/omar-services-monitor-app:"${VERSION}" ./docker

                """
          }
          else {
                sh """
                    docker build --build-arg BASE_IMAGE=nexus-docker-public-hosted.ossim.io/ossim-runtime-alpine-minimal --network=host -t "${DOCKER_REGISTRY_PUBLIC_UPLOAD_URL}"/omar-services-monitor-app:"${VERSION}".a ./docker
                """
          }
        }
      }
    }
	
	    stage('Docker push'){
        container('docker') {
          withDockerRegistry(credentialsId: 'dockerCredentials', url: "https://${DOCKER_REGISTRY_PUBLIC_UPLOAD_URL}") {
            if (BRANCH_NAME == 'master'){
                sh """
                    docker push "${DOCKER_REGISTRY_PUBLIC_UPLOAD_URL}"/omar-services-monitor-app:"${VERSION}"
                """
            }
            else if (BRANCH_NAME == 'dev') {
                sh """
                    docker tag "${DOCKER_REGISTRY_PUBLIC_UPLOAD_URL}"/omar-services-monitor-app:"${VERSION}".a "${DOCKER_REGISTRY_PUBLIC_UPLOAD_URL}"/omar-services-monitor-app:dev
                    docker push "${DOCKER_REGISTRY_PUBLIC_UPLOAD_URL}"/omar-services-monitor-app:"${VERSION}".a
                    docker push "${DOCKER_REGISTRY_PUBLIC_UPLOAD_URL}"/omar-services-monitor-app:dev
                """
            }
            else {
                sh """
                    docker push "${DOCKER_REGISTRY_PUBLIC_UPLOAD_URL}"/omar-services-monitor-app:"${VERSION}".a           
                """
            }
          }
        }
      }
      
    stage('New Deploy'){
        container('kubectl-aws-helm') {
            withAWS(
            credentials: 'Jenkins IAM User',
            region: 'us-east-1'){
                if (BRANCH_NAME == 'master'){
                    //insert future instructions here
                }
                else if (BRANCH_NAME == 'dev') {
                    sh "aws eks --region us-east-1 update-kubeconfig --name gsp-dev-v2 --alias dev"
                    sh "kubectl config set-context dev --namespace=omar-dev"
                    sh "kubectl rollout restart deployment/omar-services-monitor"   
                }
                else {
                    //sh "echo Not deploying ${BRANCH_NAME} branch"
                    sh "aws eks --region us-east-1 update-kubeconfig --name gsp-dev-v2 --alias dev"
                    sh "kubectl config set-context dev --namespace=omar-dev"
                    sh "kubectl rollout restart deployment/omar-services-monitor"  
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
