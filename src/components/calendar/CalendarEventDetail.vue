<template>

  <q-modal
    v-model="modalIsOpen"
    class="calendar-event-detail"
    @hide="__close()"
    @escape-key="__close()"
  >
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
          float-label="Summary"
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

    <div class="ced-content">
      <div
        v-if="isEditingAllowed && !inEditMode"
        class="ced-edit-button-content-spacer"
      ></div>
      <q-list no-border>

        <!-- date / time -->
        <q-item multiline>
          <q-item-side>
            <q-item-tile icon="access_time"/>
          </q-item-side>

          <!-- edit mode -->
          <q-item-main v-if="isEditingAllowed && inEditMode">

            <div class="row items-center gutter-xs">
              <div>
                <q-field>
                  <q-datetime
                    v-model="startDateObject"
                    type="date"
                    inverted-light
                    :color="fieldColor"
                    class="no-shadow"
                    format="MMM D, YYYY"
                  />
                </q-field>

              </div>

              <div v-if="!editEventObject.start.isAllDay">
                <q-field>
                  <q-datetime
                    v-model="startTimeObject"
                    type="time"
                    inverted-light
                    :color="fieldColor"
                    class="no-shadow"
                  />
                </q-field>

              </div>
              <div>to</div>
              <div>
                <q-field>
                  <q-datetime
                    v-model="endDateObject"
                    type="date"
                    inverted-light
                    :color="fieldColor"
                    class="no-shadow"
                    format="MMM D, YYYY"
                  />
                </q-field>

              </div>

              <div v-if="!editEventObject.start.isAllDay">
                <q-field>
                  <q-datetime
                    v-model="endTimeObject"
                    type="time"
                    inverted-light
                    :color="fieldColor"
                    class="no-shadow"
                  />
                </q-field>

              </div>

            </div>

            <!-- all-day -->
            <q-field>
              <q-checkbox
                label="All day"
                v-model="editEventObject.start.isAllDay"
                @input="$forceUpdate()"
                :toggle-indeterminate="false"
              />
            </q-field>

          </q-item-main>

          <!-- display mode -->
          <q-item-main v-else>
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
        <q-item v-if="isEditingAllowed && inEditMode">
          <q-item-side icon="location_on" />
          <q-item-main class="ced-list-title">
            <q-input
              v-model="editEventObject.location"
              float-label="Location"
              inverted-light
              :color="fieldColor"
              class="no-shadow"
            />
          </q-item-main>
        </q-item>
        <q-item v-else-if="textExists('location')">
          <q-item-side icon="location_on" />
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
        <q-item v-if="isEditingAllowed && inEditMode">
          <q-item-side>
            <q-item-tile icon="format_align_left"/>
          </q-item-side>
          <q-item-main>
            <q-field v-if="renderHtml">
              <q-editor
                v-model="editEventObject.description"
                float-label="Description"
                inverted-light
                :color="fieldColor"
                class="no-shadow"
              />
            </q-field>
            <q-field v-else>
              <q-input
                v-model="editEventObject.description"
                float-label="Description"
                inverted-light
                :color="fieldColor"
                class="no-shadow"
              />
            </q-field>

          </q-item-main>
        </q-item>
        <q-item
          v-else-if="textExists('description')"
          multiline
        >
          <q-item-side>
            <q-item-tile icon="format_align_left"/>
          </q-item-side>
          <q-item-main class="ced-list-title">
            <template v-if="renderHtml">
              <div v-html="eventObject.description"></div>
            </template>
            <template v-else>
              {{ eventObject.description }}
            </template>
          </q-item-main>
        </q-item>

      </q-list>
    </div>

    <!-- editing close buttons -->
    <div
      v-if="isEditingAllowed && inEditMode"
      class="row justify-end q-pa-md gutter-sm"
    >
      <div>
        <q-btn
          color="warning"
          icon="cancel"
          label="Cancel"
          @click="__close()"
        />
      </div>
      <div>
        <q-btn
          color="positive"
          icon="check"
          label="Save"
          @click="__save()"
        />
      </div>

    </div>

  </q-modal>

</template>

<script>
  import dashHas from 'lodash.has'
  import {
    QList,
    QItem,
    QItemSide,
    QItemTile,
    QItemMain,
    QModal,
    QBtn,
    QIcon,
    QField,
    QCheckbox,
    QDatetime,
    QInput,
    QEditor
  } from 'quasar'
  import {
    CalendarMixin, EventPropsMixin
  } from './mixins'
  import DateTime from 'luxon/src/datetime'
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
      QItemSide,
      QItemTile,
      QItemMain,
      QModal,
      QBtn,
      QIcon,
      QField,
      QCheckbox,
      QDatetime,
      QInput,
      QEditor
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
          'ced-top': true,
          'q-pr-md': true,
          'q-py-md': true,
          'relative-position': true
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
      isEditingAllowed: function () {
        if (dashHas(this.eventObject, 'allowEditing')) {
          return this.eventObject.allowEditing
        }
        return this.allowEditing
      }

    },
    methods: {
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
