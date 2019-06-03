<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>

        <q-toolbar-title>
          {{ calendarAppName }} {{ calendarVersion }}
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
      calendarVersion: () => {
        return 'v' + pckg.version
      },
      calendarAppName: () => {
        return pckg.productName
      }
    },
    methods: {
      openURL
    }
  }
</script>

<style>
</style>
