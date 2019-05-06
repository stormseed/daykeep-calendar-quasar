<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="glossy">
      <q-toolbar>

        <q-toolbar-title>
          Quasar Calendar v{{ calendarVersion }}
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
  import {
    openURL,
    QLayout,
    QHeader,
    QPageContainer,
    QToolbar,
    QToolbarTitle
  } from 'quasar'
  const pckg = require('../../package.json')
  export default {
    name: 'LayoutDefault',
    components: {
      QLayout,
      QHeader,
      QPageContainer,
      QToolbar,
      QToolbarTitle
    },
    data () {
      return {
        leftDrawerOpen: false
      }
    },
    computed: {
      calendarVersion: function () {
        return pckg.version
      }
    },
    methods: {
      openURL
    }
  }
</script>

<style>
</style>
