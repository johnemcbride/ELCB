docker build -t my-django-app .
docker tag my-django-app:latest <repository-uri>:latest
aws ecr get-login-password --region eu-west-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.eu-west-2.amazonaws.com
docker push <repository-uri>:latest
