const {test, expect}= require('@playwright/test');

test('Unsuccessful/ Successful Login Playwright Test', async ({page})=>
{
    const userName= page.locator("#username");
    const passWord = page.locator("[type='password']");
    const signIn = page.locator("#signInBtn");

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log(await page.title());
    

    await userName.fill("rahulshetty");
    await passWord.fill("learning");
    await signIn.click();
    // console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText("Incorrect");
    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await signIn.click();
    console.log(await page.locator(".card-body a").first().textContent());
    console.log(await page.locator(".card-body a").nth(1).textContent());

});

test('UI Controls',async({page})=>
    {
        await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
        const userName= page.locator("#userEmail");
        const passWord = page.locator("#userPassword");
        const signIn = page.locator("[value='Login']");
        const dropdown = page.locator("select.form-control");
        //select dropdown
        await dropdown.selectOption("consult");

        //click radio button
        await page.locator(".radiotextsty").last().click();
        await page.locator("#okayBtn").click();
        console.log(await page.locator(".radiotextsty").last().isChecked());
        //assertion for checked radio button
        await expect(page.locator(".radiotextsty").last()).toBeChecked();
        //Alternate way
        expect(await page.locator(".radiotextsty").last().isChecked()).toBeTruthy();
        //click checkbox

        await page.locator("#terms").click();
        //assertion for checked check box
        await expect(page.locator("#terms")).toBeChecked();
        //uncheck checkbox
        await page.locator("#terms").uncheck();
        expect(await page.locator("#terms").isChecked()).toBeFalsy();

    });

test('Child Window Handle', async ({browser})=>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const docLink= page.locator("[href*='documents-request']");
    const [page1]= await Promise.all(
        [
            context.waitForEvent('page'),
            docLink.click()   
        ]);
    const text = await page1.locator(".red").textContent();
    const arrayText= text.split(" ");
    const domain = arrayText[4].split("@")[1]
    await page.locator("#username").fill(domain);

});
    