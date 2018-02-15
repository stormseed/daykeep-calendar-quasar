<template>

    <q-modal v-model="modalIsOpen" class="calendar-event-detail">
        <div :class="getTopColorClasses">
            <div class="row justify-end items-start ced-toolbar">
                <q-btn
                    flat
                    label="Close"
                    @click="__close()"
                >
                    <q-icon name="close"></q-icon>
                </q-btn>
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
                        <q-item-tile icon="access_time" />
                    </q-item-side>
                    <q-item-main>
                        <div
                            v-if="eventObject.start && eventObject.start.dateObject"
                            class="ced-list-title"
                        >
                            {{ formatDateTime(eventObject.start.dateObject, 'dddd, MMMM D')}}
                        </div>
                        <div
                            v-if="eventObject.end && eventObject.end.dateObject && eventObject.start.isAllDay !== true"
                            class="ced-list-subtitle"
                        >
                            {{ formatDateTime(eventObject.start.dateObject, 'h:mm a')}} - {{ formatDateTime(eventObject.end.dateObject, 'h:mm a')}}
                        </div>
                    </q-item-main>
                </q-item>

                <!-- text description -->
                <q-item
                    v-if="eventObject.description && eventObject.description.length > 0"
                >
                    <q-item-side>
                        <q-item-tile icon="format_align_left" />
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
  import CalendarMixin from './CalendarMixin'
  export default {
    name: 'CalendarEventDetail',
    props: {
      eventObject: {
        type: Object,
        default: this.blankCalendarEvent
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
      // getToolbarColor: function () {
      //   return this.getEventColor(
      //     {},
      //     this.eventObject,
      //     'textColor'
      //   )
      // },
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
      formatDateTime: function (dateObject, format) {
        return date.formatDate(dateObject, format)
      },
      __open: function () {
        console.debug('calendarEventDetail.__open() called')
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
</style>