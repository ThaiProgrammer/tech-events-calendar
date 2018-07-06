---
id: software-architect-meetup-1
date: '2018-07-06'
time: 19:00 ~ 21:00
location:
  title: BIG Co-working Space
  url: https://www.google.com/maps/place/BIG+Co-working+Space/@13.7566867,100.571952,15z/data=!4m5!3m4!1s0x0:0xf2124609ad0be030!8m2!3d13.7566867!4d100.571952
categories:
  - Meetup
topics:
  - Software Architecture
links:
  - type: ticket
    url: https://www.eventpop.me/e/3767
    title: Event Pop
    price: FREE
  - type: rsvp
    url: https://www.facebook.com/events/174886566515251/
    title: Facebook Event
---

# Software Architect MeetUp#1

> ในขณะที่ Developer Community กำลังเติบโตขึ้นมาก แต่หัวข้อจำนวนมากใน Meetup ต่างๆ มักจะเป็นหัวข้อที่เน้นไปที่การใช้เครื่องมือเฉพาะทาง ภาษาเฉพาะทาง เราอยากเห็นเมืองไทยมีการพูดถึงพื้นฐานการพัฒนาซอฟต์แวร์ การออกแบบซอฟต์แวร์ และหัวข้อการเขียนโปรแกรมเชิงลึกมากขึ้น

เพราะเราพบจากประสบการณ์ว่า ถ้าพื้นฐานการออกแบบและการพัฒนาซอฟต์แวร์ดี เครื่องมือก็จะเป็นแค่กระบวนท่า และการเข้าใจหัวข้อการออกแบบ Software Architecture เป็นสิ่งสำคัญสิ่งนึงของนักพัฒนาซอฟต์แวร์ที่ต้องการจะก้าวข้ามขั้นและพัฒนาตัวเอง

* “State machine, Object-oriented and Functional Programming from Tracing perspective” by Chakrit Likitkhajorn \
  หัวข้อนี้เราจะย้อนกลับไปโมเดลการออกแบบซอฟต์แวร์ขั้นพื้นฐานสุดคือ State machine ย้อนกลับไปดูประวัติศาสตร์ของ Object-oriented Programming อีกครั้งนึง เพื่อให้เห็นว่าในขณะที่ Alan Kay คิดเรื่อง Object-oriented เขาเจอปัญหาอะไร และเขาออกแบบมาเพื่อแก้ปัญหาสิ่งไหน และสุดท้ายกลับมาดู Functional Programming ว่ามันออกแบบมาแก้ปัญหาอะไร และจะจบที่การแสดง Practical Trade-off จากสถานการณ์จริงว่าการเลือกใช้ Paradigm แต่ละแบบมีผลต่อการไล่โค้ดและไล่แก้ไขปัญหาอย่างไรบ้าง

* “Self-Documented Code: Level of Abstraction Context foreach Data Behaviour” by Passapong Champillon Thaithatgoon \
  หัวข้อนี้เราจะเริ่มมองที่วิธีการอธิบายการทำงานภายในของซอร์ฟแวร์ ซึ่งต้องปรับเปลี่ยนให้รวดเร็ว และทันตามจังหว่ะของธุรกิจ ดังนั้นวิธีในแบบเดิมๆ ไม่ว่าจะเป็น E-R Diagram หรือแม้นแต่ UML Diagram เองนั้น กลับเป็นการเพิ่มระยะเวลาและต้นทุนที่ไม่จำเป็น เพราะสิ่งที่จำเป็นต้องเปลี่ยนจริงๆคือ code ไม่ใช่เอกสารอื่นๆ ดังนั้นเราจึงต้องทำให้ code มันอธิบายตัวมันเองได้ โดยความยากของการใช้ code อธิบายตัวเองนั้น จะเพิ่มขึ้นตามปริมาณของ code ซึ่งการใช้ “บริบท”เพื่อกำหนด โครงสร้างในการจัดการ ความซับซ้อนของ code ที่มีปริมาณเพิ่มขึ้นเรื่อยๆ จึงเป็นวิธีหนึ่งที่จะช่วยทำให้ code ยังอธิบายตัวเองได้
