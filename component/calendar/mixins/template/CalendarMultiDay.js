// import {animScrollTo} from "quasar/src/utils/scroll";

const debug = require('debug')('calendar:CalendarMultiDay')
// const { getScrollTarget, setScrollPosition } = scroll

export default {
  props: {
    numDays: {
      type: Number,
      default: 7
    },
    navDays: {
      type: Number,
      default: 7
    },
    forceStartOfWeek: {
      type: Boolean,
      default: true
    },
    dayCellHeight: {
      type: [Number, String],
      default: 5
    },
    dayCellHeightUnit: {
      type: String,
      default: 'rem'
    },
    scrollStyle: {
      type: Object,
      default: function () {
        return {}
      }
    },
    scrollHeight: {
      type: String,
      default: 'auto'
    },
    showHalfHours: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      workingDate: new Date(),
      weekDateArray: [],
      parsed: this.getDefaultParsed(),
      thisNavRef: this.createNewNavEventName(),
      eventDetailEventObject: {}
    }
  },
  computed: {
    dayCellWidth: function () {
      return this.calculateDayCellWidth(this.numDays)
    },
    getScrollStyle: function () {
      if (this.scrollStyle.length > 0) {
        return this.scrollStyle
      }
      else {
        return {
          'height': this.scrollHeight
        }
      }
    },
    getScrollClass: function () {
      if (this.scrollHeight === 'auto') {
        return {
          'col': true
        }
      }
      else {
        return {}
      }
    }
  },
  methods: {
    getHeaderLabel: function () {
      if (this.forceStartOfWeek) {
        let dateReturn = ''
        let bookendDates = this.getForcedWeekBookendDates()
        if (bookendDates.first.month !== bookendDates.last.month) {
          dateReturn += bookendDates.first.toFormat('MMM')
          if (bookendDates.first.year !== bookendDates.last.year) {
            dateReturn += bookendDates.first.toFormat(' yyyy')
          }
          dateReturn += ' - '
        }
        dateReturn += bookendDates.last.toFormat('MMM yyyy')
        return dateReturn
      }
      else {
        return this.makeDT(this.workingDate).toFormat('MMMM yyyy')
      }
    },
    doUpdate: function () {
      this.mountSetDate()
      let payload = this.getMultiDayDisplayDates(
        this.buildWeekDateArray(this.numDays, this.sundayFirstDayOfWeek)
      )
      this.triggerDisplayChange(
        this.eventRef,
        payload
      )
      this.$nextTick(() => {
        this.scrollToFirstDay()
      })
    },
    handleNavMove: function (params) {
      this.moveTimePeriod(params)
      this.$emit(
        this.eventRef + ':navMovePeriod',
        params
      )
      let payload = this.getMultiDayDisplayDates(
        this.buildWeekDateArray()
      )
      payload['moveUnit'] = params.unitType
      payload['moveAmount'] = params.amount
      this.triggerDisplayChange(
        this.eventRef,
        payload
      )
    },
    scrollToElement: function (el) {
      let target = this.getScrollTarget(el)
      let offset = el.offsetTop - el.scrollHeight
      let duration = 0
      this.setScrollPosition(target, offset, duration)
    },
    scrollToFirstDay: function () {
      let thisId = this.getDayHourId(
        this.eventRef,
        this.weekDateArray[0],
        (this.dayDisplayStartHour + 1)
      )
      let thisEl = document.getElementById(thisId)
      this.scrollToElement(thisEl)
    },
    getMultiDayDisplayDates: function (weekDateArray) {
      return {
        startDate: weekDateArray[0].toISODate(),
        endDate: weekDateArray[weekDateArray.length - 1].toISODate(),
        numDays: this.numDays,
        viewType: this.$options.name
      }
    },
    getScrollTarget (el) {
      return el.closest('.scroll,.scroll-y,.overflow-auto') || window
    },
    setScrollPosition: function (scrollTarget, offset, duration) {
      if (duration) {
        this.animScrollTo(scrollTarget, offset, duration)
        return
      }
      this.setScroll(scrollTarget, offset)
    },
    setScroll: function (scrollTarget, offset) {
      if (scrollTarget === window) {
        window.scrollTo(0, offset)
        return
      }
      scrollTarget.scrollTop = offset
    },
    animScrollTo: function (el, to, duration) {
      let pos = this.getScrollPosition(el)
      if (duration <= 0) {
        if (pos !== to) {
          this.setScroll(el, to)
        }
        return
      }
      let _this = this
      requestAnimationFrame(function () {
        let newPos = pos + (to - pos) / Math.max(16, duration) * 16
        _this.setScroll(el, newPos)
        if (newPos !== to) {
          _this.animScrollTo(el, to, duration - 16)
        }
      })
    }
  },
  mounted () {
    debug('Component mounted')
    this.doUpdate()
    this.handlePassedInEvents()
    this.$root.$on(
      this.eventRef + ':navMovePeriod',
      this.handleNavMove
    )
    this.$root.$on(
      this.fullComponentRef + ':moveToSingleDay',
      this.handleDateChange
    )
    this.$root.$on(
      'click-event-' + this.eventRef,
      this.handleEventDetailEvent
    )
    this.$root.$on(
      'update-event-' + this.eventRef,
      this.handleEventUpdate
    )
  },
  watch: {
    startDate: function (newVal, oldVal) {
      this.handleStartChange()
    },
    eventArray: 'getPassedInEventArray',
    parsedEvents: 'getPassedInParsedEvents'
  }
}
