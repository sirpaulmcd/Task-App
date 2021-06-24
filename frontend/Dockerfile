# This base image because 14.16 and stretch are current LTS
# And 'slim' to use just essentials for running node
FROM node:14.16.0-stretch-slim
# Switch user to non-root provided by base
USER node
# Make dir as user so it is owned by user
RUN mkdir /home/node/frontend
# Change working directory
WORKDIR /home/node/frontend
# Copy over and change ownership to package.json to run npm install
COPY --chown=node:node package*.json ./
# Establish NODE_ENV argument (passed in my docker-compose)
ARG NODE_ENV
# If NODE_ENV is set to `production` only prod dependencies are installed
ENV NODE_ENV ${NODE_ENV}
# Install dependencies
RUN npm install
# Run frontend (command overridden by docker-compose)
CMD ["npm", "start"]
