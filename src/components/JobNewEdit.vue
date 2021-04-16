<template>
<modal :show="controller.show" size="modal-lg">
  <header slot="header">{{controller.mode}} Job</header>
  <div slot="body" v-if="job">

    <div class="form-group">
      <path-selector label="Output Path" v-model="job.outputPath"></path-selector>
    </div>

    <div class="form-group">
      <label>Load Template:</label>      
      <select class="form-control" v-model="job.templateId" @change="templateSelected()">
        <option :value="null">- please select -</option>
        <option v-for="t in processor.templates" :key="t.id" :value="t.id">{{t.name}}</option>
      </select>
    </div>

    <!-- Template Editor -->
    <div v-if="job.content">      
      <codemirror v-model="job.content" :options="cmOptions"></codemirror>
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
import Job from '../store/models/Job'
import * as fileIO from '../code/fileIO'
import { codemirror } from 'vue-codemirror'
const path = require('path');
const { app } = require('electron').remote;
//----------------------------------------
export default {
  name: "JobNewEdit",
  components:{ Modal, PathSelector, codemirror },
  props: {
    controller: Object
  },
  data() {
    return {
      job: null,
      message: null,
      template: null,
      cmOptions: {
        tabSize: 4,
        mode: 'text/x-csharp',
        theme: 'moxer',
        lineNumbers: true,
        line: true
      }
    }
  },
  computed: {
    project() { return this.$store.state.ProjectStore.project },
    processor() { return this.$store.state.AppStore.processor },
    show() { return this.controller.show },
  },
  watch: {
    show(val) { 
      if(val) {         
        this.setContent();
      }
    }
  },
  methods: {

    async setContent() {
      this.job = new Job(this.controller.payload);
      if(!this.controller.payload) {
        this.job.outputPath = path.join(this.project.outputPath, this.processor.destFolder);
        this.job.processorId = this.processor.id;
        this.job.name = this.processor.folder;
        this.job.type = this.processor.type;
        this.job.multifile = this.processor.multifile;
        this.job.fileAppend = this.processor.fileAppend;
        this.templateSelected();
      } else {
        await this.$store.dispatch('AppStore/setProcessorById', this.job.processorId);
        this.template = this.processor.templates.find(t => t.id === this.job.templateId);
      }
    },

    templateSelected() {
      this.template = this.processor.templates.find(t => t.id === this.job.templateId);
      if(this.template) {
        let content = fileIO.getTemplateContent(app.getAppPath(), this.processor.folder, this.template.file);  
        this.job.content = content;        
      }
    },

    Ok() {
      this.message = null;
      if(this.job.content) {

        let companions = [];
        this.template.companions.forEach(companionFile => {
          companions.push({
            op: companionFile.op,
            src: companionFile.src,
            dest: companionFile.dest,
            content: fileIO.getTemplateContent(app.getAppPath(), this.processor.folder, companionFile.src)
          });
        });

        this.job.companions = companions;

        this.$emit('save', this.job);
      } else {
        this.message = "Please select a template."
      }
    }
  }
}
</script>