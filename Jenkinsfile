pipeline {
    agent any
    environment { 
        gitUser = 'tiewwa_haha@hotmail.com'
        gitUrl = 'http://git.pnpsw.com/training/trainAPI.git'
        imageName = 'train-api.pnpsw.com'
        port = 9590
        net = 'appdocker_default'
    }
    stages {

        stage('checkout'){
            steps {
                git branch: 'master',
                credentialsId: env.gitUser,
                url: env.gitUrl
            }
        }

         stage('build'){
            steps {
                sh "docker build -t ${env.imageName} ."
            }
        }

        stage('stop service'){
            steps {
                script {
                    try {
                        sh "docker stop ${env.imageName}"
                        sh "docker rm ${env.imageName}"
                        echo "stop ${env.imageName}"
                    }
                    catch ( e ) {
                        echo "service ${env.imageName} not running"
                    }
                }
            }  
        }
        stage('start'){
            steps{
                sh "docker run -d -e TZ=Asia/Bangkok --name ${env.imageName} -p ${port}:${port} --net=${env.net} -v /root/project/train/uploads:/uploads --restart=always ${env.imageName}"
            }
        }
    }
}
