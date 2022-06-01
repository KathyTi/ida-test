<template>
  <div class="input-data-component">
      <div class="title">
          {{title}}
          <div class="requiring-marker" v-if="isDataRequired"></div>
      </div>
      <InputFieldComponent :isTextFieldMultiline="isTextFieldMultiline"
                           :placeholder="textFieldPlaceholder"
                           :isPrice="isPrice"
                           :text="text"
                           @changed="changed">
      </InputFieldComponent>
      <div class="error" v-if="isError">
          Поле является обязательным
      </div>
  </div>
</template>

<script>
import { Options, Vue } from 'vue-class-component';
import InputFieldComponent from './InputFieldComponent';

@Options({
  components: {InputFieldComponent},
  props: {
      index: {type: Number, default: 0},
      title: {type: String, default: ''},
      text: {type: String, default: ''},
      textFieldPlaceholder: {type: String, default: ''},
      isDataRequired: {type: Boolean, default: false},
      isTextFieldMultiline: {type: Boolean, default: false},
      isError: {type: Boolean, default: false},
      isPrice: {type: Boolean, default: false},
  },
  emits: ['changed'],
  watch: {},
})
export default class InputDataComponent extends Vue{

    changed(text){
        this.$emit('changed', text, this.$props.index)
    }

}
</script>

<style scoped lang="scss">

    @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

    .input-data-component{
      display: flex;
      width: 100%;
      flex-direction: column;
      margin-bottom: 16px;
      justify-content: flex-start;
      align-items: flex-start;
      position: relative;

      .title{
          display: flex;
          width: 100%;
          justify-content: flex-start;
          font-family: 'Source Sans Pro';
          font-style: normal;
          font-weight: 400;
          font-size: 10px;
          line-height: 13px;
          letter-spacing: -0.02em;
          color: #49485E;
      }

      .requiring-marker{
          display: flex;
          height: 4px;
          width: 4px;
          background: #FF8484;
          border-radius: 4px;
      }

      .error{
          display: flex;
          position: absolute;
          height: 10px;
          width: 100%;
          font-family: 'Source Sans Pro';
          font-style: normal;
          font-weight: 400;
          font-size: 8px;
          line-height: 10px;
          letter-spacing: -0.02em;
          color: #FF8484;
          bottom: 0;
          transform: translateY(14px);
      }

  }

</style>