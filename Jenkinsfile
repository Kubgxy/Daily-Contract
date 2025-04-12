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

    stage('♻️ Cleanup Old Containers') {
      steps {
        echo '🧹 Cleanup container เก่าก่อนเริ่มใหม่'
        bat 'docker-compose down --remove-orphans || echo "✅ ไม่มี container เก่า"'
      }
    }

    stage('🚀 Start MongoDB') {
      steps {
        echo '🚀 Starting MongoDB container...'
        bat 'docker-compose up -d mongo'
      }
    }

    stage('🔥 Restore MongoDB เฉพาะตอนที่ไม่มีข้อมูล') {
      steps {
        script {
          echo '⏳ กำลังรอให้ MongoDB พร้อม...'

          // ✅ loop รอจน Mongo พร้อม
          def ready = false
          for (int i = 0; i < 10; i++) {
            def status = bat(script: '''
              docker exec mongo mongosh --quiet --eval "db.adminCommand('ping')"
            ''', returnStatus: true)

            if (status == 0) {
              ready = true
              echo '✅ MongoDB พร้อมแล้ว!'
              break
            } else {
              echo "❌ MongoDB ยังไม่พร้อม (รอรอบที่ ${i + 1})"
              sleep(time: 3, unit: 'SECONDS')
            }
          }

          if (!ready) {
            error('💥 MongoDB ไม่พร้อมใช้งานในเวลาที่กำหนด')
          }

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

    stage('📦 Install Dependencies') {
      parallel {
        stage('Frontend') {
          steps {
            dir('frontend') {
              bat 'npm install'
            }
          }
        }
        stage('Dashboard') {
          steps {
            dir('dashboard') {
              bat 'npm install'
            }
          }
        }
        stage('Backend') {
          steps {
            dir('backend') {
              bat 'npm install'
            }
          }
        }
      }
    }

    stage('🔍 Lint Code') {
      parallel {

        stage('Frontend Lint') {
          steps {
            dir('frontend') {
              catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                echo '🚨 เริ่มตรวจสอบ Lint โค้ดฝั่ง Frontend'
                bat 'npx eslint .'
              }
            }
          }
        }

        stage('Backend Lint') {
          steps {
            dir('backend') {
              catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                echo '🚨 เริ่มตรวจสอบ Lint โค้ดฝั่ง Backend'
                bat 'npx eslint .'
              }
            }
          }
        }
      }
    }

    stage('🧪 Run Tests') {
      parallel {
        stage('Frontend Test') {
          steps {
            dir('frontend') {
              bat 'echo "🧪 ยังไม่มี Frontend test"'
            }
          }
        }
        stage('Dashboard Test') {
          steps {
            dir('dashboard') {
              bat 'echo "🧪 ยังไม่มี Dashboard test"'
            }
          }
        }
        stage('Backend Test') {
          steps {
            dir('backend') {
              bat 'echo "🧪 ยังไม่มี Backend test"'
            }
          }
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
        bat 'docker-compose build'
      }
    }

    stage('🚀 Run Docker Services') {
      steps {
        bat 'docker-compose up -d'
      }
    }

    stage('🤖 Run Robot Framework') {
      steps {
        bat '''
          set PATH=C:\\Users\\TigerDev\\AppData\\Local\\Programs\\Python\\Python313\\Scripts;%PATH%
          robot --outputdir results tests\\FrontEndTest.robot
        '''
      }
    }

  } // end stages

post {
  always {
    node('') { // หรือใช้ label ที่ใช้งานจริง เช่น node('master') หรือ node('windows')
      echo '📦 สร้างรายงาน Robot Framework'
      robot outputPath: 'results'
      bat 'xcopy /Y /S /I results D:\\SPU\\Daily-Contract\\results'
    }
  }

  success {
    node('') {
      powershell '''
        $message = @{
          content = "✅ Build สำเร็จแล้ว! เย้ดีใจสุด ๆ 🚀🎉\\n📦 โปรเจค: Daily-Contract\\n🔁 เวลา: $(Get-Date -Format 'HH:mm:ss')"
        } | ConvertTo-Json -Depth 10
        Invoke-RestMethod -Uri "https://discordapp.com/api/webhooks/1360721938003263538/w-d79xvOtQC0gn4PN4N2NYuF-Td9ub2fNvFQPtzuYSuLtDp1iP6x4nyAwgokPkKeXVx8" -Method Post -Body $message -ContentType "application/json"
      '''
    }
  }

  failure {
    node('') {
      powershell '''
        $message = @{
          content = "❌ Build ล้มเหลว - รีบตรวจสอบด่วน! 🔥\\n📦 โปรเจค: Daily-Contract\\n🕒 เวลา: $(Get-Date -Format 'HH:mm:ss')"
        } | ConvertTo-Json -Depth 10
        Invoke-RestMethod -Uri "https://discordapp.com/api/webhooks/1360721938003263538/w-d79xvOtQC0gn4PN4N2NYuF-Td9ub2fNvFQPtzuYSuLtDp1iP6x4nyAwgokPkKeXVx8" -Method Post -Body $message -ContentType "application/json"
      '''
    }
  }
}
  
}