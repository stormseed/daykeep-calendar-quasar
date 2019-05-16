<template>
  <div class="calendar-day-labels flex-row flex-no-wrap flex-justify-end">
    <div
      v-for="thisDay in weekDateArray"
      :key="formatDate(thisDay, 'EEE')"
      :class="{
        'calendar-day-label': true,
        'calendar-cell': true,
        'calendar-day-label-current': isCurrentDayLabel(thisDay),
        'cursor-pointer': calendarDaysAreClickable
      }"
      :style="{
        'width': cellWidth,
        'max-width': cellWidth,
      }"
      @click="handleDayClick(thisDay)"
    >
      {{ formatDate(thisDay, 'EEE') }}
      <div
        v-if="showDates"
        class="calendar-day-label-date"
      >
        {{ formatDate(thisDay, 'd') }}
      </div>
    </div>
  </div>
</template>

<script>
  import {
    CalendarMixin,
    CalendarDayLabelsTemplateMixin
  } from '../../mixins'

  export default {
    name: 'CalendarDayLabels',
    mixins: [
      CalendarMixin,
      CalendarDayLabelsTemplateMixin
    ]
  }
</script>

<style lang="stylus">
  .calendar-day-labels
    .calendar-day-label
      font-size 1.1em
      padding-left 4px
      .calendar-day-label-date
        font-size 1.75em
    .calendar-day-label-current
      font-weight bold

</style>
