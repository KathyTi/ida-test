<template>
  <div class="main-view">
    <div class="adding-product-area">
      <div class="header">
        Добавление товара
      </div>
      <AddNewProductComponent @clicked="addNewCard"></AddNewProductComponent>
    </div>
    <div class="products-area">
      <div class="header">
        <SortSelectComponent :itemsList="sortTypes"
                             :itemsStates="sortStates"
                             @changeSort="changeSortType"></SortSelectComponent>
      </div>
      <div class="products-catalog-wrapper">
        <div class="products-catalog" ref="scroll_wrapper_ref">
          <transition-group name="list">
            <ProductCard v-for="card in products"
                         :ref="`card_ref_${card.id}`"
                         :key="card.id"
                         :card="card"
                         @removeClicked="removeCard"
            ></ProductCard>
          </transition-group>
        </div>
        <ScrollbarComponent v-if="scroll_wrapper_ref" :scroll-element="scroll_wrapper_ref"></ScrollbarComponent>
      </div>

    </div>
  </div>
</template>

<script>
import { Options, Vue } from 'vue-class-component';
import AddNewProductComponent from '../components/AddNewProductComponent';
import ProductCard from '../components/ProductCard';
import ScrollbarComponent from '../components/ScrollbarComponent';
import SortSelectComponent from '../components/SortSelectComponent';
import api from '../lib/IndexedDB';
import DBController from "../lib/IndexedDB";


@Options({
  components: {AddNewProductComponent, ProductCard, ScrollbarComponent, SortSelectComponent},
  props: {},
  emits: [],
  watch: {},
})
export default class MainView extends Vue{

  scroll_wrapper_ref = null

  db = new DBController()

  sortTypes = ['По умолчанию', 'По имени', 'Дешевле', 'Дороже']
  sortStates = [true, false, false, false]

  products = null

  async mounted(){
    this.products = await this.db.getAll()
  }

  async addNewCard(card){
    const newCard = card
    newCard.id = new Date().getTime()
    //this.products.push(newCard)
    await this.db.addItem(newCard)
    //this.products = null
    this.products = await this.db.getAll()
    this.sort()
  }

  async removeCard(card){
    await this.db.removeItem(card)
    this.products = await this.db.getAll()
    this.sort()
  }

  changeSortType(newStates){
    this.sortStates = newStates
    this.sort()
  }

  sort(){
    this.sortStates.forEach((state, index) => {
      if(state){
        switch(index){
          case 0: this.products.sort((a, b) => a.id - b.id); break;
          case 1: this.products = this.products.sort(function(a, b){
            return a.name.localeCompare(b.name)
          }); break;
          case 2: this.products.sort((a, b) => parseInt(a.price.replace(/ /g,'')) - parseInt(b.price.replace(/ /g,''))); break;
          case 3: this.products.sort((a, b) => parseInt(b.price.replace(/ /g,'')) - parseInt(a.price.replace(/ /g,''))); break;
        }
      }
    })
  }

}
</script>

<style scoped lang="scss">

  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  .main-view{
    display: flex;
    height: 100%;
    width: 100%;
    padding: 32px 32px 0 32px;
    box-sizing: border-box;
    background-color: #FAF9F7;
    flex-direction: row;

    .adding-product-area{
      display: flex;
      width: 332px;
      height: 100%;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      margin-right: 16px;

      .header{
        display: flex;
        width: 100%;
        height: 51px;
        justify-content: flex-start;
        font-family: 'Source Sans Pro';
        font-style: normal;
        font-weight: 600;
        font-size: 28px;
        line-height: 35px;
        color: #3F3F3F;
        padding-right: 8px;
        box-sizing: border-box;
      }

    }
    @media (max-width: 768px){
      .adding-product-area{
        width: 100%;
      }
    }

    .products-area{
      display: flex;
      width: 100%;
      height: 100%;
      //background-color: lightseagreen;
      flex-direction: column;

      .header{
        display: flex;
        width: 100%;
        min-height: 51px;
        justify-content: flex-end;
      }

      .products-catalog-wrapper{
        //display: block;
        //position: static;
        //overflow-y: auto;
        //overflow-x: hidden;
        overflow: hidden;
        position: relative;
        height: 100%;
        width: 100%;
        display: block;
        .products-catalog{
          padding-top: 8px;
          padding-right: 8px;
          box-sizing: border-box;
          //position: relative;
          position: static;
          flex: 1;
          overflow-y: auto;
          //overflow-y: scroll;
          //display: block;
          //overflow-y: auto;
          overflow-x: hidden;
          //position: fixed;
          display: grid;
          height: 100%;
          width: 100%;
          left: 0;
          top: 0;
          //background-color: green;
          grid-template-columns: repeat(4, 1fr);
          column-gap: 16px;
          row-gap: 16px;
          //transition: all .8s ease;

        }
        @media (max-width: 1500px){
          .products-catalog{
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 1200px){
          .products-catalog{
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 992px){
          .products-catalog{
            grid-template-columns: repeat(1, 1fr);
          }
        }
      }

    }

  }
  @media (max-width: 768px){
    .main-view{
      flex-direction: column;
      .adding-product-area{
        margin-bottom: 24px;
      }
    }
  }

  .list-move,
  .list-enter-active,
  .list-leave-active{
    transition: all .5s ease;
  }
  .list-enter,
  .list-enter-from,
  .list-leave-to{
    opacity: 0;
    transform: translateY(50px);
  }
  .list-leave-active{
    position: absolute;
  }

</style>