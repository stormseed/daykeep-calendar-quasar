<template>
  <div :class="columnCss">
    <!-- underlying cells -->
    <div
      v-for="thisHour in 24"
      :key="thisHour"
      :style="getCellStyle"
      :id="getDayHourId(eventRef, workingDate, thisHour - 1)"
    >
      <div class="calendar-day-time-content"></div>
    </div>

    <!-- events -->
    <template v-if="dateEvents.length > 0">
      <div
        v-for="eventObject in dateEvents"
        v-if="!eventObject.start.isAllDay && !eventObject.timeSpansMultipleDays"
        :key="makeDT(workingDate).toISODate() + getEventIdString(eventObject)"
        :class="calculateDayEventClass(eventObject)"
        :style="calculateDayEventStyle(eventObject)"
      >
        <calendar-event
          :event-object="eventObject"
          :event-ref="eventRef"
          :calendar-locale="calendarLocale"
          :calendar-timezone="calendarTimezone"
          :prevent-event-detail="preventEventDetail"
          :allow-editing="allowEditing"
          render-style="doubleLine"
        />
      </div>
    </template>

    <!-- current time -->
    <div
      class="current-time-line"
      :style="timePosition"
    ></div>

  </div>
</template>

<script>
  import CalendarEvent from './CalendarEvent'
  import {
    CalendarMixin
  } from './mixins'
  import DateTime from 'luxon/src/datetime'
  export default {
    name: 'CalendarDayColumn',
    props: {
      startDate: {
        type: [Object, Date],
        default: () => { return new Date() }
      },
      dateEvents: {
        type: Array,
        default: () => []
      },
      columnCssClass: {
        type: String,
        default: 'col'
      },
      dayCellHeight: {
        type: Number,
        default: 5
      },
      dayCellHeightUnit: {
        type: String,
        default: 'rem'
      },
      eventRef: String,
      preventEventDetail: {
        type: Boolean,
        default: false
      },
      calendarLocale: {
        type: String,
        default: () => { return DateTime.local().locale }
      },
      calendarTimezone: {
        type: String,
        default: () => { return DateTime.local().zoneName }
      },
      allowEditing: {
        type: Boolean,
        default: false
      }
    },
    components: {
      CalendarEvent
    },
    mixins: [CalendarMixin],
    data () {
      return {
        workingDate: new Date(),
        eventDetailEventObject: {},
        timePosition: {
          display: 'none'
        },
        timePositionInterval: {}
      }
    },
    watch: {
      startDate: 'mountSetDate'
    },
    computed: {
      columnCss: function () {
        let returnVal = {
          'calendar-day-column-content': true,
          'relative-position': true,
          'calendar-day-column-weekend': this.isWeekendDay(this.workingDate),
          'calendar-day-column-current': this.isCurrentDate(this.workingDate)
        }
        returnVal[this.columnCssClass] = true
        return returnVal
      },
      getCellStyle: function () {
        let thisHeight = this.dayCellHeight + this.dayCellHeightUnit
        return {
          height: thisHeight,
          'max-height': thisHeight
        }
      }
    },
    methods: {
      calculateDayEventClass: function (thisEvent) {
        let classes = {}
        if (thisEvent.numberOfOverlaps > 0) {
          classes['calendar-day-event-overlap'] = true
          if (thisEvent.overlapIteration === 1) {
            classes['calendar-day-event-overlap-first'] = true
          }
        }
        return classes
      },
      calculateDayEventStyle: function (thisEvent) {
        let style = {
          position: 'absolute',
          'z-index': 10,
          width: '100%'
        }
        let positions = {}
        if (thisEvent.start.dateObject && thisEvent.end.dateObject) {
          if (thisEvent.timeSpansOvernight) {
            if (this.makeDT(this.workingDate).toISODate() === this.makeDT(thisEvent.start.dateObject).toISODate()) {
              // this is a overnight event's first day
              positions = this.calculateDayEventPosition(
                thisEvent.start.dateObject,
                thisEvent.start.dateObject.set({ hour: 23, minute: 59 }) // set to midnight
              )
            }
            else {
              // this is the second day of an overnight event
              positions = this.calculateDayEventPosition(
                thisEvent.end.dateObject.set({ hour: 0, minute: 0 }), // set to midnight
                thisEvent.end.dateObject
              )
            }
          }
          else {
            positions = this.calculateDayEventPosition(
              thisEvent.start.dateObject,
              thisEvent.end.dateObject
            )
          }
        }
        else {
          positions = {
            top: 0,
            height: 0
          }
        }
        style['top'] = positions.top
        style['height'] = positions.height
        if (thisEvent.numberOfOverlaps > 0) {
          let thisWidth = (100 / (thisEvent.numberOfOverlaps + 1)).toFixed(2)
          let thisShift = thisWidth * (thisEvent.overlapIteration - 1)
          style['width'] = thisWidth + '%'
          style['max-width'] = thisWidth + '%'
          style['left'] = thisShift + '%'
          style['z-index'] = 10 + thisEvent.overlapIteration
        }
        return style
      },
      calculateDayEventPosition: function (startDateObject, endDateObject) {
        // let startMidnight = date.adjustDate(startDateObject, {
        //   hours: 0,
        //   minutes: 0,
        //   seconds: 0,
        //   milliseconds: 0
        // })
        // let topMinuteCount = date.getDateDiff(startDateObject, startMidnight, 'minutes')
        // let heightMinuteCount = date.getDateDiff(endDateObject, startDateObject, 'minutes')
        let startMidnight = startDateObject.set({
          hours: 0,
          minutes: 0,
          seconds: 0,
          milliseconds: 0
        })
        let topMinuteCount = startDateObject.diff(startMidnight).as('minutes')
        let heightMinuteCount = endDateObject.diff(startDateObject).as('minutes')
        let sizePerMinute = this.dayCellHeight / 60
        return {
          top: (topMinuteCount * sizePerMinute) + this.dayCellHeightUnit,
          height: (heightMinuteCount * sizePerMinute) + this.dayCellHeightUnit
        }
      },
      calculateTimePosition: function () {
        let pos = {}
        let thisDateObject = this.makeDT(DateTime.local())
        if (
          thisDateObject.hasSame(this.workingDate, 'day') &&
          thisDateObject.hasSame(this.workingDate, 'month') &&
          thisDateObject.hasSame(this.workingDate, 'year')
        ) {
          pos = this.calculateDayEventPosition(thisDateObject, thisDateObject)
          pos.height = pos.top + 1
        }
        else {
          pos = {
            display: 'none'
          }
        }
        this.timePosition = pos
      },
      startTimePositionInterval: function () {
        this.calculateTimePosition()
        this.timePositionInterval = setInterval(
          this.calculateTimePosition,
          60000 // one minute
        )
      },
      endTimePositionInterval: function () {
        clearInterval(this.timePositionInterval)
      }
    },
    mounted () {
      this.mountSetDate()
      this.startTimePositionInterval()
    },
    beforeDestroy () {
      this.endTimePositionInterval()
    }
  }
</script>

<style lang="stylus">
  @import 'calendar.vars.styl'

  .calendar-day
    position relative
    .calendar-day-cell-height
      height 5rem
      max-height 5rem
    .calendar-day-column-label
      //
    .calendar-day-column-content
      position relative
    .calendar-day-column-current
      background-color $currentDayBackgroundColor
    .calendar-day-column-weekend
      background-color $weekendDayBackgroundColor
    .calendar-day-time
      padding-right .5em
      border-right $borderOuter
    .calendar-day-time-content
      border-top $borderThin
    .calendar-day-event-overlap
      margin-left 1px
      ::after
        position absolute
        top -1px
        left -1px
        width: calc(100% + 2px)
        height: calc(100% + 2px)
        content ''
        border-radius 5px
        border 1px solid white
        box-sizing border-box
    .calendar-day-event-overlap-first
      margin-left 0
    .current-time-line
      position absolute
      border 1px solid red
      width 100%


</style>
