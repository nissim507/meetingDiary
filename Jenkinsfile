pipeline {
    agent any

    environment {
        VENV_DIR = 'venv'
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
                    # Create virtual environment
                    python3 -m venv $VENV_DIR
                    # Activate virtual environment
                    source $VENV_DIR/bin/activate
                    # Upgrade pip inside venv
                    pip install --upgrade pip
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    # Activate virtual environment
                    source $VENV_DIR/bin/activate
                    # Install requirements
                    pip install -r requirements.txt
                '''
            }
        }

        stage('Install ChromeDriver') {
            steps {
                sh '''
                    # Install unzip if missing
                    apt-get update && apt-get install -y unzip wget
                    # Get Chrome version
                    CHROME_VERSION=$(google-chrome --version | awk '{print $3}' | cut -d '.' -f 1)
                    # Download matching ChromeDriver
                    wget https://chromedriver.storage.googleapis.com/${CHROME_VERSION}/chromedriver_linux64.zip
                    unzip chromedriver_linux64.zip -d /usr/local/bin/
                    chmod +x /usr/local/bin/chromedriver
                '''
            }
        }

        stage('Run Selenium Tests') {
            steps {
                sh '''
                    # Activate virtual environment
                    source $VENV_DIR/bin/activate
                    # Run pytest
                    python -m pytest tests/
                '''
            }
        }
    }
}
