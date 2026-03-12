export const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE'
} as const

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus]

export const TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
} as const

export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority]

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateTaskInput {
  title: string
  description?: string | null
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string | null
}

export interface UpdateTaskInput {
  title?: string
  description?: string | null
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string | null
}

export interface TaskQueryParams {
  status?: TaskStatus
  priority?: TaskPriority
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
