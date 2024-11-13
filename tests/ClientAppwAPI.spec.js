const {test, expect, request}= require('@playwright/test');
const loginPayLoad = {userEmail:"chhutkuritam@gmail.com",userPassword:"Iamsrk@1590"};
let token;
test.beforeAll( async()=>
{
    const apiContext = await request.newContext()
    const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
        {
            data:loginPayLoad
        })
    expect(loginResponse.ok()).toBeTruthy();

    const loginResponseJson = await loginResponse.json();
    token = loginResponseJson.token;
    console.log(token);
});


test('Client App Test', async ({page})=>
{
    page.addInitScript(value => {
        window.localStorage.setItem('token',value);

    },token);

    const userName= page.locator("#userEmail");
    const password = page.locator("#userPassword");
    const signIn = page.locator("[value='Login']");
    const products = page.locator(".card-body");
    const productName= "ZARA COAT 3";
    const email= "chhutkuritam@gmail.com";
    await page.goto("https://rahulshettyacademy.com/client");
    await products.last().locator("b").waitFor(); //alternative way
    const count = await products.count();
    //ZARA COAT 3
    for(let i=0;i< count;++i)
    {
        
        if(await products.nth(i).locator("b").textContent()=== productName)
        {
            //add to cart
            console.log("Match successful");
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }
    // Go to Cart Page
    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor();
    const bool = await page.locator ("h3:has-text('ZARA COAT 3')").isVisible();
    expect(bool).toBeTruthy();

    //click on Checkout button
    await page.locator("text=Checkout").click();

    //Enter the Country Name
    await page.locator("[placeholder*='Country']").pressSequentially("ind");
    const countryOptionsDropDown = page.locator(".ta-results");
    await countryOptionsDropDown.waitFor();
    const optionsCount= await countryOptionsDropDown.locator("button").count();
    for( let i =0; i< optionsCount; ++i)
    {
        const text= await countryOptionsDropDown.locator("button").nth(i).textContent();
        if(text.trim() === "India")
        {
            await countryOptionsDropDown.locator("button").nth(i).click();
            break;
        }
    }

    // Validate the login email in the Place-Order Page
    await expect(page.locator(".user__name [type= 'text']").first()).toHaveText(email);

    //click on the place order button
    await page.locator(".action__submit").click();

    // Validate the successful order placement message

    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");

    // Copy the order id

    const orderID  = await page.locator(".em-spacer-1 .ng-star-inserted").textContent()
    console.log(orderID);

    //Go to Orders Page

    await page.locator(".btn[routerlink*='myorders']").click();

    // Find the Order ID in the Order History Page

    const orderRow= page.locator(".table .ng-star-inserted");
    await orderRow.first().waitFor();
    const orderCount= await orderRow.count();
    
    for( let i=0; i< orderCount; ++i)
    {
        const rowOrderId= await orderRow.nth(i).locator("th").textContent();

        if (orderID.includes(rowOrderId))
        {
            // View the order details
            await orderRow.nth(i).locator("button").first().click();
        }

        break;
    }

    //Verify the order ID in the Order Details Page

    const orderIdDetails= await page.locator("div.col-text").textContent();

    expect(orderID.includes(orderIdDetails)).toBeTruthy();
});

