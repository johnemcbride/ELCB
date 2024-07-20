# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install dependencies
COPY Pipfile Pipfile.lock /app/
RUN apt-get update && apt-get install -y curl && apt-get clean
RUN pip install --upgrade pip
RUN pip install pipenv
RUN pipenv install --deploy --ignore-pipfile

# Install Litestream
RUN curl -L https://github.com/benbjohnson/litestream/releases/download/v0.3.9/litestream-v0.3.9-linux-arm64.tar.gz | tar xz -C /usr/local/bin


# Copy project
COPY mysite /app/
# Copy Litestream configuration file
COPY litestream.yml /etc/litestream.yml
COPY run.sh /app/
RUN chmod +x /app/run.sh
RUN pipenv run python manage.py collectstatic --noinput
# Expose port 8000
EXPOSE 8000

# Run the Litestream and Django development server
CMD ["/app/run.sh"]

