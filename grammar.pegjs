document = document_title events:event_month
{
  return events
}

document_title = "#" text newline newline (text newline)+ newline (text newline)+ newline newline

event_month = "##" _ month:$(literal+) _ year:$(number+) newline newline events:events
{
  return { month, year, events }
}

events = (event:event newline { return event })+

event = header:header newline content:content { return { header, content } }

header = "###" _ day:event_date _ date:event_week_day ":" title:text newline
{
  return {
      day,
        date,
        title: title.trim()
    }
}

event_date = from:$(number+) to:(_+ "~" _+ to:$(number+) { return to })?
{
  return { from, to }
}

event_week_day = "(" from:day to:(_+ "~" _+ to:day { return to })? ")"
{
  return { from, to }
}

day = "Mon"
 / "Tue"
 / "Wed"
 / "Thu"
 / "Fri"
 / "Sat"
 / "Sun"

content = table_header
  table_separator
    topic:table_topic
    location:table_location
    time:(table_time+)?
    website:table_website?
    ticket:table_ticket?
    rsvp:table_rsvp+ newline
    th_summary:th_summary newline
    en_summary:en_summary
{
  return {
      topic,
        location,
        time,
        website,
        ticket,
        rsvp,
        th_summary,
        en_summary
    }
}

table_header = "|"_+"|"_+"|"_+"|" newline
table_separator = "|" _ "-"+ _ "|" _ "-"+ _ "|" _ "-"+ _ "|" newline
table_topic = "|" _ event_topic_icon _ "|" type:text "|" topic:text "|" newline
{
  return { type: type.trim(), topic: topic.trim() }
}
table_location = "|" _ event_location_icon _ "|" location:text "|" detail:(value:text "|" { return value })? newline
{
  return { location: location.trim(), detail: detail && detail.trim() }
}
table_time = "|" _ event_time_icon _ "|" _ from:time "~" to:time after:("++" { return true })? _ "|" agenda:text "|" newline
{
  return { from, to, after, agenda: agenda.trim() }
}
table_website = "|" _ event_website_icon _ "|" _ link:markdown_link _ "|" newline { return link }
table_ticket = "|" _ event_ticket_icon _ "|" _ link:markdown_link _ "|" price:text "|" newline
{
  return { link, price: price && price.trim() }
}
table_rsvp = "|" _ event_check_icon _ "|" _ link:markdown_link _ "|" detail:(text:text "|" { return text })? newline
{
  return { link, detail: detail && detail.trim() }
}

time = hour:$number+":"minute:$number+ { return { hour, minute } }

event_topic_icon = "\uD83C\uDFF7"
event_location_icon = "\uD83D\uDCCD"
event_website_icon = "\uD83C\uDFE0"
event_ticket_icon = "\uD83C\uDF9F"
event_time_icon = "\u231A\uFE0F"
event_check_icon = "\u2705"

markdown_link = "[" title:$(literal / number / _ / [.])+ "](" link:url ")" { return { title, link } }

th_summary = $(text newline)+
en_summary = summary:(">" text:text? newline { return (text && text || "") + "\n" })+ { return summary.join('') }

url = $(literal / number / [/:.&=?-])+
text = $(literal / symbol / number / _)+
symbol = [,\/\\:."“”%;()\-…’[\]?!]
literal = [a-zA-Z\u0E00-\u0E7F]
number = [0-9]
_ = [ \t]
newline = [\n]
