<template>
<modal :show="controller.show">
  <header slot="header">Add Processor</header>
  <div slot="body" v-if="processor">

    <div class="form-group">
      <path-selector label="Output Path" v-model="processor.outputPath"></path-selector>
    </div>

    <div class="form-group">
      <label>Template:</label>      
      <select class="form-control" v-model="processor.templateId">
        <option v-for="t in processor.templates" :key="t.id" :value="t.id">{{t.name}}</option>
      </select>
    </div>
    <div class="text-danger">
      <small><em>{{message}}</em></small>
    </div>

  </div>
  <footer slot="footer" class="text-right">
    <a class="btn btn-sm btn-default" @click="$emit('close')">
      <font-awesome-icon class="text-danger" icon="times" /><span>Cancel</span>
    </a>
    <a class="btn btn-sm btn-default" @click="Ok()">
      <font-awesome-icon class="text-success" icon="check" /><span>Ok</span>
    </a>
  </footer>
</modal>
</template>

<script>
//----------------------------------------
//import swal from 'sweetalert'
import Modal from './Modal'
import PathSelector from './PathSelector'
//----------------------------------------
export default {
  name: "AddJob",
  components:{ Modal, PathSelector },
  props: {
    controller: Object
  },
  data() {
    return {
      processor: null,
      message: null
    }
  },
  computed: {
    show() { return this.controller.show },
  },
  watch: {
    show(val) { 
      if(val) { this.processor = this.controller.processor; }
    }
  },
  methods: {
    Ok() {
      this.message = null;
      if(this.processor.templateId) {          
        let processor = {...this.processor};
        this.$emit('save', processor);
      } else {
        this.message = "Please select a template."
      }
    }
  }
}
</script>