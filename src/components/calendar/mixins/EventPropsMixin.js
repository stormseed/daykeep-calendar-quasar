import DateTime from 'luxon/src/datetime'
export default {
  props: {
    eventObject: {
      type: Object,
      default: () => {}
    },
    color: {
      type: String,
      default: 'primary'
    },
    textColor: {
      type: String,
      default: 'white'
    },
    showTime: {
      type: Boolean,
      default: true
    },
    monthStyle: {
      type: Boolean,
      default: false
    },
    eventRef: String,
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
    allowEditing: {
      type: Boolean,
      default: false
    },
    renderHtml: {
      type: Boolean,
      default: false
    }
  }
}
