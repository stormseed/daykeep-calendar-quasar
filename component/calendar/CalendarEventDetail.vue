<template>

  <q-dialog
    v-model="modalIsOpen"
    class="NOcalendar-event-detail"
    @hide="__close()"
    @escape-key="__close()"
  >
    <!--
    <div :class="getTopColorClasses">
      <div class="absolute-top-right row justify-end items-start ced-toolbar">
        <q-btn
          flat
          icon-right="close"
          @click="__close()"
        />
      </div>
      <div
        v-if="isEditingAllowed && inEditMode"
        class="ced-top-title"
      >
        <div
          v-if="isEditingAllowed && inEditMode"
          class="ced-toolbar-edit-spacer">
        </div>
        <q-input
          v-model="editEventObject.summary"
          stack-label="Summary"
          inverted-light
          :color="fieldColor"
          class="no-shadow"
        />
      </div>
      <div
        v-else-if="eventObject.summary"
        class="ced-top-title"
      >
        {{ eventObject.summary }}
      </div>
      <div
        v-if="isEditingAllowed && !inEditMode"
        class="ced-edit-button-container"
      >
        <div class="ced-edit-button">
          <q-btn
            round
            icon="edit"
            :color="getEventColor(eventObject, 'color')"
            :text-color="getEventColor(eventObject, 'textColor')"
            @click="startEditMode"
          />
        </div>

      </div>

    </div>
    -->

    <q-card class="calendar-event-detail">
      <q-toolbar>
        <q-toolbar-title>
          <!--{{ eventObject.summary }}-->
        </q-toolbar-title>

        <q-btn
          v-if="isEditingAllowed && !inEditMode"
          flat
          round
          dense
          icon="edit"
          @click="startEditMode"
        />
        <div class="ced-close-button-left-spacer"></div>
        <q-btn
          flat
          round
          dense
          icon="close"
          v-close-popup
        />
      </q-toolbar>

      <q-card-section class="ced-q-card-main">
        <div class="ced-content">
          <q-list no-border>

            <!-- title -->
            <q-item>
              <!-- left side color bar -->
              <q-item-section
                avatar
                class="ced-avatar-column"
              >
                <div :class="getTopColorClasses"></div>
              </q-item-section>
              <q-item-section class="NOrow">
                <div
                  v-if="isEditingAllowed && inEditMode"
                  class="ced-top-title ced-event-title"
                >
                  <q-input
                    v-model="editEventObject.summary"
                    label="Summary"
                    stack-label
                    filled
                    bottom-slots
                  />
                </div>
                <div
                  v-else
                  class="ced-event-title"
                >
                  {{ eventObject.summary }}
                </div>

                <!-- date/time edit mode -->
                <template v-if="isEditingAllowed && inEditMode">
                  <div class="row items-center q-gutter-x-md no-wrap">
                    <field-date
                      v-model="startDateObject"
                      label="Start date"
                      stack-label
                    />
                    <template v-if="!editEventObject.start.isAllDay">
                      <field-time
                        v-model="startTimeObject"
                        label="Time"
                        stack-label
                      />
                    </template>
                  </div>
                  <div class="row items-center q-gutter-x-md no-wrap">
                    <field-date
                      label="End date"
                      stack-label
                      v-model="endDateObject"
                    />
                    <template v-if="!editEventObject.start.isAllDay">
                      <field-time
                        v-model="endTimeObject"
                        label="Time"
                        stack-label
                      />
                    </template>
                  </div>
                  <!-- all-day -->
                  <q-checkbox
                    label="All day"
                    v-model="editEventObject.start.isAllDay"
                    @input="$forceUpdate()"
                    :toggle-indeterminate="false"
                  />
                </template>
                <!-- date/time display mode -->
                <template v-else>
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
                    {{ formatDate(eventObject.start.dateObject, 'TIME_SIMPLE', true) }}
                    -
                    {{ formatDate(eventObject.end.dateObject, 'TIME_SIMPLE', true) }}
                  </div>
                </template>

                <!-- date / time -->
              </q-item-section>
            </q-item>

            <!-- location -->
            <q-item v-if="isEditingAllowed && inEditMode">
              <q-item-section avatar>
                <q-icon
                  name="location_on"
                  :color="eventColor"
                />
              </q-item-section>
              <q-item-section class="ced-list-title">
                <q-input
                  v-model="editEventObject.location"
                  label="Location"
                  stack-label
                  filled
                />
              </q-item-section>
            </q-item>
            <q-item v-else-if="textExists('location')">
              <q-item-section avatar>
                <q-icon
                  name="location_on"
                  :color="eventColor"
                />
              </q-item-section>
              <q-item-section class="ced-list-title">
                {{ eventObject.location }}
              </q-item-section>
            </q-item>

            <!-- resources -->
            <q-item
              v-if="countResources > 0"
            >
              <q-item-section avatar>
                <q-icon
                  name="business"
                  :color="eventColor"
                />
              </q-item-section>
              <q-item-section>
                <div
                  v-for="thisAttendee in eventObject.attendees"
                  :key="thisAttendee.id"
                >
                  <q-item
                    dense
                    v-if="dashHas(thisAttendee, 'resource') && thisAttendee.resource"
                    class="ced-nested-item"
                  >
                    {{ thisAttendee.displayName }}
                  </q-item>
                </div>
              </q-item-section>
            </q-item>

            <!-- attendees -->
            <q-item
              multiline
              v-if="countAttendees > 0"
            >
              <q-item-section avatar>
                <div class="relative-position ced-icon-div-with-badge">
                  <q-icon
                    name="people"
                    :color="eventColor"
                  >
                  </q-icon>
                  <q-badge color="red" floating transparent>
                    {{ countAttendees }}
                  </q-badge>
                </div>
              </q-item-section>
              <q-item-section class="ced-list-title">
                <!-- guest list -->
                <div class="row">
                <template
                  v-for="thisAttendee in eventObject.attendees"
                >
                  <q-chip
                    :key="thisAttendee.id"
                    v-if="!(dashHas(thisAttendee, 'resource') && thisAttendee.resource)"
                  >
                    <q-avatar icon="person" :color="eventColor" />
                    <template v-if="thisAttendee.displayName && thisAttendee.displayName.length > 0">
                      {{ thisAttendee.displayName }}
                    </template>
                    <template v-else>
                      {{ thisAttendee.email }}
                    </template>
                  </q-chip>
                </template>
                </div>

              </q-item-section>
            </q-item>

            <!-- description -->
            <q-item v-if="isEditingAllowed && inEditMode">
              <q-item-section avatar>
                <q-icon
                  name="format_align_left"
                  :color="eventColor"
                />
              </q-item-section>
              <q-item-section>
                <template v-if="renderHtml">
                  <q-editor v-model="editEventObject.description"/>
                </template>
                <template v-else>
                  <q-input
                    v-model="editEventObject.description"
                    label="Description"
                    stack-label
                    type="textarea"
                    filled
                  />
                </template>
              </q-item-section>
            </q-item>
            <q-item
              v-else-if="textExists('description')"
              multiline
            >
              <q-item-section avatar>
                <q-icon
                  name="format_align_left"
                  :color="eventColor"
                />
              </q-item-section>
              <q-item-section class="ced-list-title">
                <template v-if="renderHtml">
                  <div v-html="eventObject.description"></div>
                </template>
                <template v-else>
                  {{ eventObject.description }}
                </template>
              </q-item-section>
            </q-item>

          </q-list>
        </div>

        <!-- editing close buttons -->
        <div
          v-if="isEditingAllowed && inEditMode"
          class="row justify-end q-pa-md q-gutter-sm"
        >
          <div>
            <q-btn
              :color="eventColor"
              icon="cancel"
              label="Cancel"
              flat
              @click="__close()"
            />
          </div>
          <div>
            <q-btn
              :color="eventColor"
              icon="check"
              label="Save"
              flat
              @click="__save()"
            />
          </div>

        </div>
      </q-card-section>

    </q-card>

  </q-dialog>

