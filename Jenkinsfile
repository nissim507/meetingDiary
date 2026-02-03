pipeline {
    agent any

    environment {
        PATH = "$PATH:/usr/local/bin"
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
                # Create virtual environment if it doesn't exist
                if [ ! -d venv ]; then
                    python3 -m venv venv
                fi

                # Upgrade pip inside virtualenv
                ./venv/bin/pip install --upgrade pip --break-system-packages
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                # Activate virtualenv and install requirements
                ./venv/bin/pip install -r requirements.txt --break-system-packages
                '''
            }
        }

        stage('Install ChromeDriver') {
            steps {
                sh '''
                # Get Chrome major version
                CHROME_VERSION=$(google-chrome --version | awk '{print $3}' | cut -d '.' -f 1)

                # Download and install chromedriver
                wget -q https://chromedriver.storage.googleapis.com/${CHROME_VERSION}/chromedriver_linux64.zip
                unzip -o chromedriver_linux64.zip -d ./venv/bin
                chmod +x ./venv/bin/chromedriver
                '''
            }
        }

        stage('Run Selenium Tests') {
            steps {
                sh '''
                # Run tests using virtualenv Python
                ./venv/bin/python -m pytest tests/
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
