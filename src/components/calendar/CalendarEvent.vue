<template>
    <div
        :class="getEventClass"
        :style="getEventStyle"
        @mouseup="handleClick"
    >
        <span v-if="!isAllDayEvent() && showTime" class="calendar-event-start-time">
            {{ formatTime(eventObject.start.dateObject) }}
        </span>
        <span class="calendar-event-summary">
            {{ eventObject.summary }}
        </span>
    </div>
</template>

<script>
  import {
    date,
    QBtn,
    QTooltip
  } from 'quasar'
  import CalendarMixin from './CalendarMixin'
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
      eventRef: String
    },
    components: {
      QBtn,
      QTooltip
    },
    mixins: [CalendarMixin],
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
      getEventStyle: function () {
        return {
          // 'background-color': this.backgroundColor,
          // 'color': this.textColor
        }
      },
      getEventClass: function () {
        return this.addCssColorClasses(
          {
            'calendar-event': true,
            'calendar-event-month': this.monthStyle
          },
          this.eventObject
        )
      },
    },
    methods: {
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
        width 100%
        height 100%
        padding 2px
        text-overflow clip
        border-radius .25em
        margin 1px 0
        font-size 0.8em
        cursor pointer
    .calendar-event-month
        white-space nowrap

</style>