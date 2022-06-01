<template>
  <div class="input-field-component">
    <input class="input-field" v-if="!isTextFieldMultiline"
           :value="text"
           @input="change"
           :placeholder="placeholder">
    <textarea class="input-field-multiline" v-else
              :value="text"
              @input="change"
              :placeholder="placeholder">
    </textarea>
  </div>
</template>

<script>
import { Options, Vue } from 'vue-class-component';
import { getPriceFromString, cutZerosAtBegin } from "@/lib/Utils";

@Options({
  components: {},
  props: {
    text: {type: String, default: ''},
    isTextFieldMultiline: {type: Boolean, default: false},
    placeholder: {type: String, default: ''},
    isPrice: {type: Boolean, default: false}
  },
  emits: ['changed'],
  watch: {},
})
export default class InputFieldComponent extends Vue{

  currentText = ''



  change(e){
    if(this.$props.isPrice){
      if(e.target.value[0] === '0'){
        e.target.value = e.target.value.slice(-(e.target.value.length-1))
      }
      this.currentText = getPriceFromString(e.target.value)
    }
    else this.currentText = e.target.value
    this.$emit('changed', this.currentText)
  }

  get style(){
    let flex
    this.$props.isTextFieldMultiline ? flex = 1 : flex = 0.5
    return{
      '--flex': flex
    }
  }

}
</script>

<style scoped lang="scss">

  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  .input-field-component{
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: flex-start;

    .input-field{
      display: flex;
      width: 100%;
      height: 36px;
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 15px;
      outline: none;
      border: none;
      background: #FFFEFB;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      padding-inline: 10px 16px;
      box-sizing: border-box;
      color: black;
      transition: .3s ease-in;

      &::placeholder{
        color: #B4B4B4;
      }

      &:hover{
        box-shadow: inset 0 0 1px 1px rgba(200, 200, 200, 0.3), 0 2px 5px rgba(0, 0, 0, 0.1);
      }

      &:focus{
        box-shadow: inset 0 0 1px 1px rgba(0, 200, 0, 0.5), 0 2px 5px rgba(0, 0, 0, 0.1);
      }

    }

    .input-field-multiline{
      display: flex;
      width: 100%;
      height: 108px;
      min-height: unset;
      max-height: 108px;
      flex: 0 1 auto;
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 15px;
      color: black;
      outline: none;
      border: none;
      background: #FFFEFB;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      padding: 10px 11px;
      box-sizing: border-box;
      transition: .3s ease-in;
      resize: none;

      &::placeholder{
        color: #B4B4B4;
      }

      &:hover{
        box-shadow: inset 0 0 1px 1px rgba(200, 200, 200, 0.3), 0 2px 5px rgba(0, 0, 0, 0.1);
      }

      &:focus{
        box-shadow: inset 0 0 1px 1px rgba(0, 200, 0, 0.5), 0 2px 5px rgba(0, 0, 0, 0.1);
      }

    }

  }

</style>