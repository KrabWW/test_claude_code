#!/bin/bash

# ============================================
# AI开发系统 - 启动脚本
# ============================================
# 使用方法：
#   ./start.sh              # 普通模式，每次执行一个任务
#   ./start.sh --loop       # 循环模式，持续执行直到所有任务完成
#   ./start.sh --ralph      # Ralph Wiggum模式（推荐）
# ============================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 显示Banner
show_banner() {
    echo ""
    echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║        AI开发系统 - 任务管理系统          ║${NC}"
    echo -e "${BLUE}╠══════════════════════════════════════════╣${NC}"
    echo -e "${BLUE}║  技术栈:                                 ║${NC}"
    echo -e "${BLUE}║  - 后端: Next.js API Routes + TypeScript ║${NC}"
    echo -e "${BLUE}║  - 前端: Vue 3 + Vite + TypeScript        ║${NC}"
    echo -e "${BLUE}║  - 数据库: SQLite + Prisma                ║${NC}"
    echo -e "${BLUE}║  - 测试: Playwright E2E                   ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"
    echo ""
}

# 检查是否有待处理的任务
check_pending_tasks() {
    if grep -q '"status": "pending"' task.json 2>/dev/null; then
        return 0  # 有待处理任务
    else
        return 1  # 没有待处理任务
    fi
}

# 显示当前任务状态
show_status() {
    echo -e "${YELLOW}=== 当前任务状态 ===${NC}"
    echo ""

    # 统计各状态任务数
    PENDING=$(grep -c '"status": "pending"' task.json 2>/dev/null || echo "0")
    IN_PROGRESS=$(grep -c '"status": "in_progress"' task.json 2>/dev/null || echo "0")
    BLOCKED=$(grep -c '"status": "blocked"' task.json 2>/dev/null || echo "0")
    COMPLETED=$(grep -c '"status": "completed"' task.json 2>/dev/null || echo "0")

    echo "  📋 待处理: $PENDING"
    echo "  🔄 进行中: $IN_PROGRESS"
    echo "  ⚠️  阻塞: $BLOCKED"
    echo "  ✅ 已完成: $COMPLETED"
    echo ""
}

# 单次执行模式
run_once() {
    show_banner
    show_status

    echo -e "${YELLOW}开始执行下一个任务...${NC}"
    echo ""

    claude --dangerously-skip-permissions "读取CLAUDE.md，按照工作流程完成下一个任务。完成后在progress.txt中记录结果。"

    echo ""
    echo -e "${GREEN}=== 任务执行完成 ===${NC}"
    show_status
}

# 循环执行模式
run_loop() {
    show_banner

    ITERATION=0
    MAX_ITERATIONS=50

    while check_pending_tasks; do
        ITERATION=$((ITERATION + 1))

        if [ $ITERATION -gt $MAX_ITERATIONS ]; then
            echo -e "${RED}达到最大迭代次数 ($MAX_ITERATIONS)，停止执行${NC}"
            exit 0
        fi

        echo ""
        echo -e "${BLUE}════════════════════════════════════════${NC}"
        echo -e "${BLUE}  第 $ITERATION 轮迭代 - $(date '+%Y-%m-%d %H:%M:%S')${NC}"
        echo -e "${BLUE}════════════════════════════════════════${NC}"
        echo ""

        show_status

        claude --dangerously-skip-permissions "读取CLAUDE.md，按照工作流程完成下一个任务。完成后在progress.txt中记录结果。"

        # 检查是否所有任务完成
        if ! check_pending_tasks; then
            echo ""
            echo -e "${GREEN}════════════════════════════════════════${NC}"
            echo -e "${GREEN}  🎉 所有任务已完成！${NC}"
            echo -e "${GREEN}════════════════════════════════════════${NC}"
            echo ""

            # 在progress.txt中标记完成
            echo "" >> progress.txt
            echo "=== 所有任务已完成 ===" >> progress.txt
            echo "完成时间: $(date '+%Y-%m-%d %H:%M:%S')" >> progress.txt
            echo "" >> progress.txt
            echo "__ALL_TASKS_DONE__" >> progress.txt

            exit 0
        fi

        echo ""
        echo -e "${YELLOW}等待5秒后继续下一轮...${NC}"
        sleep 5
    done

    echo -e "${GREEN}没有待处理的任务了${NC}"
}

# Ralph Wiggum模式
run_ralph() {
    show_banner
    echo -e "${YELLOW}启动 Ralph Wiggum 模式...${NC}"
    echo ""
    echo "这个模式需要先安装 Ralph Wiggum 插件："
    echo "  /plugin install ralph-wiggum@claude-code-plugins"
    echo ""
    echo "安装完成后，运行以下命令："
    echo ""
    echo -e "${GREEN}/ralph-wiggum:ralph-loop \"读取CLAUDE.md，按照工作流程完成下一个任务。所有任务完成后在progress.txt中写入__ALL_TASKS_DONE__\" --max-iterations 50 --completion-promise \"__ALL_TASKS_DONE__\"${NC}"
    echo ""
}

# 主逻辑
case "${1:-}" in
    --loop|-l)
        run_loop
        ;;
    --ralph|-r)
        run_ralph
        ;;
    --status|-s)
        show_banner
        show_status
        ;;
    --help|-h)
        show_banner
        echo "使用方法："
        echo "  ./start.sh              # 执行一个任务"
        echo "  ./start.sh --loop       # 循环执行所有任务"
        echo "  ./start.sh --ralph      # 显示Ralph Wiggum使用说明"
        echo "  ./start.sh --status     # 显示当前任务状态"
        echo "  ./start.sh --help       # 显示帮助信息"
        ;;
    *)
        run_once
        ;;
esac
