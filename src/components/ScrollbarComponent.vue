<template>
    <div class="vc-scrollbar" v-if="enabled">
        <div class="v-scrollbar-box"
             :class="{
                'v-scrollbar-display': scrollbarDisplay,
                'v-scrollbar-interact': scrollbarMouseYPos,
                'v-hide': !display || !scrollbarIsRequired
             }"
             ref="scrollbarBox"
             @mousedown.prevent="onMouseDownScrollbarBox"
             @mousemove.prevent
             @wheel.prevent>
            <div class="v-scrollbar"></div>
        </div>
    </div>
</template>

<script>
import {Options, Vue} from "vue-class-component";
import AnimationFrameProcessor from "../lib/AnimationFrameProcessor";
import TimeoutResetter from "../lib/TimeoutResetter";

const Component = Options;
@Component({
    components: {

    },
    props: {
        display: {
            type: Boolean,
            default: true
        },
        alwaysDisplay: {
            type: Boolean,
            default: false
        },
        scrollElement: HTMLElement,
        reactiveUpdateParams: 0
    },
    watch: {
        reactiveUpdateParams() {
            this.onScrollBox();
        },
        scrollElement(newElement, oldElement) {
            if(this.enabled && this.scrollElement)
            {
                if(oldElement)
                {
                    this.freeElement(oldElement);
                }

                this.initializeElement();
            }
        }
    }
})
export default class ScrollbarComponent extends Vue
{
    enabled = true;

    bodyMode = true;

    scrollbarIsRequired = false;
    scrollbarDisplay = false;
    scrollbarHeight = 80;
    scrollbarMinHeight = 80;

    scrollbarTopOffset = 0;

    scrollbarMouseYPos = null;

    lastScrollTop = -1;
    lastClientHeight = -1;
    lastScrollHeight = -1;

    lastAnimationFrame = null;

    timeoutResetterActivateScrollbar =
        new TimeoutResetter(() => this.scrollbarDisplay = false, 1000);

    updateParamsInTicks()
    {
        this.lastAnimationFrame = requestAnimationFrame(() => {
            this.updateScrollbarParams();
            this.updateParamsInTicks();
        });
    }

    beforeMount()
    {
        //console.log(this.scrollElement)


        if(navigator.platform.indexOf('Win') === -1 &&
            navigator.platform.indexOf('Mac') === -1)
        {
            this.enabled = false;
        }
    }

    async mounted()
    {
        if(!this.enabled)
        {
            return;
        }

        if(this.scrollElement)
        {
            this.initializeElement();
        }

        this.$refs.scrollbarBox.style.height = this.scrollbarHeight + 'px';
    }

    initializeElement()
    {
        this.scrollElement.classList.add("vc-scrollbar-disable-default");

        this.bodyMode = this.scrollElement === document.documentElement;

        if(this.alwaysDisplay)
        {
            this.scrollbarDisplay = true;
        }
        else
        {
            this.scrollbarDisplay = false;
            //this.scrollElement.addEventListener("scroll", this.onScrollBox);
            this.scrollElement.addEventListener("mouseenter", this.onMouseEnterBox);
            this.scrollElement.addEventListener("mousemove", this.onMouseMoveElement);
            this.activateScrollbar();
        }

        this.updateParamsInTicks();
    }

    freeElement(element)
    {
        element.classList.remove("vc-scrollbar-disable-default");

        window.removeEventListener('mousemove', this.onMouseMoveWindowScrollbarChange, false);
        window.removeEventListener('mouseup', this.onMouseUpWindowScrollbarChange, false);

        //this.scrollElement.removeEventListener("scroll", this.onScrollBox);
        element.removeEventListener("mouseenter", this.onMouseEnterBox);
        element.removeEventListener("mousemove", this.onMouseMoveElement);

        if(this.lastAnimationFrame)
        {
            cancelAnimationFrame(this.lastAnimationFrame);
        }

        this.timeoutResetterActivateScrollbar.cancel();
    }

    beforeUnmount()
    {
        if(!this.enabled)
        {
            return;
        }

        if(this.scrollElement)
        {
            this.freeElement(this.scrollElement);
        }

        AnimationFrameProcessor.cancel(this.animationFrameIdHeightChange);
        AnimationFrameProcessor.cancel(this.animationFrameIdScrollbarTopOffset);
    }

    onMouseDownScrollbarBox(event)
    {
        this.scrollbarMouseYPos = event.offsetY;

        window.addEventListener('mousemove', this.onMouseMoveWindowScrollbarChange, false);
        window.addEventListener('mouseup', this.onMouseUpWindowScrollbarChange, false);
    }

    onMouseUpWindowScrollbarChange()
    {
        this.scrollbarMouseYPos = null;

        window.removeEventListener('mousemove', this.onMouseMoveWindowScrollbarChange, false);
        window.removeEventListener('mouseup', this.onMouseUpWindowScrollbarChange, false);
    }

