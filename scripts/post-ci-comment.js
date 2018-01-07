const fs = require('fs')
const comments = fs.readFileSync('tmp/ci-comment.txt', 'utf8')
const axios = require('axios')

axios.post('https://thaiprogrammer-tech-events-calendar-bot.glitch.me/pare/' + process.env.CIRCLE_BUILD_NUM, {
  body: comments
})
