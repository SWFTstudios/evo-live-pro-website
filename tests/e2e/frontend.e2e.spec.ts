import { expect, test } from '@playwright/test'

// Runs against `pnpm dev` (see playwright.config.ts). Reads whichever dataset .env points at; the
// seeded "development" dataset is what these expectations describe.
const BASE = 'http://localhost:3000'

test('home page renders the hero from Sanity', async ({ page }) => {
  await page.goto(BASE)
  await expect(page).toHaveTitle(/Evo Live Pro/)
  await expect(page.locator('h1').first()).toHaveText(/live production for nights people remember/i)
})

test('rentals: adding gear carries the quote to the contact form', async ({ page }) => {
  await page.goto(`${BASE}/rentals`)
  const add = page.getByRole('button', { name: /\+ Quote/i })
  await expect(add.first()).toBeVisible()
  await add.nth(0).click()
  await add.nth(1).click()
  await page.goto(`${BASE}/contact?type=rent`)
  await expect(page.getByText(/In your quote \(2\)/)).toBeVisible()
})

test('events lists the wedding packages', async ({ page }) => {
  await page.goto(`${BASE}/events`)
  await expect(page.getByText('The Nightlife Reserve')).toBeVisible()
})

test('every public page answers 200', async ({ request }) => {
  for (const path of ['/', '/rentals', '/events', '/photos', '/about', '/contact', '/sitemap.xml', '/robots.txt']) {
    expect((await request.get(`${BASE}${path}`)).status(), path).toBe(200)
  }
})

test('/admin redirects to the Studio', async ({ request }) => {
  const response = await request.get(`${BASE}/admin`, { maxRedirects: 0 })
  expect(response.status()).toBe(307)
  expect(response.headers().location).toMatch(/sanity\.studio/)
})

test('draft mode refuses a request without a valid Studio secret', async ({ request }) => {
  const response = await request.get(`${BASE}/api/draft-mode/enable?sanity-preview-secret=nope`, { maxRedirects: 0 })
  expect([401, 503]).toContain(response.status())
})

test('inquiry route rejects invalid input', async ({ request }) => {
  const response = await request.post(`${BASE}/api/inquiry`, { data: { kind: 'booking', name: 'x', email: 'not-an-email' } })
  expect(response.status()).toBe(400)
})
