<template>
  <div class="wrapper">
    <div class="main-view" ref="scroll_wrapper_ref">
      <div class="content-wrapper">
        <MainHeader>
          <template v-slot:title>
            Добавление товара
          </template>
          <template v-slot:button>
            <SortSelectComponent :itemsList="sortTypes"
                                 :itemsStates="sortStates"
                                 @changeSort="changeSortType"></SortSelectComponent>
          </template>
        </MainHeader>
        <div class="main-area-wrapper">
          <div class="adding-product-area">
            <AddNewProductComponent @clicked="addNewCard"></AddNewProductComponent>
          </div>
          <div class="products-catalog-wrapper">
            <div class="products-catalog">
              <transition-group name="list">
                <ProductCard v-for="card in products"
                             :ref="`card_ref_${card.id}`"
                             :key="card.id"
                             :card="card"
                             @removeClicked="removeCard"
                ></ProductCard>
              </transition-group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ScrollbarComponent v-if="scroll_wrapper_ref" :scroll-element="scroll_wrapper_ref"></ScrollbarComponent>
  </div>
</template>

<script>
import { Options, Vue } from 'vue-class-component';
import AddNewProductComponent from '../components/AddNewProductComponent';
import ProductCard from '../components/ProductCard';
import ScrollbarComponent from '../components/ScrollbarComponent';
import SortSelectComponent from '../components/SortSelectComponent';
import MainHeader from '../components/MainHeader';
import DBController from "../lib/IndexedDB";


@Options({
  components: {MainHeader, AddNewProductComponent, ProductCard, ScrollbarComponent, SortSelectComponent},
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

  addresses = ["https://ipac67.ru/image/cache/data/product/iPhone/iPhone-13-pro/green13pro-700x700.jpg",
    "https://ipac67.ru/image/cache/data/product/xiaomi/fd172cd0c6e5797cd3662bc88f8a8699-700x700.jpg",
    "https://ipac67.ru/image/cache/data/product/homepod/homebl-700x700.png",
    "https://ipac67.ru/image/cache/data/product/Charge/zashhitnoe-steklo-apple-ipad-air-2019-700x700.jpg",
    "https://ipac67.ru/image/cache/data/product/ipad/pencil21-700x700.jpg",
    "https://ipac67.ru/image/cache/data/product/xiaomi/70mai_dash_cam_a400_seriy4-800x800-1-700x700.jpg",
    "https://ipac67.ru/image/cache/data/product/xiaomi/EDA001113501A-700x700.jpg",
    "https://ipac67.ru/image/cache/data/li/aks/17340663-700x700.jpeg",
    "https://ipac67.ru/image/cache/data/product/iPhone/airtag/1111-700x700.jpg",
    "https://ipac67.ru/image/cache/data/product/ipad/aks/%20Smart%20Keyboard_1-700x700.jpeg",
    "https://ipac67.ru/image/cache/data/li/default/%20Xiaomi%20-700x700.png"]

  async mounted(){
    this.products = await this.db.getAll()

    // Просто костыль чтобы не набивать лист вручную.
    // Работает при пустом списке на загрузке.
    // Обновление страницы после удаления всех элементов снова сгенерирует этот лист.
    if(this.products.length === 0){
      for(let i = 0; i < this.addresses.length; i++){
        console.log('i', new Date().getTime())
        let newCard = {
          desc: "Описание товара по умолчанию должно содержать не менее пяти слов",
          id: i,
          img: this.addresses[i],
          name: `Имя товара ${1 + Math.floor(1 + Math.random() * 100)}`,
          price: Math.floor(10 + Math.random() * 200000).toString(),
        }
        await this.addNewCard(newCard)
      }
      this.products = await this.db.getAll()
      this.sort()
    }
  }

  async addNewCard(card){
    const newCard = card
    newCard.id = new Date().getTime()
    await this.db.addItem(newCard)
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

  .wrapper{
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;

    .main-view{
      height: 100%;
      width: 100%;
      padding: 0 32px 0 32px;
      box-sizing: border-box;
      background-color: #FAF9F7;
      flex-direction: column;
      display: block;
      position: static;
      flex: 1;
      overflow-y: auto;

      .content-wrapper{
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;
        padding-top: 32px;
        box-sizing: border-box;

        .main-area-wrapper{
          display: flex;
          width: 100%;
          height: 100%;

          .adding-product-area{
            display: flex;
            min-width: 332px;
            height: 100%;
            justify-content: flex-start;
            align-items: flex-start;
          }
          @media (max-width: 768px){

            .adding-product-area{
              width: 100%;
            }

          }

          .products-catalog-wrapper{
            height: 100%;
            width: 100%;
            overflow-y: visible;

            .products-catalog{
              display: grid;
              height: 100%;
              width: 100%;
              padding-left: 16px;
              padding-right: 8px;
              box-sizing: border-box;
              grid-template-columns: repeat(4, 1fr);
              column-gap: 16px;
              row-gap: 16px;
            }
            @media (max-width: 1600px){

              .products-catalog{
                grid-template-columns: repeat(3, 1fr);
              }

            }
            @media (max-width: 1300px){

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

    }
    @media (max-width: 768px){

      .main-view{
        flex-direction: column;

        .adding-product-area{
          margin-bottom: 24px;
        }

      }

    }
  }


  .list-move{
    transition: transform 0.8s ease;
  }
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

</style>