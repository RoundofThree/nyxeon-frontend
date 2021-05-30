<template>
  <div class="container mx-auto px-4 py-4 text-center flex flex-col md:flex-row justify-center items-center">
    <!--  Heatmap -->
    <template v-if="ready">
      <div class="w-1/4 h/1-4 flex justify-center mx-auto">
      <pie-chart style="width: 200; height: 200;" :chartData="chartData"></pie-chart>
      </div>
      <heat-map :entriesIn="quests"></heat-map>

    </template>
  </div>
</template>
<script>
// if the fetchQuests request fails, then redirect to / 
import axios from "axios"
import HeatMap from '../components/HeatMap.vue'
import PieChart from '../components/PieChart'
import getState from '../store/session'

const API = "http://localhost:8080/quests/all"
const axiosConfig = {
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
}
export default {
  components: { HeatMap, PieChart },
  data() {
    return {
      ready: false,
      quests: [],  // array of {_id, content, categories, date}
      chartData: {
        hoverBackgroundColor: "red",
        hoverBorderWidth: 10,
        labels: [], 
        datasets: [
          {
            label: "Data one",
            backgroundColor: [],
            data: []
          }
        ]
      }
    }
  },
  async created() {
    const setLoggedIn = getState().setLoggedIn
    axios.get(API, axiosConfig).then(res => {
      setLoggedIn(true)
      this.quests = res.data 
      // compute pie chart 
      let map = this.compute()
      let data = this.getData(map)
      let dynamicColors = this.getRandomColors(Array.from(Object.keys(map)).length)
      this.chartData.labels = Array.from(Object.keys(map))
      this.chartData.datasets[0].data = data 
      this.chartData.datasets[0].backgroundColor = dynamicColors
      this.ready = true
    }).catch(err => {
      console.log(err) 
      setLoggedIn(false)
      this.$router.push({name: "Home"})
    })
  },
  methods: {
    compute() {
      let map = {} 
      this.quests.forEach(e => {
        if (e.categories && e.categories.length !== 0) {
          for (let c in e.categories) { 
            let cat = e.categories[c]
            if (map[cat]) {
              map[cat] += 1
            } else {
              map[cat] = 1
            }
          }
        }
      })
      return map
    },
    getData(map) {
      let ret = [] 
      let keys = Object.keys(map)
      for (let i=0; i<keys.length; ++i) {
        ret.push(map[keys[i]])
      }
      return ret 
    },
    getRandomColors(size) {
      let ret = []
      for (let i=0; i<size; ++i) {
        let red = Math.floor(Math.random() * 255)
        let green = Math.floor(Math.random() * 255)
        let blue = Math.floor(Math.random() * 255) 
        ret.push("rgb(" + red + ","+ green + "," + blue +")")
      }
      return ret
    }
  }
}

</script>