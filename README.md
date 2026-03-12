# AI 自动化开发框架

基于 Claude Code 的自动化开发框架，通过任务驱动的方式让 AI 自动完成软件开发工作。

## 特性

- **任务驱动**: 通过 `task.json` 定义任务列表，AI 按顺序自动执行
- **流程控制**: 严格的工作流程确保代码质量
- **自动测试**: 集成 Playwright MCP 进行 E2E 测试
- **进度追踪**: 自动记录开发进度到 `progress.txt`
- **Git 集成**: 自动提交代码，保持版本历史

## 快速开始

### 1. 安装依赖

确保已安装：
- Node.js 18+
- npm 9+
- Claude Code CLI

### 2. 配置 MCP 工具

参考 [docs/MCP-REQUIREMENTS.md](docs/MCP-REQUIREMENTS.md) 配置必要的 MCP 工具。

### 3. 定义任务

编辑 `task.json` 文件，定义你的开发任务：

```json
[
  {
    "id": 1,
    "title": "初始化项目",
    "description": "创建项目基础结构",
    "status": "pending"
  },
  {
    "id": 2,
    "title": "创建数据模型",
    "description": "定义数据库模型",
    "status": "pending"
  }
]
```

### 4. 启动自动化开发

```bash
# 添加执行权限
chmod +x start.sh

# 单次执行模式
./start.sh

# 循环执行模式（推荐）
./start.sh --loop

# 查看状态
./start.sh --status
```

## 项目结构

```
.
├── CLAUDE.md              # AI 开发规范和工作流程
├── README.md              # 项目说明文档
├── start.sh               # 启动脚本
├── task.json              # 任务列表
├── progress.txt           # 开发进度日志
└── docs/
    └── MCP-REQUIREMENTS.md # MCP 工具需求文档
```

## 工作流程

1. **环境检查** - 验证开发环境
2. **领取任务** - 从 task.json 获取下一个待处理任务
3. **开发代码** - AI 根据任务描述编写代码
4. **测试验证** - 运行 lint、build、E2E 测试
5. **记录进度** - 更新 progress.txt
6. **提交代码** - 自动 git commit

## MCP 工具

本项目推荐使用以下 MCP 工具：

| 工具 | 用途 |
|------|------|
| Playwright | E2E 测试、浏览器操作 |
| Web Search | 搜索技术文档 |
| Context7 | 查询库/框架文档 |

详细配置请参考 [docs/MCP-REQUIREMENTS.md](docs/MCP-REQUIREMENTS.md)

## 自定义

### 修改技术栈

编辑 `CLAUDE.md` 中的技术栈部分，根据你的项目需求调整。

### 修改工作流程

`CLAUDE.md` 定义了 AI 的工作流程，可以根据需要调整各个阶段的检查项。

### 添加新的执行模式

编辑 `start.sh` 添加新的执行模式。

## 注意事项

1. **首次使用**: 确保 `start.sh` 有执行权限 (`chmod +x start.sh`)
2. **MCP 配置**: 确保 Claude Code 已配置必要的 MCP 工具
3. **任务状态**: 任务状态包括 `pending`、`in_progress`、`completed`、`blocked`
4. **人工介入**: 当任务状态为 `blocked` 时，需要人工处理后才能继续

## 许可证

MIT
