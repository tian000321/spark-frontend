import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // 任务列表
  await page.route('**/v1/tasks*', async route => {
    if (route.request().url().includes('/v1/tasks/')) {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ id: 'task-001', name: '图像分类模型训练', status: '已完成' }),
      });
      return;
    }
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        tasks: [
          { id: 'task-001', name: '图像分类模型训练', status: '已完成', type: '训练', time: '2026-05-01', cost: 3.42 },
          { id: 'task-002', name: '文本摘要生成', status: '运行中', type: '推理', time: '2026-05-02', cost: 8.76 },
        ],
        total: 2,
      }),
    });
  });

  // 对话提交
  await page.route('**/v1/conversation', async route => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        task_id: 'task-test-abc123',
        status: 'submitted',
        requires_consent: false,
      }),
    });
  });

  // 智能体
  await page.route('**/v1/agents*', async route => {
    if (route.request().url().includes('/reviews')) {
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify([]) });
      return;
    }
    if (route.request().url().match(/\/v1\/agents\/[^/]+$/)) {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ id: 'agent-001', name: '图像分类训练助手', developer: '星火官方', score: 98, price: '¥0.50/次', icon: '🖼️' }),
      });
      return;
    }
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        agents: [{ id: 'agent-001', name: '图像分类训练助手', developer: '星火官方', score: 98, price: '¥0.50/次', icon: '🖼️' }],
        total: 1,
      }),
    });
  });

  // 收益
  await page.route('**/v1/revenue/summary', async route => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ balance: 2847.35, transactions: [] }) });
  });
  await page.route('**/v1/recharge', async route => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ balance: 2847.35 }) });
  });
  await page.route('**/v1/withdraw', async route => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ balance: 2847.35 }) });
  });

  // 合规 & 护照
  await page.route('**/v1/compliance/status', async route => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ level: 'green' }) });
  });
  await page.route('**/v1/compliance/passport/*', async route => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ passportId: 'VC-1', status: '有效' }) });
  });

  // 伦理表决
  await page.route('**/v1/ethics/votes', async route => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify([]) });
  });

  // 角色状态（提供者已开通）
  await page.route('**/v1/provider/status', async route => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ isProvider: true }) });
  });
  await page.route('**/v1/provider/nodes', async route => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify([{ id: 'node-001', gpu: 'NVIDIA A100 80GB', status: '在线' }]) });
  });
  await page.route('**/v1/provider/revenue', async route => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ totalRevenue: '¥1,250.00' }) });
  });

  await page.route('**/v1/agent/**', async route => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({}) });
  });
  await page.route('**/v1/developer/**', async route => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({}) });
  });
  await page.route('**/v1/admin/**', async route => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify([]) });
  });
});

test('1. 首页自动跳转到聊天页', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForURL('**/chat', { timeout: 10000 });
  await expect(page.locator('button:has-text("发送")')).toBeVisible();
});

test('2. 发送消息后获得反馈', async ({ page }) => {
  await page.goto('http://localhost:3000/chat');
  // 等待发送按钮可见，说明聊天界面已就绪
  await expect(page.locator('button:has-text("发送")')).toBeVisible({ timeout: 5000 });

  // 使用 placeholder 定位可见输入框，避免选中隐藏元素
  const input = page.locator('textarea[placeholder], input[placeholder]').first();
  await input.waitFor({ state: 'visible', timeout: 5000 });
  await input.fill('训练一个模型');

  await page.click('button:has-text("发送")');

  // 等待 AI 生成徽标出现，证明收到了 AI 回复
  await expect(page.locator('text=AI 生成')).toBeVisible({ timeout: 15000 });
});

test('3. 任务中心显示任务', async ({ page }) => {
  await page.goto('http://localhost:3000/tasks');
  await expect(page.locator('text=图像分类模型训练')).toBeVisible();
});

test('4. 信任仪表盘展示合规指标', async ({ page }) => {
  await page.goto('http://localhost:3000/trust');
  await expect(page.locator('body')).toContainText('合规', { timeout: 10000 });
});

test('5. 智能体市场可访问', async ({ page }) => {
  await page.goto('http://localhost:3000/agents');
  await expect(page.locator('body')).toContainText('智能体市场');
});

test('6. 收益页显示余额与按钮', async ({ page }) => {
  await page.goto('http://localhost:3000/revenue');
  await expect(page.locator('text=¥2847.35')).toBeVisible();
  await expect(page.locator('button:has-text("充值")')).toBeVisible();
});

test('7. 个人中心可访问', async ({ page }) => {
  await page.goto('http://localhost:3000/profile');
  await expect(page.locator('body')).toContainText('个人中心');
});

test('8. 节点入驻显示提供者后台', async ({ page }) => {
  await page.goto('http://localhost:3000/nodes');
  await expect(page.locator('text=node-001')).toBeVisible();
});

test('9. 代理加盟展示费用', async ({ page }) => {
  await page.goto('http://localhost:3000/agent-register');
  await expect(page.locator('body')).toContainText('市级代理');
  await expect(page.locator('body')).toContainText('¥10,000');
});

test('10. 管理后台可访问', async ({ page }) => {
  await page.goto('http://localhost:3000/admin');
  await expect(page.locator('body')).toContainText('管理后台');
});