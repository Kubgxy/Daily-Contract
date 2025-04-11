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

    stage('🚀 Start MongoDB') {
      steps {
        script {
          echo '🚀 Starting MongoDB container...'
          bat 'docker-compose up -d mongo'
        }
      }
    }

    stage('🔥 Restore MongoDB (จากใน container จริง)') {
      steps {
        script {
          echo '🧪 ตรวจสอบไฟล์ .bson ที่จะ restore...'

          dir('dump/mydb') {
            bat '''
              echo 🔥 เริ่ม Restore ใน container 'mongo' ที่มีอยู่...

              FOR %%f IN (*.bson) DO (
                SET name=%%~nf
                echo 🔁 Restoring collection %%~nf ...
                docker cp %%f mongo:/tmp/%%f
                docker exec mongo mongorestore --db=mydb --collection=%%~nf --drop /tmp/%%f
              )

              echo ✅ Restore เสร็จสมบูรณ์แล้ว
            '''
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
