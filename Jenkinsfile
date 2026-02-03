pipeline {
    agent any

    environment {
        PATH = "$HOME/.local/bin:$PATH"
    }

    stages {
        stage('Checkout SCM') {
            steps {
                git url: 'https://github.com/nissim507/meetingDiary.git', branch: 'main'
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

        stage('Run Selenium Tests Headless') {
            steps {
                // Run pytest; make sure your tests use headless mode
                sh '''
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
