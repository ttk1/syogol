#!/bin/bash -eux

npm install
npm run dist

if [[ ! -d tmp ]]; then
  mkdir tmp
fi

rm -rf tmp/*
cp -r public/* tmp
cp -r dist/* tmp

git checkout --force gh-pages
ls -a | grep -E -v '^(\.|\.\.|\.gitignore|\.git|tmp|node_modules|CNAME)$' | xargs rm -r
mv tmp/* .
rm -r tmp

git add -A
git commit -m 'gh-pages deploy'
git push origin gh-pages
