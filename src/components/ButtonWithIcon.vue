<template>
  <div class="button-with-icon" @click="clicked">
    <slot></slot>
  </div>
</template>

<script>
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {},
  props: {},
  emits: ['clicked'],
  watch: {},
})
export default class ButtonWithIcon extends Vue{

  clicked(){
    this.$emit('clicked')
  }

}
</script>

<style scoped lang="scss">

  .button-with-icon{
    display: flex;
    height: 32px;
    width: 32px;
    justify-content: center;
    align-items: center;
    background-color: #FF8484;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    cursor: pointer;
    transition: opacity 0.6s ease-in;
  }
  //.fade-enter-active, .fade-leave-active {
  //  transition: opacity .5s;
  //}
  //.fade-enter, .fade-leave-to {
  //  opacity: 0;
  //}
  .fade-enter-from{
    opacity: 0;
  }
  .fade-enter-active{
    transition: opacity .3s;
  }
  .fade-enter-to{
    opacity: 1;
  }
  .fade-leave-from{
    opacity: 1;
  }
  .fade-leave-active{
    transition: opacity .3s;
  }
  .fade-leave-to{
    opacity: 0;
  }

</style>