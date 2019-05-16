<template>
  <div class="calendar-day-column-label flex-col-auto">
    <template
      v-for="thisHour in 24"
    >
      <div
        class="relative-position calendar-day-time"
        :key="thisHour"
        :style="{ 'height': calcDayCellHeight, 'max-height': calcDayCellHeight }"
      >
        <div class="time-label">
          {{ formatTimeFromNumber(thisHour - 1) }}
        </div>
      </div>
      <div
        v-if="showHalfHours"
        :key="thisHour"
        class="calendar-day-time cdcl-half-hour"
        :style="{ 'height': calcDayCellHeight, 'max-height': calcDayCellHeight }"
      >
        <div class="time-label">
          :30
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import {
    CalendarMixin,
    CalendarTimeLabelTemplateMixin
  } from '../../mixins'

  export default {
    name: 'CalendarTimeLabelColumn',
    mixins: [
      CalendarMixin,
      CalendarTimeLabelTemplateMixin
    ]
  }
</script>

<style lang="stylus">
  .calendar-day-column-label
    .calendar-day-time
      position relative
      .time-label
        position absolute
        top -10px
        right 20px
    .cdcl-half-hour
      font-size 0.75em
      text-align right
      .time-label
        top -6px
        right 20px
</style>
