  <template>
   <el-table
      v-loading="!rewardData"
      :data="rewardData.list"
      element-loading-text="Loading"
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="账号"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名字" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="奖励数量" align="center">
       <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
    </el-table>
  </template>

  <script>
    export default {
      props:{
        rewardData:{
          tpye:Object
        }
      },
      mounted() {
        console.log(this.rewardData)
      },
    }
  </script>