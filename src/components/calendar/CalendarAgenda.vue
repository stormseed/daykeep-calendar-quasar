<template>
    <div class="calendar-agenda column fit">
        <!-- content -->
        <!--<q-scroll-area class="col">-->
            <q-infinite-scroll
                inline
                :handler="loadMore"
                :style="{ 'height': scrollHeight, 'overflow':'auto' }">
                <div
                    v-for="daysForward in localNumDays"
                    :key="daysForward"
                >
                    <div v-if="startDateObject = getStartDateObject(daysForward - 1)">

                        <!--month marker-->
                        <div
                            v-if="startDateObject.date() === 1"
                            class="row calendar-agenda-month"
                            :style="{ 'padding-left': leftMargin }"
                        >
                            {{ startDateObject.format('MMMM YYYY') }}
                        </div>

                        <!--week marker-->
                        <div
                            v-if="startDateObject.day() === 0"
                            class="row calendar-agenda-week"
                            :style="{ 'margin-left': leftMargin }"
                        >
                            {{ getWeekTitle(startDateObject) }}
                        </div>

                        <!--individual day-->
                        <div
                            v-if="dateGetEvents(startDateObject).length > 0"
                            class="col row items-start calendar-agenda-day">
                            <div
                                class="col-auto calendar-agenda-side"
                                :style="{ 'width': leftMargin, 'max-width': leftMargin }"
                            >
                                <div class="calendar-agenda-side-date">
                                    {{ startDateObject.format('D') }}
                                </div>
                                <div class="calendar-agenda-side-day">
                                    {{ startDateObject.format('ddd') }}
                                </div>
                            </div>
                            <!--<div class="col row calendar-agenda-events">-->
                                <!--<calendar-agenda-event-->
                                    <!--v-if="dateGetEvents(startDateObject)"-->
                                    <!--v-for="thisEvent in dateGetEvents(startDateObject)"-->
                                    <!--:key="id"-->
                                    <!--class="col-12"-->
                                    <!--:event-object="thisEvent"-->
                                <!--/>-->
                            <!--</div>-->
                            <div class="col row calendar-agenda-events">
                                <template
                                    v-if="dateGetEvents(startDateObject)"
                                    v-for="thisEvent in dateGetEvents(startDateObject)"
                                >
                                    <calendar-agenda-event :event-object="thisEvent"/>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
                <q-spinner-dots slot="message" :size="40" />
            </q-infinite-scroll>
        <!--</q-scroll-area>-->
    </div>
</template>

<script>
  import moment from 'moment'
  import CalendarMixin from './CalendarMixin'
  import CalendarAgendaEvent from './CalendarAgendaEvent'
  import {
    QBtn,
    QTooltip,
    QScrollArea,
    QInfiniteScroll,
    QSpinnerDots
  } from 'quasar'
  export default {
    name: 'CalendarAgenda',
    props: {
      startMonth: {
        type: Number,
        default: moment().month() + 1
      },
      startYear: {
        type: Number,
        default: moment().year()
      },
      startDay: {
        type: Number,
        default: moment().date()
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
        yearNumber: moment().year(),
        monthNumber: moment().month() + 1,
        // weekNumber: moment().week(),
        dayNumber: moment().date(),
        // localNumDays: 30,
        localNumDays: 0,
        dayRowArray: [],
        dayCounter: [],
        parsed: this.getDefaultParsed()
      }
    },
    computed: {},
    methods: {
      loadMore: function (index, done) {
        console.debug('loadMore called, index = ', index)
        this.localNumDays += 30
        // this.doUpdate()
        done()
      },
      handleStartChange: function (val, oldVal) {
        // console.debug('handleStartChange called, val, oldVal = ', val, oldVal)
        this.doUpdate()
      },
      doUpdate: function () {
        this.mountSetDate()
        // this.localNumDays = this.numDays
      },
      getStartDateObject: function (daysForward) {
        let returnValue = this.createThisDate().add(daysForward - 1, 'days')
        // console.debug('getStartDateObject called, ', daysForward, returnValue, returnValue.format('MMMM Do YYYY'))
        return returnValue
      },
      getStartNumber: function (periodType) {
        if (this.forceStartOfWeek) {
          switch (periodType) {
            case 'year':
              return this.createThisDate().weekday(0).year()
            case 'month':
              return this.createThisDate().weekday(0).month()
            case 'day':
              return this.createThisDate().weekday(0).date()
          }
        }
        else {
          switch (periodType) {
            case 'year':
              return this.createThisDate().year()
            case 'month':
              return this.createThisDate().month()
            case 'day':
              return this.createThisDate().date()
          }
        }
      },
      getWeekTitle: function (firstMoment) {
        let lastMoment = firstMoment.clone().add(6, 'days')
        // console.debug('getWeekTitle, ', firstMoment, lastMoment)
        if (firstMoment.month() === lastMoment.month()) {
          return firstMoment.format('MMM D - ') + lastMoment.format('D')
        }
        else {
          return firstMoment.format('MMM D - ') + lastMoment.format('MMM D')
        }
      }
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