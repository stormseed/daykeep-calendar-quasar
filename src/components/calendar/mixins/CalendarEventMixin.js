import dashHas from 'lodash.has'
import DateTime from 'luxon/src/datetime'
import Interval from 'luxon/src/interval'
const defaultParsed = {
  byAllDayStartDate: {},
  byAllDayObject: {},
  byStartDate: {},
  byId: {}
}
// const { DateTime } = require('luxon')
const gridBlockSize = 5 // the number here is how many minutes for each block to use when calculating overlaps
export default {
  computed: {},
  methods: {

    formatToSqlDate: function (dateObject) {
      return this.makeDT(dateObject).toISODate()
    },
    getEventById: function (eventId) {
      return this.parsed.byId[eventId]
    },
    dateGetEvents: function (thisDate, skipSlotIndicators) {
      let hasAllDayEvents = this.hasAllDayEvents(thisDate)
      let hasEvents = this.hasEvents(thisDate)
      let returnArray = []
      let sqlDate = this.makeDT(thisDate).toISODate()
      if (hasAllDayEvents) {
        let transferFields = ['daysFromStart', 'durationDays', 'hasNext', 'hasPrev', 'slot']
        // build temp object with slot IDs
        let slotObject = {}
        let maxSlot = 0
        for (let thisEvent of this.parsed.byAllDayObject[sqlDate]) {
          slotObject[thisEvent.slot] = thisEvent
          if (thisEvent.slot > maxSlot) {
            maxSlot = thisEvent.slot
          }
        }
        // now we have it sorted but have to fill in any gaps
        for (let counter = 0; counter <= maxSlot; counter++) {
          let tempObject = {}
          if (dashHas(slotObject, counter)) {
            // this element exists
            tempObject = this.getEventById(slotObject[counter].id)
            for (let thisField of transferFields) {
              tempObject[thisField] = slotObject[counter][thisField]
            }
          }
          else {
            // this is an empty slot
            tempObject = {
              slot: counter,
              start: {
                isAllDay: true,
                isEmptySlot: true
              }
            }
          }
          if (skipSlotIndicators && tempObject.slot) {
            // bypass this - we don't want slot indicators
          }
          else {
            returnArray.push(tempObject)
          }
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
        this.parsed.byAllDayObject,
        this.formatToSqlDate(thisDateObject)
      )
    },
    hasEvents: function (thisDateObject) {
      return dashHas(
        this.parsed.byStartDate,
        this.formatToSqlDate(thisDateObject)
      )
    },

    clearParsed: function () {
      this.parsed = {}
      this.parsed = {
        byAllDayStartDate: {},
        byAllDayObject: {},
        byStartDate: {},
        byId: {},
        byMultiDay: {},
        byNextDay: {},
        byContinuedMultiDay: {},
        byContinuedNextDay: {}
      }
      return true
    },
    moveToDisplayZone: function (dateObject) {
      return this.makeDT(dateObject, this.calendarTimezone)
    },
    parseEventList: function () {
      this.clearParsed()
      for (let thisEvent of this.eventArray) {
        this.parsed.byId[thisEvent.id] = thisEvent
        if (dashHas(thisEvent.start, 'date')) {
          thisEvent.start['dateObject'] = this.moveToDisplayZone(
            DateTime.fromISO(thisEvent.start.date).startOf('day')
          )
          thisEvent.end['dateObject'] = this.moveToDisplayZone(
            DateTime.fromISO(thisEvent.end.date).endOf('day')
          )
          thisEvent.start['isAllDay'] = true
          thisEvent['durationDays'] = Math.ceil(
            thisEvent.end.dateObject
              .diff(thisEvent.start.dateObject)
              .as('days')
          )
        }
        else {
          // start date
          thisEvent.start['dateObject'] = DateTime.fromISO(thisEvent.start.dateTime)
          if (dashHas(thisEvent.start, 'timeZone')) {
            // convert to local timezone
            thisEvent.start.dateObject = thisEvent.start.dateObject
              .setZone(thisEvent.start.timeZone, { keepLocalTime: true })
              .toLocal()
            delete thisEvent.start.timeZone
            thisEvent.start.dateTime = thisEvent.start.dateObject.toISO() // fix time zone
          }
          thisEvent.start.dateObject = this.moveToDisplayZone(
            thisEvent.start.dateObject
          )
          // end date
          thisEvent.end['dateObject'] = DateTime.fromISO(thisEvent.end.dateTime)
          if (dashHas(thisEvent.end, 'timeZone')) {
            // convert to local timezone
            thisEvent.end.dateObject = thisEvent.end.dateObject
              .setZone(thisEvent.end.timeZone, { keepLocalTime: true })
              .toLocal()
            delete thisEvent.end.timeZone
            thisEvent.end.dateTime = thisEvent.end.dateObject.toISO() // fix time zone
          }
          thisEvent.end.dateObject = this.moveToDisplayZone(
            thisEvent.end.dateObject
          )
        }

        // put in duration for multiday events with an associated time
        if (
          !thisEvent.start['isAllDay'] &&
          thisEvent.start.dateObject.toISODate() !== thisEvent.end.dateObject.toISODate()
        ) {
          thisEvent['durationDays'] = Math.ceil(
            thisEvent.end.dateObject
              .diff(thisEvent.start.dateObject)
              .as('days')
          )
          if (thisEvent['durationDays'] > 2) {
            thisEvent['timeSpansMultipleDays'] = true
          }
          else {
            thisEvent['timeSpansOvernight'] = true
          }
        }

        let thisStartDate = thisEvent.start.dateObject.toISODate()
        // get all-day events
        if (
          thisEvent.start.isAllDay ||
          Math.floor(thisEvent.end.dateObject.diff(thisEvent.start.dateObject).as('days')) > 1
        ) {
          for (let dayAdd = 0; dayAdd < thisEvent.durationDays; dayAdd++) {
            let innerStartDate = thisEvent.start.dateObject
              .plus({ days: dayAdd })
              .toISODate()
            this.addToParsedList('byAllDayStartDate', innerStartDate, thisEvent.id)
            // newer all-day events routine
            this.addToParsedList(
              'byAllDayObject',
              innerStartDate,
              {
                id: thisEvent.id,
                hasPrev: (dayAdd > 0),
                hasNext: (dayAdd < (thisEvent.durationDays - 1)),
                hasPreviousDay: (dayAdd > 0),
                hasNextDay: (dayAdd < (thisEvent.durationDays - 1)),
                durationDays: thisEvent.durationDays,
                startDate: thisEvent.start.dateObject,
                daysFromStart: dayAdd
              }
            )
          }
        }

        // get events with a start and end time
        else {
          thisEvent.durationMinutes = this.parseGetDurationMinutes(thisEvent)
          this.addToParsedList('byStartDate', thisStartDate, thisEvent.id)

          if (thisEvent.start.dateObject.toISODate() !== thisEvent.end.dateObject.toISODate()) {
            // this is a date where the time is set and spans across more than one day
            const diffDays = Math.floor(thisEvent.end.dateObject.diff(thisEvent.start.dateObject).as('days'))

            if (diffDays > 1) {
              // this event spans multiple days
              this.addToParsedList('byMultiDay', thisStartDate, thisEvent.id)
              this.addToParsedList('byAllDayObject', thisStartDate, thisEvent.id)
              this.addToParsedList('byAllDayStartDate', thisStartDate, thisEvent.id)
              let multiDate = thisEvent.start.dateObject
              while (multiDate.toISODate() !== thisEvent.end.dateObject.toISODate()) {
                multiDate = multiDate.plus({ days: 1 })
                this.addToParsedList('byContinuedMultiDay', multiDate.toISODate(), thisEvent.id)
                this.addToParsedList('byAllDayObject', thisStartDate, thisEvent.id)
              }
            }
            else {
              // this event crosses into the next day
              this.addToParsedList('byNextDay', thisStartDate, thisEvent.id)
              this.addToParsedList('byContinuedNextDay', thisEvent.end.dateObject.toISODate(), thisEvent.id)
              this.addToParsedList('byStartDate', thisEvent.end.dateObject.toISODate(), thisEvent.id)
            }
          }
        }
      }
      // sort all day events
      for (let thisDate in this.parsed.byAllDayObject) {
        this.parsed.byAllDayObject[thisDate].sort(this.sortPairOfAllDayObjects)
      }
      this.buildAllDaySlotArray()
      for (let thisDate in this.parsed.byStartDate) {
        this.parsed.byStartDate[thisDate] = this.sortDateEvents(this.parsed.byStartDate[thisDate])
        this.parseDateEvents(this.parsed.byStartDate[thisDate])
      }
    },

    addToParsedList: function (listName, thisDate, whatToPush) {
      if (!dashHas(this.parsed[listName], thisDate)) {
        this.parsed[listName][thisDate] = []
      }
      this.parsed[listName][thisDate].push(whatToPush)
    },
    eventIsContinuedFromPreviousDay(id, thisDayObject) {
      const isoDate = this.makeDT(thisDayObject).toISODate()
      return (
        dashHas(this.parsed['byContinuedNextDay'], isoDate) &&
        this.parsed['byContinuedNextDay'][isoDate].includes(id)
      )
    },
    buildAllDaySlotArray: function () {
      let slotAssignments = {}

      let dateArray = Object.keys(this.parsed.byAllDayObject).sort()
      for (let thisDate of dateArray) {
        if (!dashHas(slotAssignments, thisDate)) {
          slotAssignments[thisDate] = {}
        }

        // go through each element on that date
        for (let thisAllDayObject of this.parsed.byAllDayObject[thisDate]) {
          if (!dashHas(thisAllDayObject, 'slot')) {
            let thisEventId = thisAllDayObject.id
            // find the first empty slot in the first day
            let slotToUse = 0
            let slotFound = false
            while (!slotFound) {
              if (dashHas(slotAssignments[thisDate], slotToUse)) {
                slotToUse++
              }
              else {
                slotFound = true
              }
            }
            // now fill that slot for each successive day
            for (let dayAdd = 0; dayAdd < thisAllDayObject.durationDays; dayAdd++) {
              let innerStartDate = DateTime.fromISO(thisDate + 'T00:00:00')
                .plus({ days: dayAdd })
                .toISODate()
              if (!dashHas(slotAssignments, innerStartDate)) {
                slotAssignments[innerStartDate] = {}
              }
              slotAssignments[innerStartDate][slotToUse] = thisEventId
              // go through each element on that date
              for (let thisDateElementIndex in this.parsed.byAllDayObject[innerStartDate]) {
                let thisDateElement = this.parsed.byAllDayObject[innerStartDate][thisDateElementIndex]
                if (thisDateElement.id === thisEventId) {
                  this.parsed.byAllDayObject[innerStartDate][thisDateElementIndex]['slot'] = slotToUse
                  break
                }
              }
            }
          }
        }
      }
    },

    sortPairOfAllDayObjects: function (eventA, eventB) {
      if (eventA.daysFromStart < eventB.daysFromStart) return 1
      if (eventA.daysFromStart > eventB.daysFromStart) return -1
      // okay, so daysFromStart are equal, now look at duration
      if (eventA.durationDays > eventB.durationDays) return 1
      if (eventA.durationDays < eventB.durationDays) return -1
      // daysFromStart are equal, so just take the first one
      return 0
    },

    sortPairOfDateEvents: function (eventA, eventB) {
      // return date.getDateDiff(
      //   date.addToDate(eventA.start.dateObject, { milliseconds: eventA.durationMinutes }),
      //   date.addToDate(eventB.start.dateObject, { milliseconds: eventB.durationMinutes })
      // )
      return eventB.start.dateObject
        .plus({ milliseconds: eventA.durationMinutes })
        .diff(
          eventB.start.dateObject.plus({ milliseconds: eventA.durationMinutes })
        )
        .as('days')
    },

    sortDateEvents: function (eventArray) {
      let tempArray = []
      for (let eventId of eventArray) {
        tempArray.push(this.parsed.byId[eventId])
      }
      tempArray.sort(this.sortPairOfDateEvents)
      let returnArray = []
      for (let thisEvent of tempArray) {
        returnArray.push(thisEvent.id)
      }
      return returnArray
    },

    parseDateEvents: function (eventArray) {
      let columnArray = [[]]
      let gridTimeMap = new Map()
      for (let eventId of eventArray) {
        let thisEvent = this.parsed.byId[eventId]

        let gridTimes = this.getGridTimeSlots(thisEvent)
        for (let gridCounter = gridTimes.start; gridCounter <= gridTimes.end; gridCounter++) {
          if (gridTimeMap.has(gridCounter)) {
            gridTimeMap.set(gridCounter, gridTimeMap.get(gridCounter) + 1)
          }
          else {
            gridTimeMap.set(gridCounter, 1)
          }
        }

        let foundAColumn = false
        for (let columnIndex in columnArray) {
          if (this.hasSlotForEvent(thisEvent, columnArray[columnIndex])) {
            columnArray[columnIndex].push(thisEvent)
            foundAColumn = true
            break
          }
        }
        if (!foundAColumn) {
          columnArray.push([thisEvent])
        }
      }
      // let numberOfColumns = columnArray.length
      for (let columnIndex in columnArray) {
        for (let thisEvent of columnArray[columnIndex]) {
          // thisEvent.numberOfOverlaps = numberOfColumns - 1
          thisEvent.numberOfOverlaps = this.getMaxOfGrid(thisEvent, gridTimeMap) - 1
          thisEvent.overlapIteration = parseInt(columnIndex) + 1
        }
      }
      // make column count corrections for overlapping events that overlap with other events. Confusing.
      for (let eventId of eventArray) {
        let thisEvent = this.parsed.byId[eventId]
        thisEvent.numberOfOverlaps = this.getMaxOverlapsForEvent(thisEvent, eventArray)
      }
    },
    eventsOverlap: function (event1, event2) {
      // const interval1 = this.getIntervalFromEvent(event1)
      // const interval2 = this.getIntervalFromEvent(event2)
      // return interval1.overlaps(interval2)
      return this.getIntervalFromEvent(event1).overlaps(this.getIntervalFromEvent(event2))
    },
    getIntervalFromEvent: function (thisEvent) {
      return Interval.fromDateTimes(
        thisEvent.start.dateObject,
        thisEvent.end.dateObject
      )
    },
    getMaxOverlapsForEvent: function (testEvent, eventArray) {
      let maxOverlaps = testEvent.numberOfOverlaps
      for (let eventId of eventArray) {
        const thisEvent = this.parsed.byId[eventId]
        if (this.eventsOverlap(testEvent, thisEvent)) {
          if (thisEvent.numberOfOverlaps > testEvent.numberOfOverlaps) {
            maxOverlaps = thisEvent.numberOfOverlaps
          }
        }
      }
      return maxOverlaps
    },
    hasSlotForEvent: function (checkEvent, existingEvents = []) {
      let slotAvailable = true
      for (let thisEvent of existingEvents) {
        if (
          // case 1: top of checkEvent overlaps bottom of thisEvent
          checkEvent.start.dateObject >= thisEvent.start.dateObject &&
          checkEvent.start.dateObject < thisEvent.end.dateObject
        ) {
          slotAvailable = false
          break
        }
        else if (
          // case 2: bottom of checkEvent overlaps top of thisEvent
          checkEvent.end.dateObject > thisEvent.start.dateObject &&
          checkEvent.end.dateObject <= thisEvent.end.dateObject
        ) {
          slotAvailable = false
          break
        }
        else if (
          // case 3: checkEvent falls inside of thisEvent
          checkEvent.start.dateObject >= thisEvent.start.dateObject &&
          checkEvent.end.dateObject <= thisEvent.end.dateObject
        ) {
          slotAvailable = false
          break
        }
        else if (
          // case 4: checkEvent encompasses all of thisEvent
          checkEvent.start.dateObject <= thisEvent.start.dateObject &&
          checkEvent.end.dateObject >= thisEvent.end.dateObject
        ) {
          slotAvailable = false
          break
        }
      }
      return slotAvailable
    },

    getGridTimeSlots: function (thisEvent) {
      return {
        start: this.getGridTime(thisEvent.start.dateObject, false),
        end: this.getGridTime(thisEvent.end.dateObject, true) - 1
      }
    },
    getGridTime: function (dateObject, roundUp = false) {
      dateObject = this.makeDT(dateObject) // just in case
      const gridCalc = ((dateObject.hour * 60) + dateObject.minute) / gridBlockSize
      if (roundUp) {
        return Math.ceil(gridCalc)
      }
      else {
        return Math.floor(gridCalc)
      }
    },
    getMaxOfGrid: function (thisEvent, gridTimeMap) {
      // TODO: there's probably a fancier Collections way to do this
      let max = 0
      const gridTimes = this.getGridTimeSlots(thisEvent)
      for (let gridCounter = gridTimes.start; gridCounter <= gridTimes.end; gridCounter++) {
        if (gridTimeMap.has(gridCounter) && gridTimeMap.get(gridCounter) > max) {
          max = gridTimeMap.get(gridCounter)
        }
      }
      return max
    },

    parseGetDurationMinutes: function (eventObj) {
      if (eventObj.start.isAllDay) {
        return 24 * 60
      }
      else {
        return eventObj.end.dateObject.diff(
          eventObj.start.dateObject,
          'minutes'
        )
      }
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

    handleEventUpdate: function (eventObject) {
      if (dashHas(this._props, 'fullComponentRef') && this._props.fullComponentRef) {
        // this component has a calendar parent, so don't move forward
        return
      }
      let thisEventId = eventObject.id
      // update eventArray
      for (let thisEventIndex in this.eventArray) {
        if (this.eventArray[thisEventIndex].id === thisEventId) {
          this.eventArray[thisEventIndex] = eventObject
          this.parseEventList()
        }
      }
    },

    formatTimeRange: function (startTime, endTime) {
      let returnString = ''
      // start time
      returnString += this.simplifyTimeFormat(
        this.makeDT(startTime).toLocaleString(DateTime.TIME_SIMPLE),
        (this.formatDate(startTime, 'a') === this.formatDate(endTime, 'a'))
      )
      returnString += ' - '
      // end time
      returnString += this.simplifyTimeFormat(
        this.makeDT(endTime).toLocaleString(DateTime.TIME_SIMPLE),
        false
      )
      return returnString
    },
    formatTime: function (startTime) {
      let returnString = this.makeDT(startTime).toLocaleString(DateTime.TIME_SIMPLE)
      // simplify if AM / PM present
      if (returnString.includes('M')) {
        returnString = returnString.replace(':00', '') // remove minutes if = ':00'
          .replace(' AM', 'am')
          .replace(' PM', 'pm')
      }
      return returnString
    },
    getEventDuration: function (startTime, endTime) {
      return Math.floor(
        this.makeDT(endTime).diff(this.makeDT(startTime)).as('minutes')
      )
    }
  },
  mounted () {}
}
