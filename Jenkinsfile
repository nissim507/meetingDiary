pipeline {
    agent {
        docker {
            image 'selenium-python-agent:latest' // Your custom Docker image
            args '-u root:root'                  // Run as root inside container
        }
    }

    environment {
        PATH = "$PATH:/usr/local/bin"           // Ensure chromedriver is in PATH
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/nissim507/meetingDiary.git'
            }
        }

        stage('Setup Python Environment') {
            steps {
                sh '''
                # Create virtual environment if not exists
                [ ! -d venv ] && python3 -m venv venv || echo "venv exists"
                # Activate and upgrade pip
                . venv/bin/activate
                pip install --upgrade pip
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                . venv/bin/activate
                pip install -r requirements.txt
                '''
            }
        }

        stage('Run Selenium Tests') {
            steps {
                sh '''
                . venv/bin/activate
                python -m pytest tests/
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