    onMouseMoveWindowScrollbarChange(event)
    {
        this.scrollElement.scrollTo({
            top:
                (this.scrollElement.scrollHeight - this.scrollElement.clientHeight) *
                (event.clientY - (this.scrollElement.getBoundingClientRect().y + (this.bodyMode ? this.scrollElement.scrollTop : 0)) - this.scrollbarMouseYPos) /
                (this.scrollElement.clientHeight - this.scrollbarHeight),
        });
    }

    onMouseMoveElement(event)
    {
        if(Math.abs(event.offsetX - this.scrollElement.getBoundingClientRect().width) < 32)
        {
            this.activateScrollbar();
        }
    }

    onScrollBox()
    {
        if(!this.scrollbarMouseYPos)
        {
            this.updateScrollbarParams();
        }
    }

    updateScrollbarParams()
    {
        if(this.lastClientHeight == this.scrollElement.clientHeight &&
            this.lastScrollHeight == this.scrollElement.scrollHeight &&
            this.lastScrollTop == this.scrollElement.scrollTop)
        {
            return;
        }

        this.lastClientHeight = this.scrollElement.clientHeight;
        this.lastScrollHeight = this.scrollElement.scrollHeight;
        this.lastScrollTop = this.scrollElement.scrollTop;

        if(this.scrollElement.scrollHeight <= this.scrollElement.clientHeight)
        {
            this.scrollbarIsRequired = false;
            return;
        }
        else
        {
            this.scrollbarIsRequired = true;
        }

        let scrollbarHeight = this.scrollElement.clientHeight - (this.scrollElement.scrollHeight - this.scrollElement.clientHeight);
        if(scrollbarHeight < this.scrollbarMinHeight)
        {
            scrollbarHeight = this.scrollbarMinHeight;
        }

        if(scrollbarHeight !== this.scrollbarHeight)
        {
            this.scrollbarHeight = scrollbarHeight;

            AnimationFrameProcessor.cancel(this.animationFrameIdHeightChange);
            this.animationFrameIdHeightChange = AnimationFrameProcessor.request(() => {
                this.$refs.scrollbarBox.style.height = scrollbarHeight + 'px';
            });
        }

        let scrollHeight = this.scrollElement.scrollHeight;
        let scrollTop = this.scrollElement.scrollTop;

        let clientScrollHeight = this.scrollElement.clientHeight - this.scrollbarHeight;

        let percent = scrollTop / (scrollHeight - this.scrollElement.clientHeight);
        let scrollbarTopOffset = percent * clientScrollHeight;

        if(scrollbarTopOffset !== this.scrollbarTopOffset)
        {
            this.scrollbarTopOffset = scrollbarTopOffset;

            AnimationFrameProcessor.cancel(this.animationFrameIdScrollbarTopOffset);
            this.animationFrameIdScrollbarTopOffset = AnimationFrameProcessor.request(() => {
                this.$refs.scrollbarBox.style.transform = `translateY(${scrollbarTopOffset}px)`;
            });
        }

        if(!this.alwaysDisplay)
        {
            this.activateScrollbar();
        }
    }

    onMouseEnterBox()
    {
        this.activateScrollbar();
    }

    activateScrollbar()
    {
        if(this.scrollElement.scrollHeight <= this.scrollElement.clientHeight)
        {
            return;
        }

        if(!this.scrollbarDisplay)
        {
            this.scrollbarDisplay = true;
        }

        this.timeoutResetterActivateScrollbar.run();
    }
}
</script>

<style scoped lang="scss">

    .vc-scrollbar
    {
        position: absolute;
        top: 0;
        right: 0;
        width: 14px;
        height: 100%;
        overflow: hidden;

        pointer-events: none;
        //background-color: lightblue;
    }

    .v-scrollbar
    {
        position: absolute;

        //left: 50%;
        top: 50%;
        transform: translate(0, -50%);
        right: 2px;

        border-radius: 3px;

        width: 6px;
        height: calc(100% - 4px);
        background: #757575;
        border: 1px solid #FFFFFF;

        transition: width 120ms;
    }

    .v-scrollbar-box
    {
        position: absolute;

        right: 0;

        box-sizing: border-box;

        width: 14px;
        transition: opacity 320ms, padding 320ms, width 320ms, height 320ms;
        opacity: 0;

        pointer-events: auto;

        will-change: transform, opacity, height;
        transform: translateY(0);

        &.v-scrollbar-display
        {
            opacity: 0.4;
        }

        &:hover
        {
            opacity: 0.6;

            .v-scrollbar
            {
                width: 10px;
            }
        }

        &:active
        {
            opacity: 0.8;
            transition: none;
        }

        &.v-scrollbar-interact
        {
            opacity: 0.8;

            .v-scrollbar
            {
                width: 10px;
            }
        }

        &.v-hide
        {
            opacity: 0;
            transition-duration: 180ms;
            pointer-events: none;
        }
    }
</style>

<style lang="scss">
    .vc-scrollbar-disable-default
    {
        -ms-overflow-style: none; /* Internet Explorer 10+ */
        scrollbar-width: none; /* Firefox */

        &::-webkit-scrollbar {
            display: none; /* Safari and Chrome */
        }
    }
</style>