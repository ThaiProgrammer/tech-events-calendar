const parseMarkdown = require('./parseMarkdown')
const s = require('common-tags').stripIndent

it('parses a valid markdown file successfully', () => {
  const md = s`
    ---
    id: google-cloud-onboard-bangkok-2018
    date: '2018-01-30'
    time:
      - '08:30 ~ 12:00'
      - '12:00 ~ 13:00 (break lol)'
      - '13:00 ~ 17:30++'
    location:
      title: Centara Grand at CentralWorld
      url: >-
        https://www.google.com/maps/place/Centara+Grand+at+CentralWorld/@13.7477222,100.5365583,17z/data=!3m1!4b1!4m5!3m4!1s0x30e2992f7809567f:0xccc050cff0e7d234!8m2!3d13.747717!4d100.538747
      detail: 'Convention Centre B2, 22nd Floor'
    categories:
      - Workshop
    topics:
      - Google Cloud Platform
      - Cloud
    links:
      - type: website
        url: 'https://cloudplatformonline.com/2018-onboard-bkk.html'
        title: Google Cloud
      - type: ticket
        url: 'https://cloudplatformonline.com/2018-onboard-bkk.html#register'
        title: Google Cloud

    ---
    # Google Cloud OnBoard Bangkok 2018

    > งานสัมมนา Google Cloud OnBoard นี้เป็นงานสัมมนาฟรีที่วิทยากรจาก Google
    > จะมาแนะนำเทคโนโลยีของ Google Cloud Platform งานนี้เหมาะกับทั้ง IT Managers,
    > Systems Engineers and Operations professionals, Developers, Solution
    > Architects, และผู้ที่สนใจในเทคโนโลยีของ Google ทุกคน

    Cloud OnBoard is a free full-day instructor-led enablement and training event that will provide you with a step-by-step technical introduction to the Google Cloud Platform (GCP). Through a combination of instructor-led presentations and hands-on labs, you will learn how to get started with Google App Engine, Datastore, Storage, Container Engine, Compute Engine and Network, Big Data and Machine Learning.
  `
  const result = parseMarkdown(md)
  expect(result).toMatchSnapshot()
})
