#!/bin/bash

# ============================================
# AI开发系统 - 环境初始化脚本
# ============================================

set -e

echo "============================================"
echo "   AI开发系统 - 环境初始化"
echo "============================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${YELLOW}[1/6] 检查Node.js环境...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}错误: Node.js未安装，请先安装Node.js 18+${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js版本: $NODE_VERSION${NC}"

echo ""
echo -e "${YELLOW}[2/6] 检查npm环境...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}错误: npm未安装${NC}"
    exit 1
fi
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm版本: $NPM_VERSION${NC}"

echo ""
echo -e "${YELLOW}[3/6] 创建必要的目录结构...${NC}"
mkdir -p backend frontend tests docs
echo -e "${GREEN}✓ 目录结构已创建${NC}"
echo "  - backend/  (Next.js API)"
echo "  - frontend/ (Vue 3)"
echo "  - tests/    (Playwright)"
echo "  - docs/     (文档)"

echo ""
echo -e "${YELLOW}[4/6] 初始化Git仓库...${NC}"
if [ ! -d ".git" ]; then
    git init
    echo -e "${GREEN}✓ Git仓库已初始化${NC}"
else
    echo -e "${GREEN}✓ Git仓库已存在${NC}"
fi

echo ""
echo -e "${YELLOW}[5/6] 创建.gitignore文件...${NC}"
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
dist/
build/
.next/
out/

# Testing
coverage/
test-results/
playwright-report/

# Environment
.env
.env.local
.env.*.local

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Database
*.db
*.db-journal
prisma/*.db

# Misc
.claude/
EOF
echo -e "${GREEN}✓ .gitignore已创建${NC}"

echo ""
echo -e "${YELLOW}[6/6] 创建启动脚本...${NC}"
chmod +x start.sh 2>/dev/null || true
echo -e "${GREEN}✓ 启动脚本已准备${NC}"

echo ""
echo "============================================"
echo -e "${GREEN}   环境初始化完成！${NC}"
echo "============================================"
echo ""
echo "接下来请运行："
echo ""
echo "  方式1 - 使用Ralph Wiggum插件（推荐）："
echo "    /ralph-wiggum:ralph-loop \"读取CLAUDE.md，完成下一个任务\" --max-iterations 50 --completion-promise \"__ALL_TASKS_DONE__\""
echo ""
echo "  方式2 - 使用start.sh脚本："
echo "    ./start.sh"
echo ""
echo "  方式3 - 手动执行："
echo "    claude \"读取CLAUDE.md，完成下一个任务\""
echo ""
