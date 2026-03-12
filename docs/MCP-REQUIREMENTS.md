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

---

### 3. Context7 文档查询 (推荐)

**用途**: 获取最新的库/框架文档

---

### 4. Web Reader (推荐)

**用途**: 读取网页内容，转换为 AI 友好格式

---

## 可选 MCP 工具

### 5. MySQL 数据库 (如需要)
### 6. GitHub 仓库读取 (可选)
### 7. 图像/视频分析 (可选)

---

## Claude Code 配置文件位置

**macOS/Linux**:
\`\`\`
~/.claude/settings.json
\`\`\`

---

## 验证 MCP 配置

在 Claude Code 中输入 \`/mcp\` 查看已加载的 MCP 工具。

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
4. **调试**: 使用 \`/mcp\` 命令检查 MCP 状态
