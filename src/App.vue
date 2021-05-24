// #3AAFA9
// #17252A
<template>
  <v-app style="background-color: #feffff">
    <div class="inapp">
      <v-app-bar app dark color="#2B7A78">
        <v-spacer></v-spacer>
        <h2>北大宿舍訪客登記</h2>
        <v-spacer></v-spacer>
      </v-app-bar>

      <v-main>
        <div id="router" v-bind:style="{ minHeight: Height + 'px' }">
          <router-view />
        </div>
      </v-main>
    </div>

    <v-footer padless class="font-weight-medium" color="#DEF2F1">
      <v-col class="text-center" cols="12" style="font-size: 14px">
        &copy; 2021 Copyright
        <a href="https://littlechintw.github.io">littlechin.tw</a>. All rights
        reserved.
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';
export default {
  name: "App",
  components: {
    // HelloWorld,
  },
  data: () => ({
    Height: 0,
  }),
  mounted() {
    this.Height = document.documentElement.clientHeight - 100;
    window.onresize = () => {
      this.Height = document.documentElement.clientHeight - 100;
    };
  },
};
</script>

<style>
.inapp {
  width: 80%;
  margin-left: 10%;
}
#app {
  font-family: Noto Sans SC;
}
</style>