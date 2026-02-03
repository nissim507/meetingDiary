pipeline {
    agent any

    environment {
        PATH = "$PATH:/usr/local/bin"  // Ensure chromedriver is in PATH
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
                # Make sure python3-venv is installed
                apt-get update && apt-get install -y python3-venv unzip wget

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
                pip install -r requirements.txt --break-system-packages
                '''
            }
        }

        stage('Install ChromeDriver') {
            steps {
                sh '''
                CHROME_VERSION=$(google-chrome --version | awk '{print $3}' | cut -d '.' -f 1)
                wget https://chromedriver.storage.googleapis.com/${CHROME_VERSION}/chromedriver_linux64.zip
                unzip chromedriver_linux64.zip -d /usr/local/bin/
                chmod +x /usr/local/bin/chromedriver
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
