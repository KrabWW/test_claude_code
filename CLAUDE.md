# AI开发规范 - 模板项目

## 项目概述

你是一名全栈开发工程师，负责按照 `task.json` 中的任务列表进行自动化开发。

### 技术栈（根据项目需求修改）
- **后端**: Node.js / Next.js / Express
- **前端**: Vue / React / TypeScript
- **数据库**: SQLite / PostgreSQL + Prisma
- **测试**: Playwright E2E测试

---

## 工作流程（必须严格遵守）

### 阶段1：环境检查 [GATE:ENV] ⚠️ 必须通过

```bash
# 检查命令（根据项目调整）
node -v && npm -v
```

检查项：
- [ ] Node.js 已安装
- [ ] npm 已安装
- [ ] 必要的目录结构存在

→ **只有全部通过才能进入下一阶段**

---

### 阶段2：领取任务 [GATE:TASK]

1. 读取 `task.json` 文件
2. 找到第一个 `status="pending"` 的任务
3. 将其状态改为 `"in_progress"`
4. 在 `progress.txt` 中记录开始时间

```json
// 状态变更示例
{"id": 1, "status": "pending"} → {"id": 1, "status": "in_progress"}
```

→ **只有状态变更成功才能进入下一阶段**

---

### 阶段3：开发代码 [GATE:DEV]

根据任务描述编写代码：
- 遵循项目现有代码风格
- 使用 TypeScript 严格模式
- 函数必须有返回类型注解
- 组件必须有 Props 类型定义

→ **代码编写完成才能进入下一阶段**

---

### 阶段4：测试验证 [GATE:TEST] ⚠️ 强制通过

#### 4.1 代码验证
```bash
npm run lint && npm run build
```

#### 4.2 浏览器测试（如果适用）
使用 MCP Playwright 工具验证功能：
1. 打开前端页面
2. 验证功能是否正常
3. 截图保存证据

检查项：
- [ ] lint 通过
- [ ] build 通过
- [ ] 功能正常（如适用）

→ **所有检查必须通过，否则不能提交！**

---

### 阶段5：记录进度 [GATE:LOG]

在 `progress.txt` 中记录：

```
--- YYYY-MM-DD HH:MM:SS ---
任务 #X：任务标题
状态：✅ 完成 / ⚠️ 阻塞
说明：简要描述完成的工作
```

更新 `task.json` 中的任务状态为 `"completed"`

→ **记录完成才能进入下一阶段**

---

### 阶段6：提交代码 [GATE:COMMIT]

```bash
git add .
git commit -m "feat(task-id): 简要描述完成的工作"
```

提交信息格式：
- `feat(xxx): 新功能`
- `fix(xxx): 修复bug`
- `refactor(xxx): 重构`
- `test(xxx): 添加测试`
- `docs(xxx): 文档更新`

→ **提交成功后，循环回到阶段2**

---

## 遇到阻塞时的处理 [BLOCKED]

### 什么情况算阻塞？
- 需要外部API密钥（如Supabase、OpenAI等）
- 需要人工操作外部系统
- 需要人工确认设计决策
- 依赖未完成的其他任务

### 阻塞处理流程

1. 将 `task.json` 中的任务状态改为 `"blocked"`
2. 在 `progress.txt` 中记录：
   ```
   --- YYYY-MM-DD HH:MM:SS ---
   任务 #X：任务标题
   状态：⚠️ 阻塞
   原因：具体说明为什么阻塞
   需要帮助：需要人工做什么
   操作步骤：
     1. 打开 https://xxx.com
     2. 点击 XXX
     3. 复制 API Key
     4. 将 API Key 告诉我
   ```
3. **等待人工介入**
4. 人工解决后，将状态改回 `"in_progress"`
5. 回到**阶段4**继续验证

---

## 退出条件

当 `task.json` 中所有任务状态都是 `"completed"` 时：

1. 在 `progress.txt` 中写入：
   ```
   === 所有任务已完成 ===
   完成时间：YYYY-MM-DD HH:HH:SS
   总任务数：X
   成功完成：X

   __ALL_TASKS_DONE__
   ```

2. 退出循环

---

## 代码规范

### TypeScript
```typescript
// ✅ 正确
function getData(id: number): Promise<Data | null> {
  return db.findUnique({ where: { id } });
}

// ❌ 错误
function getData(id) {
  return db.findUnique({ where: { id } });
}
```

### 组件
```typescript
// ✅ 正确
interface Props {
  data: Data;
}

const Component = ({ data }: Props) => {
  // ...
}
```

---

## 重要提醒

1. **每次只处理一个任务** - 不要贪多
2. **每个阶段必须验证** - 不能跳过
3. **遇到问题立即记录** - 不要硬撑
4. **提交信息要清晰** - 方便回溯
5. **保持代码整洁** - 遵循规范

---

# currentDate
Today's date is YYYY-MM-DD.
