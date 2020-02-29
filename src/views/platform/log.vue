/**
 * 系统管理 用户管理
 */
<template>
  <div class="user-page">
    <!-- 搜索筛选 -->

    <div class="search-box">
      <el-select
        v-model="statusValue"
        placeholder="请选择账户类型"
        size="medium"
        @change="statusChange"
        class="select"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
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

      <el-input placeholder="请输入搜索账号" v-model="inputValue" size="medium" clearable class="input"></el-input>
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
      <el-table-column align="center" label="头像" width="120">
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
      <el-table-column align="center" label="点赞数" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.like_count }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="获得pan数" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.pan }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发表时间" width="120">
        <template slot-scope="scope">
          <div>{{scope.row.create_time |parseTime('{y}-{m}-{d} {h}:{i}')}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120" >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="disableNode(scope.$index, scope.row)"
          >删除</el-button>
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
  getUsersList,
  updateUsers,
  openNode,
  searchUsers,getDynList
} from "@/api/platform";
export default {
  data() {
    return {
      inputValue: "",
      loading: false, //是显示加载
      // 请求数据参数
      formInline: {},
      //用户数据
      userData: [],
      dynList:[],
      // 分页参数
      total: 100,
      listQuery: {
        page: 0,
        rows: 20,
        sidx: "id",
        sort: "esc",
        status: 2
      },
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      options: [
        {
          value: "id",
          label: "编号"
        },
        {
          value: "create_time",
          label: "注册时间"
        }
      ],
      optionsValue: "",
      sort: true,
      statusOptions: [
        {
          value: "0",
          label: "正常"
        },
        {
          value: "1",
          label: "已禁用"
        },
        {
          value: "2",
          label: "全部"
        }
      ],
      statusValue: "",
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
      getDynList(parameter).then(response => {


        console.log(response);
        this.total = response.data.count;
        this.dynList = response.data.dynList
      });
      this.hidden = false;
      parameter.sidx = this.optionsValue || "id";
      if (this.sort) {
        parameter.sort = "esc";
      } else {
        parameter.sort = "desc";
      }
      parameter.status = this.statusValue || 2;
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 1.5 * 1000);
      getUsersList(parameter)
        .then(response => {
          // console.log(response);
          this.loading = false;
          this.total = response.data.count;
          this.userData = response.data.list;
        })
        .catch(error => {
          console.log("catched:", error);
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
      // this.userData = [];
      this.loading = true;
      this.hidden = true;
      searchUsers(this.inputValue)
        .then(res => {
          this.$message({
            message: res.msg,
            type: "success"
          });
          this.loading = false;
          this.total = 1;
          this.userData.push(res.data);
        })
        .catch(error => {
          this.getdata(this.listQuery);
        });
    },
    statusChange(value) {
      this.getdata(this.listQuery);
    },
    selectChange(value) {
      this.getdata(this.listQuery);
    },
    chengSort() {
      this.sort = !this.sort;
      this.getdata(this.listQuery);
    },
    //显示编辑界面
    disableUsers(index, row) {
      updateUsers(row.id, 1).then(res => {
        this.$message({
          message: res.msg,
          type: "success"
        });
        this.userData[index].status = 1;
      });
    },
    openUsers(index, row) {
      updateUsers(row.id, 0).then(res => {
        this.$message({
          message: res.msg,
          type: "success"
        });
        this.userData[index].status = 0;
      });
    },
    openNode(index, row) {
      openNode(row.id, 1).then(res => {
        this.$message({
          message: res.msg,
          type: "success"
        });
        this.userData[index].role = 1;
      });
    },
    disableNode(index, row) {
      openNode(row.id, 0).then(res => {
        this.$message({
          message: res.msg,
          type: "success"
        });
        this.userData[index].role = 0;
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

 