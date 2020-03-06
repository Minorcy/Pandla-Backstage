<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>

      <el-table-column label="名字" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.permission }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="用户信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="id" :label-width="formLabelWidth">
          <el-input v-model="form.id" auto-complete="off" :disabled="add"></el-input>
        </el-form-item>
        <el-form-item label="名字" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限" :label-width="formLabelWidth">
          <el-checkbox-group
            v-model="checkedPermission"
            @change="checkboxChange"
            v-if="dialogFormVisible"
          >
            <el-checkbox
              v-for="(item,index) in permissionList"
              :label="item.id"
              :key="index"
            >{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>

        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  updateRole,
  getRoleInfo,
  deleteRole,
  addRole,
  getPermissionList
} from "@/api/system";
import { getToken } from "@/utils/auth.js";
import { getList } from "@/api/table";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogFormVisible: false,
      form: {},
      permissionList: null,
      currentIndex: "",
      formLabelWidth: "80px",
      add: false,
      checkedPermission: [],
      checkedPermissionOptions: ""
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getRoleList().then(response => {
        this.list = response.data;
        this.listLoading = false;
      });
      getPermissionList().then(response => {
        console.log(response.data);
        this.permissionList = response.data;
      });
    },
    handleEdit(index, row) {
      this.add = false;
      var str = row.permission;
      if (row.permission) {
        this.checkedPermission = str.split(",");
        this.checkedPermission = this.checkedPermission.map(Number);
      } else {
        this.checkedPermission = [];
      }
      this.form = this.list[index];
      (this.dialogFormVisible = true), (this.currentIndex = index);
    },
    handleDelete(index, row) {
      this.$confirm("永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteRole(row.id).then(response => {
            // 移除对应索引位置的数据，可以对row进行设置向后台请求删除数据
            this.list.splice(index, 1);
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
    },
    update() {
      // var userDate = JSON.parse(JSON.stringify(this.form));
      // userDate.permission = this.checkedPermissionOptions
      this.form.permission = this.checkedPermissionOptions;
      console.log(this.form);
      if (this.add) {
        addRole(this.form).then(response => {
          this.$message({
            type: "success",
            message: response.msg
          });
          this.fetchData();
        });
      } else {
        updateRole(this.form).then(response => {
          this.list[this.currentIndex] = this.form.permission;
          this.$message({
            type: "success",
            message: response.msg
          });
          // console.log(this.list)
        });
      }
      this.add = false;
      this.dialogFormVisible = false;
    },
    cancel() {
      // 取消的时候直接设置对话框不可见即可
      this.dialogFormVisible = false;
    },
    handleCreate() {
      this.checkedPermission = [];
      this.form = {
        id: "",
        name: "",
        permission: ""
      };
      //   设置点击按钮之后进行显示对话框
      this.dialogFormVisible = true;
      this.add = true;
    },
    checkboxChange(data) {
      this.checkedPermissionOptions = data.toString();
    }
  }
};
</script>

<style lang="scss" scoped>
.filter-container {
  margin: 10px;
}
</style>