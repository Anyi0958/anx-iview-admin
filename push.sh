#!/usr/bin/env bash
set -e
git init
git add -A
git commit -m 'push'
git push -f "https://github.com/Anyi0958/anx-iview-admin.git" master
git push -f "https://gitee.com/anitt/anx-iview-admin.git" master
exec /bin/bash
