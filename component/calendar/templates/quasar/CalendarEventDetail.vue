<template>

  <q-dialog
    v-model="modalIsOpen"
    class="NOcalendar-event-detail"
    @hide="__close()"
    @escape-key="__close()"
  >

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
              <q-item-section>
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
                <div
                  v-if="isEditingAllowed && inEditMode"
                  class="flex-column q-gutter-y-md"
                >
                  <div class="flex-row flex-items-center q-gutter-x-md flex-no-wrap">
                    <field-date
                      v-model="startDateObject"
                      label="Start date"
                      stack-label
                      @input="checkEndAfterStart"
                    />
                    <template v-if="!editEventObject.start.isAllDay">
                      <field-time
                        v-model="startTimeObject"
                        label="Time"
                        stack-label
                        @input="checkEndAfterStart"
                      />
                    </template>
                  </div>
                  <div class="flex-row flex-items-center q-gutter-x-md flex-no-wrap">
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
                </div>
                <!-- date/time display mode -->
                <div v-else>
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
                      !eventObject.start.isAllDay"
                    class="ced-list-subtitle"
                  >
                    {{ formatDate(eventObject.start.dateObject, 'TIME_SIMPLE', true) }}
                    -
                    {{ formatDate(eventObject.end.dateObject, 'TIME_SIMPLE', true) }}
                  </div>
                </div>

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
                <div class="flex-row">
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
          class="flex-row flex-justify-end q-pa-md q-gutter-sm"
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
    QBtn,
    QCheckbox,
    QInput,
    QEditor
  } from 'quasar'
  import {
    CalendarMixin,
    EventPropsMixin,
    CalendarEventDetailTemplateMixin
  } from '@daykeep/calendar-core'
  import {
    QuasarFieldDate as FieldDate,
    QuasarFieldTime as FieldTime
  } from '../../fields'

  export default {
    name: 'CalendarEventDetail',
    mixins: [
      CalendarMixin,
      EventPropsMixin,
      CalendarEventDetailTemplateMixin
    ],
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
      QBtn,
      QCheckbox,
      QInput,
      QEditor,
      FieldDate,
      FieldTime
    },
    directives: {
      ClosePopup
    }
  }
</script>

<style lang="stylus">
  @import '~@daykeep/calendar-core/component/calendar/styles-common/calendar.vars.styl'

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
        background $grey-4
</style>
