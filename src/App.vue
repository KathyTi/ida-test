<template>
    <MainView v-if="isLoaded"></MainView>
    <Preloader v-else></Preloader>
</template>

<script>
  import { Options, Vue } from 'vue-class-component';
  import MainView from './views/MainView';
  import Preloader from './components/Preloader';

  @Options({
    components: {MainView, Preloader},
    props: {},
    emits: [],
    watch: {},
  })
  export default class App extends Vue{
      isLoaded = false
      mounted(){
          setTimeout(() => {
              this.isLoaded = true
          }, 1500)
      }
  }
</script>

<style lang="scss">

    html body{
        margin: 0;
    }

    #app {
        display: flex;
        width: 100vw;
        height: 100vh;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
    }

</style>
