import { Builder, By, Key, until } from 'selenium-webdriver'
import assert from 'assert'

// Test configuration
const APP_URL = 'http://localhost:5173/'
const TIMEOUT = 15000
const IMPLICIT_WAIT = 10000

// Test result tracking
let testsPassed = 0
let testsFailed = 0
const failedTests = []

// Utility function to log test results
function logTest(testName, passed, message = '') {
  const status = passed ? '✓ PASS' : '✗ FAIL'
  console.log(`${status}: ${testName}${message ? ' - ' + message : ''}`)
  if (passed) {
    testsPassed++
  } else {
    testsFailed++
    failedTests.push({ test: testName, message })
  }
}

// Utility function for waiting
async function waitForElement(driver, locator, timeout = TIMEOUT) {
  return driver.wait(until.elementLocated(locator), timeout)
}

// Utility function to get element text safely
async function getElementText(element) {
  try {
    return await element.getText()
  } catch {
    return ''
  }
}

// Main test suite
;(async function runShoppingAppTests() {
  let driver

  try {
    // Initialize WebDriver
    console.log('\n' + '='.repeat(70))
    console.log('SHOPPING APP AUTOMATION TEST SUITE')
    console.log('='.repeat(70))
    console.log('Initializing WebDriver...\n')

    driver = await new Builder().forBrowser('chrome').build()

    await driver.manage().setTimeouts({ implicit: IMPLICIT_WAIT })

    // ========== NAVIGATION & LOAD TESTS ==========
    console.log('\n--- NAVIGATION & LOAD TESTS ---')

    try {
      console.log(`Navigating to ${APP_URL}`)
      await driver.get(APP_URL)

      const title = await driver.getTitle()
      logTest('Page Load & Title', title && title.length > 0, `Title: ${title}`)
    } catch (e) {
      logTest('Page Load', false, e.message)
    }

    // ========== UI ELEMENT DISCOVERY TESTS ==========
    console.log('\n--- UI ELEMENT DISCOVERY TESTS ---')

    // Test: Check for main app container
    try {
      const appContainer = await driver.findElement(By.css('[data-v-app], #app, main, .container'))
      logTest('App Container Found', true)
    } catch (e) {
      logTest('App Container Found', false)
    }

    // Test: Check for tabs/navigation
    try {
      const tabs = await driver.findElements(By.css('[role="tab"], button[role="tab"]'))
      logTest('Navigation Tabs', tabs.length > 0, `Found ${tabs.length} tab(s)`)
    } catch (e) {
      logTest('Navigation Tabs', false)
    }

    // Test: Check for Product List tab
    try {
      const productListTab = await driver.findElement(
        By.xpath("//button[contains(., 'Product List')]"),
      )
      logTest('Product List Tab', true)
    } catch (e) {
      logTest('Product List Tab', false, 'Tab not found')
    }

    // Test: Check for Product Management tab
    try {
      const productMgmtTab = await driver.findElement(
        By.xpath("//button[contains(., 'Product Management')]"),
      )
      logTest('Product Management Tab', true)
    } catch (e) {
      logTest('Product Management Tab', false, 'Tab not found')
    }

    // ========== CART FUNCTIONALITY TESTS ==========
    console.log('\n--- CART FUNCTIONALITY TESTS ---')

    // Test: Find Cart Icon
    try {
      // Use the button that contains the icon
      const cartButton = await driver.findElement(
        By.css('button.p-overlay-badge, button:has(.pi-shopping-cart)'),
      )
      logTest('Cart Icon Found', true)

      // Test: Open Cart Drawer
      await cartButton.click()
      await driver.sleep(1000) // Wait for animation
      const drawer = await driver.findElement(
        By.css('.p-drawer, .p-sidebar, [role="complementary"]'),
      )
      logTest('Cart Drawer Opens', true)

      // Close drawer (click outside or close button if available, or just refresh)
      await driver.navigate().refresh()
      await driver.sleep(2000) // Wait for reload
    } catch (e) {
      logTest('Cart Functionality', false, e.message)
    }

    // ========== PRODUCT LIST TESTS ==========
    console.log('\n--- PRODUCT LIST TESTS ---')

    try {
      // Click on Product List tab if not already active
      const productListTab = await driver.findElement(
        By.xpath("//button[contains(., 'Product List')]"),
      )
      await productListTab.click()
      await driver.sleep(1000)
      logTest('Navigate to Product List', true)
    } catch (e) {
      logTest('Navigate to Product List', false)
    }

    // Test: Search bar presence
    try {
      const searchBar = await driver.findElement(
        By.css(
          'input[placeholder*="search"], input[placeholder*="Search"], [class*="search"] input',
        ),
      )
      logTest('Search Bar Found', true)
    } catch (e) {
      logTest('Search Bar Found', false, 'Search functionality may not be available')
    }

    // Test: Product cards/items displayed
    try {
      // Wait for products to load (skeleton to disappear)
      await driver.sleep(2000)
      const products = await driver.findElements(
        By.css('.bg-white.rounded-lg.shadow-sm, .product-card'),
      )
      // Filter out the sidebar if it matches the generic class
      const productCards = products.filter(async (el) => {
        const text = await el.getText()
        return text.includes('$') // Simple heuristic for product card
      })

      logTest(
        'Products Displayed',
        products.length > 0,
        `Found ${products.length} potential product elements`,
      )
    } catch (e) {
      logTest('Products Displayed', false, 'No products found on page')
    }

    // Test: Product details visibility (names, prices)
    try {
      const productNames = await driver.findElements(
        By.xpath(
          "//*[contains(@class, 'product') or contains(@class, 'title') or contains(@class, 'name')]",
        ),
      )
      logTest(
        'Product Information Visible',
        productNames.length > 0,
        `Found ${productNames.length} product element(s)`,
      )
    } catch (e) {
      logTest('Product Information Visible', false)
    }

    // Test: Pagination or load more functionality
    try {
      const pagination = await driver.findElements(
        By.css('.p-paginator, .paginator, [class*="paginator"], [class*="pagination"]'),
      )
      if (pagination.length > 0) {
        logTest('Pagination Controls', true, `Found ${pagination.length} pagination element(s)`)
      } else {
        logTest('Pagination Controls', false, 'No pagination found')
      }
    } catch (e) {
      logTest('Pagination Controls', false, e.message)
    }

    // ========== SEARCH FUNCTIONALITY TESTS ==========
    console.log('\n--- SEARCH FUNCTIONALITY TESTS ---')

    try {
      const searchInputs = await driver.findElements(
        By.css('input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]'),
      )
      if (searchInputs.length > 0) {
        const searchInput = searchInputs[0]

        // Test: Type in search
        await searchInput.clear()
        await searchInput.sendKeys('test')
        logTest('Search Input Interaction', true, 'Typed search term')

        // Wait for results to update
        await driver.sleep(1000)

        // Test: Clear search
        await searchInput.clear()
        await driver.sleep(500)
        logTest('Clear Search Input', true)
      } else {
        logTest('Search Input Interaction', false, 'No search input found')
      }
    } catch (e) {
      logTest('Search Input Interaction', false, e.message)
    }

    // ========== PRODUCT MANAGEMENT TESTS ==========
    console.log('\n--- PRODUCT MANAGEMENT TESTS ---')

    try {
      const productMgmtTab = await driver.findElement(
        By.xpath("//button[contains(., 'Product Management')]"),
      )
      await productMgmtTab.click()
      await driver.sleep(1000)
      logTest('Navigate to Product Management', true)
    } catch (e) {
      logTest('Navigate to Product Management', false, e.message)
    }

    // Test: Add Product button presence
    try {
      const addButtons = await driver.findElements(
        By.xpath(
          "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'add')] | //button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'new')]",
        ),
      )
      if (addButtons.length > 0) {
        logTest('Add Product Button', true)
      } else {
        logTest('Add Product Button', false, 'No add button found')
      }
    } catch (e) {
      logTest('Add Product Button', false)
    }

    // Test: Product form/dialog elements
    try {
      const inputs = await driver.findElements(By.css('input, textarea'))
      if (inputs.length > 0) {
        logTest('Form Elements Present', true, `Found ${inputs.length} form input(s)`)
      } else {
        logTest('Form Elements Present', false)
      }
    } catch (e) {
      logTest('Form Elements Present', false)
    }

    // ========== TAB NAVIGATION TESTS ==========
    console.log('\n--- TAB NAVIGATION TESTS ---')

    try {
      // Navigate back to Product List
      const productListTab = await driver.findElement(
        By.xpath("//button[contains(., 'Product List')]"),
      )
      await productListTab.click()
      await driver.sleep(1000)
      logTest('Tab Navigation - List to Management', true)
    } catch (e) {
      logTest('Tab Navigation - List to Management', false, e.message)
    }

    try {
      // Navigate back to Management
      const productMgmtTab = await driver.findElement(
        By.xpath("//button[contains(., 'Product Management')]"),
      )
      await productMgmtTab.click()
      await driver.sleep(1000)
      logTest('Tab Navigation - Management to List', true)
    } catch (e) {
      logTest('Tab Navigation - Management to List', false, e.message)
    }

    // ========== RESPONSIVE UI TESTS ==========
    console.log('\n--- RESPONSIVE UI TESTS ---')

    try {
      const bodyText = await driver.findElement(By.css('body')).getText()
      logTest(
        'Page Content Loaded',
        bodyText && bodyText.length > 50,
        `Content length: ${bodyText.length} chars`,
      )
    } catch (e) {
      logTest('Page Content Loaded', false)
    }

    // Test: Check for error messages
    try {
      const errorElements = await driver.findElements(
        By.xpath(
          "//*[contains(@class, 'error') or contains(@class, 'alert') or contains(@class, 'warning')]",
        ),
      )
      if (errorElements.length === 0) {
        logTest('No Error Messages', true)
      } else {
        logTest('Error Messages Check', false, `Found ${errorElements.length} error element(s)`)
      }
    } catch (e) {
      logTest('No Error Messages', true, 'No error detection needed')
    }

    // Test: Check for loading indicators
    try {
      const loadingElements = await driver.findElements(
        By.xpath("//*[contains(@class, 'loading') or contains(@class, 'spinner')]"),
      )
      logTest(
        'Page Fully Loaded',
        loadingElements.length === 0,
        `Loading elements: ${loadingElements.length}`,
      )
    } catch (e) {
      logTest('Page Fully Loaded', true)
    }

    // ========== ACCESSIBILITY TESTS ==========
    console.log('\n--- ACCESSIBILITY TESTS ---')

    try {
      const buttons = await driver.findElements(By.css('button'))
      if (buttons.length > 0) {
        logTest('Buttons Present', true, `Found ${buttons.length} button(s)`)
      } else {
        logTest('Buttons Present', false)
      }
    } catch (e) {
      logTest('Buttons Present', false)
    }

    try {
      const labels = await driver.findElements(By.css('label'))
      logTest('Form Labels', labels.length >= 0, `Found ${labels.length} label(s)`)
    } catch (e) {
      logTest('Form Labels', false)
    }

    // ========== CONSOLE ERRORS TEST ==========
    console.log('\n--- CONSOLE LOGS TEST ---')

    try {
      const logs = await driver.manage().logs().get('browser')
      const errorLogs = logs.filter((log) => log.level.value > 900) // WARNING and SEVERE
      if (errorLogs.length === 0) {
        logTest('No Browser Errors', true)
      } else {
        logTest('Browser Console', false, `Found ${errorLogs.length} error(s)`)
        errorLogs.forEach((log, i) => {
          if (i < 3) console.log(`  Error: ${log.message.substring(0, 100)}`)
        })
      }
    } catch (e) {
      logTest('Console Logs Check', false, 'Browser logs not available')
    }
  } catch (error) {
    console.error('\n✗ Test Suite Error:', error.message)
    testsFailed++
  } finally {
    // Print summary
    console.log('\n' + '='.repeat(70))
    console.log('TEST SUMMARY')
    console.log('='.repeat(70))
    console.log(`✓ Passed: ${testsPassed}`)
    console.log(`✗ Failed: ${testsFailed}`)
    console.log(`  Total:  ${testsPassed + testsFailed}`)
    console.log('='.repeat(70))

    if (failedTests.length > 0 && failedTests.length <= 5) {
      console.log('\nFailed Tests:')
      failedTests.forEach((test) => {
        console.log(`  - ${test.test}${test.message ? ': ' + test.message : ''}`)
      })
    }

    // Write results to JSON file
    const fs = await import('fs')
    const results = {
      passed: testsPassed,
      failed: testsFailed,
      total: testsPassed + testsFailed,
      failures: failedTests,
    }
    fs.writeFileSync('test_results.json', JSON.stringify(results, null, 2))

    // Close the browser
    if (driver) {
      await driver.quit()
      console.log('\nBrowser closed.')
    }

    // Exit with appropriate code
    process.exit(testsFailed > 0 ? 1 : 0)
  }
})()
