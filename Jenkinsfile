pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/nissim507/meetingDiary.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                # Upgrade pip for the current user
                python3 -m pip install --user --upgrade pip --break-system-packages

                # Install all requirements for the current user
                python3 -m pip install --user -r requirements.txt --break-system-packages

                # Add local bin to PATH so we can use chromedriver or other binaries
                export PATH=$PATH:~/.local/bin
                '''
            }
        }

        stage('Install ChromeDriver') {
            steps {
                sh '''
                # Install chromedriver in user space
                CHROME_VERSION=$(google-chrome --version | awk '{print $3}' | cut -d '.' -f 1)
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
                # Run tests using user-space Python
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
