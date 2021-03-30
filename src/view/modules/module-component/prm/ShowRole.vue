<template>
  <el-container>
    <el-header
      style="height:50px;background:#ccc;line-height:50px;margin-bottom:20px;"
    >
      平台角色信息
    </el-header>
    <el-main style="padding-top:0;">
      <div style="margin-bottom:20px;">
        <el-table
          :data="roleInfo"
          style="width: 100%"
          border
          :header-cell-style="{
            background: '#fff',
            color: '#000',
            fontWeight: 300
          }"
          :row-style="{
            background: '#ddd'
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
      </div>

      <div
        style="height:30px;line-height: 20px;color: #000;font-size:16px;font-weight:700;padding-left:5px;"
      >
        <span>权限信息</span>
      </div>
      <div style="height:260px;overflow:auto;">
        <el-tree
          :data="data"
          node-key="id"
          :props="defaultProps"
          ref="tree"
          default-expand-all
        >
        </el-tree>
      </div>
    </el-main>
    <el-footer>
      <el-button
        type="primary"
        style="margin-right: 40px;"
        @click="handleActive()"
        class="fr"
      >
        关闭
      </el-button>
    </el-footer>
  </el-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "ShowRole",
  props: {
    roleInfo: {
      type: Array
    }
  },
  data() {
    return {
      data: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      roleId: null //角色id
    };
  },
  created() {
    this.getMenuTree();
  },
  watch: {
    roleInfo() {
      this.getMenuTree();
    }
  },
  methods: {
    //获取菜单
    getMenuTree() {
      if (this.roleInfo[0].id) {
        this.axios
          .get(
            "http://192.168.0.40:9900/uc/sys/role/menu/" + this.roleInfo[0].id,
            {
              headers: { authorization: this.tokenValue }
            }
          )
          .then(res => {
            //获取表格数据，默认第一页 10条
            if (res.data && res.data.code === 0) {
              this.data = res.data.data;
            } else {
              this.$message.error(res.data.msg + "!");
            }
          });
      }
    },
    handleActive() {
      this.$emit("closeTableDialog", "关闭");
    }
  },
  computed: {
    ...mapGetters({
      tokenValue: "tokenValue"
    })
  }
};
</script>

<style></style>
