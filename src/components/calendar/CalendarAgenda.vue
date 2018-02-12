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
                            {{ formatDate(forwardDate, 'MMMM YYYY') }}
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
                            >
                                <div class="calendar-agenda-side-date">
                                    {{ formatDate(forwardDate, 'D') }}
                                </div>
                                <div class="calendar-agenda-side-day">
                                    {{ formatDate(forwardDate, 'ddd') }}
                                </div>
                            </div>
                            <div class="col row calendar-agenda-events">
                                <template
                                    v-if="dateGetEvents(forwardDate)"
                                    v-for="thisEvent in dateGetEvents(forwardDate)"
                                >
                                    <calendar-agenda-event :event-object="thisEvent"/>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
                <q-spinner-dots slot="message" :size="40" />
            </q-infinite-scroll>
    </div>
</template>

<script>
  import CalendarMixin from './CalendarMixin'
  import CalendarAgendaEvent from './CalendarAgendaEvent'
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
    props: {
      startDate: {
        type: Date,
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
      scrollHeight: {
        type: String,
        default: '200px'
      }
    },
    components: {
      CalendarAgendaEvent,
      QBtn,
      QTooltip,
      QScrollArea,
      QInfiniteScroll,
      QSpinnerDots
    },
    mixins: [CalendarMixin],
    data () {
      return {
        workingDate: new Date(),
        localNumDays: 30,
        dayRowArray: [],
        dayCounter: [],
        parsed: this.getDefaultParsed()
      }
    },
    computed: {},
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
          return date.formatDate(firstDate, 'MMM D - ') + date.formatDate(lastDate, 'D')
        }
        else {
          return date.formatDate(firstDate, 'MMM D - ') + date.formatDate(lastDate, 'MMM D')
        }
      },
    },
    mounted () {
      this.localNumDays = this.numDays
      this.doUpdate()
      this.handlePassedInEvents()
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
                    .calendar-agenda-event-summary
                        font-weight bold
                    .calendar-agenda-event-time
                        // nothing
                .calendar-agenda-event-allday
                    // nothing
</style>