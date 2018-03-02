const puppeteer = require('puppeteer')
let browser
let page
let previousRendering

async function initialize () {
  browser = await puppeteer.launch()
  page = await browser.newPage()
  await page.goto(`file://${require.resolve('./imageTemplate.html')}`, {
    waitUntil: 'networkidle2'
  })
  await page.setViewport({
    width: 1200,
    height: 1200
  })
  previousRendering = Promise.resolve()
}

async function destroy () {
  await browser.close()
}

function generateImage (event, outputFilepath) {
  const currentRendering = previousRendering
    .then(async () => {
      console.log(`Rendering "${outputFilepath}"`)
      await page.evaluate(title => {
        window.setTitle(title)
      }, event.title)
      await page.screenshot({ path: outputFilepath })
    })
  previousRendering = currentRendering
  return currentRendering
}

initialize()
  .then(() => Promise.all([
    generateImage({ title: 'meow 1' }, 'file1.png'),
    generateImage({ title: 'meow 2' }, 'file2.png'),
    generateImage({ title: 'meow 3' }, 'file3.png'),
    generateImage({ title: 'meow 4' }, 'file4.png'),
    generateImage({ title: 'meow 5' }, 'file5.png')
  ]))
  .then(destroy)
