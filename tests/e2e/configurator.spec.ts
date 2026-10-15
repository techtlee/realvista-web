import { expect, test, type Page } from '@playwright/test'

const mock = (page: Page) => page.locator('[data-mock-scroller]').first()
const address = (page: Page) => page.getByTitle('Zpět na úvodní stránku').first()
const homeSections = (page: Page) =>
  mock(page)
    .locator('[data-mock-section]')
    .evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.mockSection))

async function open(page: Page, query = '') {
  await page.goto(`/${query}`)
  // The draft lands in the URL only once the configurator has hydrated.
  // Clicking before that registers nothing — the one flake this suite had,
  // seen while the dev server was recompiling.
  await expect(page).toHaveURL(/[?&]k=/)
  await page.locator('#konfigurator').scrollIntoViewIfNeeded()
}

test('colourway recolours the mock site', async ({ page }) => {
  await open(page)
  const brand = () => mock(page).locator('> div').evaluate((el) => getComputedStyle(el).getPropertyValue('--rv-brand').trim())
  expect(await brand()).toBe('#0d0053')
  await page.getByText('Červená', { exact: true }).click()
  expect(await brand()).toBe('#ad0c14')
})

test('the mock can be navigated like the real site', async ({ page }) => {
  await open(page)
  await mock(page).getByRole('button', { name: 'Nemovitosti', exact: true }).first().click()
  await expect(address(page)).toContainText('/nemovitosti')
  await mock(page).getByRole('button', { name: /Byt 3\+kk s balkonem/ }).first().click()
  await expect(address(page)).toContainText('/nemovitosti/byt-3kk-praha-7')
  await mock(page).getByRole('navigation', { name: 'Drobečková navigace' }).getByRole('button', { name: 'Nemovitosti' }).click()
  await expect(address(page)).toHaveText(/\/nemovitosti$/)
})

test('modules and section order show up in the mock', async ({ page }) => {
  await open(page)
  await page.getByRole('button', { name: 'Pokračovat' }).click()

  await page.getByRole('switch', { name: /Mapa nemovitostí/ }).uncheck({ force: true })
  await expect(address(page)).toContainText('/nemovitosti')
  await expect(mock(page).getByText('Mapa nemovitostí')).toHaveCount(0)

  await page.getByRole('switch', { name: /Hypoteční kalkulačka/ }).check({ force: true })
  await expect(address(page)).toContainText('/nemovitosti/')
  await expect(mock(page).getByText('Hypoteční kalkulačka')).toBeVisible()

  await page.getByRole('switch', { name: /Blog/ }).uncheck({ force: true })
  await expect(mock(page).locator('[data-mock-section=blog]')).toHaveCount(0)
  await expect(mock(page).locator('header nav').first().getByText('Blog', { exact: true })).toHaveCount(0)

  await page.getByRole('button', { name: 'Posunout Čísla a výsledky nahoru' }).click()
  await page.getByRole('button', { name: 'Posunout Čísla a výsledky nahoru' }).click()
  await expect.poll(() => homeSections(page)).toEqual(['hero', 'featured', 'stats', 'services', 'agent', 'contact'])
})

test('brand and tone rewrite the mock', async ({ page }) => {
  await open(page)
  await page.getByRole('button', { name: 'Pokračovat' }).click()
  await page.getByRole('button', { name: 'Pokračovat' }).click()

  await page.locator('#brand-name').fill('Novák Reality')
  await expect(mock(page).locator('header').first()).toContainText('Novák Reality')

  const hero = mock(page).locator('[data-mock-section=hero] h1')
  const formal = await hero.innerText()
  await page.getByText('Přátelský', { exact: true }).click()
  await expect(hero).not.toHaveText(formal)
})

test('the phone frame gets the phone layout', async ({ page }) => {
  await open(page)
  await page.getByRole('radio', { name: 'Mobil' }).first().click()
  await expect(mock(page).getByRole('button', { name: 'Menu' })).toBeVisible()
  await expect(mock(page).locator('header nav').first()).toBeHidden()
})

test('submits exactly the JSON the debug panel shows', async ({ page }) => {
  await open(page, '?debug&utm_source=seznam')
  await page.getByText('Červená', { exact: true }).click()
  for (let i = 0; i < 2; i++) await page.getByRole('button', { name: 'Pokračovat' }).click()
  await page.locator('#brand-name').fill('Novák Reality')
  await page.getByRole('button', { name: 'Pokračovat' }).click()

  await expect(page.getByText('Váš výběr')).toBeVisible()
  await page.locator('#c-name').fill('Jan Novák')
  await page.locator('#c-email').fill('jan@novakreality.cz')
  await page.locator('input[type=checkbox]:not([role=switch])').check()

  const shown = JSON.parse(await page.locator('[data-debug-json]').innerText())
  const [request] = await Promise.all([
    page.waitForRequest('**/api/poptavka-webu'),
    page.getByRole('button', { name: 'Odeslat poptávku' }).click(),
  ])
  const sent = request.postDataJSON()
  delete shown.selection.capturedAt
  delete sent.selection.capturedAt
  expect(sent).toEqual(shown)
  expect(sent.selection.theme).toEqual({ name: 'realvista', variant: 'crimson' })
  expect(sent.selection.source.utm).toEqual({ source: 'seznam' })
  expect(sent.selection).not.toHaveProperty('domain')

  await expect(page.getByText('Děkujeme, poptávku máme')).toBeVisible()
})

test('Czech errors on an empty submit', async ({ page }) => {
  await open(page)
  for (let i = 0; i < 2; i++) await page.getByRole('button', { name: 'Pokračovat' }).click()
  await page.getByRole('button', { name: 'Pokračovat' }).click()
  await expect(page.getByText('Vyplňte název kanceláře nebo své jméno.')).toBeVisible()
  await page.locator('#brand-name').fill('Novák Reality')
  await page.getByRole('button', { name: 'Pokračovat' }).click()
  await page.getByRole('button', { name: 'Odeslat poptávku' }).click()
  await expect(page.getByText('Vyplňte jméno a příjmení.')).toBeVisible()
  await expect(page.getByText('Bez souhlasu vám nemůžeme odpovědět.')).toBeVisible()
})

test('a shared link restores the configuration', async ({ page, browser }) => {
  await open(page)
  await page.getByText('Hnědá', { exact: true }).click()
  await expect(page).toHaveURL(/[?&]k=/)
  const link = page.url()

  const fresh = await (await browser.newContext()).newPage()
  await fresh.goto(link)
  await expect(fresh.locator('input[name=variant][value=clay]')).toBeChecked()
})

test('no sideways scroll on a phone', async ({ browser }) => {
  const page = await (await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true })).newPage()
  await page.goto('/')
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375)
  await page.locator('#konfigurator').scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: 'Zobrazit náhled webu' }).click()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375)
})
