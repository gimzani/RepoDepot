<template>
<div class="processor-display">
  <div class="float-right">
    <button class="btn btn-xs btn-default" title="remove job" @click="$emit('remove-job', job)">      
      <font-awesome-icon class="text-danger" icon="times" />
    </button>
  </div>
  <div>    
    {{job.name}}
  </div>
  <div>
    {{job.outputPath}}
  </div>
</div>
</template>

<script>
export default {
  name: "JobDisplay",
  props: {
    job: Object
  }
}
</script>