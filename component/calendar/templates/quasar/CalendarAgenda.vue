<template>
  <div class="calendar-test">
    <calendar-agenda></calendar-agenda>

  </div>
</template>

<script>
  import {
    CalendarMixin,
    CalendarEventMixin,
    CalendarParentComponentMixin,
    CalendarTemplateMixin
  } from '../../mixins'
  import CalendarMonth from './CalendarMonth'
  import CalendarMultiDay from './CalendarMultiDay'
  import CalendarAgenda from './CalendarAgenda'
  import {
    QTabs,
    QTab,
    QTabPanels,
    QTabPanel,
    QSeparator
  } from 'quasar'

  export default {
    name: 'Calendar',
    mixins: [
      CalendarParentComponentMixin,
      CalendarMixin,
      CalendarEventMixin,
      CalendarTemplateMixin
    ],
    components: {
      CalendarMonth,
      CalendarMultiDay,
      CalendarAgenda,
      QTabs,
      QTab,
      QTabPanels,
      QTabPanel,
      QSeparator
    }
  }
</script>

<style lang="stylus">
  @import '../../styles-common/calendar.vars.styl'

  .calendar-tab-panels
    .calendar-tab-panel-day,
    .calendar-tab-panel-week
      height 60vh
      max-height 60vh
      overflow hidden
    .q-tab-panel
      border none

</style>
