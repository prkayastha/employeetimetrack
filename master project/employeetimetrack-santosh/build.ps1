aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 448346412494.dkr.ecr.us-east-2.amazonaws.com

docker-compose build

docker-compose push