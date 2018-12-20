<template>
  <div class="toolbar">
        <ui-toolbar
            brand="discordboats.club"
            text-color="white"
            :title="this.$router.currentRoute.name"
            type="colored">
            <!-- Remove any stupid navigation icon that's meant for mobile on PC -->
            <div slot="icon"></div>
            <div slot="actions" id="toolbar--actions">
                 <ui-button
                  type="secondary"
                  style="color: white;"
                   v-for="route of toolbarRoutes"
                    :key="route.name"
                    :disabled="shouldDisableRoute(route)"
                    @click="$router.replace(route.path)"
                    >{{route.name}}</ui-button>
            </div>
        </ui-toolbar>
  </div>
</template>
<script>
import {toolbarRoutes} from "@/router"
export default {
    computed: {
        toolbarRoutes() {
            return this.$router.options.routes.filter(route => toolbarRoutes.includes(route.name))
        }
    },
    methods: {
        shouldDisableRoute(route) {
            return this.$route.path == route.path;
        }
    }
}
</script>

<style scoped>
.toolbar--actions {
    display: flex;
}
</style>