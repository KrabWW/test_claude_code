# AI自主开发系统 - 任务管理系统

> 一个基于 **Claude Code + Ralph Wiggum** 的全自动AI开发系统，能够自主完成CRUD应用的开发和E2E测试。

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
├── task.json          # 任务列表（36个任务）
├── progress.txt       # 工作日志
├── init.sh            # 环境初始化脚本
├── start.sh           # 启动脚本
├── README.md          # 项目说明
├── backend/           # Next.js API后端
├── frontend/          # Vue 3前端
├── tests/             # Playwright E2E测试
└── docs/              # 文档
```

---

## 快速开始

### 1. 环境准备

确保已安装：
- Node.js 18+
- npm 9+
- Claude Code CLI

### 2. 克隆项目

```bash
git clone https://github.com/KrabWW/test_claude_code.git
cd test_claude_code
```

### 3. 初始化环境

```bash
chmod +x init.sh start.sh
./init.sh
```

---

## 执行方式

### 方式一：Ralph Wiggum 插件（推荐）

**优点：** 自动迭代、智能退出、最省心

**步骤：**

1. 在 Claude Code 中安装 Ralph Wiggum 插件：
```
/plugin install ralph-wiggum@claude-code-plugins
```

2. 启动自动开发循环：
```
/ralph-wiggum:ralph-loop "读取CLAUDE.md，按照工作流程完成下一个任务。所有任务完成后在progress.txt中写入__ALL_TASKS_DONE__" --max-iterations 50 --completion-promise "__ALL_TASKS_DONE__"
```

**参数说明：**
- `--max-iterations 50`：最多迭代50轮（保险丝）
- `--completion-promise "__ALL_TASKS_DONE__"`：当输出这个标记时停止

---

### 方式二：启动脚本

**优点：** 灵活控制、可查看状态

**命令：**

```bash
# 执行单个任务
./start.sh

# 循环执行所有任务（最多50轮）
./start.sh --loop

# 查看当前任务状态
./start.sh --status

# 显示帮助
./start.sh --help
```

**输出示例：**
```
╔══════════════════════════════════════════╗
║        AI开发系统 - 任务管理系统          ║
╠══════════════════════════════════════════╣
║  技术栈:                                 ║
║  - 后端: Next.js API Routes + TypeScript ║
║  - 前端: Vue 3 + Vite + TypeScript        ║
║  - 数据库: SQLite + Prisma                ║
║  - 测试: Playwright E2E                   ║
╚══════════════════════════════════════════╝

=== 当前任务状态 ===
  📋 待处理: 36
  🔄 进行中: 0
  ⚠️  阻塞: 0
  ✅ 已完成: 0
```

---

### 方式三：手动执行

**优点：** 完全控制、适合调试

**命令：**

```bash
# 每次执行一个任务
claude "读取CLAUDE.md，完成下一个任务"

# 或者在 Claude Code 中直接对话
# 说："请读取CLAUDE.md，完成下一个任务"
```

**适用场景：**
- 调试某个特定任务
- 人工监督每一步
- 学习AI开发流程

---

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

### 阶段说明

| 阶段 | 说明 | 验证 |
|------|------|------|
| 1.环境检查 | 确认目录和依赖 | `node -v && npm -v` |
| 2.领取任务 | 从task.json取pending任务 | 状态改为in_progress |
| 3.开发代码 | 根据描述编写代码 | 代码完成 |
| 4.测试验证 | lint + build + 浏览器测试 | 全部通过 |
| 5.记录进度 | 更新progress.txt和task.json | 状态改为completed |
| 6.提交代码 | git commit | 提交成功 |

---

## 核心文件说明

### CLAUDE.md - AI开发规范

定义了AI的工作流程、代码规范、验证步骤。**AI会严格遵循这个文件中的规则。**

### task.json - 任务列表

包含36个待完成的任务，每个任务有：
- `id`: 任务编号
- `phase`: 所属阶段
- `title`: 任务标题
- `description`: 详细描述
- `status`: pending / in_progress / completed / blocked
- `priority`: high / medium / low

### progress.txt - 工作日志

记录AI的每一次工作：
- 开始时间
- 完成的任务
- 遇到的问题
- 需要人工介入的事项

---

## 预期成果

完成后将得到：

### 1. 后端API (Next.js)
- `GET /api/tasks` - 获取任务列表
- `POST /api/tasks` - 创建任务
- `GET /api/tasks/:id` - 获取单个任务
- `PUT /api/tasks/:id` - 更新任务
- `DELETE /api/tasks/:id` - 删除任务

### 2. 前端页面 (Vue 3)
- 任务列表页
- 任务详情页
- 创建任务页
- 响应式布局

### 3. E2E测试 (Playwright)
- CRUD完整流程测试
- 自动化测试报告

---

## 遇到阻塞时

当AI遇到无法自动解决的问题时（如需要API密钥），会在progress.txt中记录：

```
--- 2026-03-12 10:30:00 ---
任务 #5：配置Supabase数据库
状态：⚠️ 阻塞
原因：需要Supabase项目的API Key
需要帮助：
  1. 打开 https://supabase.com
  2. 创建新项目
  3. 复制 API Key
  4. 将 API Key 告诉我
```

你需要按照指引操作，然后告诉AI密钥，它会继续工作。

---

## 注意事项

1. **API配额**: 长时间运行会消耗大量API调用
2. **人工介入**: 遇到阻塞时需要人工处理
3. **代码审查**: 建议人工审查AI生成的代码
4. **测试验证**: 最终需要人工验证功能是否正常

---

## 参考资料

- [Claude Code 文档](https://docs.anthropic.com/claude/docs/claude-code)
- [Ralph Wiggum 插件](https://github.com/anthropics/claude-code-plugins)
- [claude-quickstarts](https://github.com/anthropics/claude-quickstarts)

## License

MIT
