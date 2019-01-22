###############################################################################
# Step 1 : Builder image
#
FROM node:11

# Set Node environtment
#ENV NODE_ENV=development

# Switch to working directory
WORKDIR /home/node/app

# Copy contents of local folder to `WORKDIR`
COPY . .

# Install dependencies from package.json
RUN npm install --silent

# Expose port from container so host can access 1337
EXPOSE 1337