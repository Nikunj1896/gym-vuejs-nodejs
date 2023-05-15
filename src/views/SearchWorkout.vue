<template>
  <div className="p-1 m-1 pt-3">
    <form @submit.prevent="handleSubmit">
      <input
        class="form-control form-control-lg"
        type="text"
        placeholder="search exercise name"
        v-model="searchKeyWord"
      />
      <div className="pt-2">
        <div className="pt-2 pb-2 d-flex">
          <select v-model="selectedCategory" className="dropdown">
            <option value="">Category</option>
            <option
              v-for="option in allCategories"
              :value="option.value"
              :key="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        <div className="pt-2 pb-2 d-flex">
          <select v-model="selectedMuscles" className="dropdown">
            <option value="">Muscle</option>
            <option
              v-for="option in allMuscles"
              :value="option.value"
              :key="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        <div className="pt-2 pb-2 d-flex">
          <select v-model="selectedForce" className="dropdown">
            <option value="">Force</option>
            <option
              v-for="option in allForces"
              :value="option.value"
              :key="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="">
          <button className="rounded p-2" type="submit">Find Excercises</button>
        </div>
      </div>
    </form>
  </div>
  <div class="content p-2 m-1" v-for="data in ApiData" :key="data.id">
    <div class="row">
      <div class="col">
        <div class="heading">
          {{ data.exercise_name }}
          <div class="d-flex justify-content-between">
            <div class="text-muted">{{ data.Category }}</div>
          </div>
        </div>
        <!-- video -->
        <div
          @click="data.isOpen = !data.isOpen"
          className="mt-2 content-set d-flex"
        >
          How To : <i v-if="!data.isOpen" class="bi bi-plus"></i>
          <i v-else class="bi bi-dash"></i>
        </div>

        <div
          @click="data.stepsOpen = !data.stepsOpen"
          className="mt-2 content-set d-flex"
        >
          steps <i v-if="!data.stepsOpen" class="bi bi-plus"></i>
          <i v-else class="bi bi-dash"></i>
        </div>
      </div>

      <!-- videos dropdown -->
      <div v-if="data.isOpen">
        <div class="card card-body">
          <div v-for="video in data.videoURL" :key="video">
            <video :src="video" autoplay className="videoFrame"></video>
          </div>
        </div>
      </div>

      <!-- steps dropdown -->
      <div v-if="data.stepsOpen">
        <div class="card card-body">
          <div v-for="(step, index) in data.steps" :key="(index = index + 1)">
            <div className="bg-white rounded text-dark p-2 stepsDetails mb-1">
              <div className="d-flex p-2">
                <span className="number text-light">
                  {{ index }}
                </span>
                <span className="text-start">
                  {{ step }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="spinner-border text-light"
    role="status"
    v-if="this.loading && !this.EmptyApiData"
  >
    <!-- <span class="sr-only">Loading...</span> -->
  </div>
  <div class="text-light" v-if="this.EmptyApiData">No Excercises Found</div>
</template>

<script>
import axios from "axios";
export default {
  name: "searchWorkout",
  data() {
    return {
      searchKeyWord: "",
      selectedCategory: "",
      selectedMuscles: "",
      selectedForce: "",
      allCategories: [
        { value: "Barbell", label: "Barbell" },
        { value: "Dumbbells", label: "Dumbbells" },
        { value: "Kettlebells", label: "Kettlebells" },
        { value: "Stretches", label: "Stretches" },
        { value: "Cables", label: "Cables" },
        { value: "Band", label: "Band" },
        { value: "TRX", label: "TRX" },
        { value: "Bodyweight", label: "Bodyweight" },
        { value: "Yoga", label: "Yoga" },
        { value: "Machine", label: "Machine" },
      ],
      allMuscles: [
        { value: "Biceps", label: "Biceps" },
        { value: "Forearms", label: "Forearms" },
        { value: "Shoulders", label: "Shoulders" },
        { value: "Triceps", label: "Triceps" },
        { value: "Quads", label: "Quads" },
        { value: "Glutes", label: "Glutes" },
        { value: "Lats", label: "Lats" },
        { value: "Mid back", label: "Mid back" },
        { value: "Lower back", label: "Lower back" },
        { value: "Hamstrings", label: "Hamstrings" },
        { value: "Chest", label: "Chest" },
        { value: "Abdominals", label: "Abdominals" },
        { value: "Obliques", label: "Obliques" },
        { value: "Traps", label: "Traps" },
        { value: "Calves", label: "Calves" },
      ],
      allForces: [
        { value: "Push", label: "Push" },
        { value: "Pull", label: "Pull" },
        { value: "Hold", label: "Hold" },
      ],
      ApiData: [],
      EmptyApiData: false,
      loading: false,
    };
  },
  methods: {
    handleSubmit() {
      this.ApiData = [];
      this.loading = true;
      // Here, you can access the selected values and send them to Node.js server
      axios
        .post("http://localhost:4000/api/searchExcercise", {
          searchKeyword: this.searchKeyWord,
          category: this.selectedCategory,
          muscles: this.selectedMuscles,
          force: this.selectedForce,
        })
        .then((res) => {
          if (res) {
            this.loading = false;
            res.data.map((item) => {
              this.ApiData.push(item);
            });
          }
          if (this.ApiData.length == 0) {
            this.EmptyApiData = true;
          }
        })
        .catch((err) => {
          console.error("err", err);
        });
    },
  },
  async mounted() {},
  computed: {
    // for check active index will match clicked id
  },
  components: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
select {
  color: black; /* Optional: Set the initial text color in the dropdown */
}
option {
  color: black;
}
.dropdown {
  width: 100%;
  height: 37px;
  border-radius: 10px;
}
.content {
  box-shadow: 0 3px 10px rgb(181 181 181 / 20%);
  color: #fff;
}
.heading {
  font-size: 20px;
  text-align: left;
  font-weight: 700;
}
.content-set {
  background: #6b645f;
  border-radius: 8px;
  padding: 5px;
  justify-content: space-between;
}
.card.card-body {
  background: #4d4b4a;
}
.videoFrame {
  width: 100%;
  height: auto;
}
.number {
  position: absolute;
  background: #8e7eff;
  padding: 5px 12px;
  border-radius: 50%;
  left: 2%;
}
.stepsDetails {
  margin-left: 4%;
}
</style>
