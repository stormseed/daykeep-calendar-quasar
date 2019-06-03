const debug = require('debug')('calendar:CalendarAgendaEvent')

export default {
  props: {
    agendaStyle: {
      type: String,
      default: 'block'
    },
    forwardDate: [Object, Date]
  },
  methods: {
    getDotClass: function () {
      return this.addCssColorClasses({}, this.eventObject)
    },
    getDotEventClass: function () {
      return {
        'flex-row': true,
        'flex-items-center': true,
        'flex-justify-start': true,
        'cursor-pointer': true,
        'calendar-agenda-event': true,
        'calendar-agenda-event-dot-style': true,
        'calendar-agenda-event-allday': this.eventObject.start.isAllDay,
        'calendar-agenda-event-empty-slot': this.eventObject.start.isEmptySlot
      }
    },
    getEventClass: function () {
      return this.addCssColorClasses(
        {
          'calendar-agenda-event': true,
          'calendar-agenda-event-allday': this.eventObject.start.isAllDay,
          'calendar-agenda-event-empty-slot': this.eventObject.start.isEmptySlot
        },
        this.eventObject
      )
    },
    getEventStyle: function () {
      return {}
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
