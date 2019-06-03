<template>
  <div class="calendar-header flex-col-auto flex-row flex-justify-between flex-items-center">
    <div class="calendar-header-left flex-col-auto">
      <q-btn
        @click="doMoveTimePeriod(timePeriodUnit, -timePeriodAmount)"
        icon="chevron_left"
        color="primary"
        round
        flat
      />
    </div>
    <div class="calendar-header-label">
      <slot/>
    </div>
    <div class="calendar-header-right flex-col-auto">
      <q-btn
        @click="doMoveTimePeriod(timePeriodUnit, timePeriodAmount)"
        icon="chevron_right"
        color="primary"
        round
        flat
      />
    </div>
  </div>
</template>

<script>
  import { CalendarHeaderNavTemplateMixin } from '@daykeep/calendar-core'
  import { QBtn } from 'quasar'

  export default {
    name: 'CalendarHeaderNav',
    mixins: [ CalendarHeaderNavTemplateMixin ],
    components: {
      QBtn
    }
  }
</script>

<style lang="stylus">
  .calendar-header
    .calendar-month-year
      font-size 1.25em
      font-weight bold
</style>
