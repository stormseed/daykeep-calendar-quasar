# Quasar Calendar
An event display calendar for the Quasar framework

## Setup

```shell
npm install quasar-calendar
```

Add Calendar to you .vue page similar to a a Quasar component

```js
import { Calendar } from 'quasar-calendar'
```

or import individual components

```js
import {
  CalendarAgenda,
  CalendarMultiDay
} from 'quasar-calendar'
```

In your template, you can just put in a calendar viewer using the current date as the start date

```html
<calendar />
```

Or you can pass in parameters to customize

```html
<calendar-month
	:start-date="Date('2019-01-01')"
	:events="someEventObject"
/>
```

## Event data format

The event data format is meant to be a subset of the [Google Calendar v3 API](https://developers.google.com/google-apps/calendar/v3/reference/events) (*this is still a work in progress*). Events should be passed in as an array of objects. Each object can have elements like in this example:

```js
[
  {
    id: 1,
    summary: 'Test event',
    description: 'Some extra info goes here',
    location: 'Office of the Divine Randomness, 1232 Main St., Denver, CO',
    start: {
      dateTime: '2018-02-16T14:00:00Z',
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: '2018-02-16T16:30:00Z',
      timeZone: 'American/New_York'
    },
    color: 'positive',
    attendees: [
      {
        id: 5,
        email: 'somebody@somewhere.com',
        displayName: 'John Q. Public',
        organizer: false,
        self: false,
        resource: false
      }
    ]
  },
  {
    id: 2,
    summary: 'Test all-day event',
    description: 'Some extra info goes here',
    start: {
      date: '2018-02-16'
    },
    end: {
      date: '2018-02-19'
    }
  }
]
```

Each object needs to have a unique ID. The date time should be in [RFC3339](https://tools.ietf.org/html/rfc3339) format. 

## Individual Vue components

The usuable components of `Calendar`, `CalendarMonth`, `CalendarMultiDay` and `CalendarAgenda` share the following properties:

| Vue Property | Type | Description |
| --- | --- | --- |
| `start-date` | Date | A JavaScript Date object that passes in a starting display date for the calendar to display. |

In addition, each individual components have the following properties:

### CalendarMultiDay

| Vue Property | Type | Description |
| --- | --- | --- |
| `num-days` | Number | The number of days the multi-day calendar. A value of `1` will change the header to be more appropriate for a single day. |
| `nav-days` | Number | This is how many days the previous / next navigation buttons will jump. |
| `force-start-of-week` | Boolean | Default is `false`. This is appropriate if you have a week display (7 days) that you want to always start on the first day of the week. |

### CalendarAgenda

| Vue Property | Type | Description |
| --- | --- | --- |
| `num-days` | Number | The number of days to initially display and also the number of additional days to load up when the user scrolls to the bottom of the agenda. |
