FROM node:gallium-alpine3.18

# Create app directory
WORKDIR /usr/src/app

# Install OpenSSL
# RUN apt-get update && apt-get install -y openssl

# Install app dependencies
COPY package*.json ./

# Bundle app source
COPY ./ ./

# COPY .env
COPY .env ./

# Install Dependencies
RUN yarn install

EXPOSE 3001

CMD yarn prisma generate && yarn start
