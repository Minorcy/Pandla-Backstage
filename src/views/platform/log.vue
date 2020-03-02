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

      <span class="lift">
        <i class="el-icon-caret-top lift-icon" :class="[sort?'color':'']" @click="chengSort"></i>
        <i class="el-icon-caret-bottom lift-icon" :class="[!sort?'color':'']" @click="chengSort"></i>
      </span>

      <el-input placeholder="请输入搜索用户编号" v-model="inputValue" size="medium" clearable class="input"></el-input>
      <el-input
        placeholder="请输入点赞数"
        v-model="statusValue"
        type="number"
        size="medium"
        clearable
        class="input"
      ></el-input>
      <el-button class="button" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    </div>
    <!--列表-->
    <el-table
      size="small"
      :data="dynList"
      highlight-current-row
      v-loading="loading"
      border
      element-loading-text="loading"
    >
      <el-table-column align="center" label="编号" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.did }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户编号" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="账号" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发表图片" width="120">
        <template slot-scope="scope">
          <el-popover placement="right" width="400" height="400" trigger="hover">
            <el-image :src="scope.row.images"></el-image>
            <el-button slot="reference" class="button-avatar">
              <div class="block">
                <el-avatar size="small" :src="scope.row.images" shape="square" fit="fill" lazy></el-avatar>
              </div>
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发表内容" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="点赞数" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.like_count }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="获得pan数" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.pan }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发表时间" width="150">
        <template slot-scope="scope">
          <div>{{scope.row.create_time |parseTime('{y}-{m}-{d} {h}:{i}')}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="deleteDyn(scope.$index, scope.row)">删除</el-button>
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

import { getDynList, deleteDyn } from "@/api/platform";
export default {
  data() {
    return {
      inputValue: "",
      statusValue: "",
      loading: false, //是显示加载
      // 请求数据参数
      formInline: {},
      //用户数据
      dynList: [],
      // 分页参数
      total: 100,
      listQuery: {
        page: 0,
        rows: 20,
        sidx: "",
        sort: "esc",
        status: 0
      },
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      options: [
        {
          value: "create_time",
          label: "注册时间"
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
      if (this.sort) {
        parameter.sort = "esc";
      } else {
        parameter.sort = "desc";
      }
      parameter.sidx = '',
      parameter.status = 0
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 1.5 * 1000);
      getDynList(parameter)
        .then(response => {
          // console.log(response);
          this.loading = false;
          this.total = response.data.count;
          this.dynList = response.data.dynList;
        })
        .catch(error => {
          console.log("catched:", error);
        });
    },

    //搜索事件
    search() {
      if (this.inputValue == "" && this.statusValue == '') {
        this.$message({
          message: "请输入查询内容",
          type: "error"
        });
        return;
      }
      var searchData = {
        page: 0,
        rows: 20,
        sidx: this.inputValue,
        sort: "esc",
        status: this.statusValue
      };
      if (this.statusValue == "") {
        searchData.status = 0;
      }

      this.loading = true;
      this.hidden = true;

      getDynList(searchData)
        .then(res => {
          this.$message({
            message: res.msg,
            type: "success"
          });
          this.loading = false;
          // this.total = 1;
          this.dynList = res.data.dynList;
        })
        .catch(error => {
          this.getdata(this.listQuery);
        });
    },
    selectChange(value) {
      this.getdata(this.listQuery);
    },
    chengSort() {
      this.sort = !this.sort;
      this.getdata(this.listQuery);
    },
    //显示编辑界面
    deleteDyn(index, row) {
      this.$confirm("永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteDyn(row.did).then(response => {
            // console.log(response);
            // 移除对应索引位置的数据，可以对row进行设置向后台请求删除数据
            this.dynList.splice(index, 1);
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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

 