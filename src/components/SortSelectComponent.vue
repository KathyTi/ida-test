<template>
  <div class="sort-select-component">
    <div class="main-button" id="main-button">
      {{currentTitle}}
      <div class="chevron-container">
        <img src="../assets/icons/chevron.svg" id="chevron-icon" alt="Удалить товар" height="8" width="8">
      </div>
    </div>
    <transition name="fade">
      <div class="sub-block" id="sub-block" v-if="state">
        <label class="item" v-for="(item, index) in itemsList" :key="item">
          <input type="checkbox" class="checkbox-original"
                 :checked="itemsStates[index]"
                 @change="change($event, index)"/>
          <span class="checkbox-custom">
        </span>
          <div class="label">
            {{item}}
          </div>

        </label>
      </div>
    </transition>

  </div>

</template>

<script>
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {},
  props: {
      title: {type: String, default: ""},
      state: {type: Boolean, default: false},
      itemsList: {type: Array, default: []},
      itemsStates: {type: Array, default: []},
  },
  emits: ['change-sort', 'click-outside'],
  watch: {
    state(newState){
      let chevron = document.getElementById(`chevron-icon`)
      newState
              ? chevron.style.transform = 'rotate(180deg)'
              : chevron.style.transform = 'rotate(0deg)'
    }
  },
})
export default class SortSelectComponent extends Vue{

  state = false
  checkList = [true, ...new Array(this.$props.itemsList.length-1).fill(false)]

  created(){
    window.addEventListener('mouseup', this.checkIsClickOut)
  }

  mounted(){
    this.checkList = Array(this.$props.itemsList.length).fill(false)
  }

  beforeUnmount(){
    window.removeEventListener('mouseup', this.checkIsClickOut)
  }

  get currentTitle(){
    let title
    this.$props.itemsStates.forEach((i,idx) => {
      //console.log("iii", i)
      if(i){
        title = this.$props.itemsList[idx]
        //console.log("title", title)
      }
    })
    return title
  }

  changeState(){
    this.state = !this.state
  }

  change(e, index){
    this.state = false
    if(this.checkList[index] !== e.target.checked){
      this.checkList = new Array(this.$props.itemsList.length).fill(false)
      this.checkList[index] = e.target.checked
      this.$emit('change-sort', this.checkList)
    }
  }

  checkIsClickOut(element){
    let el = document.getElementById('sub-block')
    if(this.state){
      if(el !== null){
        let left = el.getBoundingClientRect().left
        let right = el.getBoundingClientRect().right
        let top = el.getBoundingClientRect().top
        let bottom = el.getBoundingClientRect().bottom
        let x = element.x
        let y = element.y

        if(x >= left && x <= right && y <= bottom && y >= top){
          //console.log("CHECK_CLICK_IN")
        }
        else{
          this.state = false
        }
      }
    }
    else{
      el = document.getElementById('main-button')
      let left = el?.getBoundingClientRect().left
      let right = el?.getBoundingClientRect().right
      let top = el?.getBoundingClientRect().top
      let bottom = el?.getBoundingClientRect().bottom
      let x = element.x
      let y = element.y

      if(x >= left && x <= right && y <= bottom && y >= top){
        this.state = true
      }
    }

  }

}
</script>

<style scoped lang="scss">

    @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  .sort-select-component{
    position: relative;
    display: flex;
    flex-direction: column;
    .main-button{
      display: flex;
      height: 36px;
      min-width: 122px;
      justify-content: space-between;
      align-items: center;
      background: #FFFEFB;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 15px;
      color: #B4B4B4;
      padding: 10px 16px;
      box-sizing: border-box;
      cursor: pointer;
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Old versions of Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none;
      transform: translateY(-5px);
      .chevron-container{
        height: 12px;
        padding-left: 4px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        #chevron-icon{
          transition: all 0.15s ease-in;
        }
      }
    }
    .sub-block{
      position: absolute;
      display: flex;
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #EAEAEA;
      align-items: center;
      flex-direction: column;
      background: #FFFEFB;
      overflow: hidden;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      transform: translateY(36px);
      z-index: 5;
      border-radius: 4px;
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 15px;
      color: #B4B4B4;
      transition: opacity .1s ease-in;
      .item{
        padding: 0 8px;
        box-sizing: border-box;
        display: flex;
        height: 24px;
        width: 100%;
        justify-content: start;
        align-items: center;
        position: relative;
        cursor: pointer;
        .checkbox-original{
          height: 12px;
          width: 12px;
          position: absolute;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          cursor: pointer;
        }
        .checkbox-custom{
          display: flex;
          height: 12px;
          width: 12px;
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          justify-content: center;
          align-items: center;
          transition: all .25s ease;
          .check-icon{
            position: absolute;
            left: 0px;
            top: 5px;
            transition: all .25s ease;
          }
        }
        .checkbox-original + .checkbox-custom{
          background-color: lightgrey;
          .check-icon{
            position: absolute;
            left: 5px;
            top: 5px;
            opacity: 0;
          }
        }
        .checkbox-original:checked + .checkbox-custom{
          background: radial-gradient(#20FD6B, green);
          box-shadow: 0 0 4px green;
          .check-icon{
            opacity: 1;
          }
        }
        .label{
          display: flex;
          margin-left: 24px;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      }
      .item:hover{
        background-color: #e8e8e8;
        color: #949494;
      }
    }
  }

    .fade-enter-from{
      opacity: 0;
    }
    .fade-enter-active{
      transition: opacity .1s;
    }
    .fade-enter-to{
      opacity: 1;
    }
    .fade-leave-from{
      opacity: 1;
    }
    .fade-leave-active{
      transition: opacity .1s;
    }
    .fade-leave-to{
      opacity: 0;
    }


</style>