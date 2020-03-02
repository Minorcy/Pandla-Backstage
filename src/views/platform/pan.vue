/**
 * 系统管理 用户管理
 */
<template>
  <div class="user-page">
    <!-- 搜索筛选 -->

    <div class="search-box">
      <el-select
        v-model="optionsValue"
        placeholder="请选择排列顺序"
        size="medium"
        @change="selectChange"
        class="select"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <!-- <span class="lift">
        <i class="el-icon-caret-top lift-icon" :class="[sort?'color':'']" @click="chengSort"></i>
        <i class="el-icon-caret-bottom lift-icon" :class="[!sort?'color':'']" @click="chengSort"></i>
      </span>-->

      <el-input placeholder="请输入搜索账号" v-model="inputValue" size="medium" clearable class="input"></el-input>
      <el-button class="button" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    </div>
    <!--列表-->
    <el-table
      size="small"
      :data="panData"
      highlight-current-row
      v-loading="loading"
      border
      element-loading-text="loading"
      style="width: 1022px"
    >
      <el-table-column align="center" label="编号" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="账号" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="余额" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.balance |getFloat() }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="冻结金额" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.freeze|getFloat() }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="transferPan(scope.$index, scope.row)">转账</el-button>
          <el-button size="mini" type="danger" @click="freezeUserPan(scope.$index, scope.row)">冻结</el-button>
          <el-button size="mini" type="warning" @click="unfreezeUserPan(scope.$index, scope.row)">解冻</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :rows.sync="listQuery.rows"
      :hidden="hidden"
      @pagination="getdata"
    />
  </div>
</template>

<script>
// 导入请求方法

import Pagination from "@/components/Pagination";

import {
  getPanList,
  getUserPan,
  transfer,
  freezeUserPan,
  unfreezeUserPan
} from "@/api/platform";
export default {
  data() {
    return {
      inputValue: "",
      loading: false, //是显示加载
      // 请求数据参数
      formInline: {},
      //用户数据
      panData: [],
      // 分页参数
      total: 100,
      listQuery: {
        page: 0,
        rows: 20,
        sort: "esc"
      },
      options: [
        {
          value: "esc",
          label: "升序"
        },
        {
          value: "desc",
          label: "降序"
        }
      ],
      optionsValue: "",
      sort: true,
      hidden: false
    };
  },
  // 注册组件
  components: {
    Pagination
  },
  /**
   * 数据发生改变
   */
  watch: {},

  /**
   * 创建完毕
   */
  created() {
    this.getdata(this.listQuery);
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    // 获取数据方法
    getdata(parameter) {
      this.hidden = false;
      parameter.sort = this.optionsValue;
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 1.5 * 1000);
      getPanList(parameter).then(response => {
        console.log(response);
        this.loading = false;
        this.total = response.data.count;
        this.panData = response.data.panList;
      });
    },

    // 分页插件事件

    //搜索事件
    search() {
      if (this.inputValue == "") {
        this.$message({
          message: "请输入账号",
          type: "error"
        });
        return;
      }
      this.panData = [];
      this.loading = true;
      this.hidden = true;
      getUserPan(this.inputValue)
        .then(res => {
          this.$message({
            message: res.msg,
            type: "success"
          });
          this.loading = false;
          this.total = 1;
          this.panData.push(res.data);
        })
        .catch(error => {
          this.getdata(this.listQuery);
        });
    },
    selectChange(value) {
      this.getdata(this.listQuery);
    },
    //显示编辑界面
    transferPan(index, row) {
      this.$prompt("请输入转账金额", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[0-9]*[1-9][0-9]*$/,
        inputErrorMessage: "请输入数字"
      }).then(({ value }) => {
        var data = {
          account: row.account,
          number: value
        };
        transfer(data).then(response => {
          this.$message({
            message: response.msg,
            type: "success"
          });
          this.panData[index].balance =
            Number(this.panData[index].balance) + Number(value);
        });
      });
    },
    freezeUserPan(index, row) {
      this.$prompt("请输入冻结金额", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[0-9]*[1-9][0-9]*$/,
        inputErrorMessage: "请输入数字"
      }).then(({ value }) => {
        freezeUserPan(row.id, value).then(response => {
          this.$message({
            message: response.msg,
            type: "success"
          });
          this.panData[index].balance =
            Number(this.panData[index].balance) - Number(value);
          this.panData[index].freeze =
            Number(this.panData[index].freeze) + Number(value);
        });
      });
    },
    unfreezeUserPan(index, row) {
      this.$prompt("请输入解冻金额", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[0-9]*[1-9][0-9]*$/,
        inputErrorMessage: "请输入数字"
      }).then(({ value }) => {
        unfreezeUserPan(row.id, value).then(response => {
          this.$message({
            message: response.msg,
            type: "success"
          });
          this.panData[index].balance =
            Number(this.panData[index].balance) + Number(value);
          this.panData[index].freeze =
            Number(this.panData[index].freeze) - Number(value);
        });
      });
    }
  },
  filters: {
    getFloat(number) {
      var n = 4;
      if (n <= 0) {
        return Math.round(number);
      }
      number = Math.round(number * Math.pow(10, n)) / Math.pow(10, n); //四舍五入
      number = Number(number).toFixed(n); //补足位数
      return number;
    }
  }
};
</script>

<style scoped>
.user-page {
  padding: 20px;
}
.select {
  width: 20%;
  margin-right: 5px;
}
.search-box {
  margin: 0 0 20px 0;
  width: 100%;
  display: flex;
  align-content: center;
}
.search-box .lift {
  display: inline-block;
}
.input {
  width: 20%;
  display: inline-block;
  margin: 0 10px;
}
.lift {
  margin-top: 5px;
  margin-left: 5px;
  margin-right: 10px;
  height: 30px;
  width: 14px;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}
.lift-icon {
  display: block;
  width: 14px;
  height: 10px;
  color: #c0c4cc;
}
.color {
  color: #409eff;
}
.userRole {
  width: 100%;
}
.button-avatar {
  border: none !important;
  padding: 0 !important;
}
</style>

 