# MCP (Model Context Protocol) 需求文档

本文档列出了 AI 开发系统推荐的 MCP 工具配置。

---

## 必备 MCP 工具

### 1. Playwright 浏览器自动化 (必备)

**用途**: E2E 测试、浏览器操作、截图验证

**安装配置**:
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-server-playwright"]
    }
  }
}
```

**常用工具**:
- `browser_navigate` - 导航到URL
- `browser_click` - 点击元素
- `browser_fill_form` - 填写表单
- `browser_snapshot` - 获取页面快照
- `browser_take_screenshot` - 截图

---

### 2. Web 搜索 (推荐)

**用途**: 搜索最新技术文档、解决方案

**安装配置**:
```json
{
  "mcpServers": {
    "web-search": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-web-search"]
    }
  }
}
```

---

### 3. Context7 文档查询 (推荐)

**用途**: 获取最新的库/框架文档

**工具列表**:
- `mcp__context7__resolve-library-id` - 解析库ID
- `mcp__context7__query-docs` - 查询文档

**使用示例**:
```
查询 React 最新文档
查询 Next.js API 用法
```

---

### 4. Web Reader (推荐)

**用途**: 读取网页内容，转换为 AI 友好格式

**工具列表**:
- `mcp__web_reader__webReader` - 抓取网页内容

---

## 可选 MCP 工具

### 5. MySQL 数据库 (如需要)

**用途**: 数据库操作

**工具列表**:
- `mcp__mysql__projA_sql_query` - 执行SQL
- `mcp__mysql__projA_get_database_info` - 获取数据库信息
- `mcp__mysql__projA_check_permissions` - 检查权限

---

### 6. GitHub 仓库读取 (可选)

**用途**: 读取 GitHub 仓库代码

**工具列表**:
- `mcp__zread__get_repo_structure` - 获取仓库结构
- `mcp__zread__read_file` - 读取文件内容
- `mcp__zread__search_doc` - 搜索文档

---

### 7. 图像/视频分析 (可选)

**用途**: 分析 UI 截图、错误截图、技术图表

**工具列表**:
- `mcp__zai-mcp-server__analyze_image` - 通用图像分析
- `mcp__zai-mcp-server__ui_to_artifact` - UI 转代码
- `mcp__zai-mcp-server__diagnose_error_screenshot` - 错误诊断
- `mcp__zai-mcp-server__analyze_video` - 视频分析

---

## Claude Code 配置文件位置

**macOS/Linux**:
```
~/.claude/settings.json
```

**配置示例**:
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-server-playwright"]
    },
    "web-search": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-web-search"]
    }
  }
}
```

---

## 安装 MCP 服务器

```bash
# 安装 Playwright MCP
npm install -g @anthropic-ai/mcp-server-playwright

# 或使用 npx 直接运行（推荐）
npx @anthropic-ai/mcp-server-playwright
```

---

## 验证 MCP 配置

在 Claude Code 中输入 `/mcp` 查看已加载的 MCP 工具。

---

## 本项目使用的 MCP

| MCP 工具 | 用途 | 状态 |
|----------|------|------|
| Playwright | E2E 测试、浏览器操作 | ✅ 必备 |
| Web Search | 搜索技术文档 | ✅ 推荐 |
| Context7 | 查询库文档 | ✅ 推荐 |
| Web Reader | 读取网页内容 | ✅ 推荐 |
| MySQL | 数据库操作 | ⚪ 可选 |
| GitHub Reader | 读取仓库代码 | ⚪ 可选 |
| Image Analysis | UI/错误分析 | ⚪ 可选 |

---

## 注意事项

1. **安全性**: MCP 工具有不同的权限级别，请谨慎配置
2. **性能**: 过多 MCP 工具会影响启动速度
3. **版本**: 建议使用最新版本的 MCP 服务器
4. **调试**: 使用 `/mcp` 命令检查 MCP 状态
