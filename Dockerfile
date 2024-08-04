# Use an ARM-compatible base image with Python 3.9
FROM arm64v8/python:3.9-slim

# Install dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install pipenv
RUN pip install --no-cache-dir pipenv gunicorn

# Install Litestream
RUN curl -L https://github.com/benbjohnson/litestream/releases/download/v0.3.11/litestream-v0.3.11-linux-arm64.tar.gz | tar xz -C /usr/local/bin

# Create and set the working directory
WORKDIR /app

# Copy Pipfile and Pipfile.lock
COPY Pipfile  /app/


# Install Python dependencies via Pipenv
RUN pipenv install 


# Copy the entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Copy the Django application code
COPY mysite litestream.yml /app/

RUN pipenv run python manage.py collectstatic

# Expose the port the app runs on
EXPOSE 8000

# Command to start Litestream and monitor the entrypoint script
CMD ["litestream", "replicate", "-exec", "/app/entrypoint.sh", "-config", "/app/litestream.yml"]