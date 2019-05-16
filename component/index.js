// import {
//   Calendar,
//   CalendarAgenda,
//   CalendarAgendaEvent,
//   CalendarAllDayEvents,
//   CalendarDayColumn,
//   CalendarDayLabels,
//   CalendarEvent,
//   CalendarEventDetail,
//   CalendarHeaderNav,
//   CalendarMonth,
//   CalendarTimeLabelColumn,
//   CalendarMultiDay
// } from './calendar'

import {
  Calendar,
  CalendarAgenda,
  CalendarMonth,
  CalendarMultiDay
} from './calendar/templates/quasar'

const Quasar = {
  DaykeepCalendar: Calendar,
  DaykeepCalendarAgenda: CalendarAgenda,
  DaykeepCalendarMonth: CalendarMonth,
  DaykeepCalendarMultiDay: CalendarMultiDay
}

// export {
//   Calendar,
//   CalendarAgenda,
//   CalendarAgendaEvent,
//   CalendarAllDayEvents,
//   CalendarDayColumn,
//   CalendarDayLabels,
//   CalendarEvent,
//   CalendarEventDetail,
//   CalendarHeaderNav,
//   CalendarMonth,
//   CalendarTimeLabelColumn,
//   CalendarMultiDay
// }
export {
  Calendar as DaykeepCalendar,
  CalendarAgenda as DaykeepCalendarAgenda,
  CalendarMonth as DaykeepCalendarMonth,
  CalendarMultiDay as DaykeepCalendarMultiDay,
  Quasar
}
