const fs = require('fs')
const html = fs.readFileSync('public/index.html', 'utf8')
const data = require('../public/calendar')
const mkdirp = require('mkdirp')
const path = require('path')
const escapeHtml = require('escape-html')

for (const event of data) {
  const id = event.id
  const filepath = `public/event/${id}.html`
  const metaTags = `
    <meta property="og:title" content="${escapeHtml(event.title)}">
    <meta property="og:description" content="${escapeHtml(event.summary)}">
    <meta property="og:image" content="/og-image.png">
  `
  const outHtml = html
    .replace(/<meta property(?:[^>"]|"([^"]*)")+>/g, '<!--og-->')
    .replace(/<!--og-->/, () => metaTags)
    .replace(/<!--og-->/g, '')
  console.log(`Generating "${filepath}"...`)
  mkdirp.sync(path.dirname(filepath))
  fs.writeFileSync(filepath, outHtml)
}
