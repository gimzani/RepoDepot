<template>
<section class="project-display" v-if="project">
  
  <!-- PROJECT -->
  <div class="float-right" v-if="canBuild">
    <button class="btn btn-default" title="Build Project" @click="$emit('build')">
        <font-awesome-icon class="text-success" icon="play" />
        <span style="margin-left:8px">Build</span>
    </button>
  </div>

  <h3>Project: {{ project.filePath | filenameExtension }}</h3>

  <div class="row project-paths">
    <div class="col">
      <path-selector label="Input Path" :value="project.inputPath" @input="setInputPath"></path-selector>
    </div>
    <div class="col">
      <path-selector label="Output Path" :value="project.outputPath" @input="setOutputPath"></path-selector>
    </div>
  </div>  

  <!-- JOBS -->
  <h4>Jobs: {{processorCount}} </h4>
  <div>
    <job-display 
      :job="p" v-for="(p, index) in project.jobs" 
      :key="index"
      @remove-job="$emit('remove-job', $event)"
      @edit-job="$emit('edit-job', $event)"
      @run-job="$emit('run-job', $event)"
    ></job-display>
  </div>

</section>
</template>


<script>
//----------------------------------------
import PathSelector from './PathSelector'
import JobDisplay from './JobDisplay'
//----------------------------------------
export default {
  name: "ProjectDisplay",
  
  components: { PathSelector, JobDisplay },

  computed: {
    project() { return this.$store.state.ProjectStore.project },
    processorCount() { return this.project && this.project.jobs ? this.project.jobs.length : 0 },
    canBuild() {
      return (this.project.inputPath && this.project.outputPath && this.project.jobs.length > 0);
    }
  },
  methods: {

    setInputPath(path) {
      this.$store.dispatch('ProjectStore/updateProject', {prop: 'inputPath', val: path });   
    }, 

    setOutputPath(path) {
      this.$store.dispatch('ProjectStore/updateProject', {prop: 'outputPath', val: path });  
    },

    setProp(prop, val) {      
      this.$store.dispatch('ProjectStore/updateProp', { prop, val });  // deprecating     
    },

    //------

  }
}
</script>