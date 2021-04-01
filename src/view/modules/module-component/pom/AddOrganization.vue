<template>
  <div style="padding-bottom:20px;position: relative;">
    <div style="position: absolute;top:-40px; left:0;">
      <span v-if="organizationForm.id">修改组织机构</span>
      <span v-else>新增组织机构</span>
    </div>
    <el-form
      :model="organizationForm"
      :rules="organizationRules"
      ref="organizationRules"
    >
      <el-form-item
        label="组织名称"
        :label-width="formLabelWidth"
        prop="name"
        size="mini"
      >
        <el-input
          v-model="organizationForm.name"
          placeholder="请输入内容"
          size="mini"
        ></el-input>
      </el-form-item>
      <el-form-item label="组织全称" :label-width="formLabelWidth" size="mini">
        <el-input
          v-model="organizationForm.fullName"
          placeholder="请输入内容"
          size="mini"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="组织代码"
        :label-width="formLabelWidth"
        prop="code"
        size="mini"
      >
        <el-input
          v-model="organizationForm.code"
          placeholder="请输入内容"
          size="mini"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="选择类型"
        :label-width="formLabelWidth"
        prop="type"
        size="mini"
      >
        <el-select v-model="organizationForm.type" placeholder="请选择选择类型">
          <el-option label="机构" value="0"></el-option>
          <el-option label="科室" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="上级机构"
        :label-width="formLabelWidth"
        prop="parentId"
        size="mini"
      >
        <el-select placeholder="请选择" v-model="organizationForm.parentId">
          <el-option
            :value="organizationForm.parentId"
            :label="organizationForm.parentName"
            style="height:150px;overflow:auto;background:#fff;"
          >
            <el-tree
              id="tree-option"
              ref="selectTree"
              :data="options"
              :props="defaultProps"
              :default-expanded-keys="defaultExpandedKey"
              @node-click="handleNodeClick"
            >
            </el-tree>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序号" :label-width="formLabelWidth" size="mini">
        <el-input
          v-model="organizationForm.sort"
          placeholder="请输入内容"
          size="mini"
        ></el-input>
      </el-form-item>
    </el-form>
    <div style="float:right;">
      <el-button @click="closeForm('organizationRules')" size="mini">
        取消
      </el-button>
      <el-button
        type="primary"
        @click="submitDialogForm('organizationRules')"
        size="mini"
      >
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AddOrganization",
  components: { mapGetters },
  props: {
    organizationForm: {
      type: Object,
      default: () => ({
        type: "", //弹窗内选择类型选项值
        parentName: "", //弹窗内上级机构选项值
        name: "", //组织名称
        sort: "", //排序号
        fullName: "", //组织全称
        code: "", //组织代码
        id: "",
        parentId: ""
      })
    },
    options: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      formLabelWidth: "120px", //弹窗内部左侧的距离
      //弹窗内上级机构选项
      organizationRules: {
        name: [
          { required: true, message: "请输入组织名称", trigger: "blur" },
          { min: 1, max: 6, message: "长度在 1 到 6 个字符", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入组织代码", trigger: "blur" },
          { min: 1, max: 6, message: "长度在 1 到 6 个字符", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请输入选择类型", trigger: "change" }
        ],
        id: [{ required: true, message: "请输入上级机构", trigger: "change" }]
      },
      defaultProps: {
        //默认值
        children: "children",
        label: "name"
      },
      defaultExpandedKey: [], //默认打开
      treeDataId: "" //树形结构id
    };
  },
  methods: {
    //重置弹窗表格并关闭
    closeForm(formName) {
      this.$emit("close", "关闭弹窗");
      this.$refs[formName].resetFields();
    },
    //提交弹窗表单
    submitDialogForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.organizationForm.id) {
            let postParams = this.qs.parse({
              fullName: this.organizationForm.fullName,
              name: this.organizationForm.name,
              parentId: this.organizationForm.parentId,
              sort: this.organizationForm.sort,
              type: this.organizationForm.type,
              code: this.organizationForm.code
            });
            this.axios({
              method: "post",
              url: "http://192.168.0.40:9900/uc/sys/organization/create",
              data: postParams,
              headers: {
                authorization: this.tokenValue,
                "Content-Type": "application/json"
              }
            }).then(res => {
              //获取表格数据，默认第一页 10条
              if (res.data && res.data.code === 0) {
                this.$message.success("新增组织机构成功！");
                this.closeForm(formName); //关闭弹窗
                this.$emit("refresh", { limit: 10, page: 1 }); //刷新表格数据
              } else {
                this.$message.error(res.data.msg);
              }
            });
          } else {
            let postParams = this.qs.parse({
              fullName: this.organizationForm.fullName,
              id: this.organizationForm.id,
              name: this.organizationForm.name,
              parentId: this.organizationForm.parentId,
              sort: this.organizationForm.sort,
              type: this.organizationForm.type
            });
            this.axios({
              method: "post",
              url: "http://192.168.0.40:9900/uc/sys/organization/update",
              data: postParams,
              headers: {
                authorization: this.tokenValue,
                "Content-Type": "application/json"
              }
            }).then(res => {
              //获取表格数据，默认第一页 10条
              if (res.data && res.data.code === 0) {
                this.$message.success("修改组织机构成功！");
                this.closeForm(formName); //关闭弹窗
                this.$emit("refresh", { limit: 10, page: 1 }); //刷新表格数据
              } else {
                this.$message.error(res.data.msg);
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //树形结构点击事件
    handleNodeClick(row) {
      //给对象新增属性
      this.$set(this.organizationForm, "parentId", row.id);
      this.$set(this.organizationForm, "parentName", row.name);
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
.qq {
  position: relative;
  position: absolute;
}
</style>
