<template>
  <div class="dashboard-editor-container">
    <panel-group :homeData="homeData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>
    <el-row :gutter="8">
      <el-col
        :xs="{span: 24}"
        :sm="{span: 24}"
        :md="{span: 24}"
        :lg="{span: 12}"
        :xl="{span: 12}"
        style="padding-right:8px;margin-bottom:30px;"
      >
        <el-table
          :data="rewardData"
          element-loading-text="Loading"
          highlight-current-row
          :summary-method="getSummaries"
          show-summary
          height="400"
        >
          <el-table-column align="center" label="ID" width="95">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="账号" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.account }}</span>
            </template>
          </el-table-column>
          <el-table-column label="名字" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column label="奖励数量" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.number }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col
        :xs="{span: 24}"
        :sm="{span: 24}"
        :md="{span: 24}"
        :lg="{span: 12}"
        :xl="{span: 12}"
        style="padding-right:8px;margin-bottom:30px;"
      >
        <el-table
          :data="nodeData"
          element-loading-text="Loading"
          highlight-current-row
          height="400"
        >
          <el-table-column align="center" label="ID" width="95">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="账号" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.account }}</span>
            </template>
          </el-table-column>
          <el-table-column label="名字" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column label="邀请码" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.invite_code }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from "./components/PanelGroup";
import LineChart from "./components/LineChart";
import RewardTable from "./components/RewardTable";
import NodeTable from "./components/NodeTable";

import {
  getHomeData,
  getlineChartData,
  getRewardData,
  getNodeData,
  getPopupData
} from "@/api/dashboard";

export default {
  name: "DashboardAdmin",
  components: {
    PanelGroup,
    LineChart,
    RewardTable,
    NodeTable
  },
  data() {
    return {
      homeData: null,
      lineChartData: {
        number: '',
        date: ''
      },
      nodeData: null,
      rewardData: null
    };
  },
  created() {
    this.getHomeData();
  },
  methods: {
    getHomeData() {
      getHomeData().then(response => {
        this.homeData = response.data;
      });
      getRewardData().then(response => {
        this.rewardData = response.data.list;
        // console.log(this.rewardData);
      });
      getNodeData().then(response => {
        // console.log(response.data);
        this.nodeData = response.data;
      });
      getlineChartData().then(response => {
        var arr = Object.values(response.data);
        var arr1 = [];
        var arr2 = [];
        for (var i = 0; i < arr.length; i++) {
          arr1.push(arr[i].number);
          arr2.push(arr[i].dat);
        }
        this.lineChartData = {
            number: arr1,
            date: arr2
        };
     
      });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        if (index === 1) {
          sums[index] = "/";
          return;
        }
        if (index === 2) {
          sums[index] = "/";
          return;
        }
        const values = data.map(item => Number(item.number));
       
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += " ";
        } else {
          sums[index] = "";
        }
      });

      return sums;
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

.el-table{
overflow:visible !important;
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
