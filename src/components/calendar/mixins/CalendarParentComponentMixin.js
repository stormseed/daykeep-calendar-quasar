const { DateTime } = require('luxon')
export default {
  props: {
    startDate: {
      type: [Object, Date],
      default: () => { return new Date() }
    },
    eventArray: {
      type: Array,
      default: () => []
    },
    parsedEvents: {
      type: Object,
      default: () => {}
    },
    eventRef: {
      type: String,
      default: 'cal-' + Math.random().toString(36).substring(2, 15)
    },
    preventEventDetail: {
      type: Boolean,
      default: false
    },
    calendarLocale: {
      type: String,
      default: () => { return DateTime.local().locale }
    },
    calendarTimezone: {
      type: String,
      default: () => { return DateTime.local().zoneName }
    },
    sundayFirstDayOfWeek: {
      type: Boolean,
      default: false
    },
    allowEditing: {
      type: Boolean,
      default: false
    }
  },
  mounted () {}
}
