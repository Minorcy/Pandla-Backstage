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

      <!-- <span class="lift">
        <i class="el-icon-caret-top lift-icon" :class="[sort?'color':'']" @click="chengSort"></i>
        <i class="el-icon-caret-bottom lift-icon" :class="[!sort?'color':'']" @click="chengSort"></i>
      </span>-->

      <!-- <el-input placeholder="请输入搜索账号" v-model="inputValue" size="medium" clearable class="input"></el-input>
      <el-button class="button" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>-->
    </div>
    <!--列表-->
    <el-table
      size="small"
      :data="reportList"
      highlight-current-row
      v-loading="loading"
      border
      element-loading-text="loading"
      style="width: 1342px;"
    >
      <el-table-column align="center" label="编号" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="举报者" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.report_name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="举报者编号" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.report_uid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="举报内容" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.report_describe }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片" width="120">
        <template slot-scope="scope">
          <el-popover placement="right" width="400" height="400" trigger="hover">
            <el-image :src="scope.row.images"></el-image>
            <el-button slot="reference" class="button-avatar">
              <div class="block">
                <el-avatar size="small" :src="scope.row.images" fit="contain" lazy shape="square"></el-avatar>
              </div>
            </el-button>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column align="center" label="被举报者" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.to_report_name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="被举报者编号" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.to_report_uid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0" size="medium">待审核</el-tag>

          <el-tag v-if="scope.row.status == 1" size="medium" type="danger">已通过</el-tag>
          <el-tag v-if="scope.row.status == 2" size="medium" type="info">不通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="举报时间" width="150">
        <template slot-scope="scope">
          <div>{{scope.row.report_create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-if="scope.row.status != 1 & scope.row.status != 2"
            type="primary"
            @click="reviewReport(scope.$index, scope.row)"
          >审核</el-button>
          <!-- <el-button
            size="mini"
            type="danger"
            v-if="scope.row.status != 2"
            @click="confirmDelete(scope.$index, scope.row)"
          >删除日志</el-button>-->
          <el-button size="mini" type="danger" @click="deleteReport(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog title="审核举报" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form :model="form" label-position="right">
        <el-form-item label="是否通过:" :rules="[
      { required: true, message: '请选择'}]">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option label="通过" value="1"></el-option>
            <el-option label="不通过" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否删除日志:">
          <el-select v-model="form.delete" placeholder="请选择">
            <el-option label="删除" value="1"></el-option>
            <el-option label="不删除" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <!-- 设置触发更新的方法 -->
        <el-button type="primary" @click="review">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入请求方法

import Pagination from "@/components/Pagination";

import {
  getReportList,
  reviewReport,
  confirmDelete,
  deleteReport
} from "@/api/platform";
export default {
  data() {
    return {
      inputValue: "",
      loading: false, //是显示加载
      // 请求数据参数
      formInline: {},
      //用户数据
      reportList: [],
      userData: [],
      // 分页参数
      total: 100,
      listQuery: {
        page: 0,
        rows: 20,

        sort: "esc",
        status: 0
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
      statusOptions: [
        {
          value: "0",
          label: "待审核"
        },
        {
          value: "1",
          label: "已通过"
        },
        {
          value: "2",
          label: "不通过"
        }
      ],
      statusValue: "",
      hidden: false,
      dialogVisible: false,
      form: {
        status: "",
        delete: "",
        index: "",
        id: "",
        did: ""
      }
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
      parameter.sort = this.optionsValue || "esc";
      parameter.status = this.statusValue || 0;
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 1.5 * 1000);
      getReportList(parameter).then(response => {
        this.loading = false;
        this.total = response.data.count;
        this.reportList = response.data.reportList;
      });
    },
    statusChange(value) {
      this.getdata(this.listQuery);
    },
    selectChange(value) {
      this.getdata(this.listQuery);
    },

    //显示编辑界面
    reviewReport(index, row) {
      this.dialogVisible = true;
      this.form.index = index;
      this.form.id = row.id;
      this.form.did = row.did;
    },
    deleteReport(index, row) {
      deleteReport(row.id).then(response => {
        this.reportList.splice(index, 1);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });
    },
    review() {
      // console.log(this.form)
      if (this.form.status == "" || this.form.delete == "") {
        this.$message({
          message: "请输入审核内容",
          type: "error"
        });
        return;
      }
      reviewReport(this.form.id, this.form.status).then(response => {
        this.$message({
          message: response.msg,
          type: "success"
        });
      });
      this.dialogVisible = false;
      if (this.form.delete == 1) {
        confirmDelete(this.form.did).then(response => {});
      }
    },
    handleClose() {
      this.dialogVisible = false;
      this.form = {
        status: "",
        delete: "",
        index: "",
        id: "",
        did: ""
      };
    },
    cancel() {
      this.dialogVisible = false;
      this.form = {
        status: "",
        delete: "",
        index: "",
        id: "",
        did: ""
      };
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

 