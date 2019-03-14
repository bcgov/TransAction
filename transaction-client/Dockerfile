FROM node:8.15.1-alpine

COPY . /src

WORKDIR /src

RUN npm install
RUN npm run build

RUN npm install -g serve

CMD serve -s /src/build -l 4000