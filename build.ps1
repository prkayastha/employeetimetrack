aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/e8v1z8c7

docker-compose build

docker-compose push