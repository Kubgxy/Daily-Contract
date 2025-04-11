pipeline {
  agent any

  environment {
    VOLUME_NAME = "mongo_data"
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
          def exists = bat(script: "docker volume ls | findstr ${VOLUME_NAME}", returnStatus: true) == 0
          if (!exists) {
            echo "🆕 Creating volume ${VOLUME_NAME}"
            bat "docker volume create ${VOLUME_NAME}"
          }

          def checkData = bat(
            script: '''docker run --rm ^
              -v mongo_data:/data/db ^
              alpine sh -c "ls -A /data/db | findstr ."
            ''',
            returnStatus: true
          )

          if (checkData != 0) {
            echo "🧠 Volume ว่างอยู่ → กำลัง restore MongoDB..."

            // เปลี่ยน dir ไปยังโฟลเดอร์ dump
            dir('dump') {
            bat '''
                echo 📂 DEBUG: Current dir is %CD%
                dir %CD%\\mydb

                docker run --rm ^
                -v mongo_data:/data/db ^
                -v "%CD%\\mydb:/restore" ^
                alpine ^
                sh -c "mkdir -p /data/db/mydb && cp -r /restore/* /data/db/mydb/ && ls -lh /data/db/mydb"
            '''
            }
            echo "✅ MongoDB volume has been restored."
          } else {
            echo "✅ MongoDB volume already has data. Skipping restore."
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
