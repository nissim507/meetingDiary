pipeline {
    agent any

    environment {
        PATH = "${env.WORKSPACE}/.local/bin:${env.PATH}"
        CHROME_BIN = "${env.WORKSPACE}/chrome/headless-chrome"
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
                mkdir -p ~/.local/bin
                python3 -m pip install --user --upgrade pip --break-system-packages
                python3 -m pip install --user -r requirements.txt --break-system-packages
                '''
            }
        }

        stage('Install Headless Chrome') {
            steps {
                sh '''
                mkdir -p chrome
                cd chrome
                # Download headless Chrome portable
                wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
                ar x google-chrome-stable_current_amd64.deb
                tar -xf data.tar.xz
                # Move chrome binary to workspace folder
                mv ./opt/google/chrome/google-chrome ./headless-chrome
                chmod +x ./headless-chrome
                cd ..
                '''
            }
        }

        stage('Install ChromeDriver') {
            steps {
                sh '''
                mkdir -p ~/.local/bin
                # Use webdriver-manager to download matching ChromeDriver
                python3 -m webdriver_manager.chrome > /dev/null
                '''
            }
        }

        stage('Run Selenium Tests') {
            steps {
                sh '''
                export PATH=$PATH:~/.local/bin
                export CHROME_BIN=${CHROME_BIN}
                python3 -m pytest tests/ --headless
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
