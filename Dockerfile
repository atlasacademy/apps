# stage 1 : prepare the sources
FROM node:13.8.0-alpine3.11 as build

ENV GENERATE_SOURCEMAP false

COPY . /src/apps-master

RUN apk add --no-cache curl \
 && mkdir -p /src \
 && cd /src \
 && curl -L -o fgo-lookup.tar.gz https://github.com/jycl1234/fgo-lookup/archive/master.tar.gz \
 && tar -zxvf fgo-lookup.tar.gz \
 && mkdir -p /app/ && cp -r fgo-lookup-master/dist /app/drop-lookup \
 && cd /src \
 && curl -L -o drop-serializer.tar.gz https://github.com/atlasacademy/drop-serializer-react/archive/master.tar.gz \
 && tar -zxvf drop-serializer.tar.gz \
 && cd drop-serializer-react-master && npm install && npm run build \
 && mkdir -p /app/ && cp -r ./build/ /app/drop-serializer \
 && cd /src \
 && cd apps-master/packages/db && npm install && npm run build \
 && mkdir -p /app/ && cp -r ./build/ /app/db

# stage 2 : copy & fire things up
FROM webdevops/nginx

COPY ./build/no-cache.conf /opt/docker/etc/nginx/vhost.common.d/10-no-cache.conf
COPY ./build/gzip.conf /opt/docker/etc/nginx/conf.d/20-gzip.conf
COPY ./build/db.conf /opt/docker/etc/nginx/vhost.common.d/30-db.conf
COPY ./build/index.html /app/index.html
COPY ./build/robots.txt /app/robots.txt
COPY --from=build /app/ /app/
RUN chown -R 1000:1000 /app
ENV WEB_DOCUMENT_INDEX=index.html
