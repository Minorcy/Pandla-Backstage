
 <template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate(1)"
      >添加文字公告</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate(2)"
      >添加图片公告</el-button>
    </div>
    <el-table
      size="small"
      :data="briefList"
      highlight-current-row
      v-loading="listLoading"
      border
      element-loading-text="loading"
      style="width:852px"
    >
      <el-table-column type="expand" width="50">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="简介">
              <span>{{ props.row.context }}</span>
            </el-form-item>
            <el-form-item label="描述">
              <el-link
                v-if="props.row.type"
                :href="props.row.info"
                target="_blank"
                type="primary"
              >{{ props.row.info }}</el-link>
              <span v-if="!props.row.type">{{ props.row.info }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="id" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标题" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发表时间" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime || '' |parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
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
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input v-model="form.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.context" autosize></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input
            v-if="!form.type"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="form.info"
            autosize
          ></el-input>
          <el-input
            v-if="form.type"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="form.info"
            autosize
          ></el-input>
          <el-upload
            v-if="form.type"
            class="upload-demo"
            action="http://pandla.io:8848/web/file/uploadFile"
            :headers="headers"
            :on-success="upload"
          >
            <el-button icon="el-icon-upload" size="mini">点击上传图片</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="发表时间" :label-width="formLabelWidth">
          <el-input v-model="form.createTime" auto-complete="off" disabled></el-input>
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
  getBriefList,
  addBrief,
  deleteBrief,
  updateBrief
} from "@/api/internal";
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
      briefList: null,
      listLoading: true,
      reg: /(http|https):\/\/([\w.]+\/?)\S*/,
      headers: {
        Authorization: getToken()
      },
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
      getBriefList().then(response => {
        response.data.filter(item => {
          item.type = "";
          if (this.reg.exec(item.info)) {
            // console.log(item.info);
            item.type = "images";
          }
        });
        setTimeout(() => {
          this.briefList = response.data;
          this.listLoading = false;
        }, 300);
      });
    },
    handleEdit(index, row) {
      this.add = false;
      this.form = this.briefList[index];
      (this.dialogFormVisible = true), (this.currentIndex = index);
    },
    upload(response, file) {
      // console.log(response)
      this.form.info = response.data;
    },
    handleDelete(index, row) {
      this.$confirm("永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteBrief(row.id).then(response => {
            // console.log(response);
            // 移除对应索引位置的数据，可以对row进行设置向后台请求删除数据
            this.briefList.splice(index, 1);
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
      var data = {
        context: this.form.context,
        id: this.form.id,
        info: this.form.info,
        title: this.form.title
      };
      if (this.add) {
        addBrief(data).then(response => {
         this.$message({
              type: "success",
              message: response.msg
            });
          this.fetchData();
        });
      } else {
        updateBrief(data).then(response => {
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
    handleCreate(type) {
       this.form = {
        id: "",
        title: "星球公告",
        info: "",
        context: "",
        createTime: "",
        type:''
      };
      if(type == 2){
        this.form.type = 'imgage'
      }
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