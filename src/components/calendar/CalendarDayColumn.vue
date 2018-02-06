<template>
    <div :class="columnCss()">
        <!-- underlying cells -->
        <!--<div v-for="thisHour in 24" :style="{ 'height': dayCellHeight, 'max-height': dayCellHeight }">-->
        <div v-for="thisHour in 24" :style="getCellStyle">
            <div class="calendar-day-time-content"></div>
        </div>

        <!-- events -->
        <div
            v-if="dateEvents.length > 0"
            v-for="eventObject in dateEvents"
            :class="calculateDayEventClass(eventObject)"
            :style="calculateDayEventStyle(eventObject)"
        >
            <calendar-event
                v-if="!eventObject.start.isAllDay"
                :event-object="eventObject"
            />
        </div>

    </div>
</template>

<script>
  import moment from 'moment'
  import CalendarEvent from './CalendarEvent'
  import CalendarMixin from './CalendarMixin'
  export default {
    name: 'CalendarDayColumn',
    props: {
      startMonth: {
        type: Number,
        default: moment().month()
      },
      startYear: {
        type: Number,
        default: moment().year()
      },
      startDay: {
        type: Number,
        default: moment().date()
      },
      startDateObject: Object,
      dateEvents: {
        type: Array,
        default: []
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
      }
    },
    components: {
      CalendarEvent
    },
    mixins: [CalendarMixin],
    data () {
      return {
        // dayCellHeight: 5,
        // dayCellHeightUnit: 'rem',
        yearNumber: moment().year(),
        monthNumber: moment().month() + 1,
        weekNumber: moment().week(),
        dayNumber: moment().date()
      }
    },
    watch: {
      startDateObject: 'mountSetDate'
    },
    computed: {
      getCellStyle: function () {
        return {
          height: this.dayCellHeight + this.dayCellHeightUnit,
          'max-height': this.dayCellHeight + this.dayCellHeightUnit
        }
      }
    },
    methods: {
      columnCss: function () {
        let returnVal = {
          'calendar-day-column-content': true,
          'relative-position': true,
          // 'calendar-day-column-current': this.isCurrentDate(this.startDay)
          'calendar-day-column-current': this.isCurrentDate2()
        }
        returnVal[this.columnCssClass] = true
        return returnVal
      },
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
        // let thisEvent = this.getEventById(event)
        let style = {
          position: 'absolute',
          'z-index': 10,
          width: '100%'
        }
        let positions = this.calculateDayEventPosition(
          thisEvent.start.dateTime,
          thisEvent.end.dateTime
        )
        style['top'] = positions.top
        style['height'] = positions.height
        if (thisEvent.numberOfOverlaps > 0) {
          let thisWidth = (100 / (thisEvent.numberOfOverlaps + 1)).toFixed(2)
          let thisShift = thisWidth * (thisEvent.overlapIteration - 1)
          console.debug('thisWidth = ', thisWidth)
          console.debug('thisShift = ', thisShift)
          style['width'] = thisWidth + '%'
          style['max-width'] = thisWidth + '%'
          style['left'] = thisShift + '%'
          style['z-index'] = 10 + thisEvent.overlapIteration
        }
        return style
      },
      calculateDayEventPosition: function (startDateTime, endDateTime) {
        console.debug('calculateDayEventTop called, dateTime = ', startDateTime)
        let startMom = moment(startDateTime)
        let endMom = moment(endDateTime)
        let momMidnight = startMom.clone().startOf('day')
        let topMinuteCount = startMom.diff(momMidnight, 'minutes')
        let heightMinuteCount = endMom.diff(startMom, 'minutes')
        let sizePerMinute = this.dayCellHeight / 60
        return {
          top: (topMinuteCount * sizePerMinute) + this.dayCellHeightUnit,
          height: (heightMinuteCount * sizePerMinute) + this.dayCellHeightUnit
        }
      },
      isCurrentDate2: function () {
        let now = moment()
        let test = moment()
          .year(this.yearNumber)
          .month(this.monthNumber - 1)
          .date(this.dayNumber)
        console.debug('isCurrentDate2 called, now/test=', now, test)
        return now.isSame(test, 'day')
      }
    },
    mounted () {
      this.mountSetDate()
    }
  }
</script>

<style lang="stylus">
    $cellWidth = 14.285%
    $cellHeight = 5em
    $borderOuter = 1px solid silver
    $borderThin = 1px dotted silver
    $currentDayBackgroundColor = #eeeeee

    .calendar-day
        position relative
        .calendar-day-cell-height
            height 5rem
            max-height 5rem
        .calendar-day-column-label
            //
        .calendar-day-column-content
            // border-right $borderOuter
            position relative
        .calendar-day-column-current
            background-color $currentDayBackgroundColor
        .calendar-day-time
            padding-right .5em
            border-right $borderOuter
        .calendar-day-time-content
            border-top $borderThin
        .calendar-day-event-overlap
            margin-left 1px
        .calendar-day-event-overlap-first
            margin-left 0


</style>