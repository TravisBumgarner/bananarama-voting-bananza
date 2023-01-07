FROM node:16

WORKDIR /app

COPY ./package*.json ./
COPY ./tsconfig.json ./
COPY ./src ./src

RUN yarn install
RUN yarn run bundle

EXPOSE 8080

# https://maximorlov.com/process-signals-inside-docker-containers/
CMD ["node", "build/index.js"] 