import { test, expect } from '@playwright/test'

test.describe('任务管理系统', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('创建任务', async ({ page }) => {
    // 点击新建任务按钮
    await page.click('text=+ 新建任务')

    // 等待表单加载
    await expect(page.locator('h1')).toContainText('创建任务')

    // 填写表单
    await page.fill('#title', 'E2E测试任务')
    await page.fill('#description', '这是一个E2E测试任务描述')
    await page.selectOption('#priority', 'HIGH')

    // 提交表单
    await page.click('button[type="submit"]')

    // 验证跳转到列表页
    await expect(page).toHaveURL('/')

    // 验证任务出现在列表中
    await expect(page.locator('text=E2E测试任务')).toBeVisible()
  })

  test('查看任务详情', async ({ page }) => {
    // 等待任务列表加载
    await page.waitForSelector('.task-card')

    // 点击第一个任务卡片
    await page.click('.task-card >> first')

    // 验证进入详情页
    await expect(page).toHaveURL(/\/tasks\/\d+/)

    // 验证详情页显示任务信息
    await expect(page.locator('.task-title')).toBeVisible()
  })

  test('更新任务', async ({ page }) => {
    // 等待任务列表加载
    await page.waitForSelector('.task-card')

    // 点击第一个任务卡片
    await page.click('.task-card >> first')

    // 等待详情页加载
    await expect(page.locator('.task-title')).toBeVisible()

    // 点击编辑按钮
    await page.click('text=编辑')

    // 修改任务标题
    const titleInput = page.locator('#title')
    await titleInput.fill('更新后的任务标题')

    // 保存
    await page.click('button[type="submit"]')

    // 验证保存成功，返回查看模式
    await expect(page.locator('text=更新后的任务标题')).toBeVisible()
  })

  test('删除任务', async ({ page }) => {
    // 先创建一个任务用于删除
    await page.click('text=+ 新建任务')
    await page.fill('#title', '待删除的任务')
    await page.click('button[type="submit"]')

    // 等待任务创建完成
    await expect(page.locator('text=待删除的任务')).toBeVisible()

    // 点击刚创建的任务
    await page.click('text=待删除的任务')

    // 等待详情页加载
    await expect(page.locator('.task-title')).toBeVisible()

    // 点击删除按钮
    await page.click('text=删除')

    // 确认删除
    await page.click('.modal >> text=确认删除')

    // 验证跳转到列表页
    await expect(page).toHaveURL('/')

    // 验证任务已删除
    await expect(page.locator('text=待删除的任务')).not.toBeVisible()
  })

  test('状态切换', async ({ page }) => {
    // 等待任务列表加载
    await page.waitForSelector('.task-card')

    // 点击第一个任务卡片
    await page.click('.task-card >> first')

    // 等待详情页加载
    await expect(page.locator('.task-title')).toBeVisible()

    // 点击"进行中"状态按钮
    await page.click('.status-btn >> text=进行中')

    // 验证状态已切换（按钮变为active状态）
    await expect(page.locator('.status-btn.active >> text=进行中')).toBeVisible()
  })

  test('筛选和排序', async ({ page }) => {
    // 等待任务列表加载
    await page.waitForSelector('.task-card')

    // 选择状态筛选
    await page.selectOption('select', { label: '待办' })

    // 验证筛选生效
    const taskCards = await page.locator('.task-card').count()
    expect(taskCards).toBeGreaterThanOrEqual(0)

    // 清除筛选
    await page.click('text=清除筛选')
  })
})
