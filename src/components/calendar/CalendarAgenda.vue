<template>
  <div class="calendar-agenda column fit">
    <!-- content block style -->
    <q-infinite-scroll
      v-if="agendaStyle === 'block'"
      inline
      :handler="loadMore"
      :style="{ 'height': scrollHeight, 'overflow':'auto' }">
      <div
        v-for="daysForward in localNumDays"
        :key="daysForward"
      >
        <div v-if="forwardDate = getDaysForwardDate(daysForward - 1)">

          <!--month marker-->
          <div
            v-if="isFirstOfMonth(forwardDate)"
            class="row calendar-agenda-month"
            :style="{ 'padding-left': leftMargin }"
          >
            {{ formatDate(forwardDate, 'MMMM yyyy') }}
          </div>

          <!--week marker-->
          <div
            v-if="isFirstDayOfWeek(forwardDate)"
            class="row calendar-agenda-week"
            :style="{ 'margin-left': leftMargin }"
          >
            {{ getWeekTitle(forwardDate) }}
          </div>

          <!--individual day-->
          <div
            v-if="dateGetEvents(forwardDate).length > 0"
            class="col row items-start calendar-agenda-day">
            <div
              class="col-auto calendar-agenda-side"
              :style="{ 'width': leftMargin, 'max-width': leftMargin }"
              :class="{ 'cursor-pointer': calendarDaysAreClickable }"
              @click="handleDayClick(getDaysForwardDate(daysForward - 1))"
            >
              <div class="calendar-agenda-side-date">
                {{ formatDate(forwardDate, 'd') }}
              </div>
              <div class="calendar-agenda-side-day">
                {{ formatDate(forwardDate, 'EEE') }}
              </div>
            </div>
            <div class="col row calendar-agenda-events">
              <calendar-agenda-event
                v-if="dateGetEvents(forwardDate, true)"
                v-for="thisEvent in dateGetEvents(forwardDate)"
                :key="makeDT(forwardDate).toISODate() + getEventIdString(thisEvent)"
                :event-object="thisEvent"
                :event-ref="eventRef"
                :calendar-locale="calendarLocale"
                :calendar-timezone="calendarTimezone"
                :allow-editing="allowEditing"
              />
            </div>
          </div>
        </div>
      </div>
      <q-spinner-dots slot="message" :size="40"/>
    </q-infinite-scroll>

    <!-- content circle style -->
    <div v-else>
      <!-- calendar header -->
      <calendar-header-nav
        time-period-unit="days"
        :time-period-amount="1"
        :move-time-period-emit="eventRef + ':navMovePeriod'"
        :calendar-locale="calendarLocale"
      >
        {{ formatDate(workingDate, 'EEE, MMM d')}}
        -
        {{ formatDate(makeDT(workingDate).plus({ days: numJumpDays }), 'MMM d')}}
      </calendar-header-nav>

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
            class="col row items-start calendar-agenda-day"
          >
            <div
              class="col-auto calendar-agenda-side"
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
            <div class="col row calendar-agenda-events">
              <div
                class="full-width"
                v-if="dateGetEvents(forwardDate)"
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
            </div>
          </div>
        </div>
      </div>
    </div>

    <calendar-event-detail
      ref="defaultEventDetail"
      v-if="!preventEventDetail"
      :event-object="eventDetailEventObject"
      :prevent-event-detail="preventEventDetail"
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
    CalendarParentComponentMixin
  } from './mixins'
  import CalendarAgendaEvent from './CalendarAgendaEvent'
  import CalendarEventDetail from './CalendarEventDetail'
  import CalendarHeaderNav from './CalendarHeaderNav'
  import {
    QBtn,
    QTooltip,
    QScrollArea,
    QInfiniteScroll,
    QSpinnerDots
  } from 'quasar'
  export default {
    name: 'CalendarAgenda',
    components: {
      CalendarAgendaEvent,
      CalendarEventDetail,
      CalendarHeaderNav,
      QBtn,
      QTooltip,
      QScrollArea,
      QInfiniteScroll,
      QSpinnerDots
    },
    mixins: [CalendarParentComponentMixin, CalendarMixin, CalendarEventMixin],
    props: {
      agendaStyle: {
        type: String,
        default: 'dot'
      },
      numDays: {
        type: Number,
        default: 7
      },
      leftMargin: {
        type: String,
        default: '4rem'
      },
      scrollHeight: {
        type: String,
        default: '200px'
      }
    },
    data () {
      return {
        workingDate: new Date(),
        numJumpDays: 28,
        localNumDays: 28,
        dayCounter: [],
        parsed: this.getDefaultParsed(),
        eventDetailEventObject: {}
      }
    },
    computed: {
      calendarDaysAreClickable: function () {
        return (this.fullComponentRef && this.fullComponentRef.length > 0)
      }
    },
    methods: {
      getDaysForwardDate: function (daysForward) {
        return this.makeDT(this.workingDate).plus({days: daysForward})
      },
      isFirstOfMonth: function (thisDate) {
        return this.makeDT(thisDate).day === 1
      },
      isFirstDayOfWeek: function (thisDate) {
        return this.makeDT(thisDate).weekday === 1
      },
      loadMore: function (index, done) {
        this.localNumDays += this.numJumpDays
        done(true)
      },
      doUpdate: function () {
        this.mountSetDate()
        this.triggerDisplayChange(
          this.eventRef,
          this.getAgendaDisplayDates()
        )
      },
      getWeekTitle: function (firstDate) {
        firstDate = this.makeDT(firstDate)
        let lastDate = firstDate.plus({days: 6})
        if (firstDate.month === lastDate.month) {
          return this.formatDate(firstDate, 'MMM d - ') + this.formatDate(lastDate, 'd')
        }
        else {
          return this.formatDate(firstDate, 'MMM d - ') + this.formatDate(lastDate, 'MMM d')
        }
      },
      handleStartChange: function () {
        this.doUpdate()
      },
      handleNavMove: function (params) {
        this.moveTimePeriod(params)
        this.$emit(
          this.eventRef + ':navMovePeriod',
          params
        )
        let payload = this.getAgendaDisplayDates()
        payload['moveUnit'] = params.unitType
        payload['moveAmount'] = params.amount
        this.triggerDisplayChange(
          this.eventRef,
          payload
        )
      },
      handleDayClick: function (dateObject) {
        if (this.fullComponentRef) {
          this.fullMoveToDay(dateObject)
        }
      },
      getAgendaDisplayDates: function () {
        return {
          startDate: this.makeDT(this.workingDate).toISODate(),
          endDate: this.makeDT(this.getDaysForwardDate(this.localNumDays)).toISODate(),
          numDays: this.localNumDays,
          viewType: this.$options.name
        }
      }
    },
    mounted () {
      this.localNumDays = this.numDays
      this.doUpdate()
      this.handlePassedInEvents()
      this.$root.$on(
        this.eventRef + ':navMovePeriod',
        this.handleNavMove
      )
      this.$root.$on(
        'click-event-' + this.eventRef,
        this.handleEventDetailEvent
      )
      this.$root.$on(
        'update-event-' + this.eventRef,
        this.handleEventUpdate
      )
    },
    watch: {
      startDate: 'handleStartChange',
      eventArray: function () {
        this.getPassedInEventArray()
      },
      parsedEvents: function () {
        this.getPassedInParsedEvents()
      }
    }
  }
</script>

<style lang="stylus">
  @import 'calendar.vars.styl'
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
