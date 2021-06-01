<template>
<div class="w-full flex flex-col">
  <div class="w-full" id="heatmap"></div>

  <div class="mb-2 mx-auto w-full">
    <ul class="flex flex-col p-2 w-full">
      <li class="border-gray-300 w-full mt-2" v-for="item in show" v-bind:key="item._id">
        <div class="w-full select-none flex flex-wrap items-center p-2 transition duration-500 ease-in-out transform hover:-translate-y-2 rounded-2xl border-2 hover:shadow-2xl">
          
          <div class="flex-1 pl-1 mr-16 mx-auto">
            <div class="font-medium text-wrap break-words">
              {{ item.content }}
            </div>
          </div>

          <div class="flex flex-row flex-wrap w-1/3 justify-center items-center space-x-2 space-y-2">
            <div v-for="category in item.categories" v-bind:key="category" class="text-white text-bold rounded-md bg-black p-2">
              {{ category }}
            </div>
          </div> 

        </div>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import { calendarHeatmap } from '../plugins/heatmap'
import moment from 'moment'
import * as d3 from 'd3'

export default {
  data() {
    return {
      entries: this.entriesIn,
      colorRange: null, 
      tooltipEnabled: true,
      tooltipUnit: null, 
      locale: null,
      max: null, 
      map: null, 
      show: []
    }
  },
  props: ["entriesIn"],
  mounted() {
    var that = this 
    setTimeout(()=>{
      that.renderHeatMap()
    }, 2000)
  },
  methods: {
    renderHeatMap() {
      // preprocess data 
      this.entries = this.entries.reverse()
      let map = {}
      this.entries.forEach(e => {
        let date = new Date(e.date)
        date = new Date(date.toDateString())
        if (map[date]) {
          map[date].push(e)
        } else {
          map[date] = [e]
        }
      })
      this.map = map
      var now = moment().endOf('day').toDate()
      var yearAgo = moment().startOf('day').subtract(1, 'year').toDate() 
      var chartData = d3.time.days(yearAgo, now).map(e => {
        return {
          date: e,
          count: map[e]? map[e].length : 0
        }
      })
      var heatmap = calendarHeatmap()
        .data(chartData)
        .selector("#heatmap")
        .tooltipEnabled(true)
        .tooltipUnit("quest")
        .legendEnabled(false)
        .colorRange(["#f4f7f7", "#79a8a9"])
        .onClick(d => {
          // show the quests on that day 
          this.show = this.map[d.date]
        })
      heatmap()
    }
  }
}
</script>
<style>
text.month-name,
text.calendar-heatmap-legend-text,
text.day-initial {
  font-size: 10px;
  z-index: 100;
  fill: inherit;
  font-family: Helvetica, arial, 'Open Sans', sans-serif;
}
rect.day-cell:hover {
  stroke: #555555;
  stroke-width: 1px;
}
.day-cell-tooltip {
  position: absolute;
  z-index: 9999;
  padding: 5px 9px;
  color: #bbbbbb;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.85);
  border-radius: 3px;
  text-align: center;
}
.day-cell-tooltip > span {
  font-family: Helvetica, arial, 'Open Sans', sans-serif
}
.calendar-heatmap {
  box-sizing: initial;
  float:right;
  overflow:scroll;
}
.heatmap {
  margin-left:auto;
  margin-right: auto; 
  text-align:right;
  overflow:visible;
  white-space: nowrap;
}

</style>
