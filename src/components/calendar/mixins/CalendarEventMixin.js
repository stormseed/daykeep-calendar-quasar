import dashHas from 'lodash.has'
// import DateTime from 'luxon'
import {
  date
} from 'quasar'
const defaultParsed = {
  byAllDayStartDate: {},
  byAllDayObject: {},
  byStartDate: {},
  byId: {}
}
const { DateTime } = require('luxon')
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
        byId: {}
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
        let thisStartDate = thisEvent.start.dateObject.toISODate()
        // get all-day events
        if (thisEvent.start.isAllDay) {
          for (let dayAdd = 0; dayAdd < thisEvent.durationDays; dayAdd++) {
            let innerStartDate = thisEvent.start.dateObject
              .plus({ days: dayAdd })
              .toISODate()
            if (!dashHas(this.parsed.byAllDayStartDate, innerStartDate)) {
              this.parsed.byAllDayStartDate[innerStartDate] = []
            }
            this.parsed.byAllDayStartDate[innerStartDate].push(thisEvent.id)
            // newer all-day events routine
            if (!dashHas(this.parsed.byAllDayObject, innerStartDate)) {
              this.parsed.byAllDayObject[innerStartDate] = []
            }

            this.parsed.byAllDayObject[innerStartDate].push({
              id: thisEvent.id,
              hasPrev: (dayAdd > 0),
              hasNext: (dayAdd < (thisEvent.durationDays - 1)),
              hasPreviousDay: (dayAdd > 0),
              hasNextDay: (dayAdd < (thisEvent.durationDays - 1)),
              durationDays: thisEvent.durationDays,
              startDate: thisEvent.start.dateObject,
              daysFromStart: dayAdd
            })
          }
        }

        // get events with a start and end time
        else {
          thisEvent.durationMinutes = this.parseGetDurationMinutes(thisEvent)
          if (!dashHas(this.parsed.byStartDate, thisStartDate)) {
            this.parsed.byStartDate[thisStartDate] = []
          }
          this.parsed.byStartDate[thisStartDate].push(thisEvent.id)
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

    sortPairOfAllDayObjects: function (a, b) {
      if (a.daysFromStart < b.daysFromStart) return 1
      if (a.daysFromStart > b.daysFromStart) return -1
      // okay, so daysFromStart are equal, now look at duration
      if (a.durationDays > b.durationDays) return 1
      if (a.durationDays < b.durationDays) return -1
      // daysFromStart are equal, so just take the first one
      return 0
    },

    sortPairOfDateEvents: function (a, b) {
      return date.getDateDiff(
        date.addToDate(a.start.dateObject, { milliseconds: a.durationMinutes }),
        date.addToDate(b.start.dateObject, { milliseconds: b.durationMinutes })
      )
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
        return eventObj.end.dateObject.diff(
          eventObj.start.dateObject,
          'minutes'
        )
      }
    },
    parseHasOverlap: function (event1, event2) {
      return (event1.start.dateObject <= event2.end.dateObject) &&
        (event1.end.dateObject >= event2.start.dateObject)
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
      if (dashHas(this._props, 'fullComponentRef')) {
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
    }
  },
  mounted () {}
}
