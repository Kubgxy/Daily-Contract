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

    stage('🔥 Restore MongoDB เฉพาะตอนที่ไม่มีข้อมูล') {
      steps {
        script {
          echo '🔎 ตรวจสอบว่า collection Employee มีข้อมูลหรือไม่...'

          def result = bat(script: '''
            docker exec mongo mongosh --quiet --eval "db.getSiblingDB('mydb').Employee.countDocuments()"
          ''', returnStdout: true).trim()

          if (result == "0") {
            echo '⚠️ ไม่พบข้อมูล → เริ่มทำการ restore...'

            dir('dump/mydb') {
              bat '''
                FOR %%f IN (*.bson) DO (
                  SET name=%%~nf
                  echo 🔁 กำลัง Restore collection %%~nf ...
                  docker cp %%f mongo:/tmp/%%f
                  docker exec mongo mongorestore --db=mydb --collection=%%~nf --drop /tmp/%%f
                )
              '''
            }
            echo '✅ Restore สำเร็จเรียบร้อย!'
          } else {
            echo "✅ ข้อมูลมีอยู่แล้ว (${result} records) → ข้ามการ restore ไป"
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

    stage('🤖 Run Robot Framework') {
      steps {
        bat '''
          set PATH=C:\\Users\\TigerDev\\AppData\\Local\\Programs\\Python\\Python313\\Scripts;%PATH%
          robot --outputdir D:\\SPU\\Daily-Contract\\results tests\\FrontEndTest.robot
        '''
      }
    }
  }

  post {
    always {
      robot outputPath: 'results'
      echo '🎉 Jenkins Pipeline Completed!'
    }
  }
}
