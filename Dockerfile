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
RUN npm install --quiet

# Expose port from container so host can access 3000
EXPOSE 3000
EXPOSE 1337

# Start the app
#CMD npm start