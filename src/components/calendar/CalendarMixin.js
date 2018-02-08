// import Moment from 'moment'
// import { extendMoment } from 'moment-range'
import dashHas from 'lodash.has'
import dashGet from 'lodash.get'
import dashIsFunction from 'lodash.isfunction'
import {
  date,
  Events
} from 'quasar'
// const moment = extendMoment(Moment)
// const defaultEventArray = []
const defaultParsed = {
  byAllDayStartDate: {},
  byStartDate: {},
  byId: {}
}
export default {
  computed: {},
  methods: {
    getNowDate: function () {
      return new Date()
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
      // if (numberOfDays === undefined) {
      //   numberOfDays = 7
      // }
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
      // if (numberOfDays === undefined) {
      //   numberOfDays = 7
      // }
      let returnArray = []
      for (let counter = 0; counter <= numberOfDays - 1; counter++) {
        returnArray.push(
          date.addToDate(this.workingDate, { days: counter })
        )
      }
      return returnArray
    },
    // getDateObject: function () {
    //   return moment()
    //     .year(dashGet(this, 'yearNumber', this.startYear))
    //     .month(dashGet(this, 'monthNumber', this.startMonth) - 1)
    //     .date(dashGet(this, 'dayNumber', this.startDay))
    // },
    formatTimeFromNumber: function (hourNumber) {
      // TODO: this should be able to handle 24 hour and alternate time formats
      return date.formatDate(
        date.adjustDate(new Date(), { hours: hourNumber }),
        'ha'
      )
      // return moment().hour(hourNumber).format('ha')
    },
    moveTimePeriod: function (params) {
      // this.moveTimePeriodOld(params.unitType, params.amount)
      console.debug('moveTimePeriod called, params = ')
      // let currentMom = this.createThisDate(this.dayNumber)
      // currentMom.add(params.amount, params.unitType)
      // this.yearNumber = currentMom.year()
      // this.monthNumber = currentMom.month() + 1
      // this.weekNumber = currentMom.week()
      // this.dayNumber = currentMom.date()

      let paramObj = {}
      paramObj[params.unitType] = params.amount
      console.debug('paramObj = ', paramObj)
      this.workingDate = date.addToDate(this.workingDate, paramObj)

      // Events.$emit(
      //   'calendar:startDatesChanged',
      //   {
      //     yearNumber: this.yearNumber,
      //     monthNumber: this.monthNumber,
      //     dayNumber: this.dayNumber
      //   }
      // )
      // this.$emit('startYear', this.startYear)
      // this.$emit('startMonth', this.startMonth)
      // this.$emit('startDay', this.startDay)
      //
      // this.$emit('start-year', this.startYear)
      // this.$emit('start-month', this.startMonth)
      // this.$emit('start-day', this.startDay)
    },
    getMonthNameFromMonthNumber: function () {
      return this.createThisDate(1).format('MMMM')
    },
    getDayOfWeek: function () {
      return this.createThisDate(this.dayNumber).format('dddd')
    },
    getEventById: function (eventId) {
      return this.parsed.byId[eventId]
    },
    formatToSqlDate: function (dateObject) {
      // console.debug('formatToSqlDate called, ', momentObject)
      return date.formatDate(dateObject, 'YYYY-MM-DD')
    },
    dateGetEvents: function (thisDate) {
      let hasAllDayEvents = this.hasAllDayEvents(thisDate)
      let hasEvents = this.hasEvents(thisDate)
      let returnArray = []
      // console.debug('about to call formatToSqlDate')
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
    // dateGetEventsOld: function (dateNum) {
    //   let thisDate = this.createThisDate(dateNum)
    //   let hasAllDayEvents = this.hasAllDayEvents(thisDate)
    //   let hasEvents = this.hasEvents(thisDate)
    //   let returnArray = []
    //   // console.debug('about to call formatToSqlDate')
    //   let sqlDate = this.formatToSqlDate(thisDate)
    //   if (hasAllDayEvents) {
    //     for (let thisEvent of this.parsed.byAllDayStartDate[sqlDate]) {
    //       returnArray.push(this.getEventById(thisEvent))
    //     }
    //   }
    //   if (hasEvents) {
    //     for (let thisEvent of this.parsed.byStartDate[sqlDate]) {
    //       returnArray.push(this.getEventById(thisEvent))
    //     }
    //   }
    //   return returnArray
    // },
    // parseDateParams: function (params) {
    //   // console.debug('parseDateParams called, params = ', params)
    //   let thisDateObject = {}
    //   if (moment.isMoment(params)) {
    //     thisDateObject = params
    //   }
    //   else if (typeof params === 'number') {
    //     // assume this is a day date
    //     thisDateObject = moment()
    //       .year(this.yearNumber)
    //       .month(this.monthNumber - 1)
    //       .date(params)
    //   }
    //   else if (typeof params === 'string') {
    //     // parse the string
    //     thisDateObject = moment(params)
    //   }
    //   else if (typeof params === 'object') {
    //     thisDateObject = moment()
    //       .year(dashGet(params, 'year', this.yearNumber))
    //       .month(dashGet(params, 'month', this.monthNumber - 1))
    //       .date(dashGet(params, 'date', this.dayNumber))
    //   }
    //   else if (typeof params === 'undefined') {
    //     thisDateObject = moment()
    //       .year(this.yearNumber)
    //       .month(this.monthNumber - 1)
    //       .date(this.dayNumber)
    //   }
    //   else {
    //     thisDateObject = moment()
    //   }
    //   // console.debug('parseDateParams returning = ', thisDateObject)
    //   return thisDateObject
    // },
    hasAnyEvents: function (thisDateObject) {
      // console.debug('hasAnyEvents call with thisDateObject = ', thisDateObject)
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
      // return moment().year(this.yearNumber).month(this.monthNumber - 1).date(dateNum)
    },
    clearParsed: function () {
      // console.debug('clearParsed called')
      this.parsed = {}
      // console.debug('clearParsed1 = ', JSON.stringify(this.parsed))
      this.parsed = {
        byAllDayStartDate: {},
        byStartDate: {},
        byId: {}
      }
      // console.debug('clearParsed2 = ', JSON.stringify(this.parsed))
      return true
    },
    parseEventList: function () {
      // let thisStart = {}
      // console.debug('parseEventList called', this)
      // console.debug('parseEventList called, this.parsed = ', JSON.stringify(this.parsed))
      // this.parsed = defaultParsed
      this.clearParsed()
      // console.debug('after clear, this.parsed = ', JSON.stringify(this.parsed))
      for (let thisEvent of this.eventArray) {
        // console.debug(thisEvent)
        this.parsed.byId[thisEvent.id] = thisEvent
        // let thisStartDateTime = moment(thisEvent.start.dateTime)

        thisEvent.start['dateObject'] = new Date(thisEvent.start.dateTime)
        thisEvent.end['dateObject'] = new Date(thisEvent.end.dateTime)

        // console.debug('parseEventList about to call formatSql')
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
        // console.debug('a = ', a)
        // let timeA = new Date(a.start.dateTime)
        // let timeB = new Date(b.start.dateTime)
        // timeA = date.addToDate(timeA, { milliseconds: a.duration })
        // timeB = date.addToDate(timeB, { milliseconds: b.duration })
        // return date.getDateDiff(timeA, timeB, 'seconds')
        return date.getDateDiff(
          date.addToDate(a.start.dateObject, { milliseconds: a.duration }),
          date.addToDate(b.start.dateObject, { milliseconds: b.duration }),
        )
        // let timeA = moment(a.start.dateTime).unix() + (a.duration / 1000)
        // let timeB = moment(b.start.dateTime).unix() + (b.duration / 1000)
        // return timeA - timeB
      })
      let returnArray = []
      for (let thisEvent of tempArray) {
        returnArray.push(thisEvent.id)
      }
      // console.debug('sortDateEvents called', eventArray, returnArray)
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
          // else if (eventId !== compareEventId) {
          //   if (numberOfOverlaps > 0) {
          //     numberOfOverlaps = 0
          //     overlapSegment++
          //   }
          // }
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
        // let thisStart = moment(eventObj.start.dateTime)
        // let thisEnd = moment(eventObj.end.dateTime)
        // return thisEnd.diff(thisStart, 'minutes')
      }
    },
    parseHasOverlap: function (event1, event2) {
      return (event1.start.dateObject <= event2.end.dateObject) &&
        (event1.end.dateObject >= event2.start.dateObject)
      // return this.dateRangeHasOverlap(
      //   event1.start.dateObject,
      //   event1.end.dateObject,
      //   event2.start.dateObject,
      //   event2.end.dateObject,
      // )
      // const range1 = moment.range(event1.start.dateTime, event1.end.dateTime)
      // const range2 = moment.range(event2.start.dateTime, event2.end.dateTime)
      // return range1.overlaps(range2, { adjacent: true })
    },
    // dateRangeHasOverlap: function (event1Start, event1End, event2Start, event2End) {
    //   return (event1Start <= event2End) && (event1End >= event2Start)
    // },
    isCurrentDate: function (thisDateObject) {
      let now = new Date()
      // console.debug('isCurrentDate called, now = ', now, thisDateObject)
      return date.isSameDate(now, thisDateObject, 'day')
    },
    // isCurrentWeekday: function (thisDayNum) {
    //   return (moment().weekday() === thisDayNum)
    // },
    // dayNameFromLocaleNumber: function (dayNumber) {
    //   return moment().weekday(dayNumber).format('dddd')
    // },
    dayNameAbbreviation: function (dayName, numLetters) {
      if (typeof dayName === 'string') {
        return dayName.slice(0, numLetters)
      }
      else {
        return 'Err'
      }
    },
    mountSetDate: function () {
      this.workingDate = this.startDate
    },
    // mountSetDateOld: function () {
    //   // console.debug('mountSetDate called')
    //   // if (dashHas(this, 'startDateObject')) {
    //   if (this.startDateObject !== undefined) {
    //     if (this.workingDateObject !== undefined) {
    //       this.workingDateObject = this.startDateObject
    //     }
    //     this.dayNumber = this.startDateObject.date()
    //     this.monthNumber = this.startDateObject.month() + 1
    //     // this.monthNumber = this.startDateObject.month()
    //     this.yearNumber = this.startDateObject.year()
    //   }
    //   else {
    //     // console.debug('startDateObject not defined')
    //     if (this.workingDateObject !== undefined) {
    //       this.workingDateObject = moment()
    //         .year(this.startYear)
    //         .month(this.startMonth - 1)
    //         .date(this.startDay)
    //     }
    //     // console.debug('old this.monthNumber, this.startMonth, this = ',
    //     //   this.monthNumber,
    //     //   this.startMonth,
    //     //   this
    //     // )
    //     this.dayNumber = this.startDay
    //     this.monthNumber = this.startMonth
    //     this.yearNumber = this.startYear
    //   }
    // },
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
      // console.debug(
      //   'handlePassedInEvents called',
      //   this.parsedEvents.length,
      //   this.eventArray.length,
      //   this.parsedEvents
      // )
      if (!this.isParsedEventsEmpty()) {
        // console.debug('about to call getPassedInParsedEvents')
        this.getPassedInParsedEvents()
      }
      else if (!this.isEventArrayEmpty()) {
        // console.debug('about to call getPassedInEventArray')
        this.getPassedInEventArray()
      }
      // console.debug('handlePassedInEvents done.')
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
