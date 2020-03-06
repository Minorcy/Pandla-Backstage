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
      <!-- 
      <el-input placeholder="请输入搜索账号" v-model="inputValue" size="medium" clearable class="input"></el-input>
      <el-button class="button" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>-->
    </div>
    <!--列表-->
    <el-table
      size="small"
      :data="barList"
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
      <el-table-column align="center" label="logo" width="120">
        <template slot-scope="scope">
          <el-popover placement="right" width="400" height="400" trigger="hover">
            <el-image :src="scope.row.logo"></el-image>
            <el-button slot="reference" class="button-avatar">
              <div class="block">
                <el-avatar size="small" :src="scope.row.logo" fit="contain" lazy></el-avatar>
              </div>
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="位置" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="电话" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.userPhone}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="简介" width="150">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            :title="scope.row.name"
            width="200"
            trigger="hover"
            :content="scope.row.intro"
          >
            <span slot="reference">公益简介</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0" size="medium">待审核</el-tag>
          <el-tag v-if="scope.row.status == 1" size="medium" type="success">已通过</el-tag>
          <el-tag v-if="scope.row.status == 2" size="medium" type="danger">已禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="环境" width="300">
        <template slot-scope="scope">
          <div class="picture-box" v-for="(item,index) in scope.row.picture" :key="index">
            <el-popover
              class="picture-box"
              placement="right"
              width="400"
              height="400"
              trigger="hover"
              v-if="item!= 'undefined'"
            >
              <el-image :src="item"></el-image>
              <el-button slot="reference" class="button-avatar">
                <div class="block">
                  <el-avatar size="small" :src="item" fit="contain" shape="square" lazy></el-avatar>
                </div>
              </el-button>
            </el-popover>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime |parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="reviewBenefit(scope.$index, scope.row)">审核</el-button>
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
    <el-dialog title="审核" :visible.sync="dialogVisible" width="30%">
      <el-form :model="form" label-position="right">
        <el-form-item label="是否通过:" :rules="[
      { required: true, message: '请选择'}]">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option label="通过" value="1"></el-option>
            <el-option label="不通过" value="2"></el-option>
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
import { getBenefitList, reviewBenefit } from "@/api/organization";
export default {
  data() {
    return {
      inputValue: "",
      loading: false, //是显示加载
      // 请求数据参数
      form: {
        status:""
      },
      //用户数据
      barList: [],
      // 分页参数
      total: 10,
      listQuery: {
        page: 0,
        rows: 20,
        sort: "esc",
        sidx: "create_time"
      },
      options: [
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
      optionsValue: "",
      hidden: false,
      sort: true,
      dialogVisible: false
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
      parameter.status = this.optionsValue || 1;
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
      getBenefitList(parameter).then(response => {
        response.data.barList.filter(item => {
          item.picture = item.picture.split(",");
          for (var i = 0; i < item.picture.length; i++) {
            if (item.picture[i] == "undefined") {
              item.picture.splice(i, 1);
            }
          }
        //   console.log(item.picture);
        });
        setTimeout(() => {
          this.loading = false;
          this.total = response.data.count;
          this.barList = response.data.barList;
        }, 300);
      });
    },

    selectChange(value) {
      this.getdata(this.listQuery);
    },
    reviewBenefit(index, row) {
      this.dialogVisible = true;
      this.form.index = index;
      this.form.id = row.id;
    },
    chengSort() {
      this.sort = !this.sort;
      this.getdata(this.listQuery);
    },
    review() {
      
      if (this.form.status == "" ) {
        this.$message({
          message: "请选择审核内容",
          type: "error"
        });
        return;
      }
      reviewBenefit(this.form.id, this.form.status).then(response => {
        this.$message({
          message: response.msg,
          type: "success"
        });
      });
      this.dialogVisible = false;
       this.getdata(this.listQuery)
    },
    cancel() {
      this.dialogVisible = false;
      this.form = {
        status: "",
        delete: "",
        index: "",
        id: ""
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

 