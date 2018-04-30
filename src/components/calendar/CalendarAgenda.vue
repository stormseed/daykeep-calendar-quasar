<template>
    <div class="calendar-agenda column fit">
        <!-- content -->
        <q-infinite-scroll
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
                            <template
                                v-if="dateGetEvents(forwardDate)"
                                v-for="thisEvent in dateGetEvents(forwardDate)"
                            >
                                <calendar-agenda-event
                                    :event-object="thisEvent"
                                    :event-ref="eventRef"
                                    :calendar-locale="calendarLocale"
                                    :calendar-timezone="calendarTimezone"
                                />
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            <q-spinner-dots slot="message" :size="40" />
        </q-infinite-scroll>

        <calendar-event-detail
            ref="defaultEventDetail"
            v-if="!preventEventDetail"
            :event-object="eventDetailEventObject"
        />

    </div>
</template>

<script>
  import CalendarMixin from './mixins/CalendarMixin'
  import CalendarEventMixin from './mixins/CalendarEventMixin'
  import CalendarAgendaEvent from './CalendarAgendaEvent'
  import CalendarEventDetail from './CalendarEventDetail'
  import {
    date,
    QBtn,
    QTooltip,
    QScrollArea,
    QInfiniteScroll,
    QSpinnerDots
  } from 'quasar'
  const { DateTime } = require('luxon')
  export default {
    name: 'CalendarAgenda',
    props: {
      startDate: {
        type: [Object, Date],
        default: () => { return new Date() }
      },
      numDays: {
        type: Number,
        default: 7
      },
      leftMargin: {
        type: String,
        default: '4rem'
      },
      eventArray: {
        type: Array,
        default: () => []
      },
      parsedEvents: {
        type: Object,
        default: () => {}
      },
      eventRef: {
        type: String,
        default: 'calendar'
      },
      preventEventDetail: {
        type: Boolean,
        default: false
      },
      scrollHeight: {
        type: String,
        default: '200px'
      },
      fullComponentRef: String,
      calendarLocale: {
        type: String,
        default: () => { return DateTime.local().locale }
      },
      calendarTimezone: {
        type: String,
        default: () => { return DateTime.local().zoneName }
      }
    },
    components: {
      CalendarAgendaEvent,
      CalendarEventDetail,
      QBtn,
      QTooltip,
      QScrollArea,
      QInfiniteScroll,
      QSpinnerDots
    },
    mixins: [CalendarMixin, CalendarEventMixin],
    data () {
      return {
        workingDate: new Date(),
        localNumDays: 30,
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
        return date.addToDate(this.workingDate, { days: daysForward })
      },
      isFirstOfMonth: function (thisDate) {
        return thisDate.getDate() === 1
      },
      isFirstDayOfWeek: function (thisDate) {
        return date.getDayOfWeek(thisDate) === 1
      },
      loadMore: function (index, done) {
        this.localNumDays += 30
        done()
      },
      handleStartChange: function (val, oldVal) {
        this.doUpdate()
      },
      doUpdate: function () {
        this.mountSetDate()
      },
      getWeekTitle: function (firstDate) {
        let lastDate = date.addToDate(firstDate, { days: 6 })
        if (firstDate.getMonth() === lastDate.getMonth()) {
          return this.formatDate(firstDate, 'MMM d - ') + this.formatDate(lastDate, 'd')
        }
        else {
          return this.formatDate(firstDate, 'MMM d - ') + this.formatDate(lastDate, 'MMM d')
        }
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
        'click-event-' + this.eventRef,
        this.handleEventDetailEvent
      )
    },
    watch: {
      startYear: 'handleStartChange',
      startMonth: 'handleStartChange',
      startDay: 'handleStartChange',
      eventArray: 'getPassedInEventArray',
      parsedEvents: 'getPassedInParsedEvents'
    }
  }
</script>

<style lang="stylus">
    .calendar-agenda
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
                    .calendar-agenda-event-time
                        // nothing
                .calendar-agenda-event-allday
                    // nothing
</style>
