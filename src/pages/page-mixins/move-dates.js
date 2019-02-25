import {
  date
} from 'quasar'
import { sampleDateAdjustments } from './sample-data'
import dashHas from 'lodash.has'

export default {
  methods: {
    moveSampleDatesAhead: function () {
      // function to take dates in our demo eventArray and move them to the near future
      for (let counter = 0; counter < this.eventArray.length; counter++) {
        let currentItem = this.eventArray[counter]
        for (let thisAdjustment of sampleDateAdjustments) {
          if (thisAdjustment.ids.indexOf(currentItem.id) >= 0) {
            currentItem = this.adjustStartEndDates(currentItem, thisAdjustment.addDays)
          }
        }
        this.eventArray[counter] = currentItem
      }
    },
    adjustStartEndDates: function (eventItem, numDays) {
      let daysDiff = 0
      if (dashHas(eventItem.start, 'dateTime') && dashHas(eventItem.end, 'dateTime')) {
        // console.debug('has dateTime')
        daysDiff = date.getDateDiff(
          new Date(eventItem.end.dateTime),
          new Date(eventItem.start.dateTime),
          'days'
        )
      }
      else if (dashHas(eventItem.start, 'date') && dashHas(eventItem.end, 'date')) {
        // console.debug('has date', Date(eventItem.start.date), Date(eventItem.end.date))
        // console.debug('has date', JSON.stringify(eventItem))
        daysDiff = date.getDateDiff(
          new Date(eventItem.end.date),
          new Date(eventItem.start.date),
          'days'
        )
      }

      // start dates
      if (dashHas(eventItem.start, 'dateTime')) {
        eventItem.start.dateTime = this.getSqlDateFormat(
          this.setADateToADay(eventItem.start.dateTime, numDays),
          true
        )
      }
      if (dashHas(eventItem.start, 'date')) {
        eventItem.start.date = this.getSqlDateFormat(
          this.setADateToADay(eventItem.start.date + 'T00:00:00Z', numDays),
          false
        )
      }

      // end dates
      if (dashHas(eventItem.end, 'dateTime')) {
        eventItem.end.dateTime = this.getSqlDateFormat(
          this.setADateToADay(eventItem.end.dateTime, numDays + daysDiff),
          true
        )
      }
      if (dashHas(eventItem.end, 'date')) {
        eventItem.end.date = this.getSqlDateFormat(
          this.setADateToADay(eventItem.end.date + 'T00:00:00Z', numDays + daysDiff),
          false
        )
      }
      return eventItem
    },
    setADateToADay: function (dateObject, addDays) {
      let now = new Date()
      if (typeof dateObject === 'string') {
        dateObject = new Date(dateObject)
      }
      dateObject = date.adjustDate(
        dateObject, {
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          date: now.getDate()
        }
      )
      if (addDays !== undefined) {
        dateObject = date.addToDate(
          dateObject, {
            days: addDays
          }
        )
      }
      return dateObject
    },
    getSqlDateFormat: function (dateObject, withTime) {
      if (withTime) {
        return date.formatDate(dateObject, 'YYYY-MM-DDTHH:mm:ssZ')
      }
      else {
        return date.formatDate(dateObject, 'YYYY-MM-DD')
      }
    }
  }
}
