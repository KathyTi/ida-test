<template>
  <div class="add-new-product-component">
    <InputDataComponent :index="0"
                        @changed="changed"
                        title="Наименование товара"
                        textFieldPlaceholder="Введите наименование товара"
                        :text="textFieldsData[0]"
                        :isError="isFieldsError[0]"
                        isDataRequired></InputDataComponent>
    <InputDataComponent :index="1"
                        @changed="changed"
                        title="Описание товара"
                        textFieldPlaceholder="Введите описание товара"
                        :text="textFieldsData[1]"
                        isTextFieldMultiline></InputDataComponent>
    <InputDataComponent :index="2"
                        @changed="changed"
                        title="Ссылка на изображение товара"
                        textFieldPlaceholder="Введите ссылку"
                        :text="textFieldsData[2]"
                        :isError="isFieldsError[2]"
                        isDataRequired></InputDataComponent>
    <InputDataComponent :index="3"
                        title="Цена товара"
                        @changed="changed"
                        textFieldPlaceholder="Введите цену"
                        :text="textFieldsData[3]"
                        :isError="isFieldsError[3]"
                        isPrice
                        isDataRequired></InputDataComponent>
    <ButtonComponent title="Добавить товар" :isActive="isConfirmButtonActive" @click="clicked"></ButtonComponent>
  </div>
</template>

<script>
import { Options, Vue } from 'vue-class-component';
import InputDataComponent from './InputDataComponent';
import ButtonComponent from './ButtonComponent';

@Options({
  components: {InputDataComponent,ButtonComponent},
  props: {},
  emits: ['clicked'],
  watch: {},
})
export default class AddNewProductComponent extends Vue{
  isConfirmButtonActive = false
  textFieldsData = new Array(4).fill('')
  isFieldsError = new Array(4).fill(false)

  changed(text, index){
    this.textFieldsData[index] = text
    if(this.textFieldsData[0].length === 0
            || this.textFieldsData[2].length === 0
            || this.textFieldsData[3].length === 0){
      this.textFieldsData.forEach((t,idx) => {
        if(this.textFieldsData[idx].length > 0)
          this.isFieldsError[idx] = false
      })
      this.isConfirmButtonActive = false
    }
    else{
      this.isConfirmButtonActive = true
      this.isFieldsError = new Array(4).fill(false)
    }
    console.log("data",this.textFieldsData)
  }

  clicked(){
    if(this.isConfirmButtonActive){
      let newCard = {
        desc: this.textFieldsData[1],
        id: 0,
        img: this.textFieldsData[2],
        name: this.textFieldsData[0],
        price: this.textFieldsData[3],
      }
      this.isFieldsError = new Array(4).fill(false)
      this.textFieldsData = new Array(4).fill('')
      this.isConfirmButtonActive = false
      this.$emit('clicked', newCard)
    }
    else{

      this.textFieldsData.forEach((d,idx) => {
        if(idx !== 1){
          d.length === 0
            ? this.isFieldsError[idx] = true
            : this.isFieldsError[idx] = false
        }
      })
    }
  }

}
</script>

<style scoped lang="scss">

  .add-new-product-component{
    position: fixed;
    display: flex;
    width: 332px;
    background: #FFFEFB;
    box-shadow: 0 20px 30px rgba(0, 0, 0, 0.04), 0 6px 10px rgba(0, 0, 0, 0.02);
    border-radius: 4px;
    padding: 24px;
    flex-direction: column;
    box-sizing: border-box;
    justify-content: space-between;
  }
  @media (max-width: 768px){

    .add-new-product-component{
      width: 100%;
    }

  }

</style>