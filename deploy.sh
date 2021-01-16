#!/usr/bin/env bash
set -e
npm run build
cd dist
touch .nojekyll
git init
git add -A
git commit -m 'deploy'
git push -f "https://gitee.com/anitt/anx-iview-admin.git" master:ay-pages
start "https://gitee.com/anitt/anx-iview-admin/pages"
git push -f "https://github.com/Anyi0958/anx-iview-admin.git" master:ay-pages
cd -
exec /bin/bash

