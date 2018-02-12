<template>
    <div
        :class="getEventClass()"
        :style="getEventStyle()"
        @mouseup="handleClick"
    >
        <div class="calendar-agenda-event-summary">
            {{ eventObject.summary }}
        </div>
        <div
            v-if="showTime && !eventObject.start.isAllDay"
            class="calendar-agenda-event-time"
        >
            {{ formatTimeRange(eventObject.start.dateObject, eventObject.end.dateObject) }}
        </div>
    </div>
</template>

<script>
  import {
    date,
    QBtn,
    QTooltip
  } from 'quasar'
  import QuantityBubble from './QuantityBubble'
  export default {
    name: 'CalendarAgendaEvent',
    props: {
      eventObject: {
        type: Object,
        default: this.blankCalendarEvent
      },
      backgroundColor: {
        type: String,
        default: 'blue'
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
      }
    },
    components: {
      QuantityBubble,
      QBtn,
      QTooltip
    },
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
    computed: {},
    methods: {
      formatTimeRange: function (startTime, endTime) {
        let returnString = ''
        // start time
        returnString += date.formatDate(startTime, 'h')
        if (startTime.getMinutes() > 0) {
          returnString += ':' + date.formatDate(startTime, 'mm')
        }
        if (date.formatDate(startTime, 'A') !== date.formatDate(endTime, 'A')) {
          returnString += ' ' + date.formatDate(startTime, 'A')
        }
        returnString += ' - '
        // end time
        returnString += date.formatDate(endTime, 'h')
        if (endTime.getMinutes() > 0) {
          returnString += ':' + date.formatDate(endTime, 'mm')
        }
        returnString += ' ' + date.formatDate(endTime, 'A')
        return returnString
      },
      getEventClass: function () {
        return {
          'calendar-agenda-event': true,
          'calendar-agenda-event-allday': this.eventObject.start.isAllDay
        }
      },
      getEventStyle: function () {
        let retVal = {
          'background-color': this.backgroundColor,
          'color': this.textColor
        }
        return retVal
      },
      handleClick: function (e) {
        // console.debug('event clicked')
        this.$emit('click', this.eventObject)
      }
    },
    mounted () {}
  }
</script>

<style lang="stylus">
</style>