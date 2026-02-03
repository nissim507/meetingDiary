pipeline {
    agent any

    environment {
        PATH = "$PATH:/var/jenkins_home/.local/bin"
    }

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
                '''
            }
        }

        stage('Run Selenium Tests') {
            steps {
                sh '''
                    python3 -m pytest tests/ --maxfail=1 --disable-warnings -q
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
