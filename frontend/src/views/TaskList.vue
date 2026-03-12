<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import { taskApi } from '@/api/taskApi'
import { TaskStatus, TaskPriority } from '@/types/task'
import TaskCard from '@/components/TaskCard.vue'

const router = useRouter()
const taskStore = useTaskStore()

// 筛选和排序状态
const filterStatus = ref<string>('')
const filterPriority = ref<string>('')
const sortBy = ref<string>('createdAt')
const sortOrder = ref<'asc' | 'desc'>('desc')

// 计算属性
const filteredTasks = computed(() => {
  let result = [...taskStore.tasks]

  if (filterStatus.value) {
    result = result.filter(t => t.status === filterStatus.value)
  }

  if (filterPriority.value) {
    result = result.filter(t => t.priority === filterPriority.value)
  }

  result.sort((a, b) => {
    const aVal = a[sortBy.value as keyof typeof a]
    const bVal = b[sortBy.value as keyof typeof b]
    if (aVal === null || aVal === undefined) return 1
    if (bVal === null || bVal === undefined) return -1
    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })

  return result
})

// 方法
async function loadTasks(): Promise<void> {
  try {
    taskStore.setLoading(true)
    taskStore.clearError()
    const tasks = await taskApi.getTasks()
    taskStore.setTasks(tasks)
  } catch (err) {
    taskStore.setError('加载任务失败')
    console.error('Failed to load tasks:', err)
  } finally {
    taskStore.setLoading(false)
  }
}

function goToCreate(): void {
  router.push('/create')
}

function goToDetail(id: number): void {
  router.push(`/tasks/${id}`)
}

function clearFilters(): void {
  filterStatus.value = ''
  filterPriority.value = ''
}

onMounted(() => {
  loadTasks()
})
</script>

<template>
  <div class="task-list-page">
    <header class="page-header">
      <h1>任务管理系统</h1>
      <button class="btn-primary" @click="goToCreate">+ 新建任务</button>
    </header>

    <!-- 筛选和排序 -->
    <div class="filters">
      <div class="filter-group">
        <label>状态：</label>
        <select v-model="filterStatus">
          <option value="">全部</option>
          <option :value="TaskStatus.TODO">待办</option>
          <option :value="TaskStatus.IN_PROGRESS">进行中</option>
          <option :value="TaskStatus.DONE">已完成</option>
        </select>
      </div>

      <div class="filter-group">
        <label>优先级：</label>
        <select v-model="filterPriority">
          <option value="">全部</option>
          <option :value="TaskPriority.LOW">低</option>
          <option :value="TaskPriority.MEDIUM">中</option>
          <option :value="TaskPriority.HIGH">高</option>
        </select>
      </div>

      <div class="filter-group">
        <label>排序：</label>
        <select v-model="sortBy">
          <option value="createdAt">创建时间</option>
          <option value="updatedAt">更新时间</option>
          <option value="priority">优先级</option>
          <option value="dueDate">截止日期</option>
        </select>
        <select v-model="sortOrder">
          <option value="desc">降序</option>
          <option value="asc">升序</option>
        </select>
      </div>

      <button class="btn-secondary" @click="clearFilters">清除筛选</button>
    </div>

    <!-- 加载状态 -->
    <div v-if="taskStore.loading" class="loading">加载中...</div>

    <!-- 错误提示 -->
    <div v-if="taskStore.error" class="error">{{ taskStore.error }}</div>

    <!-- 任务列表 -->
    <div v-if="!taskStore.loading && filteredTasks.length > 0" class="task-grid">
      <TaskCard
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @click="goToDetail(task.id)"
      />
    </div>

    <!-- 空状态 -->
    <div v-if="!taskStore.loading && filteredTasks.length === 0" class="empty-state">
      <p>暂无任务</p>
      <button class="btn-primary" @click="goToCreate">创建第一个任务</button>
    </div>
  </div>
</template>

<style scoped>
.task-list-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  color: #666;
}

.filter-group select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.btn-primary {
  padding: 10px 20px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary:hover {
  background: #45a049;
}

.btn-secondary {
  padding: 6px 12px;
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

.task-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  text-align: center;
  padding: 20px;
  color: #f44336;
  background: #ffebee;
  border-radius: 4px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-state p {
  margin-bottom: 20px;
  font-size: 16px;
}
</style>
