<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import { taskApi } from '@/api/taskApi'
import { TaskStatus, TaskPriority, type CreateTaskInput } from '@/types/task'

const router = useRouter()
const taskStore = useTaskStore()

const form = reactive<CreateTaskInput>({
  title: '',
  description: '',
  status: TaskStatus.TODO,
  priority: TaskPriority.MEDIUM,
  dueDate: null
})

const submitting = ref(false)
const error = ref<string | null>(null)

async function handleSubmit(): Promise<void> {
  if (!form.title.trim()) {
    error.value = '请输入任务标题'
    return
  }

  try {
    submitting.value = true
    error.value = null

    const newTask = await taskApi.createTask({
      title: form.title.trim(),
      description: form.description?.trim() || null,
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || null
    })

    taskStore.addTask(newTask)
    router.push('/')
  } catch (err) {
    error.value = '创建任务失败'
    console.error('Failed to create task:', err)
  } finally {
    submitting.value = false
  }
}

function goBack(): void {
  router.push('/')
}
</script>

<template>
  <div class="task-create-page">
    <header class="page-header">
      <button class="btn-back" @click="goBack">&larr; 返回</button>
      <h1>创建任务</h1>
    </header>

    <form class="task-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">任务标题 <span class="required">*</span></label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          placeholder="请输入任务标题"
          maxlength="100"
        />
      </div>

      <div class="form-group">
        <label for="description">任务描述</label>
        <textarea
          id="description"
          v-model="form.description"
          placeholder="请输入任务描述（可选）"
          rows="4"
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="status">状态</label>
          <select id="status" v-model="form.status">
            <option :value="TaskStatus.TODO">待办</option>
            <option :value="TaskStatus.IN_PROGRESS">进行中</option>
            <option :value="TaskStatus.DONE">已完成</option>
          </select>
        </div>

        <div class="form-group">
          <label for="priority">优先级</label>
          <select id="priority" v-model="form.priority">
            <option :value="TaskPriority.LOW">低</option>
            <option :value="TaskPriority.MEDIUM">中</option>
            <option :value="TaskPriority.HIGH">高</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="dueDate">截止日期</label>
        <input
          id="dueDate"
          v-model="form.dueDate"
          type="date"
        />
      </div>

      <div v-if="error" class="error-message">{{ error }}</div>

      <div class="form-actions">
        <button type="button" class="btn-secondary" @click="goBack">取消</button>
        <button type="submit" class="btn-primary" :disabled="submitting">
          {{ submitting ? '创建中...' : '创建任务' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.task-create-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
}

.btn-back {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
}

.btn-back:hover {
  color: #333;
}

.task-form {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.required {
  color: #f44336;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #4caf50;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.error-message {
  padding: 12px;
  background: #ffebee;
  color: #d32f2f;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.btn-primary {
  padding: 10px 24px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary:hover:not(:disabled) {
  background: #45a049;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 10px 24px;
  background: #e0e0e0;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-secondary:hover {
  background: #d0d0d0;
}
</style>
