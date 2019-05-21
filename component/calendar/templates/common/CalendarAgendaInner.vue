<template>
  <div class="calendar-agenda flex-column fit">
    <!-- content circle style -->
    <div>
      <!-- calendar header -->
      <slot
        name="headernav"
        :working-date="workingDate"
        :event-ref="eventRef"
        time-period-unit="month"
      ></slot>

      <div
        v-for="daysForward in numJumpDays"
        :key="daysForward"
      >
        <div
          v-if="forwardDate = getDaysForwardDate(daysForward - 1)"
          class="calendar-agenda-style-dot"
        >

          <!--individual day-->
          <div
            v-if="dateGetEvents(forwardDate).length > 0"
            class="flex-col flex-row flex-items-start calendar-agenda-day"
          >
            <div
              class="flex-col-auto calendar-agenda-side"
              :class="{ 'cursor-pointer': calendarDaysAreClickable }"
              @click="handleDayClick(getDaysForwardDate(daysForward - 1))"
            >
              <div class="calendar-agenda-side-day">
                {{ formatDate(forwardDate, 'EEE') }}
              </div>
              <div class="calendar-agenda-side-date">
                {{ formatDate(forwardDate, 'MMM d') }}
              </div>
            </div>
            <div class="flex-col flex-row calendar-agenda-events">
              <template v-if="dateGetEvents(forwardDate)">
                <div
                  class="full-width"
                  v-for="thisEvent in dateGetEvents(forwardDate, true)"
                  :key="makeDT(forwardDate).toISODate() + getEventIdString(thisEvent)"
                >
                  <calendar-agenda-event
                    v-if="!thisEvent.timeSpansOvernight || makeDT(thisEvent.start.dateObject).toISODate() === makeDT(forwardDate).toISODate()"
                    :event-object="thisEvent"
                    :prevent-event-detail="preventEventDetail"
                    :event-ref="eventRef"
                    :calendar-locale="calendarLocale"
                    :calendar-timezone="calendarTimezone"
                    :allow-editing="allowEditing"
                    :render-html="renderHtml"
                    agenda-style="dot"
                    :forward-date="forwardDate"
                  />
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <slot
      name="eventdetail"
      targetRef="defaultEventDetail"
      :prevent-event-detail="preventEventDetail"
      :event-object="eventDetailEventObject"
      :calendar-locale="calendarLocale"
      :calendar-timezone="calendarTimezone"
      :event-ref="eventRef"
      :allow-editing="allowEditing"
      :render-html="renderHtml"
    ></slot>

  </div>
</template>

<script>
  import {
    CalendarMixin,
    CalendarEventMixin,
    CalendarParentComponentMixin,
    CalendarAgendaTemplateMixin
  } from '../../mixins'
  import CalendarAgendaEvent from './CalendarAgendaEvent'
  // import CalendarEventDetail from './CalendarEventDetail'
  // import CalendarHeaderNav from './CalendarHeaderNav'

  export default {
    name: 'CalendarAgendaInner',
    components: {
      CalendarAgendaEvent
      // CalendarEventDetail,
      // CalendarHeaderNav
    },
    mixins: [
      CalendarParentComponentMixin,
      CalendarMixin,
      CalendarEventMixin,
      CalendarAgendaTemplateMixin
    ]
  }
</script>

<style lang="stylus">
  @import '../../styles-common/calendar.vars.styl'
  .calendar-agenda
    .calendar-header
      margin-bottom 1em
      .calendar-header-label
        font-size 1.25em
        font-weight bold
    .calendar-agenda-month
      font-size 1.5em
      font-weight bold
      background blue
      color white
      padding 1em 0 2em 0
      margin-bottom .5em
    .calendar-agenda-week
      font-size 1.2em
      font-weight bold
      color grey
      margin-bottom .5em
    .calendar-agenda-day
      margin-bottom 1em
      .calendar-agenda-side
        width 4em
        .calendar-agenda-side-date
          font-size 1.75em
          font-weight bold
        .calendar-agenda-side-day
          font-size 1.1em
      .calendar-agenda-events
        width 100%
      .calendar-agenda-event
        width 100%
        padding .5em .5em
        margin-bottom .5em
        text-overflow clip
        border-radius .25em
        cursor pointer
        .calendar-agenda-event-summary
          font-weight bold
    .calendar-agenda-style-dot
      .calendar-agenda-day
        margin-bottom .5em
        padding-bottom .5em
        border-bottom $borderOuter
        .calendar-agenda-side
          width 6em
          max-width 6em
          .calendar-agenda-side-date
            font-size 1.1em
            font-weight normal
          .calendar-agenda-side-day
            font-size 0.9em
</style>
