import {
  QCalendar,
  QCalendarMonth,
  QCalendarMultiDay,
  QCalendarAgenda
} from '@quasar/quasar-app-extension-qcalendar/component'

export default async ({ Vue }) => {
  Vue.component('q-calendar', QCalendar)
  Vue.component('q-calendar-month', QCalendarMonth)
  Vue.component('q-calendar-multi-day', QCalendarMultiDay)
  Vue.component('q-calendar-agenda', QCalendarAgenda)
}
