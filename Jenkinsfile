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

    stage('📦 Restore MongoDB (แบบทีละไฟล์)') {
        steps {
            script {
            dir('dump/mydb') {
                bat '''
                echo 🔍 ตรวจสอบไฟล์ .bson ที่จะ restore...
                dir *.bson

                echo 🔥 เริ่ม Restore ทีละ Collection...
                docker run --rm ^
                    -v mongo_data:/data/db ^
                    -v "%CD%:/dump" ^
                    mongo ^
                    sh -c "for file in /dump/*.bson; do \
                    name=$(basename $file .bson); \
                    echo Restoring $name...; \
                    mongorestore --host=mongo --port=27017 --db=mydb --collection=$name --drop $file; \
                    done"
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
