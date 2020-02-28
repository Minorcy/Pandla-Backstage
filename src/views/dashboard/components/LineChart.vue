<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "350px"
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.chart.hideLoading();
        this.chart.setOption({
          xAxis: {
            data: val.date,
            boundaryGap: false,
            axisTick: {
              show: false
            }
          },
           yAxis: {
          axisTick: {
            show: false
          }
        },
          series: [
            {
              name: "pan",
              itemStyle: {
                normal: {
                  color: "#FF005A",
                  lineStyle: {
                    color: "#FF005A",
                    width: 2
                  }
                }
              },
              smooth: true,
              data: val.number,
              type: "line",
              animationDuration: 2800,
              animationEasing: "cubicInOut"
            }
          ]
        });
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.chart.showLoading();
      this.setOptions(this.chartData);
    },
    setOptions({ number, date } = {}) {
      this.chart.setOption({
        xAxis: {
          data: []
        },
        grid: {
          left: 20,
          right: 40,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ["pan"]
        },
        series: [
          {
            name: "pan",
              itemStyle: {
                normal: {
                  color: "#FF005A",
                  lineStyle: {
                    color: "#FF005A",
                    width: 2
                  }
                }
              },
              smooth: true,
              data: [],
              type: "bar",
              animationDuration: 2800,
              animationEasing: "cubicInOut"
          }
        ]
      });
    }
  }
};
</script>
