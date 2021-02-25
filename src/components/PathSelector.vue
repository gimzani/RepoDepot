<template>
<div class="input-group input-group-sm">
  <div class="input-group-btn">
    <button class="btn btn-default" title="select input path" @click="getPath()">      
      <font-awesome-icon class="text-info" icon="ellipsis-h" />
    </button>   
  </div> 
    <span class="input-group-addon"><strong>{{label}}</strong>:</span>
    <input class="form-control" :disabled="true" :value="value" />
</div>
</template>

<script>
//----------------------------------------
const { dialog } = require('electron').remote;
//----------------------------------------
export default {
  name: "PathSelector",
  props: {
    value: String ,
    label: { type: String, required: true }
  },
  methods: {
    getPath() {
      dialog.showOpenDialog({ title: 'Select Folder', properties: ['openDirectory'] }).then(res => {
        let path = res.filePaths[0];
        this.$emit('input', path);
      })
    }
  }
}
</script>