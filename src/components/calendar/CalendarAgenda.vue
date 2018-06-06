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
              :NOstyle="{ 'width': leftMargin, 'max-width': leftMargin }"
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
                  :event-object="thisEvent"
                  :event-ref="eventRef"
                  :calendar-locale="calendarLocale"
                  :calendar-timezone="calendarTimezone"
                  agenda-style="dot"
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
      :event-ref="eventRef"
    />

  </div>
</template>

<script>
  import CalendarMixin from './mixins/CalendarMixin'
  import CalendarEventMixin from './mixins/CalendarEventMixin'
  import CalendarParentComponentMixin from './mixins/CalendarParentComponentMixin'
  import CalendarAgendaEvent from './CalendarAgendaEvent'
  import CalendarEventDetail from './CalendarEventDetail'
  import CalendarHeaderNav from './CalendarHeaderNav'
  import {
    date,
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
      },
      fullComponentRef: String
    },
    data () {
      return {
        workingDate: new Date(),
        numJumpDays: 28,
        localNumDays: 28,
        dayRowArray: [],
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
        return date.addToDate(this.workingDate, {days: daysForward})
      },
      isFirstOfMonth: function (thisDate) {
        return thisDate.getDate() === 1
      },
      isFirstDayOfWeek: function (thisDate) {
        return date.getDayOfWeek(thisDate) === 1
      },
      loadMore: function (index, done) {
        this.localNumDays += this.numJumpDays
        done()
      },
      doUpdate: function () {
        this.mountSetDate()
      },
      getWeekTitle: function (firstDate) {
        let lastDate = date.addToDate(firstDate, {days: 6})
        if (firstDate.getMonth() === lastDate.getMonth()) {
          return this.formatDate(firstDate, 'MMM d - ') + this.formatDate(lastDate, 'd')
        }
        else {
          return this.formatDate(firstDate, 'MMM d - ') + this.formatDate(lastDate, 'MMM d')
        }
      },
      handleNavMove: function (params) {
        this.moveTimePeriod(params)
        this.$emit(
          this.eventRef + ':navMovePeriod',
          {
            unitType: params.unitType,
            amount: params.amount
          }
        )
      },
      handleDayClick: function (dateObject) {
        if (this.fullComponentRef) {
          this.fullMoveToDay(dateObject)
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
