<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  computed: {
    invalidRoute () {
      var _this = this
      return !this.$route.matched || this.$route.matched.length === 0;
    }
  },
  mounted () {
    window.onresize = () => {
      this.clientWidthResize()
    }
  },
  methods: {
    clientWidthResize () {
      this.$store.commit('resizeWidth', Number(document.documentElement.clientHeight))
    }
  }
}
</script>
<style lang="scss">
// 红点
.el-badge__content.is-fixed {
  transform: translateY(-50%) translateX(58%)!important;
}
// 样式初始化
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
* {
  padding: 0;
  margin: 0;
}
html,
body {
  width: 100%;
  height: 100%;
}
#app {
  height: 100%;
}

::-webkit-scrollbar {
  // background-color: white!important;
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: #C1C1C1!important;
  border-radius: 8px; 
  height: 5px;
  width: 5px;
}
</style>
