const { test, expect } = require('@playwright/test');

test('Calendar Validations', async ({ browser, page }) => {
  const date = "15";
  const monthNumber = "6";
  const year = "2014";
  const currentYear = new Date().getFullYear();

  await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
  await page.locator(".react-date-picker__inputGroup").click();
  await page.locator(".react-calendar__navigation__label").click();
  await page.locator(".react-calendar__navigation__label").click();

  // Set year in the date picker
  let elementFound = false;
  let retry = 0;

  // Retry to search for the element until found or max retries reached
  while (!elementFound && retry < 21) {
    const yearLocator = page.getByText(year);
    const isYearVisible = await yearLocator.isVisible({ timeout: 500 });

    if (isYearVisible) {
      await yearLocator.click();
      elementFound = true; // Break the loop if the element is found
    } else {
      // Navigate to the previous or next year
      if (Number(year) < currentYear) {
        await page.locator(".react-calendar__navigation__prev-button").click();
      } else {
        await page.locator(".react-calendar__navigation__next-button").click();
      }
    }

    retry++;
  }

  if (!elementFound) {
    console.log("Maximum Retry Reached....");
    await browser.close();
    return; // Exit the test if the year is not found
  }

  // Set month in the date picker
  await page
    .locator(".react-calendar__year-view__months__month")
    .nth(Number(monthNumber) - 1)
    .click();

  // Set date in the date picker
  await page.locator(`//abbr[text()='${date}']`).click();

  //Validation of the date after picking from date picker

  const date_locator= page.locator(".react-date-picker__inputGroup__day");
  const month_locator= page.locator(".react-date-picker__inputGroup__month");
  const year_locator= page.locator(".react-date-picker__inputGroup__year");

  await expect (date_locator).toHaveValue(date);
  await expect (month_locator).toHaveValue(monthNumber);
  await expect (year_locator).toHaveValue(year);

});