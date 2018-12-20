<template>
  <div id="app">
        <header>
            <Toolbar></Toolbar>
        </header>
        <main>
            <router-view/>
        </main>
        <footer>
            <Footer></Footer>
        </footer>
  </div>
</template>
<script>
import Toolbar from "./components/Toolbar.vue"
import Footer from "./components/Footer.vue"

export default {
    components: {
        Toolbar,
        Footer
    }
}
</script>

<style>
.ui-toolbar, .footer {
    background: #212121 !important;
}


*,
*::before,
*::after {
    box-sizing: border-box;
}
body {
    font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    margin: 0px;
    background: #303030;
    color: white;
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
