<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import { taskApi } from '@/api/taskApi'
import { TaskStatus, TaskPriority, type Task, type UpdateTaskInput } from '@/types/task'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()

const task = ref<Task | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const isEditing = ref(false)
const showDeleteConfirm = ref(false)
const deleting = ref(false)
const saving = ref(false)

const editForm = reactive<UpdateTaskInput>({
  title: '',
  description: '',
  status: TaskStatus.TODO,
  priority: TaskPriority.MEDIUM,
  dueDate: null
})

const taskId = computed(() => parseInt(route.params.id as string, 10))

const statusOptions = [
  { value: TaskStatus.TODO, label: '待办' },
  { value: TaskStatus.IN_PROGRESS, label: '进行中' },
  { value: TaskStatus.DONE, label: '已完成' }
]

const priorityOptions = [
  { value: TaskPriority.LOW, label: '低' },
  { value: TaskPriority.MEDIUM, label: '中' },
  { value: TaskPriority.HIGH, label: '高' }
]

async function loadTask(): Promise<void> {
  try {
    loading.value = true
    error.value = null
    const data = await taskApi.getTaskById(taskId.value)
    task.value = data
    taskStore.setCurrentTask(data)
  } catch (err) {
    error.value = '加载任务失败'
    console.error('Failed to load task:', err)
  } finally {
    loading.value = false
  }
}

function startEdit(): void {
  if (task.value) {
    editForm.title = task.value.title
    editForm.description = task.value.description || ''
    editForm.status = task.value.status
    editForm.priority = task.value.priority
    editForm.dueDate = task.value.dueDate ? task.value.dueDate.split('T')[0] : null
    isEditing.value = true
  }
}

function cancelEdit(): void {
  isEditing.value = false
}

async function saveEdit(): Promise<void> {
  if (!editForm.title?.trim()) {
    error.value = '任务标题不能为空'
    return
  }

  try {
    saving.value = true
    error.value = null

    const updatedTask = await taskApi.updateTask(taskId.value, {
      title: editForm.title.trim(),
      description: editForm.description?.trim() || null,
      status: editForm.status,
      priority: editForm.priority,
      dueDate: editForm.dueDate || null
    })

    task.value = updatedTask
    taskStore.updateTaskInList(updatedTask)
    isEditing.value = false
  } catch (err) {
    error.value = '保存失败'
    console.error('Failed to save task:', err)
  } finally {
    saving.value = false
  }
}

async function changeStatus(newStatus: string): Promise<void> {
  if (!task.value || task.value.status === newStatus) return

  try {
    const updatedTask = await taskApi.updateTask(taskId.value, {
      status: newStatus as TaskStatus
    })
    task.value = updatedTask
    taskStore.updateTaskInList(updatedTask)
  } catch (err) {
    error.value = '更新状态失败'
    console.error('Failed to update status:', err)
  }
}

function confirmDelete(): void {
  showDeleteConfirm.value = true
}

function cancelDelete(): void {
  showDeleteConfirm.value = false
}

async function deleteTask(): Promise<void> {
  try {
    deleting.value = true
    await taskApi.deleteTask(taskId.value)
    taskStore.removeTask(taskId.value)
    router.push('/')
  } catch (err) {
    error.value = '删除失败'
    console.error('Failed to delete task:', err)
  } finally {
    deleting.value = false
    showDeleteConfirm.value = false
  }
}

