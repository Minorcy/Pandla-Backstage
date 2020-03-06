
  /**
 * 系统管理 用户管理
 */
<template>
  <div class="user-page">
    <!-- 搜索筛选 -->

    <div class="search-box">
      <el-select
        v-model="optionsValue"
        placeholder="请选择类型"
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
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
      <!-- 
      <el-input placeholder="请输入搜索账号" v-model="inputValue" size="medium" clearable class="input"></el-input>
      <el-button class="button" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>-->
    </div>
    <!--列表-->
    <el-table
      size="small"
      :data="advertList"
      highlight-current-row
      v-loading="loading"
      border
      element-loading-text="loading"
      style="width: 100%;"
    >
      <el-table-column align="center" label="编号" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.parentName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0" size="medium" type="success">进行中</el-tag>
          <el-tag v-if="scope.row.status == 1" size="medium" type="danger">已结束</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片" width="120">
        <template slot-scope="scope">
          <el-popover placement="right" width="400" height="400" trigger="hover">
            <el-image :src="scope.row.picture"></el-image>
            <el-button slot="reference" class="button-avatar">
              <div class="block">
                <el-avatar size="small" :src="scope.row.picture" fit="contain" lazy></el-avatar>
              </div>
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="内容" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.info}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="连接" width="150">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            :title="scope.row.name"
            width="200"
            trigger="hover"
            :content="scope.row.url"
          >
            <span slot="reference">外部连接</span>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column align="center" label="开始时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.startDate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="结束时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.endDate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate |parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="endAdvert(scope.$index, scope.row)">结束</el-button>
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
    <el-dialog title="编辑" :visible.sync="dialogVisible" width="60%">
      <el-form :model="form" label-position="right">
        <el-form-item label="编号" :label-width="formLabelWidth">
          <el-input v-model="form.id" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-select v-model="form.parentId" placeholder="请选择">
            <div v-for="(advert,index) in advertTypeList " :key="index">
              <el-option :label="advert.name" :value="advert.id"></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="2" v-model="form.picture" autosize></el-input>
          <el-upload
            class="upload-demo"
            action="http://pandla.io:8848/web/file/uploadFile"
            :headers="headers"
            :on-success="upload"
          >
            <el-button icon="el-icon-upload" size="mini">点击上传图片</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="2" v-model="form.info" auto-complete="off" autosize></el-input>
        </el-form-item>
        <el-form-item label="外部链接" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="2" v-model="form.url" auto-complete="off" autosize></el-input>
        </el-form-item>
        <el-form-item label="开始时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.startDate"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd hh-mm-ss"
            value-format="yyyy-MM-dd hh-mm-ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.endDate"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd hh-mm-ss"
            value-format="yyyy-MM-dd hh-mm-ss"
          ></el-date-picker>
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
  getAdvertList,
  getAdvertTypeList,
  updateAdvert,
  addAdvert,
  deleteAdvert,
  endAdvert
} from "@/api/advertising";
import { getToken } from "@/utils/auth.js";

export default {
  data() {
    return {
      inputValue: "",
      loading: false, //是显示加载
      // 请求数据参数
      form: {
        status: ""
      },
      //用户数据
      advertList: [],
      // 分页参数
      total: 10,
      listQuery: {
        page: 0,
        rows: 10,
        sort: "esc",
        sidx: "create_time"
      },
      options: [
        {
          value: "0",
          label: "全部"
        },
        {
          value: "1",
          label: "已结束"
        }
      ],
      optionsValue: "",
      hidden: false,
      sort: true,
      dialogVisible: false,
      advertTypeList: "",
      formLabelWidth: "80px",
      add: false,
      headers: {
        Authorization: getToken()
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
      parameter.status = this.optionsValue || 0;
      if (this.sort) {
        parameter.sort = "esc";
      } else {
        parameter.sort = "desc";
      }
      this.hidden = false;
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 1.5 * 1000);
      getAdvertTypeList().then(response => {
        this.advertTypeList = response.data;
      });
      getAdvertList(parameter).then(response => {
        this.loading = false;
        this.total = response.data.count;
        this.advertList = response.data.advertList;
      });
    },

    selectChange(value) {
      this.getdata(this.listQuery);
    },
    chengSort() {
      this.sort = !this.sort;
      this.getdata(this.listQuery);
    },
    endAdvert(index, row) {
      this.$confirm("结束广告, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        endAdvert(row.id).then(response => {
          console.log(response);
          // 移除对应索引位置的数据，可以对row进行设置向后台请求删除数据
          this.advertList.splice(index, 1);
          this.$message({
            type: "success",
            message: "结束成功!"
          });
        });
      });
    },
    handleEdit(index, row) {
      this.add = false;
      this.dialogVisible = true;
      this.form = this.advertList[index];
    },
    upload(response, file) {
      // console.log(response)
      this.form.picture = response.data;
    },
    review() {
      this.form.status = 0;
      console.log(this.form);
      if (this.add) {
        addAdvert(this.form).then(response => {
          this.$message({
            type: "success",
            message: response.msg
          });
          this.getdata(this.listQuery);
          this.dialogVisible = false;
        });
      } else {
        updateAdvert(this.form).then(response => {
          this.$message({
            type: "success",
            message: response.msg
          });
          this.getdata(this.listQuery);
          this.dialogVisible = false;
        });
      }
    },
    cancel() {
      this.dialogVisible = false;
      this.form = {};
    },
    handleCreate() {
      this.dialogVisible = true;
      this.add = true;
      this.form = {
        endDate: "",
        id: "",
        info: "",
        name: "",
        parentId: "",
        picture: "",
        startDate: "",
        status: 0,
        url: ""
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
.picture-box {
  display: inline-block;
  margin: 0 5px;
}
</style>

 