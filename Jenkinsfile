pipeline {
    agent {
        docker {
            image 'selenium/standalone-chrome'
            args '--shm-size=2g'
        }
    }

    stages {

        stage('Install Python Packages') {
            steps {
                sh 'pip install -r requirements.txt'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'pytest tests'
            }
        }

    }
}
