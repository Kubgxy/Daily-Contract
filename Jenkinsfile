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
            def exists = bat(script: "docker volume ls | findstr mongo_data", returnStatus: true) == 0
            if (!exists) {
                echo "🆕 Creating volume mongo_data"
                bat "docker volume create mongo_data"
            }

            // ตรวจว่ามีไฟล์ใน volume หรือไม่
            def checkData = bat(
                script: '''docker run --rm ^
                -v mongo_data:/data/db ^
                alpine sh -c "ls -A /data/db | findstr ."
                ''',
                returnStatus: true
            )

            if (checkData != 0) {
                echo "🧠 Volume ว่างอยู่ → กำลัง restore MongoDB..."
                bat '''
                docker run --rm ^
                    -v mongo_data:/data/db ^
                    -v "%WORKSPACE%/dump/mydb:/dump" ^
                    mongo ^
                    mongorestore --dir=/dump --nsInclude=mydb.* --drop
                '''
                echo "✅ MongoDB restore completed."
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
