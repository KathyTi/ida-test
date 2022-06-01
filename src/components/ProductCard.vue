<template>
  <div class="product-card" id="card"
        @mouseenter="isCardHovered = true"
        @mouseleave="isCardHovered = false">
      <img class="card-img" :src="card.img">
      <div class="card-details">
          <div class="card-name">
              {{card.name}}
          </div>
          <div class="card-desc">
              {{card.desc}}
          </div>
          <div class="card-price">
              {{splittedPrice}} руб.
          </div>
      </div>
      <transition name="fade">
          <ButtonWithIcon v-if="!isItMobile ? isCardHovered : true"
                          style="position: absolute; display: flex; top: 0; right: 0; z-index: 2; transform: translate(8px, -8px)"
                          @clicked="removeClicked">
              <img src="../assets/icons/delete.svg" alt="Удалить товар" height="16" width="16">
          </ButtonWithIcon>
      </transition>
  </div>
</template>

<script>
import { Options, Vue } from 'vue-class-component';
import {getPriceFromString} from "@/lib/Utils";
import ButtonWithIcon from './ButtonWithIcon';

@Options({
  components: {ButtonWithIcon},
  props: {
      card: {type: Object, default: {}},
  },
  emits: ['removeClicked'],
  watch: {},
})
export default class ProductCard extends Vue{

    isCardHovered = false
    isItMobile = false

    mounted(){
        let isMobile = /Mobi/i.test(window.navigator.userAgent)
        isMobile
            ? this.isItMobile = true
            : this.isItMobile = false
    }

    removeClicked(){
        this.$emit('removeClicked', this.$props.card)
    }

    get splittedPrice(){
        return getPriceFromString(this.$props.card.price)
    }

}
</script>

<style scoped lang="scss">

    .product-card{
        display: flex;
        position: relative;
        width: 100%;
        height: 423px;
        background-color: #FFFEFB;
        box-shadow: 0 20px 30px rgba(0, 0, 0, 0.04), 0 6px 10px rgba(0, 0, 0, 0.02);
        border-radius: 4px;
        flex-direction: column;
        align-items: flex-start;

        .card-img{
            display: flex;
            width: 100%;
            min-height: 200px;
            left: 380px;
            top: 83px;
            border-radius: 4px 4px 0 0;
            object-fit: contain;
        }

        .card-details{
            display: flex;
            width: 100%;
            height: 100%;
            padding: 16px 16px 24px 16px;
            flex-direction: column;
            box-sizing: border-box;
            overflow: hidden;

            .card-name{
                display: flex;
                width: 100%;
                font-family: 'Source Sans Pro';
                font-style: normal;
                font-weight: 600;
                font-size: 20px;
                line-height: 25px;
                color: #3F3F3F;
            }

            .card-desc{
                display: inline-block;
                width: 100%;
                height: 100%;
                font-family: 'Source Sans Pro';
                font-style: normal;
                font-weight: 400;
                font-size: 16px;
                line-height: 20px;
                color: #3F3F3F;
                text-align: left;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: pre-wrap;
            }

            .card-price{
                display: flex;
                width: 100%;
                height: 30px;
                font-family: 'Source Sans Pro';
                font-style: normal;
                font-weight: 600;
                font-size: 24px;
                line-height: 30px;
                color: #3F3F3F;
            }

        }

        &:hover{
            cursor: url(../../public/img/icons/cursor.svg), auto;
        }

    }

</style>