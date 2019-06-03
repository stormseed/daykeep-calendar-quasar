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
      <q-time
        class="date-field-q-date"
        v-bind:value="stringValue"
        @input="handleTimeFieldInput"
        :mask="dateMask.quasar"
      />
    </q-popup-proxy>
    <template v-slot:append>
      <q-icon name="access_time" class="cursor-pointer"></q-icon>
    </template>
  </q-input>
</template>

<script>
  import {
    QIcon,
    QPopupProxy,
    QTime,
    QInput
  } from 'quasar'
  import DateTimeMixin from './DateTimeMixin'
  export default {
    name: 'FieldTime',
    mixins: [ DateTimeMixin ],
    components: {
      QIcon,
      QPopupProxy,
      QTime,
      QInput
    }
  }
</script>
