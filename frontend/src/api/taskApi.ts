import axios, { type AxiosInstance } from 'axios'
import type { Task, CreateTaskInput, UpdateTaskInput, TaskQueryParams } from '@/types/task'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

class TaskApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async getTasks(params?: TaskQueryParams): Promise<Task[]> {
    const response = await this.client.get<Task[]>('/tasks', { params })
    return response.data
  }

  async getTaskById(id: number): Promise<Task> {
    const response = await this.client.get<Task>(`/tasks/${id}`)
    return response.data
  }

  async createTask(data: CreateTaskInput): Promise<Task> {
    const response = await this.client.post<Task>('/tasks', data)
    return response.data
  }

  async updateTask(id: number, data: UpdateTaskInput): Promise<Task> {
    const response = await this.client.put<Task>(`/tasks/${id}`, data)
    return response.data
  }

  async deleteTask(id: number): Promise<void> {
    await this.client.delete(`/tasks/${id}`)
  }
}

export const taskApi = new TaskApiService()
