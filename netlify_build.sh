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
&& cd drop-serializer-react-master \
&& npm install \
&& npm run build \
&& cd ../../ \
&& cp -r src/drop-serializer-react-master/build/ app/drop-serializer \
&& cd packages/db \
&& npm install \
&& npm run build \
&& cd ../../ \
&& cp -r packages/db/build/ app/db \
&& cp build/index.html app/index.html \
&& cp build/_redirects app/_redirects
