#!/usr/bin/env sh

ADDITIONAL_PARAMS=""

if [ -n "$GITHUB_PAGE" ]; then
  ADDITIONAL_PARAMS="$ADDITIONAL_PARAMS --public-path=/mansfield/"
fi

bun build ./src/index.html \
  --outdir=dist \
  --sourcemap \
  --target=browser \
  --minify \
  --define:process.env.NODE_ENV='\"production\"' \
  --env='BUN_PUBLIC_*' \
  $ADDITIONAL_PARAMS
cp -r ./public ./dist/
cp ./public/sw.js ./dist/
cp ./public/manifest.json ./dist/
