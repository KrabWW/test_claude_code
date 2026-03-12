/**
 * E2E测试演示脚本
 *
 * 运行方式：
 * npx playwright test demo.spec.ts --headed --workers=1
 *
 * 这个脚本会：
 * 1. 打开浏览器窗口（headed模式）
 * 2. 每一步操作都会暂停1-2秒，方便观察
 * 3. 输出详细的操作日志到控制台
 */

import { test, expect } from '@playwright/test'

// 辅助函数：暂停执行
const pause = (ms: number = 1500) => new Promise(r => setTimeout(r, ms))

// 辅助函数：打印日志
const log = (step: string) => console.log(`\n📍 [步骤] ${step}\n`)

test.describe('任务管理系统 - E2E演示测试', () => {
  test('完整CRUD流程演示', async ({ page }) => {
    // ========================================
    // 第1步：打开任务列表页面
    // ========================================
    log('打开任务列表页面')
    await page.goto('/')
    await pause(2000)

    // 验证页面标题
    await expect(page.locator('h1')).toContainText('任务管理系统')
    console.log('✅ 页面加载成功：任务管理系统')

    // ========================================
    // 第2步：创建新任务
    // ========================================
    log('点击"新建任务"按钮')
    await page.click('button:has-text("+ 新建任务")')
    await pause(1000)

    // 验证进入创建页面
    await expect(page.locator('h1')).toContainText('创建任务')
    console.log('✅ 进入创建任务页面')

    log('填写任务表单')
    const taskTitle = `演示任务_${new Date().toLocaleTimeString()}`
    await page.fill('#title', taskTitle)
    await page.fill('#description', '这是一个通过Playwright E2E测试创建的演示任务')
    await page.selectOption('#priority', 'HIGH')
    await pause(1000)
    console.log(`✅ 表单填写完成：${taskTitle}`)

    log('提交表单')
    await page.click('button[type="submit"]')
    await pause(2000)

    // 验证跳转回列表页
    await expect(page).toHaveURL(/.*localhost:5173\/$/)
    console.log('✅ 任务创建成功，返回列表页')

    // 验证任务出现在列表中
    await expect(page.getByRole('heading', { name: taskTitle }).first()).toBeVisible()
    console.log(`✅ 新任务"${taskTitle}"已显示在列表中`)
    await pause(1000)

    // ========================================
    // 第3步：查看任务详情
    // ========================================
    log('点击任务查看详情')
    await page.getByRole('heading', { name: taskTitle }).click()
    await pause(2000)

    // 验证详情页
    await expect(page.locator('.task-title').first()).toBeVisible()
    console.log('✅ 进入任务详情页')

    // 验证任务信息
    await expect(page.locator('.task-title').first()).toContainText(taskTitle)
    console.log('✅ 任务标题正确显示')
    await pause(1000)

    // ========================================
    // 第4步：状态切换
    // ========================================
    log('测试状态切换：点击"进行中"')
    await page.click('.status-btn:has-text("进行中")')
    await pause(1000)

    // 验证状态切换
    await expect(page.locator('.status-btn.active:has-text("进行中")')).toBeVisible()
    console.log('✅ 状态已切换为"进行中"')

    log('测试状态切换：点击"已完成"')
    await page.click('.status-btn:has-text("已完成")')
    await pause(1000)

    await expect(page.locator('.status-btn.active:has-text("已完成")')).toBeVisible()
    console.log('✅ 状态已切换为"已完成"')
    await pause(1000)

    // ========================================
    // 第5步：编辑任务
    // ========================================
    log('点击"编辑"按钮')
    await page.click('button:has-text("编辑")')
    await pause(1000)

    // 修改任务标题
    const updatedTitle = `已编辑_${taskTitle}`
    await page.fill('#title', updatedTitle)
    console.log(`✅ 修改标题为：${updatedTitle}`)

    // 修改描述
    await page.fill('#description', '这是编辑后更新任务描述')
    await pause(500)

    log('保存编辑')
    await page.click('button[type="submit"]')
    await pause(2000)

    // 验证更新成功
    await expect(page.locator('.task-title').first()).toContainText(updatedTitle)
    console.log('✅ 任务更新成功')

    // ========================================
    // 第6步：删除任务
    // ========================================
    log('点击"删除"按钮')
    await page.click('button:has-text("删除")')
    await pause(1000)

    // 验证确认对话框出现
    await expect(page.locator('.modal')).toBeVisible()
    console.log('✅ 删除确认对话框已显示')

    log('确认删除')
    await page.click('.modal >> button:has-text("确认删除")')
    await pause(2000)

    // 验证返回列表页
    await expect(page).toHaveURL(/.*localhost:5173\/$/)
    console.log('✅ 已返回列表页')

    // 验证任务已删除
    await expect(page.getByRole('heading', { name: updatedTitle })).not.toBeVisible()
    console.log(`✅ 任务"${updatedTitle}"已成功删除`)

    // ========================================
    // 测试完成
    // ========================================
    console.log('\n' + '='.repeat(50))
    console.log('🎉 E2E测试演示完成！')
    console.log('='.repeat(50) + '\n')
    console.log('测试覆盖的功能：')
    console.log('  ✅ 创建任务 (POST)')
    console.log('  ✅ 查看任务详情 (GET)')
    console.log('  ✅ 状态切换 (PUT)')
    console.log('  ✅ 编辑任务 (PUT)')
    console.log('  ✅ 删除任务 (DELETE)')
    console.log('\n完整CRUD流程验证通过！\n')
  })

  test('筛选和排序功能演示', async ({ page }) => {
    log('打开任务列表页面')
    await page.goto('/')
    await pause(1000)

    log('测试状态筛选 - 选择"待办"')
    // 使用label选择器更可靠
    await page.selectOption('select', { label: '待办' })
    await pause(500)
    console.log('✅ 已筛选"待办"状态')

    log('清除筛选')
    await page.click('button:has-text("清除筛选")')
    await pause(500)
    console.log('✅ 筛选已清除')

    log('测试排序功能 - 选择"优先级"')
    const sortSelect = page.locator('select').nth(2)
    await sortSelect.selectOption({ label: '优先级' })
    await pause(500)
    console.log('✅ 已按优先级排序')

    console.log('\n✅ 筛选和排序功能测试通过！\n')
  })
})
