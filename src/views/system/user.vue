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
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >删除</el-button>
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
      <el-table-column label="账号" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column label="角色" width="110" align="center">
        <template slot-scope="scope">
          <el-tag size="medium">{{ scope.row.roleId }}</el-tag>
          <!-- <el-popover trigger="hover" placement="top">
          <p>姓名: {{ scope.row.name }}</p>
          <p>住址: {{ scope.row.account }}</p>
          <div slot="reference" class="name-wrapper"   >
            <el-tag size="medium" >{{ scope.row.roleId }}</el-tag>
          </div>
          </el-popover>-->
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="时间" width="250">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.regTime }}</span>
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
      <!-- 在el-dialog中进行嵌套el-form实现弹出表格的效果 -->
      <el-form :model="form">
        <el-form-item label="id" :label-width="formLabelWidth">
          <el-input v-model="form.id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="账号" :label-width="formLabelWidth">
          <el-input v-model="form.account" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="时间" :label-width="formLabelWidth">
          <el-input v-model="form.regTime" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="form.roleId" v-if="roleList" :placeholder="roleList[0].name">
            <div v-for="(role,index) in roleList " :key="index">
              <el-option :label="role.name" :value="role.id"></el-option>
            </div>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <!-- 设置触发更新的方法 -->
        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList,
  addUser,
  getRoleList,
  updateUser,
  deleteUser
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
      roleList: null,
      currentIndex: "",
      formLabelWidth: "80px",
      add: false
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getUserList().then(response => {
        this.list = response.data;
        this.listLoading = false;
      });
    },
    handleEdit(index, row) {
      getRoleList().then(response => {
        this.roleList = response.data;
      });

      this.form = this.list[index];
      (this.dialogFormVisible = true), (this.currentIndex = index);
    },
    handleDelete(index, row) {
      this.$confirm("永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: "warning"
      })
        .then(() => {
          console.log(11)
          deleteUser(id).then(response => {
            console.log(response);
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
      // this.$confirm('此操作将任务状态改为删除状态, 是否继续?', '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }).then(() => {
      //       console.log(11)
      //     }).catch(() => {
      //       //几点取消的提示
      //     });
    },
    update() {
      var userDate = JSON.parse(JSON.stringify(this.form));
      this.$delete(userDate, "regTime");

      if (this.add) {
        addUser(userDate).then(response => {
          this.list.push(this.form);
        });
      } else {
        updateUser(userDate).then(response => {
          this.list[this.currentIndex] = this.form;
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
      getRoleList().then(response => {
        this.roleList = response.data;
      });
      this.form = {
        id: "",
        account: "",
        password: "",
        username: "",
        roleId: "",
        regTime: ""
      };
      //   设置点击按钮之后进行显示对话框
      this.dialogFormVisible = true;
      this.add = true;
    }
  },
  roleInfo(id) {
    console.log(id);
  }
};
</script>

<style lang="scss" scoped>
.filter-container {
  margin: 10px;
}
</style>