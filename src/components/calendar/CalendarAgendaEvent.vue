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
      <template v-if="eventObject.start.isAllDay || eventObject.timeSpansMultipleDays">
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
  import {
    CalendarMixin,
    CalendarEventMixin,
    EventPropsMixin
  } from './mixins'
  import {
    QBtn,
    QTooltip
  } from 'quasar'
  import DateTime from 'luxon/src/datetime'
  export default {
    name: 'CalendarAgendaEvent',
    mixins: [CalendarMixin, CalendarEventMixin, EventPropsMixin],
    props: {
      agendaStyle: {
        type: String,
        default: 'block'
      },
      forwardDate: [Object, Date]
    },
    components: {
      QBtn,
      QTooltip
    },
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
