<template>
  <div class="invitation-page">
   
    <el-upload
      class="upload-demo"
      action="http://pandla.io:8848/web/file/uploadFile"
      :headers="headers"
      :on-success="upload"
      :show-file-list="false"
    >
     
     <el-button icon="el-icon-upload" size="mini" style=" height: 40px;">点击上传图片</el-button>

    </el-upload>

    <el-table
      size="small"
      :data="imgList"
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
      <el-table-column align="center" label="状态" width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0" size="medium" type="success">启用</el-tag>
          <el-tag v-if="scope.row.status == 1" size="medium" type="danger">已禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片">
        <template slot-scope="scope">
          <el-popover placement="right" width="400" height="400" trigger="hover">
            <el-image :src="scope.row.url"></el-image>
            <el-button slot="reference" class="button-avatar">
              <div class="block">
                <el-link type="primary">{{scope.row.url}}</el-link>
              </div>
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate |parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="deleteInvImg(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getInvImgList, addInvImg, deleteInvImg } from "@/api/internal";
import { getToken } from "@/utils/auth.js";

export default {
  data() {
    return {
      imgList: "",
      formLabelWidth: "80px",
      disabled: true,
      loading: true,
      headers: {
        Authorization: getToken()
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.loading = true;
      getInvImgList().then(response => {
        this.loading = false;
        this.imgList = response.data;
      });
    },

    upload(response, file) {
      addInvImg(response.data).then(response => {
        // console.log(response);
        this.$message({
          type: "success",
          message: response.msg
        });
        this.fetchData();
      });
    },
    deleteInvImg(index, row) {
      this.$confirm("删除海报, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteInvImg(row.id).then(response => {
          console.log(response);
          this.imgList.splice(index, 1);
          this.$message({
            type: "success",
            message: response.msg
          });
        });
      });
    }
  }
};
</script>
<style  scoped>
.invitation-page {
  padding: 20px;
  width: 100%;
  min-height: 100%;
  margin: 0 auto;
}
.img-box {
  margin: 10px;
}
.time {
  display: inline-block;
  line-height: 2.5;
  font-size: 16px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
.upload-demo {
  display: block;
  margin-bottom: 10px ;
}
</style>