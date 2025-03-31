pipeline {
  agent {
    node {
      label 'GMT'
    }

  }
  stages {
    stage('Dependencies installation') {
      agent any
      steps {
        sh 'npm install'
      }
    }

    stage('NG Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Electron Forge Zip') {
      steps {
        sh 'npm run zip'
      }
    }

  }
  environment {
    dependencies = ''
  }
}