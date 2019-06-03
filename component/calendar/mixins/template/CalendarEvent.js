import dashHas from 'lodash.has'

const debug = require('debug')('calendar:CalendarEvent')

export default {
  props: {
    forceAllDay: Boolean,
    currentCalendarDay: Object,
    hasPreviousDay: Boolean,
    hasNextDay: Boolean,
    firstDayOfWeek: Boolean,
    lastDayOfWeek: Boolean,
    renderStyle: {
      type: String,
      default: 'singleLine'
    },
    isLeftmostColumn: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getEventStyle: function () {
      return {
        // 'background-color': this.backgroundColor,
        // 'color': this.textColor
      }
    },
    getEventClass: function () {
      return this.addCssColorClasses(
        {
          'calendar-event': true,
          'calendar-event-month': this.monthStyle,
          'calendar-event-multi': !this.monthStyle,
          'calendar-event-multi-allday': this.forceAllDay,
          'calendar-event-has-next-day': this.eventHasNextDay(),
          'calendar-event-has-previous-day': this.eventHasPreviousDay(),
          'calendar-event-empty-slot': this.isEmptySlot(),
          'calendar-event-continues-next-week': this.eventContinuesNextWeek(), // for future use
          'calendar-event-continues-from-last-week': this.eventContinuesFromLastWeek() // for future use
        },
        this.eventObject
      )
    },
    isEmptySlot: function () {
      return this.eventObject.start.isEmptySlot
    },
    eventContinuesNextWeek: function () {
      return (
        dashHas(this.eventObject, 'start.dateObject') &&
        this.monthStyle &&
        this.eventHasNextDay() &&
        (this.lastDayOfWeek || this.isLastDayOfMonth(this.eventObject.start.dateObject))
      )
    },
    eventContinuesFromLastWeek: function () {
      return (
        dashHas(this.eventObject, 'start.dateObject') &&
        this.monthStyle &&
        this.eventHasPreviousDay() &&
        (this.firstDayOfWeek || this.isFirstDayOfMonth(this.eventObject.start.dateObject))
      )
    },
    isLastDayOfMonth: function (dateObject) {
      if (typeof dateObject === 'undefined' || dateObject === null) {
        return false
      }
      return this.makeDT(this.currentCalendarDay).toISODate() === this.makeDT(dateObject).endOf('month').toISODate()
    },
    isFirstDayOfMonth: function (dateObject) {
      if (typeof dateObject === 'undefined' || dateObject === null) {
        return false
      }
      return this.makeDT(this.currentCalendarDay).toISODate() === this.makeDT(dateObject).startOf('month').toISODate()
    },
    eventHasNextDay: function () {
      if (this.hasNextDay) {
        return this.hasNextDay
      }
      return false
    },
    eventHasPreviousDay: function () {
      if (this.hasPreviousDay) {
        return this.hasPreviousDay
      }
      return false
    },
    isAllDayEvent: function () {
      return this.eventObject.start.isAllDay
    },
    eventDuration: function () {
      return this.getEventDuration(this.eventObject.start.dateObject, this.eventObject.end.dateObject)
    },
    handleClick: function (e) {
      this.eventObject.allowEditing = this.allowEditing
      this.$emit('click', this.eventObject)
      this.triggerEventClick(this.eventObject, this.eventRef)
    }
  },
  mounted () {
    debug('Component mounted')
  }
}
