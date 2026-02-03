pipeline {
    agent any

    environment {
        PATH = "${env.WORKSPACE}/.local/bin:${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/nissim507/meetingDiary.git'
            }
        }

        stage('Install Python Dependencies') {
            steps {
                sh '''
                python3 -m pip install --user --upgrade pip --break-system-packages
                python3 -m pip install --user -r requirements.txt --break-system-packages
                '''
            }
        }

        stage('Install Google Chrome') {
            steps {
                sh '''
                # Download and install Chrome stable in the workspace
                wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
                apt-get update && apt-get install -y ./google-chrome-stable_current_amd64.deb || true
                '''
            }
        }

        stage('Install Matching ChromeDriver') {
            steps {
                sh '''
                CHROME_VERSION=$(google-chrome --version | awk '{print $3}' | cut -d. -f1)
                wget -q https://chromedriver.storage.googleapis.com/${CHROME_VERSION}/chromedriver_linux64.zip
                unzip -o chromedriver_linux64.zip -d ~/.local/bin
                chmod +x ~/.local/bin/chromedriver
                export PATH=$PATH:~/.local/bin
                '''
            }
        }

        stage('Run Selenium Tests') {
            steps {
                sh '''
                export PATH=$PATH:~/.local/bin
                python3 -m pytest tests/
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
