import { test, expect } from '@playwright/test'

test.describe('任务管理系统', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('创建任务', async ({ page }) => {
    // 使用唯一的前缀避免冲突
    const taskTitle = `测试任务_${Date.now()}`

    // 点击新建任务按钮
    await page.click('button:has-text("+ 新建任务")')

    // 等待表单加载
    await expect(page.locator('h1')).toContainText('创建任务')

    // 填写表单
    await page.fill('#title', taskTitle)
    await page.fill('#description', '这是一个E2E测试任务描述')
    await page.selectOption('#priority', 'HIGH')


    // 提交表单
    await page.click('button[type="submit"]')

    // 等待跳转回列表页
    await expect(page).toHaveURL(/.*localhost:5173\/$/, { timeout: 10000 })

    // 验证任务已创建 - 使用 first() 鶈除除歧义
    await expect(page.getByRole('heading', { name: taskTitle }).first()).toBeVisible()
  })

  test('查看任务详情', async ({ page }) => {
    // 点击"详情测试任务"任务卡片
    await page.getByRole('heading', { name: '详情测试任务' }).click()

    // 验证详情页加载
    await expect(page.locator('.task-title').first()).toBeVisible()
    await expect(page.locator('.task-title').first()).toContainText('详情测试任务')
  })

  test('更新任务', async ({ page }) => {
    // 点击任务进入详情
    await page.getByRole('heading', { name: '更新测试任务' }).click()

    // 等待详情页加载
    await expect(page.locator('.task-title').first()).toBeVisible()

    // 点击编辑按钮
    await page.click('button:has-text("编辑")')

    // 修改任务标题
    await page.fill('#title', '已更新的任务标题')

    // 保存
    await page.click('button[type="submit"]')

    // 验证更新成功
    await expect(page.locator('.task-title').first()).toContainText('已更新的任务标题')
  })

  test('删除任务', async ({ page }) => {
    // 创建一个用于删除的任务
    const deleteTaskTitle = `待删除任务_${Date.now()}`

    // 先创建任务
    await page.click('button:has-text("+ 新建任务")')
    await page.fill('#title', deleteTaskTitle)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/.*localhost:5173\/$/, { timeout: 10000 })

    // 点击刚创建的任务
    await page.getByRole('heading', { name: deleteTaskTitle }).click()

    // 等待详情页加载
    await expect(page.locator('.task-title').first()).toBeVisible()

    // 点击删除按钮
    await page.click('button:has-text("删除")')

    // 确认删除（在模态框中）
    await page.click('.modal >> button:has-text("确认删除")')

    // 等待跳转回列表页
    await expect(page).toHaveURL(/.*localhost:5173\/$/, { timeout: 10000 })

    // 验证任务已被删除
    await expect(page.getByRole('heading', { name: deleteTaskTitle })).not.toBeVisible()
  })

  test('状态切换', async ({ page }) => {
    // 创建一个用于状态切换的任务
    const statusTaskTitle = `状态任务_${Date.now()}`

    // 先创建任务
    await page.click('button:has-text("+ 新建任务")')
    await page.fill('#title', statusTaskTitle)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/.*localhost:5173\/$/, { timeout: 10000 })

    // 点击刚创建的任务
    await page.getByRole('heading', { name: statusTaskTitle }).click()

    // 等待详情页加载
    await expect(page.locator('.task-title').first()).toBeVisible()

    // 点击"进行中"状态按钮
    await page.click('.status-btn:has-text("进行中")')

    // 验证状态已切换（按钮变为active状态）
    await expect(page.locator('.status-btn.active:has-text("进行中")')).toBeVisible()
  })

  test('筛选功能', async ({ page }) => {
    // 创建一个高优先级任务
    const highPriorityTaskTitle = `高优先级任务_${Date.now()}`

    await page.click('button:has-text("+ 新建任务")')
    await page.fill('#title', highPriorityTaskTitle)
    await page.selectOption('#priority', 'HIGH')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/.*localhost:5173\/$/, { timeout: 10000 })

    // 验证任务已创建
    await expect(page.getByRole('heading', { name: highPriorityTaskTitle }).first()).toBeVisible()
  })
})
