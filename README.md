# AI自主开发系统 - 任务管理系统

一个基于 **Claude Code + Ralph Wiggum** 的全自动AI开发系统，能够自主完成CRUD应用的开发和E2E测试。

## 项目概述

本项目演示如何构建一个"无限运行"的AI开发系统，让AI能够：
- 自主领取和完成任务
- 编写代码并验证
- 进行端到端测试
- 修复bug直到所有功能正常

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端 | Next.js API Routes + TypeScript |
| 前端 | Vue 3 + Vite + TypeScript |
| 数据库 | SQLite + Prisma ORM |
| E2E测试 | Playwright |
| AI驱动 | Claude Code + Ralph Wiggum |

## 目录结构

```
ai-dev-system/
├── CLAUDE.md          # AI开发规范（员工手册）
├── task.json          # 任务列表
├── progress.txt       # 工作日志
├── init.sh            # 环境初始化脚本
├── start.sh           # 启动脚本
├── backend/           # Next.js API后端
├── frontend/          # Vue 3前端
├── tests/             # Playwright E2E测试
└── docs/              # 文档
```

## 快速开始

### 1. 环境准备

确保已安装：
- Node.js 18+
- npm 9+
- Claude Code CLI

### 2. 初始化环境

```bash
cd ai-dev-system
chmod +x init.sh start.sh
./init.sh
```

### 3. 启动AI开发

#### 方式A：使用 Ralph Wiggum 插件（推荐）

```bash
# 首先安装插件
# 在 Claude Code 中执行：
/plugin install ralph-wiggum@claude-code-plugins

# 启动循环
/ralph-wiggum:ralph-loop "读取CLAUDE.md，按照工作流程完成下一个任务。所有任务完成后在progress.txt中写入__ALL_TASKS_DONE__" --max-iterations 50 --completion-promise "__ALL_TASKS_DONE__"
```

#### 方式B：使用启动脚本

```bash
# 执行单个任务
./start.sh

# 循环执行所有任务
./start.sh --loop

# 查看状态
./start.sh --status
```

#### 方式C：手动执行

```bash
claude "读取CLAUDE.md，完成下一个任务"
```

## 工作流程

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  1.环境  │ -> │  2.领取  │ -> │  3.开发  │ -> │  4.测试  │ -> │  5.记录  │
│   检查   │    │   任务   │    │   代码   │    │   验证   │    │   进度   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
                                      │               │
                                      │               ├─ 通过 → 6.提交 → 循环
                                      │               │
                                      │               └─ 阻塞 → 记录 → 等待人工
                                      │                              │
                                      │<─────────────────────────────┘
```

## 核心文件说明

### CLAUDE.md - AI开发规范

定义了AI的工作流程、代码规范、验证步骤。AI会严格遵循这个文件中的规则。

### task.json - 任务列表

包含36个待完成的任务，每个任务有：
- `id`: 任务编号
- `phase`: 所属阶段
- `title`: 任务标题
- `description`: 详细描述
- `status`: pending/in_progress/completed/blocked
- `priority`: high/medium/low

### progress.txt - 工作日志

记录AI的每一次工作：
- 开始时间
- 完成的任务
- 遇到的问题
- 需要人工介入的事项

## 预期成果

完成后将得到：

1. **后端API** (Next.js)
   - `GET /api/tasks` - 获取任务列表
   - `POST /api/tasks` - 创建任务
   - `GET /api/tasks/:id` - 获取单个任务
   - `PUT /api/tasks/:id` - 更新任务
   - `DELETE /api/tasks/:id` - 删除任务

2. **前端页面** (Vue 3)
   - 任务列表页
   - 任务详情页
   - 创建任务页
   - 响应式布局

3. **E2E测试** (Playwright)
   - CRUD完整流程测试
   - 自动化测试报告

## 注意事项

1. **API配额**: 长时间运行会消耗大量API调用
2. **人工介入**: 遇到阻塞时需要人工处理
3. **代码审查**: 建议人工审查AI生成的代码
4. **测试验证**: 最终需要人工验证功能是否正常

## 参考资料

- [Claude Code 文档](https://docs.anthropic.com/claude/docs/claude-code)
- [Ralph Wiggum 插件](https://github.com/anthropics/claude-code-plugins)
- [claude-quickstarts](https://github.com/anthropics/claude-quickstarts)

## License

MIT
