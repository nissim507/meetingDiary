pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/nissim507/meetingDiary.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'pip install -r requirements.txt'
            }
        }

        stage('Run Selenium Tests') {
            steps {
                // Run tests using pytest
                bat 'pytest tests'
            }
        }
    }
}
