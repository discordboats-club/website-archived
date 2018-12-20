<template>
  <div class="footer">
      <div class="whatisthis">
          <p class="footer--name">discordboats.club</p>
          <p>discordboats.club is a constantly growing directory for Discord bots. discordboats.club is not affiliated with, endorsed by, supported by and/or sponsored by Discord in any way, shape or form.</p>
      </div>
      <div class="paddingBoy"></div>
      <div>links whatever here</div>
  </div>
</template>

<script>
export default {
  name: "footer",
}
</script>

<style scoped>
.footer {
    width: 100vw;
    height: 17vh;
    color: white; 
    padding: 0.5vw 1vh;
    display: flex;
    /* bg color is in App.vue */
}
.whatisthis {
    display: flex;
    flex-direction: column;
    width: 50%;
}
.footer--name {
    text-align: center;
    font-size: 1.3em;
}
.paddingBoy {
    width: 1vw;
}
</style>
