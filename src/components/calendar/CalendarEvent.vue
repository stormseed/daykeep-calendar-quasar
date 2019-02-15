<template>
  <div
    :class="getEventClass()"
    :style="getEventStyle()"
    @click="handleClick"
  >
    <template v-if="renderStyle === 'singleLine' || isAllDayEvent() || (renderStyle === 'doubleLine' && eventDuration() < 45)">
      <template v-if="!eventHasPreviousDay() || ((firstDayOfWeek || isLeftmostColumn) && eventHasPreviousDay())">
        <div v-if="isEmptySlot()" class="calendar-event-summary">
          &nbsp;
        </div>
        <div v-else class="calendar-event-summary calendar-event-render-single">
          <span v-if="!isAllDayEvent()" class="calendar-event-time">
            {{ formatTime(eventObject.start.dateObject) }}
          </span>
          {{ eventObject.summary }}
        </div>
      </template>
      <template v-else>
        &nbsp;
      </template>
    </template>
    <template v-else-if="renderStyle === 'doubleLine'">
      <div class="calendar-event-summary">
        {{ eventObject.summary }}
      </div>
      <div class="calendar-event-time">
        {{ formatTimeRange(eventObject.start.dateObject, eventObject.end.dateObject) }}
      </div>
    </template>
    <template v-else>
      <!-- this is the older event drawing style, will eventually be removed -->
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
    </template>
  </div>
</template>

<script>
  import {
    QBtn,
    QTooltip
  } from 'quasar'
  import {
    CalendarMixin,
    CalendarEventMixin,
    EventPropsMixin
  } from './mixins'
  import dashHas from 'lodash.has'
  export default {
    name: 'CalendarEvent',
    mixins: [CalendarMixin, CalendarEventMixin, EventPropsMixin],
    props: {
      forceAllDay: Boolean,
      currentCalendarDay: Object,
      hasPreviousDay: Boolean,
      hasNextDay: Boolean,
      firstDayOfWeek: Boolean,
      lastDayOfWeek: Boolean,
      renderStyle: {
        type: String,
        default: 'singleLine'
      },
      isLeftmostColumn: {
        type: Boolean,
        default: false
      }
    },
    components: {
      QBtn,
      QTooltip
    },
    data () {
      return {}
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
        return this.addCssColorClasses(
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
      },
      isEmptySlot: function () {
        return this.eventObject.start.isEmptySlot
      },
      eventContinuesNextWeek: function () {
        return (
          dashHas(this.eventObject, 'start.dateObject') &&
          this.monthStyle &&
          this.eventHasNextDay() &&
          (this.lastDayOfWeek || this.isLastDayOfMonth(this.eventObject.start.dateObject))
        )
      },
      eventContinuesFromLastWeek: function () {
        return (
          dashHas(this.eventObject, 'start.dateObject') &&
          this.monthStyle &&
          this.eventHasPreviousDay() &&
          (this.firstDayOfWeek || this.isFirstDayOfMonth(this.eventObject.start.dateObject))
        )
      },
      isLastDayOfMonth: function (dateObject) {
        if (typeof dateObject === 'undefined' || dateObject === null) {
          return false
        }
        return this.makeDT(this.currentCalendarDay).toISODate() === this.makeDT(dateObject).endOf('month').toISODate()
      },
      isFirstDayOfMonth: function (dateObject) {
        if (typeof dateObject === 'undefined' || dateObject === null) {
          return false
        }
        return this.makeDT(this.currentCalendarDay).toISODate() === this.makeDT(dateObject).startOf('month').toISODate()
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
      isAllDayEvent: function () {
        return this.eventObject.start.isAllDay
      },
      eventDuration: function () {
        return this.getEventDuration(this.eventObject.start.dateObject, this.eventObject.end.dateObject)
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

  $nextPrevEdgeVal = 5%

  .calendar-event
    /*width 100%*/
    height 100%
    padding 2px
    text-overflow clip
    border-radius 5px
    margin 1px 0
    font-size 0.8em
    cursor pointer
    .calendar-event-summary
      font-weight bolder
    .calendar-event-time
      font-weight normal
    .calendar-event-render-single
      white-space nowrap
      overflow hidden

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

  .calendar-event-continues-next-week
    padding-right $nextPrevEdgeVal
    clip-path polygon(0% 100%, 0% 0%, (100% - $nextPrevEdgeVal) 0%, 100% 50%, (100% - $nextPrevEdgeVal) 100%)

  .calendar-event-continues-from-last-week
    padding-left $nextPrevEdgeVal
    clip-path polygon($nextPrevEdgeVal 100%, 0% 50%, $nextPrevEdgeVal 0, 100% 0, 100% 100%)

  .calendar-event-continues-next-week.calendar-event-continues-from-last-week
    padding-left $nextPrevEdgeVal
    padding-right $nextPrevEdgeVal
    clip-path polygon($nextPrevEdgeVal 100%, 0% 50%, $nextPrevEdgeVal 0, (100% - $nextPrevEdgeVal) 0%, 100% 50%, (100% - $nextPrevEdgeVal) 100%)
</style>
