<template>
  <el-container>
    <!-- 头部开始 -->
    <el-header
      style="border-bottom: 1px solid #ddd; padding:0; height:40px; line-height:40px;margin-bottom: 10px;"
    >
      <span>平台机构管理</span>
    </el-header>
    <!-- 头部结束 -->
    <!-- 主体部分开始 -->
    <el-container>
      <!-- 左侧树形结构开始 -->
      <el-aside
        style="width: 200px; margin-right: 5px; border: 1px solid #ddd;"
        :style="platformAsideHeight"
      >
        <div style="border-bottom: 1px solid #ccc; padding: 5px;">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText"
            size="mini"
          >
          </el-input>
        </div>
        <el-tree
          class="filter-tree"
          :data="organizationData"
          :props="defaultProps"
          :filter-node-method="filterNode"
          ref="tree"
          node-key="id"
          @node-click="nodeClick"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>
              <i :class="data.icon"></i>
              {{ node.label }}
            </span>
          </span>
        </el-tree>
      </el-aside>
      <!-- 左侧树形结构结束 -->
      <!-- 右侧主体开始 -->
      <el-main class="organization-main">
        <el-container>
          <!-- 右侧头部开始 -->
          <el-header class="organization-header">
            <el-row>
              <el-col :span="18">
                <el-select v-model="organizationStatus" size="mini">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="在用" value="0"></el-option>
                  <el-option label="停用" value="1"></el-option>
                </el-select>
                <SearchInput @searchValue="searchOrganization"></SearchInput>
              </el-col>
              <el-col :span="6">
                <el-button type="info" size="mini">查询</el-button>
                <el-button
                  type="primary"
                  @click="dialogFormVisible = true"
                  size="mini"
                >
                  新增
                </el-button>
              </el-col>
            </el-row>
          </el-header>
          <!-- 右侧头部结束 -->
          <!-- 右侧表格开始 -->
          <el-main style="padding-bottom:0;padding:0;">
            <template>
              <el-table
                :data="tableData"
                style="width: 100%;"
                row-key="id"
                :height="tableHeight"
                @cell-click="cellClick"
                border
                :tree-props="{
                  children: 'children',
                  hasChildren: 'hasChildren'
                }"
              >
                <el-table-column
                  type="index"
                  label="序号"
                  align="center"
                  width="100"
                  sortable
                ></el-table-column>
                <el-table-column prop="id" label="角色ID" width="120">
                </el-table-column>
                <el-table-column prop="name" label="组织名称" width="120">
                </el-table-column>
                <el-table-column prop="code" label="组织代码" width="120">
                </el-table-column>
                <el-table-column prop="type" label="组织类型" width="120">
                  <template slot-scope="scope">
                    <span v-if="scope.row.type === 0">机构</span>
                    <span v-if="scope.row.type === 1">科室</span>
                  </template>
                </el-table-column>
                <el-table-column prop="parentName" label="上级组织" width="120">
                </el-table-column>
                <el-table-column prop="disableFlag" label="状态" width="120">
                  <template slot-scope="scope">
                    <span v-if="scope.row.disableFlag === 0">在用</span>
                    <span v-if="scope.row.disableFlag === 1">停用</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="130">
                  <template slot-scope="scope">
                    <el-button
                      @click="changeClick(scope.row)"
                      type="text"
                      size="small"
                    >
                      修改
                    </el-button>
                    <el-button
                      @click="removeClick(scope.row)"
                      type="text"
                      size="small"
                    >
                      删除
                    </el-button>
                    <el-button
                      @click="disableClick(scope.row)"
                      type="text"
                      size="small"
                    >
                      停用
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="page">
                <Pagination
                  :totalCount="totalCount"
                  @paginationChange="getlist"
                >
                </Pagination>
              </div>
            </template>
          </el-main>
          <!-- 右侧表格结束 -->
          <!-- 弹窗开始 -->
          <el-dialog
            title="新增组织机构"
            :visible.sync="dialogFormVisible"
            class="organization-dialog"
          >
            <el-form
              :model="organizationForm"
              :rules="organizationRules"
              ref="organizationRules"
            >
              <el-form-item
                label="组织名称"
                :label-width="formLabelWidth"
                prop="organizationName"
                size="mini"
              >
                <el-input
                  v-model="organizationForm.organizationName"
                  placeholder="请输入内容"
                  size="mini"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="组织全称"
                :label-width="formLabelWidth"
                size="mini"
              >
                <el-input
                  v-model="organizationForm.organizationFullname"
                  placeholder="请输入内容"
                  size="mini"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="组织代码"
                :label-width="formLabelWidth"
                prop="organizationCode"
                size="mini"
              >
                <el-input
                  v-model="organizationForm.organizationCode"
                  placeholder="请输入内容"
                  size="mini"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="选择类型"
                :label-width="formLabelWidth"
                prop="dialogOrganizationValue"
                size="mini"
              >
                <el-select
                  v-model="organizationForm.dialogOrganizationValue"
                  placeholder="请选择活动区域"
                  size="mini"
                >
                  <el-option
                    v-for="item in dialogOrganizationOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    size="mini"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="上级机构"
                :label-width="formLabelWidth"
                prop="dialogParentOrganizationValue"
                size="mini"
              >
                <el-select
                  v-model="organizationForm.dialogParentOrganizationValue"
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
              <el-form-item
                label="排序号"
                :label-width="formLabelWidth"
                size="mini"
              >
                <el-input
                  v-model="organizationForm.orderID"
                  placeholder="请输入内容"
                  size="mini"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
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
          </el-dialog>
          <!-- 弹窗结束 -->
        </el-container>
      </el-main>
      <!-- 右侧主体结束 -->
    </el-container>
    <!-- 主题部分结束 -->
  </el-container>
