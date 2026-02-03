pipeline {
    agent any

    environment {
        VENV_DIR = "${WORKSPACE}/venv"
        PATH = "${VENV_DIR}/bin:${env.PATH}" // use virtual environment python/pip
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
                    # create virtual environment if not exists
                    if [ ! -d "${VENV_DIR}" ]; then
                        python3 -m venv ${VENV_DIR}
                    fi
                    # upgrade pip inside venv
                    ${VENV_DIR}/bin/pip install --upgrade pip
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    ${VENV_DIR}/bin/pip install -r requirements.txt
                '''
            }
        }

        stage('Run Selenium Tests') {
            steps {
                sh '''
                    ${VENV_DIR}/bin/python -m pytest tests/ --disable-warnings
                '''
            }
        }
    }
}
