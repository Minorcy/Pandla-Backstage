/**
 * 系统管理 用户管理
 */
<template>
  <div class="user-page">
    <!-- 搜索筛选 -->

    <div class="search-box">
      <el-select v-model="optionsValue" placeholder="请选择排列顺序" size="medium" @change="selectChange">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input placeholder="请输入搜索内容" v-model="inputValue" size="medium" class="input"></el-input>
      <el-button class="button" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    </div>
    <!--列表-->
    <el-table
      size="small"
      @selection-change="selectChange"
      :data="userData"
      highlight-current-row
      v-loading="loading"
      border
      element-loading-text="loading"
      style="width: 100%;"
    >
      <el-table-column align="center" label="编号" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="头像" width="120">
        <template slot-scope="scope">
          <div class="block">
            <el-avatar :size="50" :src="scope.row.portrait" fit="cover" lazy></el-avatar>
          </div>
          <!-- <el-image :src="scope.row.portrait" fit="cover" lazy>
            <div slot="placeholder" class="image-slot">
              加载中
              <span class="dot">...</span>
            </div>
          </el-image>-->
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="账号" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.phone||scope.row.email }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="邮箱" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>-->
      <el-table-column align="center" label="状态" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0" size="medium" type="success">正常</el-tag>
          <el-tag v-if="scope.row.status == 1" size="medium" type="info">已禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="身份" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.role == 0" size="medium">普通用户</el-tag>
          <el-tag v-if="scope.row.role == 1" size="medium" type="danger">节点</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="位置" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.site }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.acctType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="年龄" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.age }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="身高" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.stature }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="体重" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.weight }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="签名" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.signature }}</span>
        </template> 
      </el-table-column>-->
      <el-table-column align="center" label="注册时间" width="120">
        <template slot-scope="scope">
          <div>{{scope.row.createTime}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最后上线时间" width="120">
        <template slot-scope="scope">
          <div>{{scope.row.loginTime}}</div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-if="scope.row.status == 0"
            type="danger"
            @click="handleEdit(scope.$index, scope.row)"
          >禁用</el-button>
          <el-button
            size="mini"
            v-if="scope.row.status == 1"
            type="success"
            @click="handleEdit(scope.$index, scope.row)"
          >解除禁用</el-button>
          <el-button
            size="mini"
            v-if="scope.row.role == 0"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
          >开启节点</el-button>
          <el-button
            size="mini"
            v-if="scope.row.role == 1"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
          >关闭节点</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :rows.sync="listQuery.rows"
      @pagination="getdata"
    />
  </div>
</template>

<script>
// 导入请求方法

import Pagination from "@/components/Pagination";
import { getUsersList } from "@/api/platform";
export default {
  data() {
    return {
      inputValue: "",
      loading: false, //是显示加载
      // 请求数据参数
      formInline: {},
      //用户数据
      userData: [],
      // 分页参数
      total: 100,
      listQuery: {
        page: 0,
        rows: 20,
        sidx: "id",
        sort: "esc"
      },
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
       options: [{
          value: 'id',
          label: '编号'
        }, {
          value: 'create_time',
          label: '注册时间'
        }],
        optionsValue:''
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
      parameter.sidx = this.optionsValue || "id"
      this.loading = true;
      getUsersList(parameter).then(response => {
        console.log(response);
        this.loading = false;
        this.total = response.data.count;
        this.userData = response.data.list;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    // 分页插件事件

    //搜索事件
    search() {
      this.getdata(this.formInline);
    },
    selectChange(value){
      this.getdata(this.listQuery);
    }

    //显示编辑界面
  }
};
</script>

<style scoped>
.user-page {
  padding: 20px;
}
.search-box {
  margin: 0 0 20px 0;
  width: 100%;
}
.input {
  width: 15%;
  display: inline-block;
  margin-right: 10px;
}
.userRole {
  width: 100%;
}
</style>

 