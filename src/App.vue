<template>
<div class="app">
  <toolbar
    @new-project="newProject($event)"
    @open-project="openProject($event)"
    @close-project="closeProject()"
    @new-job="openJobModal()"
    @save-project="saveProject()"
  ></toolbar>

  <project-display
    @remove-job="removeJob($event)"
    @build="buildProject()"
    @edit-job="openJobModal($event)"
    @run-job="runJob($event)"
  ></project-display>
  
  <div class="status-bar" v-if="statusMessage">
    <span class="text-info">
      {{statusMessage}}
    </span>    
  </div>

  <job-new-edit :controller="jobModal" @close="jobModal.show=false" @save="saveJob"></job-new-edit>
 

</div>
</template>

<script>
//---------------------------------------------------
//import * as tests from './tests/test'
//---------------------------------------------------
import swal from 'sweetalert'
import BatchProcessor from './code/batchProcessor'

import Toolbar from './components/Toolbar'
import ProjectDisplay from './components/ProjectDisplay'
import JobNewEdit from './components/JobNewEdit'
//---------------------------------------------------
export default {

  name: "App",

  components: { Toolbar, ProjectDisplay, JobNewEdit },

  data() {
    return {
      jobModal: {
        show: false,
        mode: 'New',
        payload: null
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
 
    openJobModal(job) {
      this.jobModal.show = true;
      this.jobModal.mode = job ? 'Edit' : 'New';
      this.jobModal.payload = job;
    },

    saveJob(job) {
      this.jobModal.show = false;
      let exists = this.project.jobs.find(j => j.id == job.id);
      if(!exists) {          
        this.$store.dispatch("ProjectStore/addJob", job);
      }else {
        this.$store.dispatch("ProjectStore/updateJob", job);
      }
    },

    removeJob(job) {
      let exists = this.project.jobs.find(j => { return j.id == job.id });
      if(exists) {          
        this.$store.dispatch("ProjectStore/removeJob", exists);
      }
    },

    //-----  build
    buildProject() {
      const batch = new BatchProcessor(this.project);
      batch.build().then(() => {
        swal("success","build successful","success");
      });
    },

    runJob(job) {
      const batch = new BatchProcessor(this.project);
      console.log(batch);
      batch.processJob(job).then(() => {
        swal("success","job run successful","success");
      });
    }

  }
}
</script>