</template>

<script>
  import dashHas from 'lodash.has'
  import {
    QList,
    QItem,
    QItemSection,
    QAvatar,
    QChip,
    QIcon,
    QBadge,
    QDialog,
    ClosePopup,
    QCard,
    QCardSection,
    QToolbar,
    QToolbarTitle,
    // QPopupProxy,
    QBtn,
    // QField,
    QCheckbox,
    // QDate,
    // QTime,
    QInput,
    QEditor
  } from 'quasar'
  import {
    CalendarMixin, EventPropsMixin
  } from './mixins'
  import {
    FieldDate,
    FieldTime
  } from './fields'
  import DateTime from 'luxon/src/datetime'
  const debug = require('debug')('calendar:CalendarEventDetail')
  export default {
    name: 'CalendarEventDetail',
    mixins: [CalendarMixin, EventPropsMixin],
    props: {
      fieldColor: {
        type: String,
        default: 'grey-2'
      }
    },
    components: {
      QList,
      QItem,
      QItemSection,
      QAvatar,
      QChip,
      QIcon,
      QBadge,
      QDialog,
      QCard,
      QCardSection,
      QToolbar,
      QToolbarTitle,
      // QPopupProxy,
      QBtn,
      // QField,
      QCheckbox,
      // QDate,
      // QTime,
      QInput,
      QEditor,
      FieldDate,
      FieldTime
    },
    directives: {
      ClosePopup
    },
    data () {
      return {
        modalIsOpen: false,
        inEditMode: false,
        editEventObject: {},
        startDateObject: new Date(),
        startTimeObject: new Date(),
        endDateObject: new Date(),
        endTimeObject: new Date()
      }
    },
    computed: {
      countAttendees: function () {
        if (!dashHas(this.eventObject, 'attendees')) {
          return 0
        }
        let count = this.eventObject.attendees.length
        for (let thisAttendee of this.eventObject.attendees) {
          if (dashHas(thisAttendee, 'resource') && thisAttendee.resource) {
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
          debug('thisAttendee = ', thisAttendee)
          if (dashHas(thisAttendee, 'resource') && thisAttendee.resource) {
            count++
          }
        }
        return count
      },
      getTopColorClasses: function () {
        return this.addCssColorClasses(
          {
            'full-width': true,
            'full-height': true,
            'q-pr-md': true,
            // 'q-py-md': true,
            // 'q-py-none': true,
            // 'q-mt-sm': true,
            'relative-position': true,
            'ced-top': true
          },
          this.eventObject)
      },
      eventColor: function () {
        return this.getEventColor(this.eventObject, 'color')
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
      isEditingAllowed: function () {
        if (dashHas(this.eventObject, 'allowEditing')) {
          return this.eventObject.allowEditing
        }
        return this.allowEditing
      }

    },
    methods: {
      dashHas: dashHas,
      textExists: function (fieldLocation) {
        return (
          dashHas(this.eventObject, fieldLocation) &&
          this.eventObject[fieldLocation].length > 0
        )
      },
      __open: function () {
        this.modalIsOpen = true
      },
      __close: function () {
        this.modalIsOpen = false
        this.inEditMode = false
      },
      startEditMode: function () {
        this.editEventObject = this.eventObject
        // fixes for any values that will cause errors
        if (!dashHas(this.editEventObject, 'start.isAllDay')) {
          this.editEventObject.start.isAllDay = false
        }
        let dateObj = {}
        if (typeof this.editEventObject.start.dateObject.toJSDate === 'function') {
          dateObj = this.editEventObject.start.dateObject.toJSDate()
        }
        else {
          dateObj = this.editEventObject.start.dateObject
        }
        this.startDateObject = dateObj
        this.startTimeObject = dateObj
        if (dashHas(this.editEventObject, 'end.dateObject')) {
          if (typeof this.editEventObject.end.dateObject.toJSDate === 'function') {
            dateObj = this.editEventObject.end.dateObject.toJSDate()
          }
          else {
            dateObj = this.editEventObject.end.dateObject
          }
          this.endDateObject = dateObj
          this.endTimeObject = dateObj
        }
        this.inEditMode = true
      },
      __save: function () {
        // convert elements back to parsed format
        const stepList = ['start', 'end']
        const isAllDay = this.editEventObject.start.isAllDay

        for (let step of stepList) {
          let dateObj = DateTime.fromJSDate(this[step + 'DateObject'])
          if (isAllDay) {
            this.editEventObject[step] = {
              date: dateObj.toISODate()
            }
          }
          else {
            let timeObj = this[step + 'TimeObject']
            dateObj = dateObj.set({
              hour: timeObj.getHours(),
              minute: timeObj.getMinutes(),
              second: timeObj.getSeconds()
            })
            this.editEventObject[step] = {
              dateTime: dateObj.toISO()
            }
          }
        }

        // strip out calculated fields
        let fieldList = ['daysFromStart', 'durationDays', 'hasNext', 'hasPrev', 'slot', 'allowEditing']
        for (let thisField of fieldList) {
          delete this.editEventObject[thisField]
        }

        // done modifying
        this.eventObject = this.editEventObject
        this.$root.$emit(
          'update-event-' + this.eventRef,
          this.eventObject
        )
        this.__close()
      }
    },
    mounted () {
      debug('Component mounted')
    }
  }
</script>

<style lang="stylus">
  @import 'calendar.vars.styl'

  $topSidePadding = 16px
  $listSideItemWidth = 38px
  $listSideItemSpace = 10px
  $forcedLeftMargin = $topSidePadding + $listSideItemWidth + $listSideItemSpace

  .calendar-event-detail
    max-width 80vw !important
    .ced-icon-div-with-badge
      padding-right 5px
      padding-top 5px
    .ced-close-button-left-spacer
      width 16px
    .ced-event-title
      font-size 1.5em
      font-weight 500
    .ced-list-title
      font-size 1em
    .ced-list-subtitle
      font-size .8em
      opacity 0.8
    .ced-q-card-main
      padding-top 0
    .ced-avatar-column
      min-width 40px
      margin-right 16px
    .ced-top
      /*padding .25em 0 1em*/
      .ced-top-title
        font-size 1.25em
        margin-left $forcedLeftMargin
        .ced-toolbar-edit-spacer
          min-height 1em
          height 1em
      .ced-edit-button-container
        position relative
        .ced-edit-button
          position absolute
          left 8px
          bottom -32px
    .ced-content
      font-size 1em
      .ced-edit-button-content-spacer
        min-height 1em
        height 1em
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