function goBack(): void {
  router.push('/')
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function getPriorityLabel(priority: string): string {
  const option = priorityOptions.find(o => o.value === priority)
  return option?.label || priority
}

onMounted(() => {
  loadTask()
})
</script>

<template>
  <div class="task-detail-page">
    <header class="page-header">
      <button class="btn-back" @click="goBack">&larr; 返回</button>
      <h1>{{ isEditing ? '编辑任务' : '任务详情' }}</h1>
    </header>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-if="error && !isEditing" class="error-message">{{ error }}</div>

    <div v-if="!loading && task" class="task-content">
      <!-- 查看模式 -->
      <div v-if="!isEditing" class="view-mode">
        <div class="task-header">
          <h2 class="task-title">{{ task.title }}</h2>
          <div class="status-buttons">
            <button
              v-for="opt in statusOptions"
              :key="opt.value"
              :class="['status-btn', { active: task.status === opt.value }]"
              @click="changeStatus(opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div class="task-meta">
          <div class="meta-item">
            <span class="label">优先级：</span>
            <span class="value">{{ getPriorityLabel(task.priority) }}</span>
          </div>
          <div class="meta-item">
            <span class="label">截止日期：</span>
            <span class="value">{{ formatDate(task.dueDate) }}</span>
          </div>
          <div class="meta-item">
            <span class="label">创建时间：</span>
            <span class="value">{{ formatDate(task.createdAt) }}</span>
          </div>
          <div class="meta-item">
            <span class="label">更新时间：</span>
            <span class="value">{{ formatDate(task.updatedAt) }}</span>
          </div>
        </div>

        <div v-if="task.description" class="task-description">
          <h3>描述</h3>
          <p>{{ task.description }}</p>
        </div>

        <div class="task-actions">
          <button class="btn-primary" @click="startEdit">编辑</button>
          <button class="btn-danger" @click="confirmDelete">删除</button>
        </div>
      </div>

      <!-- 编辑模式 -->
      <div v-else class="edit-mode">
        <form class="edit-form" @submit.prevent="saveEdit">
          <div class="form-group">
            <label for="title">任务标题 <span class="required">*</span></label>
            <input
              id="title"
              v-model="editForm.title"
              type="text"
              placeholder="请输入任务标题"
              maxlength="100"
            />
          </div>

          <div class="form-group">
            <label for="description">任务描述</label>
            <textarea
              id="description"
              v-model="editForm.description"
              placeholder="请输入任务描述（可选）"
              rows="4"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="status">状态</label>
              <select id="status" v-model="editForm.status">
                <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="priority">优先级</label>
              <select id="priority" v-model="editForm.priority">
                <option v-for="opt in priorityOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="dueDate">截止日期</label>
            <input id="dueDate" v-model="editForm.dueDate" type="date" />
          </div>

          <div v-if="error" class="error-message">{{ error }}</div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="cancelEdit">取消</button>
            <button type="submit" class="btn-primary" :disabled="saving">
              {{ saving ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="cancelDelete">
      <div class="modal">
        <h3>确认删除</h3>
        <p>确定要删除这个任务吗？此操作无法撤销。</p>
        <div class="modal-actions">
          <button class="btn-secondary" @click="cancelDelete">取消</button>
          <button class="btn-danger" :disabled="deleting" @click="deleteTask">
            {{ deleting ? '删除中...' : '确认删除' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-detail-page {
  max-width: 800px;
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

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error-message {
  padding: 12px;
  background: #ffebee;
  color: #d32f2f;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
}

.task-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.task-title {
  margin: 0;
  font-size: 22px;
  flex: 1;
  margin-right: 16px;
}

.status-buttons {
  display: flex;
  gap: 8px;
}

.status-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.status-btn:hover {
  border-color: #4caf50;
}

.status-btn.active {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

.task-meta {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.meta-item {
  font-size: 14px;
}

.meta-item .label {
  color: #666;
  margin-right: 8px;
}

.meta-item .value {
  color: #333;
  font-weight: 500;
}

.task-description {
  margin-bottom: 24px;
}

.task-description h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
}

.task-description p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  white-space: pre-wrap;
}

.task-actions {
  display: flex;
  gap: 12px;
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

.btn-danger {
  padding: 10px 24px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-danger:hover:not(:disabled) {
  background: #d32f2f;
}

.btn-danger:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 编辑表单样式 */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
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
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 24px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
}

.modal h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
}

.modal p {
  margin: 0 0 20px 0;
  color: #666;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
