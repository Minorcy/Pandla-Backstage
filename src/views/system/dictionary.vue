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

    <el-row :gutter="8">
      <el-col
        :xs="{span: 24}"
        :sm="{span: 24}"
        :md="{span: 24}"
        :lg="{span: 12}"
        :xl="{span: 12}"
        style="padding-right:8px;margin-bottom:30px;"
      >
        <el-table
          v-loading="listLoading"
          :data="panList"
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
          <el-table-column label="类型" width="110" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.type }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="250" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row,1)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row, 1)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col
        :xs="{span: 24}"
        :sm="{span: 24}"
        :md="{span: 24}"
        :lg="{span: 12}"
        :xl="{span: 12}"
        style="padding-right:8px;margin-bottom:30px;"
      >
        <el-table
          v-loading="listLoading"
          :data="ylList"
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
          <el-table-column label="类型" width="110" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.type }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="250" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row,2)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row,2)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog title="用户信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="id" :label-width="formLabelWidth">
          <el-input v-model="form.id" auto-complete="off" :disabled="add"></el-input>
        </el-form-item>
        <el-form-item label="名字" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-input v-model="form.type" auto-complete="off"></el-input>
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
import { getDictList, addDictn, updateDict, deleteDict } from "@/api/system";

export default {
  data() {
    return {
      ylList: null,
      panList: null,
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
      getDictList().then(response => {
        this.ylList = response.data.ylList;
        this.panList = response.data.panList;
        this.listLoading = false;
      });
    },
    handleEdit(index, row, type) {
      this.add = false;
      if (type == 1) {
        this.form = this.panList[index];
      } else {
        this.form = this.ylList[index];
      }

      (this.dialogFormVisible = true), (this.currentIndex = index);
    },
    handleDelete(index, row, type) {
      this.$confirm("永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteDict(row).then(response => {
            // 移除对应索引位置的数据，可以对row进行设置向后台请求删除数据
            if (type == 1) {
              this.panList.splice(index, 1);
            } else {
              this.ylList.splice(index, 1);
            }
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
      console.log(this.form);
      if (this.add) {
        addDictn(this.form).then(response => {
          this.fetchData();
        });
      } else {
        updateDict(this.form).then(response => {
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
      this.checkedPermission = [];
      this.form = {
        id: "",
        name: "",
        type: ""
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