<template>
  <div class="preloader">
      <div class="preloader-content">
          <div class="logo">
              <img src="../../public/img/ida-project-logo.png" id="chevron-icon" alt="Удалить товар" height="44" width="90">
          </div>
          <div class="loading">
              <span></span>
              <span></span>
              <span></span>
          </div>
      </div>
  </div>
</template>

<script>
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {},
  props: {},
  emits: [],
  watch: {},
})
export default class Preloader extends Vue{

}
</script>

<style scoped lang="scss">

    .preloader{
        display: flex;
        width: 100%;
        height: 100%;
        background-color: black;
        justify-content: center;
        align-items: center;

        .preloader-content{
            display: flex;
            flex-direction: column;
            align-items: center;

            .logo{
                display: flex;
                object-fit: contain;
            }

            .loading{
                width: 20px;
                height: 15px;
                justify-content: space-between;
                align-items: center;
                display: flex;

                span{
                    width: 4px;
                    height: 4px;
                    background-color: white;
                    border-radius: 50%;
                    animation-name: dots;
                    animation-duration: 1s;
                    animation-iteration-count: infinite;
                    animation-timing-function: ease-in-out;
                }

            }

            .loading span:nth-child(2){
                animation-delay: .3333333s;
            }
            .loading span:nth-child(3){
                animation-delay: .6666666s;
            }

            @keyframes dots {
                50%{
                    opacity: .2;

                }
            }

        }

    }

</style>