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
  import CalendarMixin from './mixins/CalendarMixin'
  import {
    date,
    QBtn,
    QTooltip
  } from 'quasar'
  const { DateTime } = require('luxon')
  export default {
    name: 'CalendarAgendaEvent',
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
      calendarLocale: {
        type: String,
        default: () => { return DateTime.local().locale }
      },
      calendarTimezone: {
        type: String,
        default: () => { return DateTime.local().zoneName }
      }
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
    computed: {},
    methods: {
      getEventClass: function () {
        return this.addCssColorClasses(
          {
            'calendar-agenda-event': true,
            'calendar-agenda-event-allday': this.eventObject.start.isAllDay,
            'calendar-agenda-event-empty-slot': this.eventObject.start.isEmptySlot
          },
          this.eventObject
        )
      },
      getEventStyle: function () {
        return {}
      },
      formatTimeRange: function (startTime, endTime) {
        let returnString = ''
        // start time
        returnString += this.simplifyTimeFormat(
          this.makeDT(startTime).toLocaleString(DateTime.TIME_SIMPLE),
          (this.formatDate(startTime, 'a') === this.formatDate(endTime, 'a'))
        )
        returnString += ' - '
        // end time
        returnString += this.simplifyTimeFormat(
          this.makeDT(endTime).toLocaleString(DateTime.TIME_SIMPLE),
          false
        )
        return returnString
      },
      handleClick: function (e) {
        // console.debug('event clicked')
        this.$emit('click', this.eventObject)
        this.triggerEventClick(this.eventObject, this.eventRef)
      }
    },
    mounted () {}
  }
</script>

<style lang="stylus">
  .calendar-agenda-event-empty-slot
    display none
    background green
</style>
