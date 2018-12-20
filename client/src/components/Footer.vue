<template>
  <div class="footer">
      <div class="mainFooter">
        <div class="whatisthis">
        <p class="footer--mftt">discordboats.club</p>
            <p>discordboats.club is a constantly growing directory for Discord bots. discordboats.club is not affiliated with, endorsed by, supported by and/or sponsored by Discord in any way, shape or form.</p>
        </div>
        <div style="flex-grow: 1;">
            <p class="footer--mftt">Links</p>
            <div class="flexLinks">
                <router-link v-for="r in linkRoutes" :key="r.path" :to="r.path">{{r.name}}</router-link>
            </div>
        </div>
      </div>
      <div class="cp">
          © 2018 discordboats.club. All rights reserved.
      </div>
  </div>
</template>

<script>
import {toolbarRoutes} from "@/router"
export default {
  name: "footer",
  computed: {
    linkRoutes() {
        return this.$router.options.routes.filter(route => !toolbarRoutes.includes(route.name));
    }
  }
}
</script>

<style scoped>
.footer {
    width: 100vw;
    height: 20vh;
    color: white; 
    padding: 0.5vw 1vh;
    display: flex;
    flex-direction: column;
    /* bg color is in App.vue */
}
.cp {
    text-align: center;
}
.mainFooter {
    display: flex;
    max-width: 100%;
}
.whatisthis {
    display: flex;
    flex-direction: column;
    width: 50%;
}
.footer--mftt {
    /* mftt is main footer title text */
    text-align: center;
    font-size: 1.3em;
}
.flexLinks {
    display: flex;
    flex-direction: column;
    text-align: center;
}
</style>
