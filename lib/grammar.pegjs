event_month = "##" _ month:month _ year:$(number+) events:(event*) newline*
{
  return { month, year, events }
}

month
  = "January" { return 1 }
  / "February" { return 2 }
  / "March" { return 3 }
  / "April" { return 4 }
  / "May" { return 5 }
  / "June" { return 6 }
  / "July" { return 7 }
  / "August" { return 8 }
  / "September" { return 9 }
  / "October" { return 10 }
  / "November" { return 11 }
  / "December" { return 12 }

event = newline+ header:header newline* content:content { return { header, content } }

header = "###" _ id:event_id _ day:event_date _ date:event_week_day ":" title:$([^\n]+)
{
  return {
    id,
    day,
    date,
    title: title.trim(),
    declared: options.generateDeclared(location())
  }
}

event_id = "<a name=\"" id:$([^"]+) "\"></a>" { return id }

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
  newline table_separator
    topic:table_topic
    location:table_location
    time:(table_time+)?
    website:table_website*
    ticket:table_ticket*
    rsvp:table_rsvp*
    newline*
    summary:$(summary)?
    description:description
{
  return {
    topic,
    location,
    time,
    website,
    ticket,
    rsvp,
    summary,
    description
  }
}

table_header = "|"_+"|"_+"|"_+"|"
table_separator = "|" _ "-"+ _ "|" _ "-"+ _ "|" _ "-"+ _ "|"

table_topic = newline "|" _ event_topic_icon _ "|" type:text "|" topic:text "|"
{
  return {
    categories: type.trim().split(/\s*,\s*/),
    topics: topic.trim().split(/\s*,\s*/),
  }
}
table_location = newline "|" _ event_location_icon _ "|" _* location:text_or_link _* "|" detail:(_* value:$([^|\n]+) _* "|" { return value })?
{
  return { title: location.title.trim(), url: location.url, detail: detail && detail.trim() }
}
table_time = newline "|" _ event_time_icon _ "|" _ from:time "~" to:time after:(flag:"++"? { return !!flag }) _ "|" agenda:(agenda:text "|" { return agenda })?
{
  return { from, to, after, agenda: agenda && agenda.trim() }
}
table_website = newline "|" _ event_website_icon _ "|" _ link:markdown_link _ "|"
{
  return { link: link }
}
table_ticket = newline "|" _ event_ticket_icon _ "|" _ link:markdown_link _ "|" price:(price:text "|" { return price })?
{
  return { link, price: price && price.trim() }
}
table_rsvp = newline "|" _ event_check_icon _+ "|" _ link:markdown_link _ "|" detail:(text:text "|" { return text })?
{
  return { link, detail: detail && detail.trim() }
}

time = hour:$number+":"minute:$number+
{
  return { hour: +hour, minute: +minute }
}

event_topic_icon = "\uD83C\uDFF7"
event_location_icon = "\uD83D\uDCCD"
event_website_icon = "\uD83C\uDFE0"
event_ticket_icon = "\uD83C\uDF9F"
event_time_icon = "\u231A\uFE0F"
event_check_icon = "\u2705"

text_or_link = markdown_link / (title:$([^\[|\n][^|\n]*) { return { title } })

markdown_link = "[" title:$([^\]\n]+) "](" url:$(([^()\n] / bracket)+) ")"
{
  return { title, url }
}

bracket = "(" $([^)] / bracket)* ")"

summary = $([^>\n] [^\n]+ (newline ([^>\n] [^\n]*)?)*)
description = first_line:quoted_line more_lines:(newline text:quoted_line { return text })*
{
  return [first_line].concat(more_lines).join('\n')
}

quoted_line = ">" _? text:$([^\n]*) { return text || "" }

url = $(literal / number / [/:.&=?\-#])+
text = $(literal / symbol / number / _)+
symbol = [,\/\\:."“”%;()\-…’[\]?!]
literal = [a-zA-Z\u0E00-\u0E7F]
number "number" = [0-9]
_ "space" = [ \t]
newline "newline" = [\n]
