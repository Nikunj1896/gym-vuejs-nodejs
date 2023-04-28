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
        v-for="list in trainList"
        :key="list.title"
      >
        <div @click="getInputList(list)">
          {{ list.title }} <span>{{ list.week }}</span>
        </div>
      </div>
    </div>
    <div class="recommend">
      <span @click="createRef = true"
        >We are recommended 3+ workout for beginners.</span
      >
    </div>
    <div>
      <p class="back">Help</p>
    </div>
    <div>
      <button
        @click="generateWork()"
        type="button"
        class="btn btn-primary generate-btn"
      >
        Generate workout
      </button>
    </div>
  </div>

  <!-- create work out -->
  <div class="p-3" v-if="createRef">
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
        <div class="mb-3 input-fields">
          <label for="numberOfDays" class="form-label"
            >Number of days they train</label
          >
          <input
            type="number"
            class="form-control"
            id="numberOfDays"
            name="numberOfDays"
            v-model="moreList.numberOfDays"
          />
        </div>
        <div class="create-btn">
          <button
            type="button"
            class="btn btn-danger"
            @click="createRef = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="moreRecommend()"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "GenerateWorkout",
  data() {
    return {
      createRef: false,
      trainList: [
        { title: "1x", week: "Per Week" },
        { title: "2x", week: "Per Week" },
        { title: "3x", week: "Per Week" },
        { title: "4x", week: "Per Week" },
        { title: "5x", week: "Per Week" },
        { title: "6x", week: "Per Week" },
      ],
      oftenTrain: "",
      moreList: {
        name: "",
        height: 0,
        weight: 0,
        numberOfDays: 0,
      },
    };
  },
  methods: {
    getInputList(items) {
      console.log("items", items.title);
      this.oftenTrain = items.title;
    },
    moreRecommend() {
      this.moreList = {
        name: this.moreList.name,
        height: this.moreList.height,
        weight: this.moreList.weight,
        numberOfDays: this.moreList.numberOfDays,
      };
      this.createRef = false
      console.log("moreList ----- ", this.moreList);
    },
    generateWork() {
      const payload = {
        ...this.moreList,
        oftenTrain: this.oftenTrain,
      };
      console.log("payload-------- ", payload);
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
.create-work .create-btn {
  display: flex;
  gap: 10px;
  justify-content: end;
}
</style>
