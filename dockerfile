# Creates the weaviate-class-updater.
#
# You can access the container using:
#   docker run -it -v ./data:/app/data weaviate-class-updater sh
# To start it stand-alone:
#   docker run -it -v ./data:/app/data weaviate-class-updater

FROM node:18-alpine as builder
RUN mkdir -p ./code
COPY package.json /code/package.json
WORKDIR /code
RUN npm i
COPY ./tsconfig.json .
COPY ./src ./src
RUN npm run build

FROM node:18-alpine
RUN mkdir -p /app
WORKDIR /app
COPY --from=builder /code/dist .
COPY package.json ./package.json
RUN npm i --only=prod
CMD ["node", "index.mjs"]
