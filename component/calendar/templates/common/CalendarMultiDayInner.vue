<template>
  <div class="calendar-multi-day-component flex-column fit flex-no-wrap">
    <!-- week nav -->
    <template v-if="numDays === 1">
      <calendar-header-nav
        time-period-unit="days"
        :time-period-amount="navDays"
        :move-time-period-emit="eventRef + ':navMovePeriod'"
        :calendar-locale="calendarLocale"
      >
        {{ formatDate(workingDate, 'EEEE, MMMM d, yyyy')}}
      </calendar-header-nav>
    </template>
    <template v-else>
      <calendar-header-nav
        time-period-unit="days"
        :time-period-amount="navDays"
        :move-time-period-emit="eventRef + ':navMovePeriod'"
      >
        {{ getHeaderLabel() }}
      </calendar-header-nav>
    </template>

    <div v-if="numDays > 1" class="calendar-time-margin">
      <calendar-day-labels
        :number-of-days="numDays"
        :show-dates="true"
        :start-date="workingDate"
        :force-start-of-week="forceStartOfWeek"
        :full-component-ref="fullComponentRef"
        :sunday-first-day-of-week="sundayFirstDayOfWeek"
        :calendar-locale="calendarLocale"
      />
    </div>

    <!-- all day events -->
    <div class="calendar-time-margin">
      <calendar-all-day-events
        :number-of-days="numDays"
        :start-date="weekDateArray[0]"
        :parsed="parsed"
        :event-ref="eventRef"
        :prevent-event-detail="preventEventDetail"
        :calendar-locale="calendarLocale"
        :calendar-timezone="calendarTimezone"
        :allow-editing="allowEditing"
      />
    </div>

    <!-- content -->
    <q-scroll-area
      :style="getScrollStyle"
      :class="getScrollClass"
    >
      <div class="flex-col">
        <div class="calendar-day flex-row">
          <calendar-time-label-column
            :calendar-locale="calendarLocale"
            :day-cell-height="dayCellHeight"
            :day-cell-height-unit="dayCellHeightUnit"
            :show-half-hours="showHalfHours"
          />
          <div class="calendar-multiple-days flex-col flex-row">
            <calendar-day-column
              v-for="thisDate in weekDateArray"
              :key="makeDT(thisDate).toISODate()"
              :start-date="thisDate"
              :date-events="dateGetEvents(thisDate, true)"
              column-css-class="calendar-day-column-content"
              :style="{ 'width': dayCellWidth }"
              :event-ref="eventRef"
              :prevent-event-detail="preventEventDetail"
              :calendar-locale="calendarLocale"
              :calendar-timezone="calendarTimezone"
              :allow-editing="allowEditing"
              :day-cell-height="dayCellHeight"
              :day-cell-height-unit="dayCellHeightUnit"
              :show-half-hours="showHalfHours"
            />
          </div>
        </div>
      </div>

    </q-scroll-area>

    <calendar-event-detail
      ref="defaultEventDetail"
      v-if="!preventEventDetail"
      :event-object="eventDetailEventObject"
      :event-ref="eventRef"
      :calendar-locale="calendarLocale"
      :calendar-timezone="calendarTimezone"
      :allow-editing="allowEditing"
      :render-html="renderHtml"
    />

  </div>
</template>

<script>
  import {
    CalendarMixin,
    CalendarEventMixin,
    CalendarParentComponentMixin,
    CalendarMultiDayTemplateMixin
  } from '../../mixins'
  import {
    CalendarDayColumn,
    CalendarTimeLabelColumn,
    CalendarDayLabels,
    CalendarAllDayEvents
  } from '../common'
  import CalendarHeaderNav from './CalendarHeaderNav'
  import CalendarEventDetail from './CalendarEventDetail'
  import { QScrollArea } from 'quasar'

  // const { getScrollTarget, setScrollPosition } = scroll

  export default {
    name: 'CalendarMultiDay',
    mixins: [
      CalendarParentComponentMixin,
      CalendarMixin,
      CalendarEventMixin,
      CalendarMultiDayTemplateMixin
    ],
    components: {
      CalendarDayColumn,
      CalendarTimeLabelColumn,
      CalendarDayLabels,
      CalendarHeaderNav,
      CalendarAllDayEvents,
      CalendarEventDetail,
      QScrollArea
    }
  }
</script>

<style lang="stylus">
  @import '../../styles-common/calendar.vars.styl'

  .calendar-multi-day-component
    .calendar-time-margin
      margin-left $dayTimeLabelWidth
    .calendar-header
      .calendar-header-label
        font-size 1.25em
        font-weight bold
    .calendar-day
      margin-top 10px
      .calendar-day-column-label
        width $dayTimeLabelWidth
      .calendar-day-column-content
        border-right $borderThin
        position relative
      .calendar-day-time
        padding-right .5em
        border-right $borderOuter
      .calendar-day-time-content
        border-top $borderThin

</style>
