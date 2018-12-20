<template>
  <div id="app">
        <header>
            <Toolbar></Toolbar>
        </header>
        <main>
            <router-view/>
        </main>
        <footer>
            
        </footer>
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
    margin: 0px;
}
div#app {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
}
main {
    flex: 1 0 auto;
}
html {
    font-size: 100%;
}
</style>
