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
	:start-year="2018"
	:start-month="1"
	:events="someEventObject"
/>
```

## Event data format

Events should be passed in as an array of objects. Each object should have the following information:

```js
{
	id: 1,
	summary: 'My event title',
	description: 'Some extra info goes here',
	start: {
		dateTime: '2018-01-16 14:00:00',
		isAllDay: false
	},
	end: {
		dateTime: '2018-01-16 16:30:00',
		isAllDay: false
	}
},
```

Each object needs to have a unique ID. The date time should be in a string format that [Moment.js](https://momentjs.com/docs/#/parsing/) can parse. 

## Individual Vue components

The usuable components of `Calendar`, `CalendarMonth`, `CalendarMultiDay` and `CalendarAgenda` share the following properties:

| Vue Property | Type | Description |
| --- | --- | --- |
| `start-year` | Number | An integer representing the initial year the calendar should start on. |
| `start-month` | Number | An integer representing the initial month the calendar should start on. Unlike moment.js, a `1` means January and `12` means December. |
| `start-day` | Number | An integer representing the initial day of the month should start on. |


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

## Roadmap

- [ ] Pass in visual properties for individual events
- [ ] Allow a custom function or component to display events
