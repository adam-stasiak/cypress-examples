node {
    docker.image('cypress/base:16.13.0').inside {
        stage ('build') {
                git 'https://github.com/adam-stasiak/cypress-examples.git'
                sh 'npm install --legacy-peer-deps'
                sh './node_modules/cypress/bin/cypress install'
                sh 'node app.js &'
        }
        stage('Test') {
            try {
                sh 'CYPRESS_BASE_URL=http://localhost:3000 ./node_modules/cypress/bin/cypress run --spec cypress/integration/presentation/ci.ts'
            }
            finally {
                archiveArtifacts artifacts: 'cypress/screenshots/**', fingerprint: true
            }
        }
    }
}
