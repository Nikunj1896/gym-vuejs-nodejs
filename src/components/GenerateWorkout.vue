<template>
  <!-- show types -->
  <div class="p-3" v-if="!createRef">
    <div>
      <p class="back" @click="$router.push('/')">Back</p>
    </div>
    <div>
      <h1>How often do you want to train?</h1>
    </div>
    <div class="row grid-container">
      <div
        class="col-sm-6 grid-item"
        v-for="(list, index) in trainList"
        :key="list.title"
      >
        <div
          @click="getInputList(list, index)"
          :class="{ active: isActive(index) }"
        >
          {{ list.title }} <span>{{ list.week }}</span>
          <br />
        </div>
        <span className="text"> <i>[ {{ list.text }}]</i> </span>
      </div>
    </div>
    <div class="recommend">
      <span @click="createRef = true"
        >We are recommended 3+ workout for beginners.</span
      >
    </div>
  </div>

  <!-- create work out -->
  <div class="p-3">
    <div>
      <h1>Create work schedule</h1>
    </div>
    <div class="create-work">
      <form>
        <div class="mb-3 input-fields">
          <label for="name" class="form-label"> Name </label>
          <input
            type="text"
            class="form-control"
            id="name"
            name="name"
            v-model="moreList.name"
            placeholder="Please Enter Name"
          />
        </div>
        <div class="row">
          <div class="mb-3 input-fields col">
            <label for="height" class="form-label">Height</label>
            <input
              type="number"
              class="form-control"
              id="height"
              name="height"
              v-model="moreList.height"
            />
          </div>
          <div class="mb-3 input-fields col">
            <label for="weight" class="form-label">Weight</label>
            <input
              type="number"
              class="form-control"
              id="weight"
              name="weight"
              v-model="moreList.weight"
            />
          </div>
        </div>
      </form>
    </div>
  </div>
  <div>
    <p class="back">Help</p>
  </div>
  <div className="pb-2">
    <button
      @click="generateWork()"
      type="button"
      class="btn btn-primary generate-btn m-2"
    >
      Generate Workout
    </button>
    <button
      @click="searchWorkout()"
      type="button"
      class="btn btn-primary generate-btn m-2"
    >
      Search Workout
    </button>
  </div>
</template>

<script>
export default {
  name: "GenerateWorkout",
  props: {
    paramsData: {
      type: Object, // Set the type to object
      required: true, // Make the prop required
    },
  },
  data() {
    return {
      createRef: false,
      activeIndex: null,
      trainList: [
        { index: 3, title: "3x", week: "Per Week", text: "Alternate Split" },
        {
          index: 4,
          title: "4x",
          week: "Per Week",
          text: "Upper / Lower split",
        },
        {
          index: 6,
          title: "6x",
          week: "Per Week",
          text: "Push / Pull / Legs split",
        },
      ],
      oftenTrain: "",
      moreList: {
        name: "",
        height: 0,
        weight: 0,
      },
      payload: "",
      data: "",
    };
  },
  methods: {
    getInputList(item, index) {
      this.oftenTrain = item.title;

      this.activeIndex = index;
    },
    moreRecommend() {
      this.moreList = {
        name: this.moreList.name,
        height: this.moreList.height,
        weight: this.moreList.weight,
      };
      this.createRef = false;
    },
    generateWork() {
      const payload = {
        ...this.moreList,
        oftenTrain: this.oftenTrain,
      };
      this.payload = payload;
      this.$router.push({
        name: "allWorkSchedule",
        params: { data: JSON.stringify(payload) },
      });
    },
    searchWorkout() {
      this.$router.push('/searchWorkout');
    },
  },
  computed: {
    isActive() {
      return (index) => this.activeIndex === index;
    },
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2,
p {
  color: #fff;
}
.back {
  text-align: left;
  font-size: 20px;
  color: #4848f2;
  padding: 0px 17px;
}
.grid-container {
  padding: 10px;
}
.grid-item {
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
  padding: 40px 20px;
  font-size: 30px;
  text-align: center;
  color: #fff;
  display: flex;
  flex-direction: column;
}
.grid-item span {
  font-size: 20px;
}
.recommend {
  color: gray;
  padding: 20px;
}
.generate-btn {
  color: #000;
}
.create-work .form-label {
  color: #fff;
}
.create-work .input-fields {
  text-align: left;
}
.create-work .form-control:focus {
  border-color: transparent !important;
  box-shadow: none !important;
}
.active {
  background: linear-gradient(to right, white, darkorchid);
  color: transparent;
  background-clip: text;
}
</style>
