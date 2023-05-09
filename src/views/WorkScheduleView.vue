<template>
  <div v-if="paramsData">
    <WorkSchedule :paramsData="paramsData"  />
  </div>
</template>

<script>
// @ is an alias to /src
import WorkSchedule from "@/components/WorkSchedule.vue";

export default {
  name: "WorkScheduleView",
  data() {
    return {
      paramsData: null,
    };
  },
  mounted() {
    if (this.$route.params.data) {
      this.paramsData = JSON.parse(this.$route.params.data)
      console.log('paramsdata', this.paramsdata)
    } else {
      console.log("Data parameter not defined");
    }
  },
  components: {
    WorkSchedule,
  },
};
</script>

<style>
</style>
