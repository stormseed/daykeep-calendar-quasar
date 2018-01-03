import Moment from 'moment'
import { extendMoment } from 'moment-range'
import _ from 'lodash'
import { Events } from 'quasar'
const moment = extendMoment(Moment)
export default {
  computed: {},
  methods: {
    formatTimeFromNumber: function (hourNumber) {
      return moment().hour(hourNumber).format('ha')
    },
    moveTimePeriod: function (unitType, amount) {
      // console.debug('moveTimePeriod called with', unitType, amount)
      let currentMom = this.createThisDate(this.dayNumber)
      // console.debug('currentMom = ', currentMom)
      currentMom.add(amount, unitType)
      // console.debug('new currentMom = ', currentMom)
      // console.debug('moveTimePeriod add done')
      // if (amount > 0) {
      //   currentMom.add(amount, unitType)
      // }
      // else {
      //   currentMom.subtract(Math.abs(amount), unitType)
      // }
      // console.debug('old year, month, day = ', this.yearNumber, this.monthNumber, this.dayNumber)
      this.yearNumber = currentMom.year()
      this.monthNumber = currentMom.month() + 1
      // this.monthNumber = currentMom.month()
      this.weekNumber = currentMom.week()
      this.dayNumber = currentMom.date()
      // if (this.generateCalendarCellArray !== undefined) {
      //   this.generateCalendarCellArray()
      // }
      // console.debug('new year, month, day = ', this.yearNumber, this.monthNumber, this.dayNumber)
      Events.$emit('calendar:startDatesChanged')
      // console.debug('leaving moveTimePeriod')
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
    formatToSqlDate: function (momentObject) {
      // console.debug('formatToSqlDate called, ', momentObject)
      return momentObject.format('YYYY-MM-DD')
    },
    dateGetEvents: function (dateNum) {
      let thisDate = this.createThisDate(dateNum)
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
    parseDateParams: function (params) {
      // console.debug('parseDateParams called, params = ', params)
      let thisDateObject = {}
      if (moment.isMoment(params)) {
        thisDateObject = params
      }
      else if (typeof params === 'number') {
        // assume this is a day date
        thisDateObject = moment()
          .year(this.yearNumber)
          .month(this.monthNumber - 1)
          .date(params)
      }
      else if (typeof params === 'string') {
        // parse the string
        thisDateObject = moment(params)
      }
      else if (typeof params === 'object') {
        thisDateObject = moment()
          .year(_.get(params, 'year', this.yearNumber))
          .month(_.get(params, 'month', this.monthNumber - 1))
          .date(_.get(params, 'date', this.dayNumber))
      }
      else if (typeof params === 'undefined') {
        thisDateObject = moment()
          .year(this.yearNumber)
          .month(this.monthNumber - 1)
          .date(this.dayNumber)
      }
      else {
        thisDateObject = moment()
      }
      // console.debug('parseDateParams returning = ', thisDateObject)
      return thisDateObject
    },
    hasAnyEvents: function (params) {
      // console.debug('hasAnyEvents call with params = ', params)
      let thisDateObject = this.parseDateParams(params)
      return (
        this.hasEvents(thisDateObject) ||
        this.hasAllDayEvents(thisDateObject)
      )
    },
    hasAllDayEvents: function (params) {
      let thisDateObject = this.parseDateParams(params)
      return _.has(
        this.parsed.byAllDayStartDate,
        this.formatToSqlDate(thisDateObject)
      )
    },
    hasEvents: function (params) {
      let thisDateObject = this.parseDateParams(params)
      return _.has(
        this.parsed.byStartDate,
        this.formatToSqlDate(thisDateObject)
      )
    },
    createThisDate: function (dateNum) {
      return this.parseDateParams(dateNum)
      // return moment().year(this.yearNumber).month(this.monthNumber - 1).date(dateNum)
    },
    parseEventList: function () {
      // let thisStart = {}
      for (let thisEvent of this.eventArray) {
        console.debug(thisEvent)
        this.parsed.byId[thisEvent.id] = thisEvent
        let thisStartDateTime = moment(thisEvent.start.dateTime)
        // console.debug('parseEventList about to call formatSql')
        let thisStartDate = this.formatToSqlDate(thisStartDateTime)

        // get all-day events
        if (thisEvent.start.isAllDay) {
          if (!_.has(this.parsed.byAllDayStartDate, thisStartDate)) {
            this.parsed.byAllDayStartDate[thisStartDate] = []
          }
          this.parsed.byAllDayStartDate[thisStartDate].push(thisEvent.id)
        }

        // get events with a start and end time
        else {
          thisEvent.duration = this.parseGetDurationMinutes(thisEvent)
          if (!_.has(this.parsed.byStartDate, thisStartDate)) {
            this.parsed.byStartDate[thisStartDate] = []
          }
          this.parsed.byStartDate[thisStartDate].push(thisEvent.id)
        }
      }

      // console.debug('this.parsed.byStartDate = ', this.parsed.byStartDate)
      for (let thisDate in this.parsed.byStartDate) {
        console.debug(thisDate)
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
        let timeA = moment(a.start.dateTime).unix() + (a.duration / 1000)
        let timeB = moment(b.start.dateTime).unix() + (b.duration / 1000)
        return timeA - timeB
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
        let thisStart = moment(eventObj.start.dateTime)
        let thisEnd = moment(eventObj.end.dateTime)
        return thisEnd.diff(thisStart, 'minutes')
      }
    },
    parseHasOverlap: function (event1, event2) {
      const range1 = moment.range(event1.start.dateTime, event1.end.dateTime)
      const range2 = moment.range(event2.start.dateTime, event2.end.dateTime)
      return range1.overlaps(range2, { adjacent: true })
    },
    isCurrentDate: function (thisDateNum) {
      let now = moment()
      // let test = moment().year(this.yearNumber).month(this.monthNumber - 1).date(thisDateNum)
      let test = moment().year(this.yearNumber).month(this.monthNumber - 1).date(thisDateNum)
      // console.debug('isCurrentDate called, checking now = ', now.format('YYYY-MM-DD'))
      // console.debug('test = ', test.format('YYYY-MM-DD'))
      // console.debug('this.monthNumber = ', this.monthNumber)
      // console.debug('test = ', test.format('YYYY-MM-DD'))
      return now.isSame(test, 'day')
    },
    isCurrentWeekday: function (thisDayNum) {
      return (moment().weekday() === thisDayNum)
    },
    dayNameFromLocaleNumber: function (dayNumber) {
      return moment().weekday(dayNumber).format('dddd')
    },
    dayNameAbbreviation: function (dayName, numLetters) {
      if (typeof dayName === 'string') {
        return dayName.slice(0, numLetters)
      }
      else {
        return 'Err'
      }
    },
    mountSetDate: function () {
      // console.debug('mountSetDate called')
      // if (_.has(this, 'startDateObject')) {
      if (this.startDateObject !== undefined) {
        if (this.workingDateObject !== undefined) {
          this.workingDateObject = this.startDateObject
        }
        this.dayNumber = this.startDateObject.date()
        this.monthNumber = this.startDateObject.month() + 1
        this.yearNumber = this.startDateObject.year()
      }
      else {
        // console.debug('startDateObject not defined')
        if (this.workingDateObject !== undefined) {
          this.workingDateObject = moment()
            .year(this.startYear)
            .month(this.startMonth - 1)
            .date(this.startDay)
        }
        // console.debug('old this.monthNumber, this.startMonth, this = ',
        //   this.monthNumber,
        //   this.startMonth,
        //   this
        // )
        this.dayNumber = this.startDay
        this.monthNumber = this.startMonth
        this.yearNumber = this.startYear
      }
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
    floor10: function (value, exp) {
      return this.decimalAdjust('floor', value, exp)
    },
    calculateDayCellWidth: function (numberOfDays) {
      return this.decimalAdjust(
        'floor',
        100 / numberOfDays,
        -3
      ) + '%'
    }
  },
  mounted () {}
}
