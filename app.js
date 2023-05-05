const puppeteer = require('puppeteer');

var sql = require("mssql");

    try {
        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect();//connection string here
        const result = await sql.query`INSERT INTO nasdaq (Symbol, NameC, Last_Sale, Net_Change, Percent_Change, Market_Cap, Reccomendation) VALUES(${item},${item1},${item2},${item3},${item4},${item5}, ${item6});`;
        console.dir(result);
    } catch (err) {
        console.log(err);
    }
    
}

async function run() {
    let browser;
    
    try {
        browser = await puppeteer.launch({headless: false});
        

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(2 * 60 * 1000);
        await page.goto('https://www.nasdaq.com/market-activity/stocks/screener');
        //wait 2 seconds for page to load
        
        const radio1 = await page.$('#filterModal > div > div.nasdaq-screener__form-items > div.nasdaq-screener__form-set.nasdaq-screener__exchange-group > div > div.nasdaq-screener__radio-box--exchange-item.nasdaq-screener__radio-box--exchange-item-NASDAQ > label')
        await radio1.click();
        const radio2 = await page.$('#filterModal > div > div.nasdaq-screener__form-items > div.nasdaq-screener__form-set.nasdaq-screener__analyst-rating > div > div > label:nth-child(3)')
        await radio2.click();
        const radio3 = await page.$('#filterModal > div > div.nasdaq-screener__form-items > div.nasdaq-screener__form-set.nasdaq-screener__analyst-rating > div > div > label:nth-child(1)')

        await radio3.click();
        const radio7 = await page.$('#filterModal > div > div.nasdaq-screener__form-button.nasdaq-screener__form-button--overlay > button.nasdaq-screener__form-button--apply')
        await radio7.click();

        const selector = 'body > div.dialog-off-canvas-main-canvas > div > main > div.page__content > article > div:nth-child(3) > div.layout--main > div > div > div.nasdaq-screener__content-container > div.nasdaq-screener__table-container';
        await page.waitForSelector(selector);
        
        const el = await page.$(selector);
        const text = await el.evaluate(e => e.innerText);
        //turn the text into an array
        const textrow = text.split('\n');
        
        
        //make a for loop for textrow setting i to the index of the array
        for (let i = 1; i < textrow.length; i++) {
            var list = textrow[i].split('\t'); 
            sqlQuery(list[0],list[1],list[2],list[3],list[4],list[5], 'Buy');
        }
        

        

        console.log(`Buy Reccomended: \n \n \n Sql Updated`);
       
        
        const radio5 = await page.$('#filterModal > div > div.nasdaq-screener__form-items > div.nasdaq-screener__form-set.nasdaq-screener__analyst-rating > div > div > label:nth-child(5)')
        await radio5.click();
        await radio2.click();
        await radio3.click();
        const radio6 = await page.$('#filterModal > div > div.nasdaq-screener__form-items > div.nasdaq-screener__form-set.nasdaq-screener__analyst-rating > div > div > label:nth-child(4)')
        await radio6.click();
        await radio7.click();
        

        await page.waitForSelector(selector);
        
         const el2 = await page.$(selector);
        const text2 = await el2.evaluate(e => e.innerText);
        //turn the text into an array
        const texterrow = text2.split('\n');
        //foreach item in the array, split it into a new array item on the tab character
        //make a for loop for te

        for (let i = 1; i < texterrow.length; i++) {
            var list = texterrow[i].split('\t');
            sqlQuery(list[0], list[1], list[2], list[3], list[4], list[5], 'Sell');
        }
        console.log(`\n \n \n \n Sell Reccomended: SQL UPDATED`);
    } catch (e) {
        console.error('run failed', e);
    } finally {
        await browser?.close();
    }
}


if (require.main == module)
    run();