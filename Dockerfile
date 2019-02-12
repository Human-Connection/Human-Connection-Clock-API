FROM node:11

# Set Node environtment
#ENV NODE_ENV=development

# Switch to working directory
WORKDIR /home/node/coc-api

# Copy contents of local folder to `WORKDIR`
COPY . .

# Install npm packages globally
RUN npm install --global nodemon db-migrate db-migrate-mysql wait-on

# Install dependencies from package.json
RUN npm install --quiet --no-warnings

# Expose port from container so host can access 1337
EXPOSE 1337
