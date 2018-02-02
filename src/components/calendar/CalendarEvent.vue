<template>
    <div
        :class="getEventClass()"
        :style="getEventStyle()"
        @mouseup="handleClick"
    >
        <span v-if="!isAllDayEvent() && showTime" class="calendar-event-start-time">
            {{ formatTime(eventObject.start.dateTime) }}
        </span>
        <span class="calendar-event-summary">
            {{ eventObject.summary }}
        </span>
    </div>
</template>

<script>
  import moment from 'moment'
  import {
    QBtn,
    QTooltip
  } from 'quasar'
  import QuantityBubble from './QuantityBubble'
  export default {
    name: 'CalendarEvent',
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
      formatTime: function (dateTimeString) {
        let thisMoment = moment(dateTimeString)
        let returnString = ''
        returnString += thisMoment.format('h')
        if (thisMoment.minute() > 0) {
          returnString += ':' + thisMoment.format('mm')
        }
        returnString += thisMoment.format('a').slice(0, 1)
        return returnString
      },
      isAllDayEvent: function () {
        return this.eventObject.start.isAllDay
      },
      getEventClass: function () {
        return {
          'calendar-event': true,
          'calendar-event-month': this.monthStyle
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
        console.debug('event clicked')
        this.$emit('click', this.eventObject)
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