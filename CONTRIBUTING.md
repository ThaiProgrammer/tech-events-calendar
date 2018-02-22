# CONTRIBUTING

Thanks for your interest in making this project better!

## Missing events

Please [submit an event by creating an issue using this link](https://github.com/ThaiProgrammer/tech-events-calendar/issues/new?title=[Event]+«EVENT TITLE HERE»&body=%23%23%23%20Date%20and%20time%0AYYYY-MM-DD%0AHH%3AMM%20~%20HH%3AMM%0A%0A%23%23%23%20Location%0A%3C!--%20Please%20include%20Google%20Maps%20link%20--%3E%0A%0A%0A%23%23%23%20Links%0A%3C!--%20Please%20include%20relevant%20links%20--%3E%0A-%20Website%3A%0A-%20Tickets%3A%0A-%20Facebook%20event%3A%0A%0A%23%23%23%20Event%20summary%0A%3C!--%20One%20paragraph%2C%20not%20longer%20than%20280%20chars%20--%3E%0A%0A%0A%23%23%23%20Event%20description%0A%3C!--%20Not%20more%20than%203%20paragraph%20--%3E%0A%0A%0A). Our contributors team will review your submission and add it to the calendar as appropriate. Please make sure that your event follows the criteria below.

You can also contribute the event data directly and send us a pull request.

### Criteria for events

To avoid information clutter on this calendar, here is the guideline of what should be in the calendar.

- It should be a public event (e.g. meetups, conferences, hackathons, workshop).
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


## Event data is incorrect or incomplete

If you found a mistake in any event’s data, please help us correct it.

On the event page, you can click on the “Edit on GitHub” button to edit the event data, and submit your correction to the project.


## Suggestions for improvement

Please [open an issue](https://github.com/ThaiProgrammer/tech-events-calendar/issues).


## Help maintain this project

The goal of this project is to be **community-maintained**,
rather than being maintained by a single entity.
If you want to help maintain this project,
[please go to the CALL FOR MAINTAINERS page](https://github.com/ThaiProgrammer/tech-events-calendar/issues/11).
