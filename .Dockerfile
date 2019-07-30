
FROM postgres
WORKDIR /var/db
COPY ./db ./
# RUN THE PGSQL SERVER

# My SQL
FROM node:alpine
WORKDIR /var/www/
COPY yarn.lock package.json ./
RUN yarn
COPY . ./
RUN yarn production
