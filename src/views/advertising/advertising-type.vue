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
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>

      <el-table-column label="名字" width="250" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
    
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="用户信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="id" :label-width="formLabelWidth">
          <el-input v-model="form.id" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="名字" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
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
import { getAdvertTypeList,addAdvertType,updateAdvertType} from "@/api/advertising";


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
      getAdvertTypeList().then(response => {
        this.list = response.data;
        this.listLoading = false;
      });
    },
    handleEdit(index, row) {
      this.add = false;
      this.form = this.list[index];
      (this.dialogFormVisible = true), (this.currentIndex = index);
    },
   
    update() {
      console.log(this.form);
      if (this.add) {
        addAdvertType(this.form.name).then(response => {
          this.fetchData();
        });
      } else {
        updateAdvertType(this.form.id,this.form.name).then(response => {
          this.list[this.currentIndex] = this.form
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