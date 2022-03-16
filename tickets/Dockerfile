FROM node:16-alpine as build

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-alpine

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN ls
COPY --from=build /app/build ./build
RUN npm install --only=prod

CMD ["npm", "start"]
