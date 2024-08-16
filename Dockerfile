# Use an ARM-compatible base image with Python 3.9
FROM arm64v8/python:3.9-slim 

# Install dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    nginx \
    vim \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install pipenv and gunicorn
RUN pip install --no-cache-dir pipenv gunicorn

# Install Litestream
RUN curl -L https://github.com/benbjohnson/litestream/releases/download/v0.3.11/litestream-v0.3.11-linux-arm64.tar.gz | tar xz -C /usr/local/bin



# Install Node.js 20 (ARM-compatible)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
# Create and set the working directory
WORKDIR /app

# Copy Pipfile and Pipfile.lock
COPY Pipfile  /app/

# Install Python dependencies via Pipenv
RUN pipenv install 

# Copy the Django application code
COPY mysite litestream.yml /app/


# Copy the entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh


RUN adduser --system --no-create-home --disabled-login --group nginx
# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy SSL certificate and key (Assuming you add them to the Docker context)
COPY ssl/cert.pem /etc/nginx/ssl/cert.pem
COPY ssl/privkey.pem /etc/nginx/ssl/privkey.pem
COPY ssl/cloudflare_root.pem /etc/nginx/ssl/cloudflare_root.pem

# Ensure the SSL directory has the correct permissions
RUN chmod 600 /etc/nginx/ssl/* && chown nginx:nginx /etc/nginx/ssl/*

WORKDIR /app/react-app
RUN npm i
RUN npm run vite-build

# Create and set the working directory
WORKDIR /app
# Collect static files for Django
RUN pipenv run python manage.py collectstatic --noinput

# Expose the ports for Nginx and the app
EXPOSE 443
EXPOSE 80
EXPOSE 8000

# Command to start Nginx, Litestream, and the application
CMD ["/bin/bash", "-c", "nginx && litestream replicate -exec /app/entrypoint.sh -config /app/litestream.yml"]
