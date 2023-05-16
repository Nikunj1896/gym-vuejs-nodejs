<template>
  <div>
    <div className="d-flex justify-content-between text-center header">
      <h1>Work schedule</h1>
      <div className="text-black weekButton">
        <div>
          <div class="dropdown">
            <button
              class="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ selectedWeek }}
            </button>
            <ul class="dropdown-menu">
              <li>
                <a class="dropdown-item" href="#" @click="selectWeek('Week 1')"
                  >Week 1</a
                >
              </li>
              <li>
                <a class="dropdown-item" href="#" @click="selectWeek('Week 2')"
                  >Week 2</a
                >
              </li>
              <li>
                <a class="dropdown-item" href="#" @click="selectWeek('Week 3')"
                  >Week 3</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="row m-1">
      <div
        class="col box"
        v-for="i in 6"
        :key="i"
        @click="fetchDay(i)"
        :class="{ active: isActive(i) }"
      >
        Day {{ i }}
      </div>
    </div>
    <div class="container pt-4 font-bold">
      <div v-if="!noExercise">
        <div class="text-white" v-if="this.paramsData.name">
          Hi {{ this.paramsData.name }} your workout has been generated
        </div>
        <div v-if="!this.loading">
          <div class="content p-2" v-for="data in ApiData" :key="data.id">
            <div class="row">
              <div class="col">
                <div class="heading">
                  {{ data.exercise_name }}
                  <div class="d-flex justify-content-between">
                    <div class="text-muted">{{ data.Category }}</div>
                    <div class="d-flex starContiner">
                      <star-rating
                        v-if="!this.displayStars"
                        @update:rating="setRating"
                        @click="sendId(data.id)"
                        :star-size="20"
                      >
                      </star-rating>
                      <star-rating
                        v-else
                        @update:rating="setRating"
                        @click="sendId(data.id)"
                        :star-size="20"
                        :rating="data.rating"
                      >
                      </star-rating>
                    </div>
                  </div>
                </div>
                <div class="mt-4 content-set d-flex" v-if="data.set">
                  <div>Sets : {{ data.set }}</div>
                  <div className="Reps">Reps : {{ data.reps }}</div>
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
                  <div
                    v-for="(step, index) in data.steps"
                    :key="(index = index + 1)"
                  >
                    <div
                      className="bg-white rounded text-dark p-2 stepsDetails mb-1"
                    >
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
        </div>
        <div className="text-white loading" v-if="this.loading">
          Loading...
        </div>
        <div className="pt-2 pb-2">
          <button
          v-if="!this.loading "
            @click="regenrate"
            :disabled="this.disableButton == true"
            v-bind:class="
              this.disableButton ? 'Disable rounded' : 'regenrateButton rounded'
            "
          >
            Regenrate Exercises
          </button>
        </div>
      </div>
      <div v-else className="text-light fw-bold fs-1">Let Yourself Rest.</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import StarRating from "vue-star-rating";
