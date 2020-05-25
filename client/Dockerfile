FROM node:8-alpine AS build

COPY . /src

WORKDIR /src

RUN npm install
RUN npm run build

FROM nginx:1.15.10-alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./env2js.sh /env2js.sh
COPY --from=build /src/build /usr/share/nginx/html

RUN chmod +x /env2js.sh
RUN chmod +w /usr/share/nginx/html/js/env.config.js

EXPOSE 8080

CMD /env2js.sh > /usr/share/nginx/html/js/env.config.js && nginx -g "daemon off;"