const debug = require('debug')('calendar:Calendar')

export default {
  props: {
    startDate: {
      type: [Object, Date],
      default: () => { return new Date() }
    },
    tabLabels: {
      type: Object,
      default: () => {
        return {
          month: 'Month',
          week: 'Week',
          threeDay: '3 Day',
          day: 'Day',
          agenda: 'Agenda'
        }
      }
    }
  },
  data () {
    return {
      dayCellHeight: 5,
      dayCellHeightUnit: 'rem',
      workingDate: new Date(),
      parsed: {
        byAllDayStartDate: {},
        byStartDate: {},
        byId: {}
      },
      currentTab: 'tab-month',
      thisRefName: this.createRandomString()
    }
  },
  methods: {
    setupEventsHandling: function () {
      this.$root.$on(
        this.eventRef + ':navMovePeriod',
        this.calPackageMoveTimePeriod
      )
      this.$root.$on(
        this.eventRef + ':moveToSingleDay',
        this.switchToSingleDay
      )
      this.$root.$on(
        'update-event-' + this.eventRef,
        this.handleEventUpdate
      )
    },
    calPackageMoveTimePeriod: function (params) {
      this.moveTimePeriod(params)
      this.$emit(
        'calendar' + ':navMovePeriod',
        params
      )
    },
    switchToSingleDay: function (params) {
      this.setTimePeriod(params)
      this.currentTab = 'tab-single-day-component'
    },
    doUpdate: function () {
      this.mountSetDate()
    }
  },
  mounted () {
    debug('Component mounted')
    this.mountSetDate()
    this.parseEventList()
    this.setupEventsHandling()
  },
  watch: {
    startDate: function () {
      this.handleStartChange()
    },
    eventArray: function () {
      this.getPassedInEventArray()
    },
    parsedEvents: function () {
      this.getPassedInParsedEvents()
    }
  }
}
