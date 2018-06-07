<template>
  <div
    v-if="agendaStyle === 'dot'"
    :class="getDotEventClass()"
    :style="getEventStyle()"
    @mouseup="handleClick"
  >
    <!-- dot style -->
    <div class="col-auto calendar-agenda-event-dot" :class="getDotClass()"></div>
    <div
      v-if="showTime"
      class="col-auto calendar-agenda-event-time"
    >
      <template v-if="eventObject.start.isAllDay">
        All day
      </template>
      <template v-else>
        {{ formatTimeRange(eventObject.start.dateObject,
        eventObject.end.dateObject) }}
      </template>
    </div>
    <div class="col calendar-agenda-event-summary">
      {{ eventObject.summary }}
    </div>
  </div>
  <div
    v-else
    :class="getEventClass()"
    :style="getEventStyle()"
    @mouseup="handleClick"
  >
    <!-- block style -->
    <div class="calendar-agenda-event-summary">
      {{ eventObject.summary }}
    </div>
    <div
      v-if="showTime && !eventObject.start.isAllDay"
      class="calendar-agenda-event-time"
    >
      {{ formatTimeRange(eventObject.start.dateObject,
      eventObject.end.dateObject) }}
    </div>
  </div>
</template>

<script>
  import CalendarMixin from './mixins/CalendarMixin'
  import {
    QBtn,
    QTooltip
  } from 'quasar'
  const { DateTime } = require('luxon')
  export default {
    name: 'CalendarAgendaEvent',
    props: {
      eventObject: {
        type: Object,
        default: () => {}
      },
      agendaStyle: {
        type: String,
        default: 'block'
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
      },
      allowEditing: {
        type: Boolean,
        default: false
      }
    },
    components: {
      QBtn,
      QTooltip
    },
    mixins: [CalendarMixin],
    data () {
      return {}
    },
    computed: {},
    methods: {
      getDotClass: function () {
        return this.addCssColorClasses({}, this.eventObject)
      },
      getDotEventClass: function () {
        return {
          'row': true,
          'items-center': true,
          'justify-start': true,
          'cursor-pointer': true,
          'calendar-agenda-event': true,
          'calendar-agenda-event-dot-style': true,
          'calendar-agenda-event-allday': this.eventObject.start.isAllDay,
          'calendar-agenda-event-empty-slot': this.eventObject.start.isEmptySlot
        }
      },
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
        this.eventObject.allowEditing = this.allowEditing
        this.$emit('click', this.eventObject)
        this.triggerEventClick(this.eventObject, this.eventRef)
      }
    },
    mounted () {}
  }
</script>

<style lang="stylus">
  @import 'calendar.vars.styl'
  .calendar-agenda-event-empty-slot
    display none
    background green

  .calendar-agenda-event-dot-style
    width 100%
    background-color inherit
    transition background-color 0.3s ease
    &:hover
      background-color $whiteHighlightBackgroundColor
      transition background-color 0.3s ease
    .calendar-agenda-event-time
      margin-left 1em
      width 160px
    .calendar-agenda-event-dot
      border-radius 12px
      width 12px
      height 12px
</style>
