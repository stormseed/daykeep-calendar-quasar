const debug = require('debug')('calendar:CalendarAllDayEvents')

export default {
  props: {
    startDate: {
      type: [Object, Date],
      default: () => { return new Date() }
    },
    parsed: {
      type: Object,
      default: () => {}
    },
    numberOfDays: {
      type: Number,
      default: 7
    },
    eventRef: String,
    preventEventDetail: {
      type: Boolean,
      default: false
    },
    allowEditing: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dayCellHeight: 5,
      dayCellHeightUnit: 'rem',
      workingDate: new Date(),
      workingDateObject: {},
      weekArray: []
    }
  },
  computed: {
    cellWidth: function () {
      return this.calculateDayCellWidth(this.numberOfDays)
    }
  },
  methods: {
    doUpdate: function () {
      this.mountSetDate()
    },
    addDaysToDate: function (thisDateObject, numDays) {
      return this.makeDT(thisDateObject).plus({ days: numDays })
    }
  },
  mounted () {
    debug('Component mounted')
    this.mountSetDate()
  },
  updated () {
    this.mountSetDate()
  },
  watch: {
    startDate: 'handleStartChange'
  }
}