</template>
<script>
import SearchInput from "@/components/common-components/SearchInput";
import Pagination from "@/components/common-components/Pagination";
import { mapState, mapGetters } from "vuex";

export default {
  components: { SearchInput, Pagination, mapState, mapGetters },
  data() {
    return {
      //树形控件
      filterText: "",
      //树形结构数据
      organizationData: [],
      //树形结构默认树形
      defaultProps: {
        children: "children",
        label: "name"
      },
      //左侧高度
      platformAsideHeight: {
        height: ""
      },
      organizationStatus: "", //组织状态
      //组织表格数据
      tableData: [],
      //选中的表格数据
      multipleSelection: [],
      tableHeight: "", //表格高度
      dialogFormVisible: false, //弹窗是否显示
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
      organizationForm: {
        dialogOrganizationValue: "", //弹窗内选择类型选项值
        dialogParentOrganizationValue: "", //弹窗内上级机构选项值
        organizationName: "", //组织名称
        orderID: "", //排序号
        organizationFullname: "", //组织全称
        organizationCode: "" //组织代码
      },
      organizationRules: {
        organizationName: [
          { required: true, message: "请输入组织名称", trigger: "blur" },
          { min: 1, max: 6, message: "长度在 1 到 6 个字符", trigger: "blur" }
        ],
        organizationCode: [
          { required: true, message: "请输入组织代码", trigger: "blur" },
          { min: 1, max: 6, message: "长度在 1 到 6 个字符", trigger: "blur" }
        ],
        dialogOrganizationValue: [
          { required: true, message: "请输入选择类型", trigger: "change" }
        ],
        dialogParentOrganizationValue: [
          { required: true, message: "请输入上级机构", trigger: "change" }
        ]
      },
      totalCount: null, //表格数据总条数
      nodeClickId: null
    };
  }, // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    window.addEventListener("resize", this.getPlatformAsideHeight); // 注册监听器
    this.getPlatformAsideHeight(); // 页面创建时先调用一次

    window.addEventListener("resize", this.getTableHeight); // 注册监听器
    this.getTableHeight(); // 页面创建时先调用一次
    this.getOrganization(); //获取组织机构
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    organizationStatus(val) {
      debugger;
    }
  },
  methods: {
    //获取属性结构
    getOrganization() {
      this.axios
        .get("http://192.168.0.40:9900/uc/sys/organization/tree/" + 1, {
          //row.id
          params: { type: "0" },
          headers: { authorization: this.tokenValue }
        })
        .then(res => {
          //获取表格数据，默认第一页 10条
          if (res.data && res.data.code === 0) {
            this.organizationData = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    //设置表格数据
    getlist(data) {
      this.axios
        .get("http://192.168.0.40:9900/uc/sys/organization/page/" + 3, {
          //this.userInfo.id
          params: data,
          headers: { authorization: this.tokenValue }
        })
        .then(res => {
          //获取表格数据，默认第一页 10条
          if (res.data && res.data.code === 0) {
            let tableList = res.data.data.list;
            tableList.forEach(item => {
              this.deleteHasChildren(item);
            });
            this.tableData = tableList; //后端返回的表格数据
            this.totalCount = res.data.data.totalCount; // 后端返回的总条数
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    getPlatformAsideHeight() {
      // 获取浏览器高度，减去顶部导航栏的值70（可动态获取）
      this.platformAsideHeight.height = window.innerHeight - 172 + "px";
    },
    searchOrganization(value) {
      //这里继续开始写。。。。。。。。。搜索功能
      console.log(value);
      this.nodeClickId;
      this.organizationStatus;
      let aaa = {
        parentId: "",
        disableFlag: "",
        condition: "",
        limit: 10,
        page: 1
      };
      debugger;
    },
    getTableHeight() {
      // 获取浏览器高度，减去顶部导航栏的值70（可动态获取）
      this.tableHeight = window.innerHeight - 267 + "px";
    },
    //提交弹窗表单
    submitDialogForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //重置弹窗表格并关闭
    closeForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
    //表格修改事件
    changeClick(row) {
      this.dialogFormVisible = true;
      console.log(row);
      //...这一行的数据赋值
    },
    //表格删除事件
    removeClick(row) {
      //...删除接口
    },
    //表格停用事件
    disableClick(row) {},
    //表格点击事件
    cellClick(row, column, event, cell) {
      this.axios
        .get("http://192.168.0.40:9900/uc/sys/organization/tree/" + 1, {
          //row.id
          params: { type: "0" },
          headers: { authorization: this.tokenValue }
        })
        .then(res => {
          //获取表格数据，默认第一页 10条
          if (res.data && res.data.code === 0) {
            //删除hasChildren属性
            let tableList = res.data.data;
            tableList.forEach(item => {
              this.deleteHasChildren(item);
            });
            //添加获取的数据
            let tableDataCopy = this.tableData.slice(0);
            for (let i = 0; i < tableDataCopy.length; i++) {
              if (tableDataCopy[i].id === row.id) {
                tableDataCopy[i].children = tableList;
              }
            }
            this.tableData = tableDataCopy;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    //删除hasChildren属性
    deleteHasChildren(item) {
      if (item.hasChildren) {
        delete item.hasChildren;
        item.children.forEach(item => {
          if (item.hasChildren) {
            delete item.hasChildren;
            this.deleteHasChildren(item);
          }
        });
      }
    },
    nodeClick(row) {
      //树形控件点击事件
      this.nodeClickId = row.id;
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    }),
    ...mapGetters({
      tokenValue: "tokenValue"
    })
  }
};
</script>

<style scoped>
.organization-main {
  padding: 0;
  padding-top: 5px;
}
.organization-header {
  min-width: 630px;
  height: 40px !important;
  padding: 0;
}

.fr {
  float: right;
}
.organization-dialog {
  margin-top: -85px;
}
</style>
