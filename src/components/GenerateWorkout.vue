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
        v-for="(list,index) in trainList"
        :key="list.title"  
      >
        <div @click="getInputList(list,index)"  :class="{ active: isActive(index) }">
          {{ list.title }} <span>{{ list.week }}</span>
        </div>
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
      </form>
    </div>
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
</template>

<script>
export default {
  name: "GenerateWorkout",
  data() {
    return {
      createRef: false,
        activeIndex: null,
      trainList: [
        { index:1,title: "1x", week: "Per Week" },
        { index:2,title: "2x", week: "Per Week" },
        { index:3,title: "3x", week: "Per Week" },
        { index:4,title: "4x", week: "Per Week" },
        { index:5,title: "5x", week: "Per Week" },
        { index:6,title: "6x", week: "Per Week" },
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
    getInputList(item,index) {
      console.log("items", item.title);
      this.oftenTrain = item.title;

      this.activeIndex = index;
    },
    moreRecommend() {
      this.moreList = {
        name: this.moreList.name,
        height: this.moreList.height,
        weight: this.moreList.weight,
        numberOfDays: this.moreList.numberOfDays,
      };
      this.createRef = false;
      console.log("moreList ----- ", this.moreList);
    },
    generateWork() {
      const payload = {
        ...this.moreList,
        oftenTrain: this.oftenTrain,
      };
     this.$router.push("/workSchedule");
      console.log("payload-------- ", payload);
    },
  },
  computed: {
    isActive() {
      return (index) => this.activeIndex === index;
    }
  }

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
.active {
   background: linear-gradient(to right, white  , darkorchid);
   color: transparent;
  background-clip: text;
}
</style>
