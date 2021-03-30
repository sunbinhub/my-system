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
        prop="fparentName"
        size="mini"
      >
        <el-select
          v-model="organizationForm.fparentName"
          placeholder="请选择活动区域"
          size="mini"
        >
          <el-option
            v-for="item in dialogParentOrganizationOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            size="mini"
          >
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
export default {
  name: "AddOrganization",
  props: {
    parentId: {
      type: String
    },
    organizationForm: {
      type: Object,
      default: () => ({
        type: "", //弹窗内选择类型选项值
        fparentName: "", //弹窗内上级机构选项值
        name: "", //组织名称
        sort: "", //排序号
        fullName: "", //组织全称
        code: "", //组织代码
        id: ""
      })
    }
  },
  data() {
    return {
      formLabelWidth: "120px", //弹窗内部左侧的距离
      //弹窗内组织选项
      dialogOrganizationOptions: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      //弹窗内上级机构选项
      dialogParentOrganizationOptions: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
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
        fparentName: [
          { required: true, message: "请输入上级机构", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    //重置弹窗表格并关闭
    closeForm(formName) {
      this.$refs[formName].resetFields();
      this.$emit("close", "关闭弹窗");
    },
    //提交弹窗表单
    submitDialogForm(formName) {
      this.$refs[formName].validate(valid => {
        debugger;
        if (valid) {
          if (!this.organizationForm.id) {
            let postParams = this.qs.parse({
              fullName: this.organizationForm.fullName,
              name: this.organizationForm.name,
              parentId: this.parentId,
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
              parentId: this.parentId,
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
    }
  }
};
</script>

<style>
.qq {
  position: relative;
  position: absolute;
}
</style>
