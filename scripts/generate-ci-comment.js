const fs = require('fs')
const { execSync } = require('child_process')

console.error('# Please pipe the output of this command to "tmp/ci-comment.txt"')
console.error(`# so that the "post-ci-comment.js" works!`)

const buildUrl = `https://circleci.com/gh/ThaiProgrammer/tech-events-calendar/${process.env.CIRCLE_BUILD_NUM}`
const checkBuildLog = '[โปรดตรวจสอบข้อมูล Log ใน CircleCI (Please check the logs in CircleCI).](' + buildUrl + ')'

if (!fs.existsSync('public/calendar.json')) {
  console.log(':rotating_light: **ไม่สามารถประมวลผลไฟล์ข้อมูลได้ (Cannot process data file.)**')
  console.log(checkBuildLog)
  console.log()
} else if (!fs.existsSync('public/calendar.ics')) {
  console.log(':rotating_light: **ไม่สามารถสร้างไฟล์ปฏิทินได้ (Cannot generate ICS file.)**')
  console.log(checkBuildLog)
  console.log()
}

if (fs.existsSync('tmp/readme-parse-diagnostic.json')) {
  const diagnostics = require('../tmp/readme-parse-diagnostic.json')
  if (diagnostics.errors && diagnostics.errors.length) {
    console.log(':x: **ข้อผิดพลาดในการประมวลผลไฟล์ (Processing errors):**')
    console.log()
    for (const error of diagnostics.errors) {
      console.log(
        '  - ' + require('escape-html')(error.message) + '<br />' +
        error.location.filename + ', line ' + error.location.line + ', column ' + error.location.column
      )
      console.log()
    }
    console.log()
  }
}

if (fs.existsSync('public/calendar.json')) {
  console.log(':green_heart: **ประมวลผลข้อมูลสำเร็จ (Calendar data processed successfully!)**')
  console.log()
  try {
    console.error('# Now diffing calendar.json file.')
    execSync('curl https://thaiprogrammer-tech-events-calendar.spacet.me/calendar.json > /tmp/master-calendar.json', { timeout: 10000 })
    const diffResult = execSync('diff -u /tmp/master-calendar.json public/calendar.json || true', { timeout: 2000 }).toString()
    if (diffResult.trim()) {
      console.log(':bulb: **ข้อมูลปฏิทินมีการเปลี่ยนแปลง (Calendar data has been changed):**')
      console.log('```diff')
      console.log(diffResult)
      console.log('```')
    } else {
      console.log(':bulb: **ข้อมูลปฏิทินเหมือนเดิม (Calendar data unchanged.)**')
    }
    console.log()
  } catch (e) {
    logError('Failed to generate JSON diff.', e)
  }
}

function logError (m, e) {
  console.log(':x: **' + m + '**')
  console.log('Error:')
  console.log('```')
  console.log(e.stack)
  console.log('```')
  console.log()
}
