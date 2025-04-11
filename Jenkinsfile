pipeline {
  agent any

  environment {
    VOLUME_NAME = "mongo_data"
    DUMP_PATH = "${WORKSPACE}/dump/mydb"
    DB_NAME = "mydb"
  }

  stages {
    stage('📥 Clone Repository') {
      steps {
        checkout scm
      }
    }

    stage('📦 Check MongoDB Volume') {
      steps {
        script {
          def volumeExists = bat(script: "docker volume ls | findstr ${VOLUME_NAME}", returnStatus: true) == 0
          if (!volumeExists) {
            echo "🆕 Creating volume: ${VOLUME_NAME}"
            bat "docker volume create ${VOLUME_NAME}"
            echo "🧠 Restoring MongoDB from dump..."
            bat """
              docker run --rm ^
                -v ${VOLUME_NAME}:/data/db ^
                -v ${DUMP_PATH}:/dump ^
                mongo ^
                mongorestore --drop --db ${DB_NAME} /dump
            """
          } else {
            echo "✅ MongoDB volume '${VOLUME_NAME}' already exists. Skipping restore."
          }
        }
      }
    }

    stage('📥 Install Frontend') {
      steps {
        dir('frontend') {
          bat 'npm install'
        }
      }
    }

    stage('📥 Install Dashboard') {
      steps {
        dir('dashboard') {
          bat 'npm install'
        }
      }
    }

    stage('📥 Install Backend') {
      steps {
        dir('backend') {
          bat 'npm install'
        }
      }
    }

    stage('🧪 Test Frontend') {
      steps {
        dir('frontend') {
          bat 'echo "No frontend test yet"'
        }
      }
    }

    stage('🧪 Test Dashboard') {
      steps {
        dir('dashboard') {
          bat 'echo "No dashboard test yet"'
        }
      }
    }

    stage('🧪 Test Backend') {
      steps {
        dir('backend') {
          bat 'echo "No backend test yet"'
        }
      }
    }

    stage('⚙️ Prepare .env Files') {
      steps {
        dir('frontend') {
          bat 'copy .env.example .env'
        }
        dir('dashboard') {
          bat 'copy .env.example .env'
        }
        dir('backend') {
          bat 'copy .env.example .env'
        }
      }
    }

    stage('🐳 Build Docker Images') {
      steps {
        dir('.') {
          bat 'docker-compose build'
        }
      }
    }

    stage('🚀 Run Docker Services') {
      steps {
        dir('.') {
          bat 'docker-compose up -d'
        }
      }
    }

    stage('🤖 Run Robot Framework Tests') {
      steps {
        bat 'robot tests\\FrontEndTest.robot'
      }
    }
  }

  post {
    always {
      echo '🎉 Jenkins Pipeline Completed!'
    }
  }
}
