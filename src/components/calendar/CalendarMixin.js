import dashHas from 'lodash.has'
import {
  date,
  Events
} from 'quasar'
const defaultParsed = {
  byAllDayStartDate: {},
  byStartDate: {},
  byId: {}
}
export default {
  computed: {},
  methods: {
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
    getDayOfWeek: function () {
      return this.createThisDate(this.dayNumber).format('dddd')
    },
    getEventById: function (eventId) {
      return this.parsed.byId[eventId]
    },
    formatToSqlDate: function (dateObject) {
      return date.formatDate(dateObject, 'YYYY-MM-DD')
    },
    dateGetEvents: function (thisDate) {
      let hasAllDayEvents = this.hasAllDayEvents(thisDate)
      let hasEvents = this.hasEvents(thisDate)
      let returnArray = []
      let sqlDate = this.formatToSqlDate(thisDate)
      if (hasAllDayEvents) {
        for (let thisEvent of this.parsed.byAllDayStartDate[sqlDate]) {
          returnArray.push(this.getEventById(thisEvent))
        }
      }
      if (hasEvents) {
        for (let thisEvent of this.parsed.byStartDate[sqlDate]) {
          returnArray.push(this.getEventById(thisEvent))
        }
      }
      return returnArray
    },
    hasAnyEvents: function (thisDateObject) {
      return (
        this.hasEvents(thisDateObject) ||
        this.hasAllDayEvents(thisDateObject)
      )
    },
    hasAllDayEvents: function (thisDateObject) {
      return dashHas(
        this.parsed.byAllDayStartDate,
        this.formatToSqlDate(thisDateObject)
      )
    },
    hasEvents: function (thisDateObject) {
      return dashHas(
        this.parsed.byStartDate,
        this.formatToSqlDate(thisDateObject)
      )
    },
    createThisDate: function (dateNum) {
      return this.parseDateParams(dateNum)
    },
    clearParsed: function () {
      this.parsed = {}
      this.parsed = {
        byAllDayStartDate: {},
        byStartDate: {},
        byId: {}
      }
      return true
    },
    parseEventList: function () {
      this.clearParsed()
      for (let thisEvent of this.eventArray) {
        this.parsed.byId[thisEvent.id] = thisEvent
        thisEvent.start['dateObject'] = new Date(thisEvent.start.dateTime)
        thisEvent.end['dateObject'] = new Date(thisEvent.end.dateTime)
        let thisStartDate = this.formatToSqlDate(thisEvent.start.dateObject)

        // get all-day events
        if (thisEvent.start.isAllDay) {
          if (!dashHas(this.parsed.byAllDayStartDate, thisStartDate)) {
            this.parsed.byAllDayStartDate[thisStartDate] = []
          }
          this.parsed.byAllDayStartDate[thisStartDate].push(thisEvent.id)
        }

        // get events with a start and end time
        else {
          thisEvent.duration = this.parseGetDurationMinutes(thisEvent)
          if (!dashHas(this.parsed.byStartDate, thisStartDate)) {
            this.parsed.byStartDate[thisStartDate] = []
          }
          this.parsed.byStartDate[thisStartDate].push(thisEvent.id)
        }
      }

      for (let thisDate in this.parsed.byStartDate) {
        this.parsed.byStartDate[thisDate] = this.sortDateEvents(this.parsed.byStartDate[thisDate])
        this.parseDateEvents(this.parsed.byStartDate[thisDate])
      }
    },
    sortDateEvents: function (eventArray) {
      let tempArray = []
      for (let eventId of eventArray) {
        tempArray.push(this.parsed.byId[eventId])
      }
      tempArray.sort(function (a, b) {
        return date.getDateDiff(
          date.addToDate(a.start.dateObject, { milliseconds: a.duration }),
          date.addToDate(b.start.dateObject, { milliseconds: b.duration }),
        )
      })
      let returnArray = []
      for (let thisEvent of tempArray) {
        returnArray.push(thisEvent.id)
      }
      return returnArray
    },
    parseDateEvents: function (eventArray) {
      let overlapSegment = 1
      let overlapIteration = 1
      for (let eventId of eventArray) {
        let numberOfOverlaps = 0
        for (let compareEventId of eventArray) {
          let thisEvent = this.parsed.byId[eventId]
          let compareEvent = this.parsed.byId[compareEventId]
          if (
            eventId !== compareEventId &&
            this.parseHasOverlap(thisEvent, compareEvent)
          ) {
            numberOfOverlaps++
          }
        }
        this.parsed.byId[eventId]['numberOfOverlaps'] = numberOfOverlaps
        if (numberOfOverlaps > 0) {
          this.parsed.byId[eventId]['overlapSegment'] = overlapSegment
          this.parsed.byId[eventId]['overlapIteration'] = overlapIteration
          overlapIteration++
        }
        else {
          this.parsed.byId[eventId]['overlapSegment'] = 0
          overlapSegment++
          overlapIteration = 1
        }
      }
    },
    parseGetDurationMinutes: function (eventObj) {
      if (eventObj.start.isAllDay) {
        return 24 * 60
      }
      else {
        return date.getDateDiff(
          eventObj.start.dateObject,
          eventObj.end.dateObject,
          'minutes'
        )
      }
    },
    parseHasOverlap: function (event1, event2) {
      return (event1.start.dateObject <= event2.end.dateObject) &&
        (event1.end.dateObject >= event2.start.dateObject)
    },
    isCurrentDate: function (thisDateObject) {
      let now = new Date()
      return date.isSameDate(now, thisDateObject, 'day')
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
    getPassedInParsedEvents: function () {
      this.parsed = defaultParsed
      if (
        this.parsedEvents !== undefined &&
        this.parsedEvents.byId !== undefined &&
        Object.keys(this.parsedEvents).length > 0
      ) {
        this.parsed = this.parsedEvents
        return true
      }
      else {
        return false
      }
    },
    getPassedInEventArray: function () {
      this.parsed = defaultParsed
      if (this.eventArray !== undefined && this.eventArray.length > 0) {
        this.parseEventList()
        return true
      }
      else {
        return false
      }
    },
    getDefaultParsed: function () {
      return defaultParsed
    },
    isParsedEventsEmpty: function () {
      return !(
        this.parsedEvents !== undefined &&
        this.parsedEvents.byId !== undefined &&
        Object.keys(this.parsedEvents).length > 0
      )
    },
    isEventArrayEmpty: function () {
      return !(this.eventArray !== undefined && this.eventArray.length > 0)
    },
    handlePassedInEvents: function () {
      if (!this.isParsedEventsEmpty()) {
        this.getPassedInParsedEvents()
      }
      else if (!this.isEventArrayEmpty()) {
        this.getPassedInEventArray()
      }
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
