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
      </span> -->

      <el-input placeholder="请输入搜索账号" v-model="inputValue" size="medium" clearable class="input"></el-input>
      <el-button class="button" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    </div>
    <!--列表-->
    <el-table
      size="small"
      :data="invList"
      highlight-current-row
      v-loading="loading"
      border
      element-loading-text="loading"
      style="width: 1200px;"
    >
      <el-table-column align="center" label="邀请人编号" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.uid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="邀请人用户名" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="邀请人账号" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.uaccount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="邀请码" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="被邀请人编号" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.toid}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="被邀请人名字" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.toname}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="被邀请人账号" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.toaccount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time |parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="transferPan(scope.$index, scope.row)">转账</el-button>
          <el-button size="mini" type="danger" @click="freezeUserPan(scope.$index, scope.row)">冻结</el-button>
          <el-button size="mini" type="warning" @click="unfreezeUserPan(scope.$index, scope.row)">解冻</el-button>
        </template>
      </el-table-column> -->
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
  getInviteList,
  queryInvite
} from "@/api/platform";
export default {
  data() {
    return {
      inputValue: "",
      loading: false, //是显示加载
      // 请求数据参数
      formInline: {},
      //用户数据
      invList:[],
      // 分页参数
      total: 10,
      listQuery: {
        page: 0,
        rows: 20,
        sort: "esc",
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
      parameter.sort = this.optionsValue
      this.hidden = false;
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 1.5 * 1000);
      getInviteList(parameter).then(response=>{
        console.log(response)
        this.loading = false;
        this.total = response.data.count;
        this.invList = response.data.invList;
        })
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
      this.loading = true;
      this.hidden = true;
      queryInvite(this.listQuery,this.inputValue)
        .then(res => {
          this.$message({
            message: res.msg,
            type: "success"
          });
          this.loading = false;
          this.total = 1;
          this.forceData.push(res.data);
        })
        .catch(error => {
          this.getdata(this.listQuery);
        });
    },
    selectChange(value) {
      this.getdata(this.listQuery);
    },
    
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

 