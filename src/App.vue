<template>
  <v-app>
    <v-container>
      <Dilemma/>
    </v-container>
  </v-app>
</template>

<script>
  import Dilemma from './components/Dilemma'

  export default {
    name: 'App',
    components: {
      Dilemma
    },
  }
</script>