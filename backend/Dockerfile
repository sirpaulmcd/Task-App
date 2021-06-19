# This base image because 14.16 and stretch are current LTS
# And 'slim' to use just essentials for running node
FROM node:14.16.0-stretch-slim
# Create user
USER node
# Make dir as user so it is owned by user
RUN mkdir /home/node/backend
# Change working directory
WORKDIR /home/node/backend
# Copy over and change ownership to package.json to run npm install
COPY --chown=node:node package-lock.json package.json ./
# Like `npm i` but for automated environments
RUN npm ci
# Run backend api in dev mode
CMD ["npm", "run", "dev"]
