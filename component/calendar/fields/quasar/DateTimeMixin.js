import DateTime from 'luxon/src/datetime'
export default {
  props: {
    value: { required: true },
    placeholder: String,
    label: String,
    stackLabel: Boolean,
    dense: Boolean
  },
  computed: {
    thisFieldType: function () {
      let thisFieldType = 'date'
      if (this.$options.name === 'FieldTime') {
        thisFieldType = 'time'
      }
      return thisFieldType
    }
  },
  methods: {
    convertValueToStringValue: function (newValue = null, fieldType = 'date') {
      if (!newValue) {
        newValue = this.value
      }
      if (newValue instanceof Date) {
        newValue = DateTime.fromJSDate(this.value)
      }
      this.stringValue = newValue.toFormat(this.dateMask.luxon)
      this.fakieStringValue = newValue.toLocaleString(this.fakieStringFormats[fieldType])
      this.dtValue = newValue
    },
    convertDtToEverythingElse: function (newDt = null, fieldType = 'date') {
      if (!newDt) {
        newDt = this.dtValue
      }
      this.fakieStringValue = newDt.toLocaleString(this.fakieStringFormats[fieldType])
      this.dtValue = newDt
      this.$emit('input', newDt.toJSDate())
    },
    handleDateFieldInput: function (value, reason, details) {
      this.convertDtToEverythingElse(
        this.dtValue.set({
          year: details.year,
          month: details.month,
          day: details.day
        }),
        'date'
      )
      this.$refs.qDateTimeProxy.hide()
    },
    handleTimeFieldInput: function (value, reason, details) {
      let tempDT = DateTime.fromFormat(value, this.dateMask.luxon)
      this.convertDtToEverythingElse(
        this.dtValue.set({
          hour: tempDT.hour,
          minute: tempDT.minute
        }),
        'time'
      )
      // this.$refs.qDateTimeProxy.hide()
    }
  },
  mounted () {
    this.convertValueToStringValue(null, this.thisFieldType)
  },
  data () {
    return {
      stringValue: '',
      dtValue: {},
      fakieStringValue: '',
      fakieStringFormats: {
        date: DateTime.DATE_FULL,
        time: DateTime.TIME_SIMPLE
      },
      dateMask: {
        quasar: 'YYYY-MM-DD HH:mm',
        luxon: 'yyyy-MM-dd HH:mm'
      }
    }
  },
  watch: {
    value: function (newVal) {
      this.convertValueToStringValue(newVal, this.thisFieldType)
    }
  }
}
