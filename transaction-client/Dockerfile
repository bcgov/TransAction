# FROM node:8.15.1-alpine as build-stage

# COPY . /src

# WORKDIR /src

# RUN npm install
# RUN npm run build


#FROM nginx:1.15.9-alpine
FROM openshift-nginx

#COPY nginx.conf /etc/nginx/conf.d/default.conf
#COPY nginx.conf /etc/nginx/nginx.conf
#COPY --from=build-stage /src/build /var/www/html
COPY ./build /usr/share/nginx/html

#EXPOSE 8080

CMD nginx -g "daemon off;"
