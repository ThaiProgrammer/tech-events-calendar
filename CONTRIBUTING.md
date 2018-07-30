# CONTRIBUTING

Thanks for your interest in making this project better!

Here are ways you can contribute to this project.

## Add an event to the project

Please check out our process document: [The Process of Adding New Events to the calendar.thaiprogrammer.org Database and Facebook Page](https://paper.dropbox.com/doc/The-Process-of-Adding-New-Events-to-the-calendar.thaiprogrammer.org-Database-and-Facebook-Page-NhTeG7Sxzd7LuVWFuE3OP). This document explains how you can submit a new event to this 

### Criteria for events

To avoid information clutter on this calendar, here is the guideline of what should be in the calendar.

- It should be a public event (e.g. meetups, conferences, hackathons, workshop).
    - The event should be organized _for_ the community. (Events organized by businesses are OK, but they should be for the benefit of the community.)
    - Therefore, paid training courses and paid workshops of commercial nature are not allowed.
- The location and topics should already be determined.
- For recurring events, only 1 upcoming event should be on the calendar.

### Contributing event data

Event data is stored in the [data](data) folder. They are organized by month. Inside each month’s folder, there are Markdown files. Each Markdown file represents 1 event.

It looks like this:

```markdown
---
id: a-unique-event-id
date: '2018-01-27'
time: '18:00 ~ 21:00'
location:
  url: https://www.google.com/maps/place/....
  title: Place title
  detail: Optional detail about the place
categories:
  - Meetup
topics:
  - JavaScript
links:
  - type: website
    url: https://...
    title: Website title
  - type: ticket
    url: https://eventpop.me/e/...
    title: Event Pop
  - type: rsvp
    url: https://www.facebook.com/events/.../
    title: Facebook Event
---

# Event title

> One line of summary. Not longer than 280 characters.

Event description, 3 paragraphs or less.
```

- `id` A unique ID for the event.
- `date` The date for the event. Examples:
  - '2018-01-01' (Single day)
  - '2018-01-25 ~ 2018-01-27' (Date range)
- `time` The time for the event. Not needed for all-day events. Examples:
  - '18:00 ~ 21:00'
  - '18:00 ~ 21:00++' (If there are e.g. networking after party)
- `location`
  - `url` Google Maps URL
  - `title` Name of the place
  - `detail` More information that’s useful for navigation. E.g., if the place is inside a building, you can name the building and the floor.
- `categories` Allowed categories are:
  - **Codefest** — Come and code
  - **Conference**
  - **Hackathon** — Come and build things
  - **Meetup**
  - **Workshop**
- `topics` A list of topics related to this event.
- `links` A list of links. Each link should contain these fields:
  - `type` The type of link. Allowed values are:
    - **website** — The official website for the event
    - **ticket** — Where to get or buy tickets
    - **rsvp** — To tell your friends that you are going, e.g. Facebook Events link
  - `url`
  - `title`
  - `price` Price to join this event. This is only valid for ticket type links. Examples:
    - **FREE** — the event is free to join
    - **300 THB**


## Spread the word

- **Star** this project on GitHub.

- **Share and promote the website,** [calendar.thaiprogrammer.org](https://calendar.thaiprogrammer.org/).

- **Like and share our Facebook page,** https://www.facebook.com/thtechevents


## Update incorrect/incomplete event data

If you found a mistake in any event’s data, please help us correct it.

On the event page, you can click on the “Edit on GitHub” button to edit the event data, and submit your correction to the project.


## Help maintain this project

The goal of this project is to be **community-maintained**,
rather than being maintained by a single entity.
If you want to help maintain this project,
[please go to the CALL FOR MAINTAINERS page](https://github.com/ThaiProgrammer/tech-events-calendar/issues/11).


## Other things you can help

- Help writing the documentation for this project to make it easier for first-time contributors to get started with this project.

- Take a look at issues labeled [`help wanted`](https://github.com/ThaiProgrammer/tech-events-calendar/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22help+wanted%22). Issues friendly for first-time contributors are labeled [`good first issue`](https://github.com/ThaiProgrammer/tech-events-calendar/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22good+first+issue%22).

- Teach your friends to use Git and GitHub by guiding them through the process of making a contribution to this project. We are already doing good practices such as automated tests, CI and CD, so this project can be useful for introducing people to modern software development.

- Report bugs, suggest design/UX improvements, [file an issue](https://github.com/ThaiProgrammer/tech-events-calendar/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc).
