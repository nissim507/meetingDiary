pipeline {
    agent any

    environment {
        PATH = "${env.HOME}/.local/bin:${env.PATH}" // For pip installs
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
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

        stage('Setup Node / Frontend') {
            steps {
                sh '''
                    # Install npm dependencies
                    npm install
                '''
            }
        }

        stage('Run Frontend & Selenium Tests') {
            steps {
                sh '''
                    # Start frontend in background
                    npm run dev &

                    # Get the frontend PID so we can kill it later
                    FRONTEND_PID=$!

                    # Wait until port 5173 is open (frontend ready)
                    echo "Waiting for frontend to start..."
                    for i in {1..20}; do
                        nc -z localhost 5173 && break
                        sleep 1
                    done

                    # Run Selenium tests
                    python3 -m pytest tests/ --maxfail=1 --disable-warnings -q

                    # Kill frontend after tests
                    kill $FRONTEND_PID
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
