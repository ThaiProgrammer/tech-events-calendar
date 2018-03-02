// This script generates a separate HTML file for each event.
// This allows each event’s URL to be shared easily on Facebook
// and other social networks.
//
// See this issue for more information:
// https://github.com/ThaiProgrammer/tech-events-calendar/issues/87
//
// 1. Reads `index.html` file (template)
// 2. Reads `calendar.json` (data)
// 3. For each event, create `public/event/[id].html`,
//    replacing the meta tags.

const fs = require('fs')
const html = fs.readFileSync('public/index.html', 'utf8')
const data = require('../public/calendar')
const mkdirp = require('mkdirp')
const path = require('path')
const escapeHtml = require('escape-html')

const findImage = (filepath) => {
  const pngPath = filepath.replace(/\.md$/, '.png')
  if (fs.existsSync(pngPath)) return pngPath
}

for (const event of data) {
  const id = event.id
  const outFilepath = `public/event/${id}.html`
  const inImageFilepath = findImage(event.declared.filename)

  let imageUrl = '/og-image.png'
  if (inImageFilepath) {
    const outImagePathname = `/event/${id}.png`
    const outImageFilepath = `public${outImagePathname}`
    imageUrl = outImagePathname
    mkdirp.sync(path.dirname(outImageFilepath))
    console.log(`Copying image "${outImageFilepath}"`)
    fs.copyFileSync(inImageFilepath, outImageFilepath)
  }

  const metaTags = `
    <meta property="og:title" content="${escapeHtml(event.title)}">
    <meta property="og:description" content="${escapeHtml(event.summary)}">
    <meta property="og:image" content="${imageUrl}">
  `
  const outHtml = html
    .replace(/<meta property(?:[^>"]|"([^"]*)")+>/g, '<!--og-->')
    .replace(/<!--og-->/, () => metaTags)
    .replace(/<!--og-->/g, '')
  console.log(`Generating "${outFilepath}"...`)
  mkdirp.sync(path.dirname(outFilepath))
  fs.writeFileSync(outFilepath, outHtml)
}
