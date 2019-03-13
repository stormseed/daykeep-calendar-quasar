<template>
  <q-input
    v-bind:value="value"
    v-on:input="$emit('input', $event.target.value)"
    mask="time"
    :rules="['time']"
    :placeholder="placeholder"
    :label="label"
    :stack-label="stackLabel"
    :dense="dense"
    filled
  >
    <template v-slot:append>
      <q-icon name="access_time" class="cursor-pointer">
        <q-popup-proxy>
          <q-time
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
    QTime,
    QInput
  } from 'quasar'
  export default {
    name: 'FieldTime',
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
      QTime,
      QInput
    },
    data () {
      return {}
    }
  }
</script>
