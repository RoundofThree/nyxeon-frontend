import { Doughnut, mixins } from 'vue-chartjs'

export default {
  extends: Doughnut,
  template: '<canvas id="graph" width="400" height="400"></canvas>',
  props: ["chartData"],
  mounted() {
    this.renderChart(this.chartData, {
      borderWidth: "10px",
      hoverBackgroundColor: "red",
      hoverBorderWidth: "10px"
    })
  }
}