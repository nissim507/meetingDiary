pipeline {
    agent any

    stages {

        stage('Install Python Dependencies') {
            steps {
                sh 'pip install -r requirements.txt'
            }
        }

        stage('Run Selenium Tests') {
            steps {
                sh 'pytest tests'
            }
        }

    }
}
