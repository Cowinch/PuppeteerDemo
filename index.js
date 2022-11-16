const puppeteer = require('puppeteer')
const fs = require('fs/promises')
const cron = require('node-cron')
async function start() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://learnwebcode.github.io/practice-requests/')

    //creates an image
    // await page.screenshot({path: 'amazing.png', fullPage: true})

    //creates a txt file with red, orange and yellow written on different lines
    // const colors = ['red', 'orange', 'yellow']
    // await fs.writeFile('colors.txt', colors.join("\r\n"))

    const names = await page.evaluate(() => {
        //the inside of this callback function is frontEnd/browser land, not backEnd/node land. Console.logs here will go to the browser, not the terminal
        return Array.from(document.querySelectorAll('.info strong')).map(x => x.textContent)
    })
    await fs.writeFile('names.txt', names.join("\r\n"))

    await page.click('#clickme')
    //  first argument is a css-like selector (img, h1, .container, #header-box ect.)
    const clickedData = await page.$eval("#data", element => element.textContent)
    console.log(clickedData)

    // we use $$ instead of just one because this isnt a class or id.
    const photos = await page.$$eval('img', (imgs) => {
        return imgs.map(image => image.src)
    })

    await page.type('#ourfield', "blue")
    await Promise.all([page.click("ourform button"), page.waitForNavigation()]) 
    //if we used two $, we would have type out document.querySelector ect. instead we can just type #message
    const info = await page.$eval("#message", element => element.textContent)
    console.log(info)

    //for of, NOT for each as for each does not work with await syntax
    for (const photo of photos) {
        const imagePage = await page.goto(photo)
        // photo.split('/').pop() will take the https://learnwebcode.github.io/practice-requests/images/cat-1.jpg and return only cat-1.jpg
        await fs.writeFile(photo.split('/').pop(), await imagePage.buffer())
    }


    await browser.close()
}

start()

//scheduling a file like this is not the correct way to go about this
// cron.schedule("*/5 * * * * *", start)