<template>
    <div :class="columnCss">
        <!-- underlying cells -->
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
  import CalendarEvent from './CalendarEvent'
  import CalendarMixin from './CalendarMixin'
  import { date } from 'quasar'
  export default {
    name: 'CalendarDayColumn',
    props: {
      startDate: {
        type: Date,
        default: () => { return new Date() }
      },
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
        workingDate: new Date()
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
          'calendar-day-column-current': this.isCurrentDate(this.workingDate)
        }
        returnVal[this.columnCssClass] = true
        return returnVal
      },
      getCellStyle: function () {
        return {
          height: this.dayCellHeight + this.dayCellHeightUnit,
          'max-height': this.dayCellHeight + this.dayCellHeightUnit
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
        let positions = this.calculateDayEventPosition(
          thisEvent.start.dateObject,
          thisEvent.end.dateObject
        )
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
        let startMidnight = date.adjustDate(startDateObject, {
          hours: 0,
          minutes: 0,
          seconds: 0,
          milliseconds: 0
        })
        let topMinuteCount = date.getDateDiff(startDateObject, startMidnight, 'minutes')
        let heightMinuteCount = date.getDateDiff(endDateObject, startDateObject, 'minutes')
        let sizePerMinute = this.dayCellHeight / 60
        return {
          top: (topMinuteCount * sizePerMinute) + this.dayCellHeightUnit,
          height: (heightMinuteCount * sizePerMinute) + this.dayCellHeightUnit
        }
      },
    },
    mounted () {
      this.mountSetDate()
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