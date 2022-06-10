#!/usr/bin/env bash

CI=false \
&& mkdir -p src \
&& cd src \
&& curl -L -o fgo-lookup.tar.gz https://github.com/jycl1234/fgo-lookup/archive/master.tar.gz \
&& tar -zxvf fgo-lookup.tar.gz \
&& cd .. \
&& mkdir -p app \
&& cp -r src/fgo-lookup-master/dist app/drop-lookup \
&& cd src \
&& curl -L -o drop-serializer.tar.gz https://github.com/atlasacademy/drop-serializer-react/archive/master.tar.gz \
&& tar -zxvf drop-serializer.tar.gz \
&& npm install -g npm@8 \
&& cd drop-serializer-react-master && npm ci && npm run build \
&& cd ../../ && cp -r src/drop-serializer-react-master/build/ app/drop-serializer \
&& cd src \
&& curl -L -o bingo.tar.gz https://github.com/atlasacademy/bingo/archive/master.tar.gz \
&& tar -zxvf bingo.tar.gz \
&& cd ../ && cp -r ./src/bingo-master app/bingo \
&& cd src \
&& curl -L -o chargers.tar.gz https://github.com/atlasacademy/chargers/archive/main.tar.gz \
&& tar -zxvf chargers.tar.gz \
&& cd chargers-main && npm ci && npm run build \
&& cd ../../ && cp -r src/chargers-main/out/ app/chargers \
&& lerna bootstrap --ci \
&& cd packages/db && npm run build \
&& cd ../../ && cp -r packages/db/build/ app/db \
&& cd packages/paper-moon && npm run build \
&& cd ../../ && cp -r packages/paper-moon/build/ app/paper-moon \
&& cp build/index.html app/index.html \
&& cp build/_redirects app/_redirects \
&& cp build/robots.txt app/robots.txt \
&& cp packages/db/public/favicon.ico app/favicon.ico
