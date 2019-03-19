FROM node:8.15.1-alpine as build-stage

COPY . /src

WORKDIR /src

RUN npm install
RUN npm run build


FROM nginx:1.15.9-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /src/build /usr/share/nginx/html

EXPOSE 4000

CMD ["nginx", "-g", "daemon off;"]