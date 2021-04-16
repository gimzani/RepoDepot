<template>
<div class="processor-display">
  <div class="float-right">
    <button class="btn btn-xs btn-default" title="run job" @click="$emit('run-job', job)">      
      <font-awesome-icon class="text-success" icon="play" />
    </button>
    <button class="btn btn-xs btn-default" title="edit job" @click="$emit('edit-job', job)">      
      <font-awesome-icon class="text-info" icon="pencil-alt" />
    </button>
    <button class="btn btn-xs btn-default" title="remove job" @click="removeJob(job)">      
      <font-awesome-icon class="text-danger" icon="times" />
    </button>
  </div>
  <div>    
    <strong>{{job.name}}</strong>
  </div>
  <div>
    {{job.outputPath}}
  </div>
</div>
</template>

<script>
//--------------------------------------------
import swal from 'sweetalert'
//--------------------------------------------
export default {
  name: "JobDisplay",
  props: {
    job: Object
  },
  methods: {
    removeJob(job) {
      swal({
        title: "Are you sure?",
        text: "Remove this Job?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((confirm) => {
        if (confirm) {
          this.$emit('remove-job', job)
        }
      });
    }
  }
}
</script>