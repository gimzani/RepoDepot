<template>

<section class="toolbar form-inline">

  <span class="btn-group">
    <button class="btn btn-default" @click="newProjectDialog()" title="New Project">
      <font-awesome-icon class="text-warning" icon="file" />
    </button>
    <button class="btn btn-default" @click="openProject()" title="Open Project">
      <font-awesome-icon class="text-warning" icon="folder-open" />
    </button>
    <button class="btn btn-default" @click="closeProject()" title="Close Project" v-if="filePath">
      <font-awesome-icon class="text-danger" icon="times" />
    </button>
  </span>

  <span style="margin:0 20px;" v-if="filePath">    
    <button class="btn btn-default" @click="saveProject()" title="Save Project">
      <font-awesome-icon class="text-success" icon="save" />
    </button>      
  </span>

  <span class="input-group" v-if="outputPath">
    <div class="input-group-btn">
      <button class="btn btn-default" @click="addJob()" title="Add Processor">
        <font-awesome-icon class="text-success" icon="plus" />
      </button>
    </div>
    <select class="form-control" v-model="processorId">
      <option v-for="p in processors" :key="p.id" :value="p.id">{{p.folder}}</option>
    </select>
  </span>

</section>


</template>


<script>
//----------------------------------------
const { dialog } = require('electron').remote;
//----------------------------------------
export default {
  name: "Toolbar",

  data() {
    return {
      processorId: 1
    }
  },

  computed: {
    processors() { return this.$store.state.AppStore.processors; },
    project() { return this.$store.state.ProjectStore.project },
    filePath() { return this.project ? this.project.filePath : null; },
    inputPath() { return this.project ? this.project.inputPath : null; },
    outputPath() { return this.project ? this.project.outputPath : null; }
  },

  methods: {

    newProjectDialog() {
      dialog.showSaveDialog({ title: 'New Repo Depot Project File', filters: [{ name: "Repo Depot Project", extensions:['rpd'] }] }).then(res => {
        let projectFilePath = res.filePath;
        if(projectFilePath) {            
          this.$emit('new-project', projectFilePath);
        }
      })
    },

    openProject() {
      dialog.showOpenDialog({ title: 'Select Project File', properties: ['openFile'], filters: [{ name: "Repo Depot Project", extensions:['rpd'] }]}).then(res => {
        let projectFilePath = res.filePaths[0]; 
        if(projectFilePath) {    
          this.$emit('open-project', projectFilePath);
        }
      })
    },

    closeProject() {
      this.$emit('close-project');
    },

    addJob() {
      let processor = this.processors.find(item => {
        return item.id == this.processorId;
      });
      this.$emit('add-job', processor);
    },

    saveProject() {
      this.$emit('save-project');
    }


  }
}
</script>