#!/usr/bin/env bash
set -e
npm run build
cd anx
touch .nojekyll
git init
git add -A
git commit -m 'deploy'
git push -f "https://gitee.com/anitt/anx-iview-admin.git" master:anx-pages
start "https://gitee.com/anitt/anx-iview-admin/pages"
git push -f "https://github.com/Anyi0958/anx-iview-admin.git" master:anx-pages
cd -
exec /bin/bash

