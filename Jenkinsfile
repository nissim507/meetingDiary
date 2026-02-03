pipeline {
    agent any

    stages {

        stage('Clone Repo') {
            steps {
                git 'https://github.com/nissim507/meetingDiary.git'
            }
        }

        stage('Install Python Dependencies') {
            steps {
                bat 'pip install -r requirements.txt'
            }
        }

        stage('Run Selenium Tests') {
            steps {
                bat 'pytest tests'
            }
        }

    }
}
