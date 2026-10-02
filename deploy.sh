#!/bin/bash
# Loky 网站一键部署：构建 + 上传到阿里云服务器（106.14.136.194）
# 用法：在项目目录里执行  ./deploy.sh
set -e
cd "$(dirname "$0")"

echo "→ 构建中..."
npm run build

echo "→ 上传到服务器..."
scp -r -o BatchMode=yes dist/* root@106.14.136.194:/var/www/lokykkxx/

echo "✅ 部署完成：http://106.14.136.194/"
