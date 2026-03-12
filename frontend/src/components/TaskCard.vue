<script setup lang="ts">
import type { Task } from '@/types/task'
import { TaskStatus, TaskPriority } from '@/types/task'

interface Props {
  task: Task
}

defineProps<Props>()

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    [TaskStatus.TODO]: '待办',
    [TaskStatus.IN_PROGRESS]: '进行中',
    [TaskStatus.DONE]: '已完成'
  }
  return labels[status] || status
}

function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    [TaskStatus.TODO]: 'status-todo',
    [TaskStatus.IN_PROGRESS]: 'status-progress',
    [TaskStatus.DONE]: 'status-done'
  }
  return classes[status] || ''
}

function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    [TaskPriority.LOW]: '低',
    [TaskPriority.MEDIUM]: '中',
    [TaskPriority.HIGH]: '高'
  }
  return labels[priority] || priority
}

function getPriorityClass(priority: string): string {
  const classes: Record<string, string> = {
    [TaskPriority.LOW]: 'priority-low',
    [TaskPriority.MEDIUM]: 'priority-medium',
    [TaskPriority.HIGH]: 'priority-high'
  }
  return classes[priority] || ''
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}
</script>

<template>
  <div class="task-card">
    <div class="task-header">
      <h3 class="task-title">{{ task.title }}</h3>
      <span :class="['status-badge', getStatusClass(task.status)]">
        {{ getStatusLabel(task.status) }}
      </span>
    </div>

    <p v-if="task.description" class="task-description">
      {{ task.description }}
    </p>

    <div class="task-meta">
      <span :class="['priority-badge', getPriorityClass(task.priority)]">
        {{ getPriorityLabel(task.priority) }}优先级
      </span>
      <span v-if="task.dueDate" class="due-date">
        截止: {{ formatDate(task.dueDate) }}
      </span>
    </div>

    <div class="task-footer">
      <span class="created-at">创建于 {{ formatDate(task.createdAt) }}</span>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.task-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  flex: 1;
  margin-right: 10px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.status-todo {
  background: #e3f2fd;
  color: #1976d2;
}

.status-progress {
  background: #fff3e0;
  color: #f57c00;
}

.status-done {
  background: #e8f5e9;
  color: #388e3c;
}

.task-description {
  margin: 8px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 12px;
}

.priority-badge {
  padding: 2px 6px;
  border-radius: 3px;
}

.priority-low {
  background: #f5f5f5;
  color: #666;
}

.priority-medium {
  background: #fff8e1;
  color: #ffa000;
}

.priority-high {
  background: #ffebee;
  color: #d32f2f;
}

.due-date {
  color: #666;
}

.task-footer {
  border-top: 1px solid #eee;
  padding-top: 8px;
  font-size: 12px;
  color: #999;
}
</style>
