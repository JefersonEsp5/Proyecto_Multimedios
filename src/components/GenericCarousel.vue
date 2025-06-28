<template>
    <div class="generic-carousel-wrapper">
        <div class="carousel-content-wrapper" ref="carouselRef">
            <div class="carousel-items-container" :style="{ transform: `translateX(-${scrollPosition}px)` }">
                <div v-for="(item, index) in items" :key="item.id || index" class="carousel-item"
                    :style="{ minWidth: `${itemWidth}px`, maxWidth: `${itemWidth}px` }">
                    <slot name="item" :item="item" :index="index"></slot>
                </div>
            </div>
        </div>

        <button class="nav-button prev" @click="scroll('prev')" :class="{ 'hidden': scrollPosition <= 0 }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        </button>

        <button class="nav-button next" @click="scroll('next')" :class="{ 'hidden': scrollPosition >= maxScroll }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </button>
    </div>
</template>

<script>
export default {
    name: 'GenericCarousel',
    props: {
       
        items: {
            type: Array,
            required: true
        },
        itemWidth: {
            type: Number,
            default: 200
        },
        scrollAmount: {
            type: Number,
            default: 200 
        }
    },
    data() {
        return {
            scrollPosition: 0,
            maxScroll: 0,
        };
    },
    mounted() {
        this.updateMaxScroll();
      
        window.addEventListener('resize', this.updateMaxScroll);
    },
    beforeUnmount() {
     
        window.removeEventListener('resize', this.updateMaxScroll);
    },
    methods: {
        updateMaxScroll() {
        
            this.$nextTick(() => {
                if (!this.$refs.carouselRef) return;

                const containerWidth = this.$refs.carouselRef.clientWidth;
               
                const contentWidth = this.items.length * this.itemWidth;

                this.maxScroll = Math.max(0, contentWidth - containerWidth);
            });
        },
        scroll(direction) {
            if (direction === 'next') {
                this.scrollPosition = Math.min(this.scrollPosition + this.scrollAmount, this.maxScroll);
            } else {
                this.scrollPosition = Math.max(this.scrollPosition - this.scrollAmount, 0);
            }
        },
    },
    watch: {
        items() {
            this.updateMaxScroll();
        }
    }
};
</script>

<style scoped>
.generic-carousel-wrapper {
    position: relative;
    overflow: hidden;
    padding: 0 40px;
}

.carousel-content-wrapper {
    overflow: hidden;
    width: 100%; 
}

.carousel-items-container {
    display: flex; 
    flex-wrap: nowrap; 
    transition: transform 0.3s ease-in-out;
    align-items: flex-start; 
}


.carousel-item {
    flex-shrink: 0;
    min-width: var(--item-width); 
    max-width: var(--item-width);
    margin-right: 20px;
    box-sizing: border-box;
}

.carousel-item:last-child {
    margin-right: 0;
}


.nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 10;
    transition: background-color 0.3s ease;
}

.nav-button:hover {
    background-color: rgba(0, 0, 0, 0.7);
}

.nav-button.prev {
    left: 0;
}

.nav-button.next {
    right: 0;
}

.nav-button.hidden {
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
}

.nav-button svg {
    width: 20px;
    height: 20px;
}
</style>