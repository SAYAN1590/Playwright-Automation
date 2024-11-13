const {test, expect, request}= require('@playwright/test');
const loginPayLoad = {userEmail:"chhutkuritam@gmail.com",userPassword:"Iamsrk@1590"};
let token;

const orderPayLoad = {orders: [{country: "Cuba", productOrderedId: "6581ca399fd99c85e8ee7f45"}]};
let orderID;

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

    const orderResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
        {
            data: orderPayLoad,
            headers:
            {
                'Authorization':token,
                'Content-Type':'application/json'
            }
        })
    const orderResponseJson = await orderResponse.json();
    orderID= orderResponseJson.orders[0];
    console.log(orderID);

});


test('Client App Test', async ({page})=>
{
    await page.addInitScript(value => {
        window.localStorage.setItem('token',value);
    },token);

    await page.goto("https://rahulshettyacademy.com/client");
    
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

