import DateTime from 'luxon/src/datetime'

const debug = require('debug')('calendar:CalendarMonth')

export default {
  // data () {
  //   return {
  //     dayCellHeight: 5,
  //     dayCellHeightUnit: 'rem',
  //     workingDate: new Date(),
  //     weekArray: [],
  //     parsed: this.getDefaultParsed(),
  //     eventDetailEventObject: {},
  //     eventClicked: false
  //   }
  // },
  computed: {
    // calendarDaysAreClickable: function () {
    //   return (this.fullComponentRef && this.fullComponentRef.length > 0)
    // }
  },
  methods: {
    // monthGetDateEvents: function (dateObject) {
    //   return this.dateGetEvents(dateObject)
    // },
    // doUpdate: function () {
    //   this.mountSetDate()
    //   let payload = this.getWeekArrayDisplayDates(this.generateCalendarCellArray())
    //   this.triggerDisplayChange(
    //     this.eventRef,
    //     payload
    //   )
    // },
    // getCalendarCellArray: function (monthNumber, yearNumber) {
    //   let currentDay = this.makeDT(
    //     DateTime.fromObject({
    //       year: yearNumber,
    //       month: monthNumber,
    //       day: 1
    //     })
    //   )
    //   let currentWeekOfYear = this.getWeekNumber(currentDay, this.sundayFirstDayOfWeek)
    //   let weekArray = []
    //   let currentWeekArray = []
    //   let thisDayObject = {}
    //   for (let thisDateOfMonth = 1; thisDateOfMonth <= 31; thisDateOfMonth++) {
    //     currentDay = this.makeDT(
    //       DateTime.fromObject({
    //         year: yearNumber,
    //         month: monthNumber,
    //         day: thisDateOfMonth
    //       })
    //     )
    //     if (
    //       currentDay.year === yearNumber &&
    //       currentDay.month === monthNumber
    //     ) {
    //       if (
    //         this.getWeekNumber(currentDay, this.sundayFirstDayOfWeek) !== currentWeekOfYear
    //       ) {
    //         weekArray.push(currentWeekArray)
    //         currentWeekOfYear = this.getWeekNumber(currentDay, this.sundayFirstDayOfWeek)
    //         currentWeekArray = []
    //       }
    //       thisDayObject = {
    //         dateObject: currentDay,
    //         year: currentDay.year,
    //         month: currentDay.month,
    //         date: currentDay.day,
    //         dayName: currentDay.toFormat('EEEE'),
    //         dayNumber: currentDay.weekday
    //       }
    //       currentWeekArray.push(thisDayObject)
    //     }
    //   }
    //   if (weekArray.length > 0) {
    //     weekArray.push(currentWeekArray)
    //   }
    //   return weekArray
    // },
    // generateCalendarCellArray: function () {
    //   this.weekArray = this.getCalendarCellArray(
    //     this.makeDT(this.workingDate).month,
    //     this.makeDT(this.workingDate).year
    //   )
    //   return this.weekArray
    // },

    /*
    handleNavMove: function (params) {
      this.moveTimePeriod(params)
      this.$emit(
        this.eventRef + ':navMovePeriod',
        // {
        //   unitType: params.unitType,
        //   amount: params.amount
        // }
        params
      )
      let payload = this.getWeekArrayDisplayDates(this.generateCalendarCellArray())
      payload['moveUnit'] = params.unitType
      payload['moveAmount'] = params.amount
      this.triggerDisplayChange(
        this.eventRef,
        payload
      )
    }
    */

    // getWeekArrayDisplayDates: function (weekArray) {
    //   // this takes a weekArray and figures out the values to send for a page display event
    //   let startDateObj = weekArray[0][0].dateObject
    //   const lastWeek = weekArray[weekArray.length - 1]
    //   let endDateObj = lastWeek[lastWeek.length - 1].dateObject
    //   return {
    //     startDate: startDateObj.toISODate(),
    //     endDate: endDateObj.toISODate(),
    //     numDays: Math.ceil(endDateObj.diff(startDateObj).as('days') + 1),
    //     viewType: this.$options.name
    //   }
    // },
    // handleDayClick: function (dateObject) {
    //   // event item clicked; prevent "day" event
    //   if (this.eventClicked) {
    //     this.eventClicked = false
    //     return
    //   }
    //   if (this.fullComponentRef) {
    //     this.fullMoveToDay(dateObject)
    //   }
    //   this.handleNavMove({ absolute: dateObject })
    //   this.triggerDayClick(dateObject, this.eventRef)
    // },
    // handleCalendarEventClick: function () {
    //   this.eventClicked = true
    // }
  },
  mounted () {
    debug('Component mounted')
    // this.doUpdate()
    // this.handlePassedInEvents()

    // this.$root.$on(
    //   this.eventRef + ':navMovePeriod',
    //   this.handleNavMove
    // )

    // this.$root.$on(
    //   'click-event-' + this.eventRef,
    //   this.handleEventDetailEvent
    // )
    // this.$root.$on(
    //   'update-event-' + this.eventRef,
    //   this.handleEventUpdate
    // )
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
