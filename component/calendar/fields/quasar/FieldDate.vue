<template>
  <q-input
    v-if="stringValue"
    v-bind:value="fakieStringValue"
    :placeholder="placeholder"
    :label="label"
    :stack-label="stackLabel"
    :dense="dense"
    filled
    disabled
  >
    <q-popup-proxy
      ref="qDateTimeProxy"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-date
        class="date-field-q-date"
        v-bind:value="stringValue"
        @input="handleDateFieldInput"
        :mask="dateMask.quasar"
      />
    </q-popup-proxy>
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer"></q-icon>
    </template>
  </q-input>
</template>

<script>
  import {
    QIcon,
    QPopupProxy,
    QDate,
    QInput
  } from 'quasar'
  import DateTimeMixin from './DateTimeMixin'
  export default {
    name: 'FieldDate',
    mixins: [ DateTimeMixin ],
    components: {
      QIcon,
      QPopupProxy,
      QDate,
      QInput
    }
  }
</script>
