#!/usr/bin/env bash

set -e

CI=false

mkdir -p src

mkdir -p app/drop-lookup
curl -L -o src/fgo-lookup.tar.gz https://github.com/atlasacademy/fgo-lookup/archive/master.tar.gz
tar -C app/drop-lookup --strip-components=2 -zxvf src/fgo-lookup.tar.gz fgo-lookup-master/dist
npm run build

mkdir -p app/bingo
curl -L -o src/bingo.tar.gz https://github.com/atlasacademy/bingo/archive/master.tar.gz
tar -C app/bingo --strip-components=1 -zxvf src/bingo.tar.gz bingo-master

mkdir -p app/drop-serializer
curl -L -o src/drop-serializer.tar.gz https://github.com/atlasacademy/drop-serializer-react/archive/build.tar.gz
tar -C app/drop-serializer --strip-components=1 -zxvf src/drop-serializer.tar.gz drop-serializer-react-build

# chargers is hosted on Github Pages
# cd src
# curl -L -o chargers.tar.gz https://github.com/atlasacademy/chargers/archive/main.tar.gz
# tar -zxvf chargers.tar.gz
# cd chargers-main && npm ci && npm run build
# cd ../../ && cp -r src/chargers-main/out/ app/chargers

# fgo-docs is hosted on Github Pages

npm ci
npx lerna bootstrap --ci

cd packages/db && npm run build
cd ../../ && cp -r packages/db/build/ app/db

# Don't build paper-moon since it's currently being developed
# cd packages/paper-moon && npm run build
# cd ../../ && cp -r packages/paper-moon/build/ app/paper-moon
mkdir -p app/paper-moon
curl -L -o src/paper-moon.tar.gz https://github.com/atlasacademy/apps/archive/paper-moon-build.tar.gz
tar -C app/paper-moon --strip-components=1 -zxvf src/paper-moon.tar.gz apps-paper-moon-build

cp build/index.html app/index.html
cp build/_redirects app/_redirects
cp build/robots.txt app/robots.txt
cp packages/db/public/favicon.ico app/favicon.ico
