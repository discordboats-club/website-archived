<template>
  <div id="app">
        <Toolbar></Toolbar>
        <router-view/>
  </div>
</template>
<script>
import Toolbar from "./components/Toolbar.vue"
export default {
    components: {
        Toolbar
    }
}
</script>

<style>
*,
*::before,
*::after {
    box-sizing: border-box;
}
body {
    margin: 0;
}
html {
    font-size: 100%;
}
</style>