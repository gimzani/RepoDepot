<template>
<div class="app">
  <toolbar
    @new-project="newProject($event)"
    @open-project="openProject($event)"
    @close-project="closeProject()"
    @add-job="addJobModal($event)"
    @save-project="saveProject()"
  ></toolbar>

  <project-display
    @remove-job="removeJob($event)"
    @build="buildProject()"
  ></project-display>
  
  <div class="status-bar" v-if="statusMessage">
    <span class="text-info">
      {{statusMessage}}
    </span>    
  </div>

  <add-job :controller="processorModal" @close="processorModal.show=false" @save="addJob"></add-job>
 

</div>
</template>

<script>
//---------------------------------------------------
//import * as tests from './tests/test'
//---------------------------------------------------
import swal from 'sweetalert'
const path = require('path');
import BatchProcessor from './code/batchProcessor'

import Toolbar from './components/Toolbar'
import ProjectDisplay from './components/ProjectDisplay'
import AddJob from './components/AddJob'
//---------------------------------------------------
export default {

  name: "App",

  components: { Toolbar, ProjectDisplay, AddJob },

  data() {
    return {
      processorModal: {
        show: false,
        processor: null
      }
    }
  },

  computed: { 
    project() { return this.$store.state.ProjectStore.project; },
    statusMessage() { return this.$store.state.ProjectStore.statusMessage; }
  },

  mounted() {
    this.$store.dispatch("AppStore/init");
  },

  methods: {

    //-----  project file handlers

    newProject(path) {
      console.log(path);
      this.$store.dispatch("ProjectStore/newProject", path);      
    },

    saveProject() {
      this.$store.dispatch("ProjectStore/saveProject");
    },

    openProject(path) {
      this.$store.dispatch("ProjectStore/loadProject", path);      
    },

    closeProject() {
      this.$store.dispatch("ProjectStore/init");
    },

    //-----  processor handlers
 
    addJobModal(processor) {
      processor.outputPath = path.join(this.project.outputPath, processor.destFolder);
      this.processorModal.show = true;
      this.processorModal.processor = processor;
    },

    addJob(processor) {  // add job from processor
      this.processorModal.show = false;
      let exists = this.project.jobs.find(proc => { return proc.id == processor.id });
      if(!exists) {          
        this.$store.dispatch("ProjectStore/addJob", processor);
      }else {
        console.warn('processor already exists.');
      }
    },

    removeJob(processor) {
      let exists = this.project.jobs.find(p => { return p.id == processor.id });
      if(exists) {          
        this.$store.dispatch("ProjectStore/removeJob", exists);
      }
    },

    //-----  build
    buildProject() {
      const batch = new BatchProcessor();
      batch.build(this.project).then(() => {
        swal("success","build successful","success");
      });
    }
  }
}
</script>