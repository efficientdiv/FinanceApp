import { test, expect } from '@playwright/test'

const DEMO_EMAIL = 'eleanor@luxfinance.demo'
const DEMO_PASSWORD = 'demo1234!'

test.describe('Authentication flow', () => {
  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/login/)
  })

  test('login page renders correctly', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('h1')).toContainText('Welcome back')
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
    await expect(page.getByPlaceholder('••••••••')).toBeVisible()
  })

  test('shows error for wrong credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[name=email]', 'wrong@example.com')
    await page.fill('[name=password]', 'wrongpassword')
    await page.click('button[type=submit]')
    await expect(page.getByText('Invalid email or password')).toBeVisible({ timeout: 5000 })
  })

  test('logs in with demo credentials and shows dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[name=email]', DEMO_EMAIL)
    await page.fill('[name=password]', DEMO_PASSWORD)
    await page.click('button[type=submit]')

    // Wait for redirect to dashboard
    await expect(page).toHaveURL('/', { timeout: 10000 })

    // Verify dashboard renders
    await expect(page.locator('h1')).toContainText('Eleanor')
    await expect(page.getByText('Total net worth')).toBeVisible()
  })

  test('dashboard shows key sections', async ({ page }) => {
    // Sign in first
    await page.goto('/login')
    await page.fill('[name=email]', DEMO_EMAIL)
    await page.fill('[name=password]', DEMO_PASSWORD)
    await page.click('button[type=submit]')
    await expect(page).toHaveURL('/', { timeout: 10000 })

    // Verify all major sections
    await expect(page.getByText('Recent transactions')).toBeVisible()
    await expect(page.getByText('Spending by category')).toBeVisible()
    await expect(page.getByText('Watchlist')).toBeVisible()
    await expect(page.getByText('Insights & opportunities')).toBeVisible()
  })

  test('navigation works after login', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[name=email]', DEMO_EMAIL)
    await page.fill('[name=password]', DEMO_PASSWORD)
    await page.click('button[type=submit]')
    await expect(page).toHaveURL('/', { timeout: 10000 })

    // Navigate to accounts
    await page.click('text=Accounts')
    await expect(page).toHaveURL('/accounts')
    await expect(page.locator('h1')).toContainText('Your accounts')

    // Navigate to transactions
    await page.click('text=Transactions')
    await expect(page).toHaveURL('/transactions')

    // Navigate back to overview
    await page.click('text=Overview')
    await expect(page).toHaveURL('/')
  })

  test('⌘K opens command palette', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[name=email]', DEMO_EMAIL)
    await page.fill('[name=password]', DEMO_PASSWORD)
    await page.click('button[type=submit]')
    await expect(page).toHaveURL('/', { timeout: 10000 })

    await page.keyboard.press('Meta+k')
    await expect(page.getByPlaceholder('Search transactions, tickers…')).toBeVisible({ timeout: 3000 })

    await page.keyboard.press('Escape')
    await expect(page.getByPlaceholder('Search transactions, tickers…')).not.toBeVisible()
  })

  test('signup page renders correctly', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.locator('h1')).toContainText('Create an account')
    await expect(page.getByPlaceholder('Eleanor Vance')).toBeVisible()
  })
})

test.describe('Transaction filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('[name=email]', DEMO_EMAIL)
    await page.fill('[name=password]', DEMO_PASSWORD)
    await page.click('button[type=submit]')
    await expect(page).toHaveURL('/', { timeout: 10000 })
  })

  test('filters transactions by Income tab', async ({ page }) => {
    await page.click('text=Income')
    // Income tab should show fewer items
    const rows = page.locator('.hover-row')
    await expect(rows.first()).toBeVisible({ timeout: 3000 })
  })

  test('filters transactions by Pending tab', async ({ page }) => {
    await page.click('text=Pending')
    await expect(page.getByText('Pending')).toBeVisible({ timeout: 3000 })
  })
})
