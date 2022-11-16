const puppeteer = require('puppeteer')

async function start() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://learnwebcode.github.io/practice-requests/')

    //creates an image
    // await page.screenshot({path: 'amazing.png', fullPage: true})
    
    await browser.close()
}

start()