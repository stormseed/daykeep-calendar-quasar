<template>

  <q-modal v-model="modalIsOpen" class="calendar-event-detail">
    <div :class="getTopColorClasses">
      <div class="row justify-end items-start ced-toolbar">
        <q-btn
          flat
          icon-right="close"
          @click="__close()"
        />
      </div>
      <div class="ced-top-title" v-if="eventObject.summary">
        {{ eventObject.summary }}
      </div>

    </div>

    <div class="ced-content">
      <q-list>

        <!-- date / time -->
        <q-item>
          <q-item-side>
            <q-item-tile icon="access_time"/>
          </q-item-side>
          <q-item-main>
            <div
              v-if="eventObject.start && eventObject.start.dateObject"
              class="ced-list-title"
            >
              {{ formatDate(eventObject.start.dateObject, 'DATE_HUGE', true) }}
              <template
                v-if="eventObject.end &&
                  eventObject.end.dateObject &&
                  eventObject.start.isAllDay &&
                  formatDate(eventObject.start.dateObject, 'DATE_SHORT', true) !== formatDate(eventObject.end.dateObject, 'DATE_SHORT', true)"
              >
                -
                {{ formatDate(eventObject.end.dateObject, 'DATE_HUGE', true) }}
              </template>
            </div>
            <div
              v-if="eventObject.end &&
                eventObject.end.dateObject &&
                eventObject.start.isAllDay !== true"
              class="ced-list-subtitle"
            >
              {{ formatDate(eventObject.start.dateObject, 'TIME_SIMPLE', true)
              }}
              -
              {{ formatDate(eventObject.end.dateObject, 'TIME_SIMPLE', true) }}
            </div>
          </q-item-main>
        </q-item>

        <!-- location -->
        <q-item
          v-if="textExists('location')"
        >
          <q-item-side>
            <q-item-tile icon="location_on"/>
          </q-item-side>
          <q-item-main class="ced-list-title">
            {{ eventObject.location }}
          </q-item-main>
        </q-item>

        <!-- resources -->
        <q-item
          v-if="countResources > 0"
        >
          <q-item-side>
            <q-item-tile icon="business"/>
          </q-item-side>
          <q-item-main>
            <q-item
              dense
              v-for="thisAttendee in eventObject.attendees"
              :key="thisAttendee.id"
              v-if="thisAttendee.resource"
              class="ced-nested-item"
            >
              {{ thisAttendee.displayName }}
            </q-item>
          </q-item-main>
        </q-item>

        <!-- attendees -->
        <q-item
          multiline
          v-if="countAttendees > 0"
        >
          <q-item-side icon="people">
            <!--<q-item-tile icon="people" />-->
          </q-item-side>
          <q-item-main class="ced-list-title">

            <q-item-tile>
              {{ countAttendees }} guest<template v-if="countAttendees > 1">s</template>
            </q-item-tile>

            <!-- guest list -->
            <q-item-tile>
              <q-item
                dense
                v-for="thisAttendee in eventObject.attendees"
                :key="thisAttendee.id"
                v-if="!thisAttendee.resource"
                class="ced-nested-item"
              >
                <q-item-side
                  inverted
                  icon="person"
                  class="ced-small-inverted-icon"
                />
                <q-item-main class="ced-list-title">
                  <template v-if="thisAttendee.displayName && thisAttendee.displayName.length > 0">
                    {{ thisAttendee.displayName }}
                  </template>
                  <template v-else>
                    {{ thisAttendee.email }}
                  </template>
                </q-item-main>
              </q-item>
            </q-item-tile>

          </q-item-main>
        </q-item>

        <!-- description -->
        <q-item
          multiline
          v-if="textExists('description')"
        >
          <q-item-side>
            <q-item-tile icon="format_align_left"/>
          </q-item-side>
          <q-item-main class="ced-list-title">
            {{ eventObject.description }}
          </q-item-main>
        </q-item>

      </q-list>

    </div>
  </q-modal>

</template>

<script>
  import dashHas from 'lodash.has'
  import {
    date,
    QList,
    QItem,
    QItemSide,
    QItemTile,
    QItemMain,
    QModal,
    QBtn,
    QIcon
  } from 'quasar'
  import CalendarMixin from './mixins/CalendarMixin'
  const { DateTime } = require('luxon')
  export default {
    name: 'CalendarEventDetail',
    props: {
      eventObject: {
        type: Object,
        default: () => {}
      },
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
      QList,
      QItem,
      QItemSide,
      QItemTile,
      QItemMain,
      QModal,
      QBtn,
      QIcon
    },
    mixins: [CalendarMixin],
    data () {
      return {
        modalIsOpen: false
      }
    },
    computed: {
      countAttendees: function () {
        if (!dashHas(this.eventObject, 'attendees')) {
          return 0
        }
        let count = this.eventObject.attendees.length
        for (let thisAttendee of this.eventObject.attendees) {
          if (thisAttendee.resource) {
            count--
          }
        }
        return count
      },
      countResources: function () {
        if (!dashHas(this.eventObject, 'attendees')) {
          return 0
        }
        let count = 0
        for (let thisAttendee of this.eventObject.attendees) {
          if (thisAttendee.resource) {
            count++
          }
        }
        return count
      },
      getTopColorClasses: function () {
        return this.addCssColorClasses({
          'ced-top': true
        },
        this.eventObject)
      },
      getEventStyle: function () {
        return {
          // 'background-color': this.backgroundColor,
          // 'color': this.textColor
        }
      },
      getEventClass: function () {
        return this.addCssColorClasses(
          {
            'calendar-event': true,
            'calendar-event-month': this.monthStyle
          },
          this.eventObject
        )
      },
    },
    methods: {
      textExists: function (fieldLocation) {
        return (
          dashHas(this.eventObject, fieldLocation) &&
          this.eventObject[fieldLocation].length > 0
        )
      },
      formatDateTime: function (dateObject, format) {
        return date.formatDate(dateObject, format)
      },
      __open: function () {
        this.modalIsOpen = true
      },
      __close: function () {
        this.modalIsOpen = false
      }
    },
    mounted () {}
  }
</script>

<style lang="stylus">
  @import 'calendar.vars.styl'

  $topSidePadding = 16px
  $listSideItemWidth = 38px
  $listSideItemSpace = 10px
  $forcedLeftMargin = $topSidePadding + $listSideItemWidth + $listSideItemSpace

  .calendar-event-detail
    .ced-list-title
      font-size 1em
    .ced-list-subtitle
      font-size .8em
      opacity 0.8
    .ced-top
      padding .25em 0 1em
      .ced-top-title
        font-size 1.25em
        margin-left $forcedLeftMargin
    .ced-content
      font-size 1em
    .ced-nested-item
      padding-left 0
    .ced-small-inverted-icon
      font-size 20px
      padding 2px
      border-radius 50%
      min-width 24px
      .q-item-icon-inverted
        background lighten($light, 25%)
</style>
