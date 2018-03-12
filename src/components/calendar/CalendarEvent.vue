<template>
    <div
        :class="getEventClass()"
        :style="getEventStyle()"
        @click="handleClick"
    >
        <!--INNER-test prev - {{ eventObject.hasPrev }}, next - {{ eventObject.hasNext }}-->
        <template v-if="!eventHasPreviousDay() || (firstDayOfWeek && eventHasPreviousDay())">
          <span v-if="!isAllDayEvent() && showTime" class="calendar-event-start-time">
            {{ formatTime(eventObject.start.dateObject) }}
          </span>
            <span v-if="isEmptySlot()" class="calendar-event-summary">
              &nbsp;
          </span>
            <span v-else class="calendar-event-summary">
              {{ eventObject.summary }}
          </span>
        </template>
        <template v-else>
          &nbsp;
        </template>
    </div>
</template>

<script>
  import {
    date,
    QBtn,
    QTooltip
  } from 'quasar'
  import CalendarMixin from './CalendarMixin'
  import CalendarEventMixin from './CalendarEventMixin'
  import dashHas from 'lodash.has'
  export default {
    name: 'CalendarEvent',
    props: {
      eventObject: {
        type: Object,
        default: this.blankCalendarEvent
      },
      color: {
        type: String,
        default: 'primary'
      },
      textColor: {
        type: String,
        default: 'white'
      },
      showTime: {
        type: Boolean,
        default: true
      },
      monthStyle: {
        type: Boolean,
        default: false
      },
      eventRef: String,
      forceAllDay: Boolean,
      hasPreviousDay: Boolean,
      hasNextDay: Boolean,
      firstDayOfWeek: Boolean,
      lastDayOfWeek: Boolean
    },
    components: {
      QBtn,
      QTooltip
    },
    mixins: [CalendarMixin, CalendarEventMixin],
    data () {
      return {
        blankCalendarEvent: {
          id: 0,
          summary: '...',
          description: '...',
          start: {
            dateTime: '2020-01-01 00:00:00',
            isAllDay: false,
            timeZone: 'America/New_York'
          },
          end: {
            dateTime: '2020-01-01 01:00:00',
            isAllDay: false,
            timeZone: 'American/New_York'
          }
        }
      }
    },
    computed: {
    },
    methods: {
      getEventStyle: function () {
        return {
          // 'background-color': this.backgroundColor,
          // 'color': this.textColor
        }
      },
      getEventClass: function () {
        let returnVal = this.addCssColorClasses(
          {
            'calendar-event': true,
            'calendar-event-month': this.monthStyle,
            'calendar-event-multi': !this.monthStyle,
            'calendar-event-multi-allday': this.forceAllDay,
            'calendar-event-has-next-day': this.eventHasNextDay(),
            'calendar-event-has-previous-day': this.eventHasPreviousDay(),
            'calendar-event-empty-slot': this.isEmptySlot(),
            'calendar-event-continues-next-week': this.eventContinuesNextWeek(), // for future use
            'calendar-event-continues-from-last-week': this.eventContinuesFromLastWeek() // for future use
          },
          this.eventObject
        )
        // console.debug('getEventClass called, summary = %s, eventObject = %O, returnVal = %O', this.eventObject.summary, this.stripObject(this.eventObject), returnVal)
        return returnVal
      },
      isEmptySlot: function () {
        return this.eventObject.start.isEmptySlot
      },
      eventContinuesNextWeek: function () {
        return (
          this.monthStyle &&
          this.eventHasNextDay() &&
          this.lastDayOfWeek
        )
      },
      eventContinuesFromLastWeek: function () {
        return (
          this.monthStyle &&
          this.eventHasPreviousDay() &&
          this.firstDayOfWeek
        )
      },
      eventHasNextDay: function () {
        if (this.hasNextDay) {
          return this.hasNextDay
        }
        return false
      },
      eventHasPreviousDay: function () {
        if (this.hasPreviousDay) {
          return this.hasPreviousDay
        }
        return false
      },
      formatTime: function (startTime) {
        let returnString = ''
        returnString += date.formatDate(startTime, 'h')
        if (startTime.getMinutes() > 0) {
          returnString += ':' + date.formatDate(startTime, 'mm')
        }
        returnString += date.formatDate(startTime, 'a').slice(0, 1)
        return returnString
      },
      isAllDayEvent: function () {
        return this.eventObject.start.isAllDay
      },
      handleClick: function (e) {
        this.$emit('click', this.eventObject)
        this.triggerEventClick(this.eventObject, this.eventRef)
      }
    },
    mounted () {}
  }
</script>

<style lang="stylus">
    .calendar-event
        /*width 100%*/
        height 100%
        padding 2px
        text-overflow clip
        border-radius .25em
        margin 1px 0
        font-size 0.8em
        cursor pointer
    .calendar-event-month
        white-space nowrap
        margin 1px 2px
    .calendar-event-multi-allday
        margin-right 1em
    .calendar-event-has-next-day
        border-top-right-radius 0
        border-bottom-right-radius 0
        margin-right 0
    .calendar-event-has-previous-day
        border-top-left-radius 0
        border-bottom-left-radius 0
        margin-left 0
    .calendar-event-empty-slot
        background-color transparent !important
        cursor inherit
        border-radius 0
</style>
