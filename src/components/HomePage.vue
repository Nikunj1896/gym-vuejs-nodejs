<template>
  <div>
    <div>
      <img
        width="200"
        src="https://cdn.dribbble.com/users/3701628/screenshots/11369364/dribbble-01.png"
        alt="LOGO"
      />
    </div>
    <div>
      <h2>Workout Joy</h2>
    </div>

    <div class="work-btn">
      <button
        class="start-btn"
        @click="$router.push('/generateWorkout')"
        type="button"
      >
        Get Start
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage",
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  color: #fff;
}
.start-btn {
  width: 200px;
  height: 40px;
  border-radius: 10px;
}
.work-btn {
  position: absolute;
  bottom: 100px;
}
</style>
