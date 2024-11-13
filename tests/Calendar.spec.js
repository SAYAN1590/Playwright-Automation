const {test, expect}= require('@playwright/test');

test('Calendar Validations', async ({browser,page})=>
{
        const date = "15";
        const monthNumber = "6";
        const year = "1690";
        const currentYear = new Date().getFullYear();

        await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
        await page.locator(".react-date-picker__inputGroup").click();
        await page.locator(".react-calendar__navigation__label").click();
        await page.locator(".react-calendar__navigation__label").click();

        //set year in the date picker
        let elementFound = false;
        let retry =0

        // Retry to search element until found for at max 20 times
        while (!elementFound && retry<21 ) {
            try {

                //Set timeout for the element < Global timeout to allow the catch block to be executed
                await page.getByText(year).waitFor({timeout:500});

                // Try to locate the element
                if (page.getByText(year)) {
                    await page.getByText(year).click();
                    elementFound = true; // Break the loop if the element is found
                } 
                
            } 
            catch (error) {
                // Compare with the current year to determine which way to navigate
                if(Number(year)< currentYear){
                    await page.locator(".react-calendar__navigation__prev-button").click();
                    
                }
                else
                {
                    await page.locator(".react-calendar__navigation__next-button").click();
                }
                
            }

            retry++;
        }

        if (elementFound==false)
        {
            console.log("Maximum Retry Reached....")
            await browser.close();
        }
        //set month in the date picker

        await page.locator(".react-calendar__year-view__months__month").nth(Number(monthNumber)-1).click();

        //set date in the date picker
        await page.locator("//abbr[text()='"+date+"']").click();
   
    
});