export default {
  name: "WorkSchedule",
  props: {
    paramsData: {},
  },
  data() {
    return {
      ApiData: [],
      rating: 0,
      displayStars: false,
      activeIndex: null,
      selectedWeek: "Week 1",
      noExercise: false,
      disableButton: false, //disable button after click,
      RatingChange: [],
      loading: false,
    };
  },
  methods: {
    selectWeek(week) {
      this.selectedWeek = week;
    },
    // fetch excercises as per given ids
    fetchExerciseData(ids) {
      const apiUrl = "http://localhost:4000/api/excercise/";
      const promises = ids.map((id) => {
        return fetch(apiUrl + id)
          .then((response) => response.json())
          .then((data) => ({
            id: data.id,
            Category: data.Category,
            exercise_name: data.exercise_name,
            videoURL: [...data.videoURL],
            steps: [...data.steps],
            target: data.target,
            SetsAndReps: [
              ["3", "10"],
              ["4", "8-10"],
              ["3", "4-5"],
              ["3", "8-12"],
              ["3", "7-8"],
              ["3", "10"],
              ["3", "2"],
            ],
          }));
      });
      return Promise.all(promises);
    },
    // fetch data as per day selected
    fetchDay(i) {
      this.disableButton = false;
      this.RatingChange = [];
      this.activeIndex = i;
      if (this.paramsData.oftenTrain == "4x") {
        if (i === 1 || i === 2 || i === 4 || i === 5) {
          this.noExercise = false;

          let exerciseIds = [];
          if (i === 1) exerciseIds = [67, 69, 449, 445, 383, 0, 282];
          else if (i === 2) exerciseIds = [130, 891, 131, 502, 752];
          else if (i === 4) exerciseIds = [72, 71, 446, 51, 357, 21, 279];
          else if (i === 5) exerciseIds = [158, 164, 132, 534, 753];

          this.fetchExerciseData(exerciseIds)
            .then((dataArray) => {
              console.log(dataArray);
              const SetsAndReps = [
                ["3", "10"],
                ["4", "8-10"],
                ["3", "4-5"],
                ["3", "8-12"],
                ["3", "7-8"],
                ["3", "10"],
                ["3", "2"],
              ];
              const modifiedDataArray = dataArray.map((exercise, index) => {
                exercise.set = SetsAndReps[index][0];
                exercise.reps = SetsAndReps[index][1];
                return exercise;
              });
              this.ApiData = modifiedDataArray;
            })
            .catch((error) => {
              console.error(error);
            });
        } else if (i === 3 || i === 6) {
          this.noExercise = true;
        }
      } else if (this.paramsData.oftenTrain == "3x") {
        if (i === 1 || i === 3 || i === 5) {
          this.noExercise = false;

          let exerciseIds = [];
          if (i === 1) exerciseIds = [67, 69, 449, 51, 94, 388];
          else if (i === 3) exerciseIds = [383, 0, 361, 1, 415, 279];
          else if (i === 5) exerciseIds = [130, 132, 502, 753, 752, 824, 879];

          this.fetchExerciseData(exerciseIds)
            .then((dataArray) => {
              console.log(dataArray);
              const SetsAndReps = [
                ["3", "10"],
                ["4", "8-10"],
                ["3", "4-5"],
                ["3", "8-12"],
                ["3", "7-8"],
                ["3", "10"],
                ["3", "2"],
              ];
              const modifiedDataArray = dataArray.map((exercise, index) => {
                exercise.set = SetsAndReps[index][0];
                exercise.reps = SetsAndReps[index][1];
                return exercise;
              });
              this.ApiData = modifiedDataArray;
            })
            .catch((error) => {
              console.error(error);
            });
        } else if (i === 2 || i === 4 || i == 6) {
          this.noExercise = true;
        }
      } else if (this.paramsData.oftenTrain == "6x") {
        if (i === 1 || i == 2 || i === 3 || i == 4 || i === 5 || i == 6) {
          this.noExercise = false;

          let exerciseIds = [];
          if (i === 1) exerciseIds = [447, 445, 449, 37, 267];
          else if (i === 2) exerciseIds = [447, 445, 449, 37, 267];
          else if (i === 3) exerciseIds = [130, 601, 132, 753, 879];
          else if (i === 4) exerciseIds = [67, 72, 383, 357, 298];
          else if (i === 5) exerciseIds = [449, 130, 879, 753];
          else if (i === 6) exerciseIds = [601, 130, 879, 753];

          this.fetchExerciseData(exerciseIds)
            .then((dataArray) => {
              console.log(dataArray);
              const SetsAndReps = [
                ["3", "10"],
                ["4", "8-10"],
                ["3", "4-5"],
                ["3", "8-12"],
                ["3", "7-8"],
                ["3", "10"],
                ["3", "2"],
              ];
              const modifiedDataArray = dataArray.map((exercise, index) => {
                exercise.set = SetsAndReps[index][0];
                exercise.reps = SetsAndReps[index][1];
                return exercise;
              });
              this.ApiData = modifiedDataArray;
            })
            .catch((error) => {
              console.error(error);
            });
        }
      } else {
        console.log("Days are not Selected---");
      }
    },
    // set rating data
    sendId(id) {
      axios
        .post("http://localhost:4000/api/rating", {
          rating: this.rating,
          excersizeId: id,
        })
        .then((response) => {
          this.RatingChange.push(response.data);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    setRating(rating) {
      this.rating = rating;
    },
    // regerate exercise
    regenrate() {
      this.displayStars = true;
      this.disableButton = true;
      this.loading = true;
      axios
        .post("http://localhost:4000/api/addRating", {
          Data: this.RatingChange,
        })
        .then((res) => {
          const Data = res.data;

          const uniqueIds = new Set(
            this.RatingChange.map((obj) => obj.excersizeId)
          );

          // Filter apidata to remove objects with duplicate ids
          const filteredArray = this.ApiData.filter(
            (obj) => !uniqueIds.has(obj.id)
          );

          // add new data from resposne
          const nnn = [...Data, ...filteredArray];
          this.ApiData = nnn;
          this.loading = false;
        })
        .catch((err) => {
          console.error("err", err);
        });
    },
  },
  async mounted() {
    this.loading = true;
    // get all excercise initially
    const apiUrl = "http://localhost:4000/api/getexcercise";
    axios
      .get(apiUrl)
      .then((response) => {
        const exercises = response.data.data;
        const apiData = [];
        exercises.map((data) => {
          apiData.push({
            id: data.id,
            Category: data.Category,
            exercise_name: data.exercise_name,
            videoURL: [...data.videoURL],
            steps: [...data.steps],
            target: data.target.Primary?.[0],
          });
          this.ApiData = apiData;
    this.loading = false;
    });
    })
    .catch((err) => {
      console.error(err);
    });
  },
  computed: {
    // for check active index will match clicked id
    isActive() {
      return (index) => this.activeIndex === index;
    },
  },
  components: {
    StarRating,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body {
  color: #fff;
}
h1 {
  color: #fff;
}
.box {
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  font-size: 16px;
  margin: 0px 3px;
  padding: 0px;
}
.grid-item {
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
  text-align: center;
  display: flex;
  flex-direction: row;
}
.content {
  box-shadow: 0 3px 10px rgb(181 181 181 / 20%);
  color: #fff;
}
.image img {
  border-radius: 10px;
  height: 102px;
  width: 100%;
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
.starContiner {
  margin-right: 1%;
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
.regenrateButton {
  background-color: #6b645f;
  color: #fff;
  padding: 2px 18px;
}
.weekButton {
  border-radius: 5px;
  padding: 0px 5px;
}
.header {
  margin: 5px 10px;
  align-items: center;
}
.active {
  background-color: #6c757d;
  color: white;
  background-clip: text;
}
.Disable {
  background-color: #6b645f;
}
.Reps {
  padding-right: 5px;
}
.loading {
  height: 507px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 31px;
}
</style>
