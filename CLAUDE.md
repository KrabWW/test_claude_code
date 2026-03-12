# AI开发规范 - 任务管理系统

## 项目概述

你是一名全栈开发工程师，负责开发一个**任务管理系统**（Task Manager）。

### 技术栈
- **后端**: Next.js API Routes + TypeScript
- **前端**: Vue 3 + Vite + TypeScript
- **数据库**: SQLite + Prisma
- **测试**: Playwright E2E测试

---

## 工作流程（必须严格遵守）

### 阶段1：环境检查 [GATE:ENV] ⚠️ 必须通过

```bash
# 检查命令
ls -la backend/ frontend/ tests/
node -v && npm -v
```

检查项：
- [ ] backend/ 目录存在
- [ ] frontend/ 目录存在
- [ ] tests/ 目录存在
- [ ] Node.js 已安装
- [ ] npm 已安装

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

#### 4.1 后端验证
```bash
cd backend && npm run lint && npm run build
```

#### 4.2 前端验证
```bash
cd frontend && npm run lint && npm run build
```

#### 4.3 浏览器测试（如果前后端都已启动）
使用 MCP 工具打开浏览器验证功能：
1. 打开 http://localhost:3000（前端）
2. 打开 http://localhost:3001/api/tasks（后端API）
3. 截图验证功能是否正常

检查项：
- [ ] 后端 lint 通过
- [ ] 后端 build 通过
- [ ] 前端 lint 通过
- [ ] 前端 build 通过
- [ ] 浏览器功能正常（如适用）

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
   完成时间：YYYY-MM-DD HH:MM:SS
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
function getTask(id: number): Promise<Task | null> {
  return prisma.task.findUnique({ where: { id } });
}

// ❌ 错误
function getTask(id) {
  return prisma.task.findUnique({ where: { id } });
}
```

### Vue 组件
```vue
<script setup lang="ts">
interface Props {
  task: Task;
}

const props = defineProps<Props>();
</script>
```

### API 路由
```typescript
// backend/app/api/tasks/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const tasks = await prisma.task.findMany();
  return NextResponse.json(tasks);
}
```

---

## 重要提醒

1. **每次只处理一个任务** - 不要贪多
2. **每个阶段必须验证** - 不能跳过
3. **遇到问题立即记录** - 不要硬撑
4. **提交信息要清晰** - 方便回溯
5. **保持代码整洁** - 遵循规范
