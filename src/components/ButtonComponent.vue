<template>
  <div class="button-component" :style="style">{{title}}</div>
</template>

<script>
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {},
  props: {
    title: {type: String, default: ''},
    isActive: {type: Boolean, default: true},
    green: {type: Boolean, default: true},
    white: {type: Boolean, default: true},
  },
  emits: [],
  watch: {},
})
export default class ButtonComponent extends Vue{

  get style(){

    let bgColor
    let color
    let hoverBgColor

    if(this.$props.green && this.$props.isActive){
      bgColor = '#7BAE73'
      color = '#FFFFFF'
      hoverBgColor = '#4B7E43'
    }
    else if(this.$props.white && this.$props.isActive){
      bgColor = '#FFFFFF'
      color = '#B4B4B4'
      hoverBgColor = '#BBBBBB'
    }
    else{
      bgColor = '#EEEEEE'
      color = '#B4B4B4'
      hoverBgColor = '#EEEEEE'
    }

    return{
      '--bg-color': bgColor,
      '--color': color,
      '--hover-bg-color': hoverBgColor ,
    }
  }

}
</script>

<style scoped lang="scss">

  @import url('https://fonts.googleapis.com/css?family=Inter');

  .button-component{
    display: flex;
    height: 36px;
    width: 100%;
    justify-content: center;
    align-items: center;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 15px;
    text-align: center;
    letter-spacing: -0.02em;
    color: var(--color);
    background: var(--bg-color);
    border-radius: 10px;
    padding-inline: 10px 16px;
    box-sizing: border-box;
    cursor: pointer;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none;
    transition: all .4s linear;
    &:hover{
      background: var(--hover-bg-color);
    }
  }


</style>