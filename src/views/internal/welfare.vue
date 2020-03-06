<template>
  <div class="welfare-page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="margin:10px 5px;display: inline-block;">公益活动</span>
        <el-button
          style="float: right;margin: 0 10px"
          type="danger"
          @click="endActivity"
          v-if="disabled"
        >立即结束</el-button>
        <el-button style="float: right; " type="primary" @click="edit" v-if="disabled">编辑</el-button>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="活动id" :label-width="formLabelWidth">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="活动内容" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="2" autosize v-model="form.text" :disabled="disabled"></el-input>
        </el-form-item>

        <el-form-item label="活动图片" :label-width="formLabelWidth" v-if="disabled">
          <el-popover placement="right" width="400" height="400" trigger="hover">
            <el-image :src="form.image"></el-image>
            <el-button slot="reference" class="button-avatar">
              <div class="block">
                <el-link type="primary">{{form.image}}</el-link>
              </div>
            </el-button>
          </el-popover>
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth" v-if="!disabled">
          <el-input type="textarea" :rows="2" v-model="form.image" autosize></el-input>
          <el-upload
            class="upload-demo"
            action="http://pandla.io:8848/web/file/uploadFile"
            :headers="headers"
            :on-success="upload"
          >
            <el-button icon="el-icon-upload" size="mini">点击上传图片</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-switch v-model="form.status" :disabled="disabled"></el-switch>
        </el-form-item>

        <el-form-item label="开始时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            :disabled="disabled"
            placeholder="选择日期时间"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <!-- <el-input v-model="form.startTime" :disabled="disabled"></el-input> -->
        </el-form-item>
        <el-form-item label="结束时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            :disabled="disabled"
            placeholder="选择日期时间"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <!-- <el-input v-model="form.endTime" :disabled="disabled"></el-input> -->
        </el-form-item>

        <el-form-item v-if="!disabled">
          <el-button type="primary" @click="update()">立即修改</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getPollActivity, updateActivity, endActivity } from "@/api/internal";
import { getToken } from "@/utils/auth.js";

export default {
  data() {
    return {
      form: {},
      formLabelWidth: "80px",
      disabled: true,
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
      getPollActivity().then(response => {
        this.form = response.data[0];
        if (this.form.status == 1) {
          this.form.status = true;
        } else {
          this.form.status = false;
        }
      });
    },
    edit() {
      this.disabled = false;
    },
    cancel() {
      this.disabled = true;
    },
    upload(response, file) {
      this.form.image = response.data;
    },
    update() {
      if (this.form.status) {
        this.form.status = 1;
      } else {
        this.form.status = 2;
      }
      console.log(this.form);
      updateActivity(this.form).then(response => {
        this.$message({
          type: "success",
          message: response.msg
        });
        this.fetchData();
         this.disabled = true;
      });
    },
    endActivity() {
      endActivity(this.form.id).then(response => {
        this.$message({
          type: "success",
          message: response.msg
        });
        this.fetchData();
      });
    }
  }
};
</script>
<style  scoped>
.welfare-page {
  padding: 20px;
  width: 80%;
  margin: 0 auto;
}
</style>