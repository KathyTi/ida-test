<template>
  <div class="main-header">
    <slot name="title"></slot>
    <slot name="button"></slot>
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
export default class MainHeader extends Vue{

}
</script>

<style scoped lang="scss">

  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  .main-header{
    display: flex;
    width: 100%;
    min-height: 51px;
    justify-content: space-between;
    align-items: center;
    font-family: 'Source Sans Pro';
    font-style: normal;
    font-weight: 600;
    font-size: 28px;
    line-height: 35px;
    color: #3F3F3F;
    padding-right: 8px;
    box-sizing: border-box;
  }

</style>