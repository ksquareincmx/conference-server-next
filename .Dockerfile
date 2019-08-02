
# START THE PGSQL SERVER
FROM postgres
WORKDIR /var/db
COPY ./db ./

# START conference-server
FROM node:alpine
WORKDIR /var/www/
COPY yarn.lock package.json ./
RUN yarn
COPY . ./
RUN yarn production
