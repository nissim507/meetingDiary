pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/nissim507/meetingDiary.git'
            }
        }

        stage('Setup Python') {
            steps {
                sh '''
                    python3 -m pip install --user --upgrade pip --break-system-packages
                    python3 -m pip install --user -r requirements.txt --break-system-packages
                    export PATH=$PATH:/var/jenkins_home/.local/bin
                '''
            }
        }

        stage('Run Selenium Tests') {
            steps {
                sh '''
                    python3 test_login.py
                '''
            }
        }
    }

    post {
        always {
            echo "Pipeline finished"
        }
    }
}
