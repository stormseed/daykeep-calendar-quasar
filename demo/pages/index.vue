<template>
  <q-page padding class="row NOflex NOflex-center">
    <q-card
      v-if="showCards.fullCalendar"
      inline
      class="full-width q-ma-sm"
    >
      <q-card-section>
        Full calendar component
        <span slot="subtitle">
                    A multifunction component that displays calendar information in a variety of predefined formats.
                </span>
      </q-card-section>
      <q-card-section>
        <calendar
          :event-array="eventArray"
          :sunday-first-day-of-week="false"
          NOcalendar-locale="fr"
          NOcalendar-timezone="America/Los_Angeles"
          NOevent-ref="MYCALENDAR"
          :allow-editing="true"
          agenda-style="block"
          :render-html="true"
          :NOstart-date="new Date(2019, 1, 4)"
        />
      </q-card-section>
    </q-card>
    <q-card
      v-if="showCards.month"
      inline
      class="full-width q-ma-sm"
    >
      <q-card-section>
        Individual month view component
        <span slot="subtitle">
                    Example of a single component displayed. Acts independently of any other calendar component on the same page.
                </span>
      </q-card-section>
      <q-card-section>
        <calendar-month
          :event-array="eventArray"
          :sunday-first-day-of-week="false"
          calendar-locale="fr"
        />
      </q-card-section>
    </q-card>
    <q-card
      v-if="showCards.week"
      inline
      class="full-width q-ma-sm"
    >
      <q-card-section>
        Individual multi-day / week view component
        <span slot="subtitle">
                    The multi-day component. This can be configured as a proper full-week display (shown), a single day or a multi-day. The number of days shown and the number of days moved in the navigation are adjustable.
                </span>
      </q-card-section>
      <q-card-section>
        <calendar-multi-day
          :event-array="eventArray"
          scrollHeight="400px"
          day-cell-height="7"
          day-cell-height-unit="rem"
          :show-half-hours="true"
        />
      </q-card-section>
    </q-card>
    <q-card
      v-if="showCards.agenda"
      inline
      class="full-width q-ma-sm"
    >
      <q-card-section>
        Agenda view component
      </q-card-section>
      <q-card-section>
        <calendar-agenda
          :event-array="eventArray"
          agenda-style="block"
          :sunday-first-day-of-week="true"
          :allow-editing="false"
          :num-days="1"
          calendar-locale="es"
          calendar-timezone="America/Argentina/Buenos_Aires"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
  import {
    QPage,
    QCard,
    QCardSection
  } from 'quasar'
  import {
    Calendar,
    CalendarMonth,
    CalendarMultiDay,
    CalendarAgenda
  } from '../../component'
  import { sampleEventArray } from './page-mixins/sample-data'
  import MoveDates from './page-mixins/move-dates'
  export default {
    name: 'PageIndex',
    components: {
      QPage,
      QCard,
      QCardSection,
      Calendar,
      CalendarMonth,
      CalendarMultiDay,
      CalendarAgenda
    },
    mixins: [ MoveDates ],
    data () {
      return {
        eventArray: sampleEventArray, // in page-mixins/sample-data.js
        showCards: {
          fullCalendar: true,
          month: false,
          week: false,
          agenda: false
        }
      }
    },
    computed: {},
    methods: {},
    created () {
      this.moveSampleDatesAhead()
    }
  }
</script>

<style lang="stylus">
</style>
