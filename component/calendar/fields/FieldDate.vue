<template>
  <q-input
    v-bind:value="value"
    v-on:input="$emit('input', $event.target.value)"
    mask="date"
    :rules="['date']"
    :placeholder="placeholder"
    :label="label"
    :stack-label="stackLabel"
    :dense="dense"
    filled
  >
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy>
          <q-date
            v-bind:value="value"
            v-on:input="$emit('input', $event.target.value)"
          />
        </q-popup-proxy>
      </q-icon>
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
  export default {
    name: 'FieldDate',
    props: {
      value: { required: true },
      placeholder: String,
      label: String,
      stackLabel: Boolean,
      dense: Boolean
    },
    components: {
      QIcon,
      QPopupProxy,
      QDate,
      QInput
    },
    data () {
      return {}
    }
  }
</script>
