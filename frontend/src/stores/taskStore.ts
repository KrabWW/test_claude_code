import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task } from '@/types/task'

export const useTaskStore = defineStore('task', () => {
  // 状态
  const tasks = ref<Task[]>([])
  const currentTask = ref<Task | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const taskCount = computed(() => tasks.value.length)
  const todoTasks = computed(() => tasks.value.filter(t => t.status === 'TODO'))
  const inProgressTasks = computed(() => tasks.value.filter(t => t.status === 'IN_PROGRESS'))
  const doneTasks = computed(() => tasks.value.filter(t => t.status === 'DONE'))

  // Actions
  function setTasks(newTasks: Task[]): void {
    tasks.value = newTasks
  }

  function addTask(task: Task): void {
    tasks.value.push(task)
  }

  function updateTaskInList(updatedTask: Task): void {
    const index = tasks.value.findIndex(t => t.id === updatedTask.id)
    if (index !== -1) {
      tasks.value[index] = updatedTask
    }
  }

  function removeTask(taskId: number): void {
    tasks.value = tasks.value.filter(t => t.id !== taskId)
  }

  function setCurrentTask(task: Task | null): void {
    currentTask.value = task
  }

  function setLoading(value: boolean): void {
    loading.value = value
  }

  function setError(value: string | null): void {
    error.value = value
  }

  function clearError(): void {
    error.value = null
  }

  return {
    // 状态
    tasks,
    currentTask,
    loading,
    error,
    // 计算属性
    taskCount,
    todoTasks,
    inProgressTasks,
    doneTasks,
    // Actions
    setTasks,
    addTask,
    updateTaskInList,
    removeTask,
    setCurrentTask,
    setLoading,
    setError,
    clearError
  }
})
