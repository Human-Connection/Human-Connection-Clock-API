FROM node:11

# Set Node environtment
#ENV NODE_ENV=development

# Switch to working directory
WORKDIR /home/node/coc-api

# Copy contents of local folder to `WORKDIR`
COPY . .

# Install nodemon globally
RUN npm install --global nodemon db-migrate db-migrate-mysql

# Install dependencies from package.json
RUN npm install --quiet --no-warnings

# Expose port from container so host can access 1337
EXPOSE 1337
