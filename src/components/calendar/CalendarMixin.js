import dashHas from 'lodash.has'
import {
  date,
  Events
} from 'quasar'
export default {
  computed: {},
  methods: {
    triggerEventClick: function (eventObject, eventRef) {
      Events.$emit(
        'click-event-' + eventRef,
        eventObject
      )
    },
    handleEventDetailEvent: function (params, thisRef) {
      if (thisRef === undefined) {
        thisRef = 'defaultEventDetail'
      }
      this.eventDetailEventObject = params
      if (dashHas(this.$refs, thisRef + '.__open')) {
        this.$refs[thisRef].__open()
      }
    },
    fullMoveToDay: function (dateObject) {
      if (this.fullComponentRef) {
        Events.$emit(
          this.fullComponentRef + ':moveToSingleDay', {
            dateObject: dateObject
          }
        )
      }
    },
    getEventColor: function (cssObject, eventObject, colorName) {
      if (dashHas(eventObject, colorName)) {
        return eventObject[colorName]
      }
      else if (dashHas(this, colorName)) {
        return this[colorName]
      }
      else if (colorName === 'textColor') {
        return 'white'
      }
      else {
        return 'primary'
      }
    },
    addCssColorClasses: function (cssObject, eventObject) {
      cssObject['bg-' + this.getEventColor(cssObject, eventObject, 'color')] = true
      cssObject['text-' + this.getEventColor(cssObject, eventObject, 'textColor')] = true
      return cssObject
    },
    formatDate: function (dateObject, formatString) {
      return date.formatDate(dateObject, formatString)
    },
    dateAdjustWeekday (thisDateObject, weekdayNum) {
      let checkDate = new Date()
      let adjustForward = true
      if (weekdayNum < 0) {
        adjustForward = false
        weekdayNum = Math.abs(weekdayNum)
      }
      for (let counter = 0; counter <= 6; counter++) {
        if (adjustForward) {
          checkDate = date.addToDate(thisDateObject, { days: counter })
        }
        else {
          checkDate = date.subtractFromDate(thisDateObject, { days: counter })
        }
        if (date.getDayOfWeek(checkDate) === weekdayNum) {
          return checkDate
        }
      }
    },
    buildWeekDateArray: function (numberOfDays) {
      if (numberOfDays === undefined) {
        if (this.numberOfDays !== undefined) {
          numberOfDays = this.numberOfDays
        }
        else if (this.numDays !== undefined) {
          numberOfDays = this.numDays
        }
        else {
          numberOfDays = 7
        }
      }
      if (this.forceStartOfWeek) {
        this.weekDateArray = this.getForcedWeekDateArray(numberOfDays)
      }
      else {
        this.weekDateArray = this.getWeekDateArray(numberOfDays)
      }
    },
    getForcedWeekBookendDates: function (numberOfDays) {
      if (numberOfDays === undefined) {
        numberOfDays = 7
      }
      return {
        first: this.dateAdjustWeekday(this.workingDate, -1),
        last: this.dateAdjustWeekday(this.workingDate, numberOfDays),
      }
    },
    getForcedWeekDateArray: function (numberOfDays) {
      let bookendDates = this.getForcedWeekBookendDates()
      let returnArray = []
      for (let counter = 0; counter <= numberOfDays - 1; counter++) {
        returnArray.push(
          date.addToDate(bookendDates.first, { days: counter })
        )
      }
      return returnArray
    },
    getWeekDateArray: function (numberOfDays) {
      let returnArray = []
      for (let counter = 0; counter <= numberOfDays - 1; counter++) {
        returnArray.push(
          date.addToDate(this.workingDate, { days: counter })
        )
      }
      return returnArray
    },
    formatTimeFromNumber: function (hourNumber) {
      // TODO: this should be able to handle 24 hour and alternate time formats
      return date.formatDate(
        date.adjustDate(new Date(), { hours: hourNumber }),
        'ha'
      )
    },
    moveTimePeriod: function (params) {
      let paramObj = {}
      paramObj[params.unitType] = params.amount
      this.workingDate = date.addToDate(this.workingDate, paramObj)
    },
    setTimePeriod: function (params) {
      this.workingDate = params.dateObject
    },
    getDayOfWeek: function () {
      return this.createThisDate(this.dayNumber).format('dddd')
    },
    createThisDate: function (dateNum) {
      return this.parseDateParams(dateNum)
    },
    isCurrentDate: function (thisDateObject) {
      let now = new Date()
      return date.isSameDate(now, thisDateObject, 'day')
    },
    isWeekendDay: function (thisDateObject) {
      const dayName = date.formatDate(thisDateObject, 'ddd')
      return (dayName === 'Sun' || dayName === 'Sat')
    },
    mountSetDate: function () {
      this.workingDate = this.startDate
    },
    decimalAdjust: function (type, value, exp) {
      // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
      // If the exp is undefined or zero...
      if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value)
      }
      value = +value
      exp = +exp
      // If the value is not a number or the exp is not an integer...
      if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN
      }
      // Shift
      value = value.toString().split('e')
      value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)))
      // Shift back
      value = value.toString().split('e')
      return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp))
    },
    calculateDayCellWidth: function (numberOfDays) {
      return this.decimalAdjust(
        'floor',
        100 / numberOfDays,
        -3
      ) + '%'
    },
    createNewNavEventName: function () {
      return 'calendar:navMovePeriod:' + this.createRandomString()
    },
    createRandomString: function () {
      return Math.random().toString(36).substring(2, 15)
    }
  },
  mounted () {}
}
