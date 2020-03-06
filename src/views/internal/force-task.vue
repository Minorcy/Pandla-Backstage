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
      <el-table
        v-loading="listLoading"
        :data="forceList"
        element-loading-text="Loading"
        highlight-current-row
      >
        <el-table-column align="center" label="ID" width="95">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="任务名" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="奖励" width="110" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.number }}</span>
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
            <el-input v-model="form.id" auto-complete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="任务名" :label-width="formLabelWidth">
            <el-input v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="奖励" :label-width="formLabelWidth">
            <el-input v-model="form.number" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <!-- 设置触发更新的方法 -->
          <el-button type="primary" @click="update">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getTaskList, addTask, deleteTask, updateTask } from "@/api/internal";
import { getToken } from "@/utils/auth.js";

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
      forceList: null,
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
      getTaskList().then(response => {
        // console.log(response);
        this.forceList = response.data.ylList;
        this.listLoading = false;
      });
    },
    handleEdit(index, row) {
      this.add = false;
      this.form = this.forceList[index];
      (this.dialogFormVisible = true), (this.currentIndex = index);
    },
    handleDelete(index, row) {
      this.$confirm("永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteTask(row.id, 2).then(response => {
            // console.log(response);
            // 移除对应索引位置的数据，可以对row进行设置向后台请求删除数据
            this.forceList.splice(index, 1);
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
      var data = this.form;
      data.status = 2;
      if (this.add) {
        addTask(data).then(response => {
          this.$message({
            type: "success",
            message: response.msg
          });
          this.fetchData();
        });
      } else {
        updateTask(data).then(response => {
          this.$message({
            type: "success",
            message: response.msg
          });
          this.fetchData();
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
      this.form = {
        id: "",
        name: "",
        number: ""
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