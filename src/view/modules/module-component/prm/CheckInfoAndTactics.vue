<template>
  <el-container id="check">
    <el-header style="height:87px;padding-left:0;">
      <div
        style="height:30px;line-height: 20px;color: #000;font-size:16px;font-weight:700;padding-left:5px;"
      >
        <span>平台角色信息</span>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        :header-cell-style="{
          background: '#999',
          color: '#fff',
          fontWeight: 400,
          padding: '5px 0'
        }"
      >
        <el-table-column prop="code" label="角色代码" width="180">
        </el-table-column>
        <el-table-column prop="name" label="角色名称" width="180">
        </el-table-column>
        <el-table-column prop="remark" label="角色描述"></el-table-column>
        <el-table-column prop="disableFlag" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.disableFlag === 0">在用</span>
            <span v-if="scope.row.disableFlag === 1">停用</span>
          </template>
        </el-table-column>
      </el-table>
    </el-header>
    <el-main style="padding-left:0;">
      <div
        style="height:30px;line-height: 20px;color: #000;font-size:16px;font-weight:700;padding-left:5px;"
      >
        <span>权限信息</span>
      </div>
      <div style="height:180px;overflow:auto;">
        <el-tree
          :data="data"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          :default-expanded-keys="useMenuTree"
          :default-checked-keys="useMenuTree"
          ref="tree"
        >
        </el-tree>
      </div>
    </el-main>
    <el-footer>
      <el-button style="margin-top: 12px;" @click="last()">
        上一步
      </el-button>
      <el-button
        type="primary"
        style="margin-top: 12px;"
        @click="handleActive()"
      >
        完成
      </el-button>
    </el-footer>
  </el-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "CheckInfoAndTactics",
  props: {
    useMenuTree: {
      type: Array
    }
  },
  data() {
    return {
      tableData: [
        {
          code: "001", //角色代码
          name: "test001", //角色名称
          disableFlag: 0, //状态
          remark: "test001" //角色描述
        }
      ],
      data: [],
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  created() {
    this.getMenuTree();
  },
  methods: {
    //获取菜单
    getMenuTree() {
      this.axios
        .get("http://192.168.0.40:9900/uc/sys/menu/tree", {
          params: { parentId: 0 },
          headers: { authorization: this.tokenValue }
        })
        .then(res => {
          //获取菜单构建树
          if (res.data && res.data.code === 0) {
            this.data = res.data.data;
          } else {
            _this.$message.error(res.msg);
          }
        });
    },
    last() {
      this.$emit("setLast", "上一步");
    },
    handleActive() {
      this.$emit("newRole", "提交");
    }
  },
  computed: {
    ...mapGetters({
      tokenValue: "tokenValue"
    })
  }
};
</script>

<style>
#check .el-table td {
  padding: 5px 0;
}
</style>
