<template>  
  <transition name="modal">
    <div class="modal-mask" @click="closeOnMaskClick ? close() : null" v-show="show">
      <div class="modal-wrapper">
        <div class="modal-container" :class="this.size" @click.stop>
          <div class="header">
            <slot name="header"></slot>
          </div>
          <div class="body">
            <slot name="body"></slot>
          </div>
          <div class="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
//--------------------------------------------
//  Base Modal - defines styles and behaviors
//--------------------------------------------
export default {
  name: "Modal",
  props: {
    show: {
      type: Boolean,
      required: true
    },
    size: {
      type: String,
      default: "modal-md"
    },
    closeOnMaskClick:{
      type: Boolean,
      default:false
    },
    closeOnEscapeKey:{
      type: Boolean,
      default:true
    }
  },
  methods: {
    close: function() {
      this.$emit('close');
    }
  },
  mounted: function() {
    if (this.closeOnEscapeKey == true) {
      document.addEventListener("keydown", e => {
        if (this.show && e.keyCode == 27) {
          this.close();
        }
      });
    }
  }
};
//--------------------------------------------
</script>