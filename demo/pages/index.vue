<template>
  <q-page padding class="row NOflex NOflex-center">
    <div>
      <q-option-group
        v-model="showCards"
        :options="showCardOptions"
        type="toggle"
        inline
      ></q-option-group>
    </div>
    <transition
      appear
      enter-active-class="animated fadeInLeft"
      leave-active-class="animated fadeOutLeft"
    >
      <q-card
        v-if="showCards.includes('fullCalendar')"
        inline
        class="full-width q-ma-sm"
      >
        <q-card-section>
          <div class="text-h6">
            Full calendar component
          </div>
          <div class="text-subtitle2">
            A multifunction component that displays calendar information in a variety of predefined formats.
          </div>
        </q-card-section>
        <q-card-section>
          <daykeep-calendar
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
    </transition>

    <transition
      appear
      enter-active-class="animated fadeInLeft"
      leave-active-class="animated fadeOutLeft"
    >
      <q-card
        v-if="showCards.includes('month')"
        inline
        class="full-width q-ma-sm"
      >
        <q-card-section>
          <div class="text-h6">
            Individual month view component
          </div>
          <div class="text-subtitle2">
            Example of a single component displayed. Acts independently of any other calendar component on the same page.
          </div>
        </q-card-section>
        <q-card-section>
          <daykeep-calendar-month
            :event-array="eventArray"
            :sunday-first-day-of-week="false"
            calendar-locale="fr"
          />
        </q-card-section>
      </q-card>
    </transition>

    <transition
      appear
      enter-active-class="animated fadeInLeft"
      leave-active-class="animated fadeOutLeft"
    >
      <q-card
        v-if="showCards.includes('week')"
        inline
        class="full-width q-ma-sm"
      >
        <q-card-section>
          <div class="text-h6">
            Individual multi-day / week view component
          </div>
          <div class="text-subtitle2">
            The multi-day component. This can be configured as a proper full-week display (shown), a single day or a multi-day. The number of days shown and the number of days moved in the navigation are adjustable.
          </div>
        </q-card-section>
        <q-card-section>
          <daykeep-calendar-multi-day
            :event-array="eventArray"
            scrollHeight="400px"
            day-cell-height="7"
            day-cell-height-unit="rem"
            :show-half-hours="true"
          />
        </q-card-section>
      </q-card>
    </transition>

    <transition
      appear
      enter-active-class="animated fadeInLeft"
      leave-active-class="animated fadeOutLeft"
    >
      <q-card
        v-if="showCards.includes('agenda')"
        inline
        class="full-width q-ma-sm"
      >
        <q-card-section>
          <div class="text-h6">
            Agenda view component
          </div>
        </q-card-section>
        <q-card-section>
          <daykeep-calendar-agenda
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
    </transition>

  </q-page>
</template>

<script>
  import {
    QPage,
    QCard,
    QCardSection,
    QOptionGroup
  } from 'quasar'
  import {
    DaykeepCalendar,
    DaykeepCalendarMonth,
    DaykeepCalendarMultiDay,
    DaykeepCalendarAgenda
  } from '../../component/quasar'
  import {
    MoveDates,
    sampleEventArray
  } from '@daykeep/calendar-core/demo'
  export default {
    name: 'PageIndex',
    components: {
      QPage,
      QCard,
      QCardSection,
      QOptionGroup,
      DaykeepCalendar,
      DaykeepCalendarMonth,
      DaykeepCalendarMultiDay,
      DaykeepCalendarAgenda
    },
    mixins: [ MoveDates ],
    data () {
      return {
        eventArray: sampleEventArray, // in page-code-mixins/sample-data.js
        showCards: ['fullCalendar'],
        showCardOptions: [
          { label: 'Full calendar', value: 'fullCalendar' },
          { label: 'Month', value: 'month' },
          { label: 'Week', value: 'week' },
          { label: 'Agenda', value: 'agenda' }
        ]
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
