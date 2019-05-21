const debug = require('debug')('calendar:CalendarAgenda')

export default {
  props: {
    agendaStyle: {
      type: String,
      default: 'dot'
    },
    numDays: {
      type: Number,
      default: 7
    },
    leftMargin: {
      type: String,
      default: '4rem'
    },
    scrollHeight: {
      type: String,
      default: '200px'
    }
  },
  data () {
    return {
      workingDate: new Date(),
      numJumpDays: 28,
      localNumDays: 28,
      dayCounter: [],
      parsed: this.getDefaultParsed(),
      eventDetailEventObject: {}
    }
  },
  computed: {
    calendarDaysAreClickable: function () {
      return (this.fullComponentRef && this.fullComponentRef.length > 0)
    }
  },
  methods: {
    getDaysForwardDate: function (daysForward) {
      return this.makeDT(this.workingDate).plus({ days: daysForward })
    },
    isFirstOfMonth: function (thisDate) {
      return this.makeDT(thisDate).day === 1
    },
    isFirstDayOfWeek: function (thisDate) {
      return this.makeDT(thisDate).weekday === 1
    },
    loadMore: function (index, done) {
      this.localNumDays += this.numJumpDays
      done(true)
    },
    doUpdate: function () {
      this.mountSetDate()
      this.triggerDisplayChange(
        this.eventRef,
        this.getAgendaDisplayDates()
      )
    },
    getWeekTitle: function (firstDate) {
      firstDate = this.makeDT(firstDate)
      let lastDate = firstDate.plus({ days: 6 })
      if (firstDate.month === lastDate.month) {
        return this.formatDate(firstDate, 'MMM d - ') + this.formatDate(lastDate, 'd')
      }
      else {
        return this.formatDate(firstDate, 'MMM d - ') + this.formatDate(lastDate, 'MMM d')
      }
    },
    handleStartChange: function () {
      this.doUpdate()
    },
    handleNavMove: function (params) {
      this.moveTimePeriod(params)
      this.$emit(
        this.eventRef + ':navMovePeriod',
        params
      )
      let payload = this.getAgendaDisplayDates()
      payload['moveUnit'] = params.unitType
      payload['moveAmount'] = params.amount
      this.triggerDisplayChange(
        this.eventRef,
        payload
      )
    },
    handleDayClick: function (dateObject) {
      if (this.fullComponentRef) {
        this.fullMoveToDay(dateObject)
      }
    },
    getAgendaDisplayDates: function () {
      return {
        startDate: this.makeDT(this.workingDate).toISODate(),
        endDate: this.makeDT(this.getDaysForwardDate(this.localNumDays)).toISODate(),
        numDays: this.localNumDays,
        viewType: this.$options.name
      }
    }
  },
  mounted () {
    debug('Component mounted')
    this.localNumDays = this.numDays
    this.doUpdate()
    this.handlePassedInEvents()
    this.$root.$on(
      this.eventRef + ':navMovePeriod',
      this.handleNavMove
    )
    this.$root.$on(
      'click-event-' + this.eventRef,
      this.handleEventDetailEvent
    )
    this.$root.$on(
      'update-event-' + this.eventRef,
      this.handleEventUpdate
    )
  },
  watch: {
    startDate: 'handleStartChange',
    eventArray: function () {
      this.getPassedInEventArray()
    },
    parsedEvents: function () {
      this.getPassedInParsedEvents()
    }
  }
}
