<template>
  <el-container id="platform-user">
    <!-- 头部开始 -->
    <el-header
      style="border-bottom: 1px solid #ddd; padding:0; height:40px; line-height:40px;margin-bottom: 10px;"
    >
      <span>用户管理</span>
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
            <el-row class="fr">
              <el-select
                v-model="organizationStatus"
                style="width:120px;"
                placeholder="用户类型"
                size="mini"
              >
                <el-option label="全部" value="all"></el-option>
                <el-option label="停用" value="disable"></el-option>
                <el-option label="启用" value="enable"></el-option>
              </el-select>
              <SearchInput
                @searchValue="searchOrganization"
                placeholder="请输入用户名/ID"
              ></SearchInput>
              <el-button
                type="primary"
                @click="dialogFormVisible = true"
                size="mini"
              >
                新建用户
              </el-button>
            </el-row>
          </el-header>
          <!-- 右侧头部结束 -->
          <!-- 右侧表格开始 -->
          <el-main style="padding-bottom:0;">
            <template>
              <el-table
                ref="multipleTable"
                :data="organizationTableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                :height="tableHeight"
              >
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column
                  prop="name"
                  label="序号"
                  align="center"
                  width="100"
                  sortable
                ></el-table-column>
                <el-table-column label="日期" width="120">
                  <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column prop="name" label="姓名" width="120">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="地址"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column label="操作" width="263">
                  <template slot-scope="scope">
                    <el-button
                      @click="11111(scope.row)"
                      type="text"
                      size="small"
                    >
                      修改信息
                    </el-button>
                    <el-button
                      @click="22222(scope.row)"
                      type="text"
                      size="small"
                    >
                      停用用户
                    </el-button>
                    <el-button
                      @click="3333(scope.row)"
                      type="text"
                      size="small"
                    >
                      设置角色
                    </el-button>
                    <el-button
                      @click="4444(scope.row)"
                      type="text"
                      size="small"
                    >
                      更多操作
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="page">
                <Pagination
                  :tableData="organizationTableData"
                  @paginationChange="setTableData"
                >
                </Pagination>
              </div>
            </template>
          </el-main>
          <!-- 右侧表格结束 -->
          <!-- 弹窗开始 -->
          <el-dialog :visible.sync="dialogFormVisible" style="width:1300px;">
            <el-container>
              <el-header
                style="font-size:20px; border-bottom: 1px solid #ccc;height: 30px;"
              >
                <i class="el-icon-back"></i>
                <span>新增用户信息</span>
              </el-header>
              <el-container>
                <el-header>
                  <el-steps
                    :active="active"
                    finish-status="success"
                    simple
                    style="margin-top: 20px"
                  >
                    <el-step title="步骤 1"></el-step>
                    <el-step title="步骤 2"></el-step>
                    <el-step title="步骤 3"></el-step>
                  </el-steps>
                </el-header>
                <el-main>
                  <div
                    v-show="dialogId === 1 ? true : false"
                    style="height:400px; overflow:auto;"
                  >
                    <el-form
                      :model="platformUserForm"
                      :rules="platformUserFormRules"
                      ref="platformUserForm"
                      label-width="100px"
                      class="demo-ruleForm"
                    >
                      <el-form-item
                        label="用户id"
                        prop="platformUserId"
                        size="mini"
                      >
                        <el-input
                          v-model="platformUserForm.platformUserId"
                          size="mini"
                          style="width:200px;"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="用户姓名" prop="platformUserName">
                        <el-input
                          v-model="platformUserForm.platformUserName"
                          size="mini"
                          style="width:200px;"
                        ></el-input>
                      </el-form-item>
                      <el-form-item
                        label="用户类型"
                        prop="platformUserType"
                        size="mini"
                      >
                        <el-select
                          v-model="platformUserForm.platformUserType"
                          placeholder="请选择活动区域"
                          size="mini"
                        >
                          <el-option
                            label="区域一"
                            value="shanghai"
                          ></el-option>
                          <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item
                        label="所属科室"
                        prop="subordinateDepartments"
                        size="mini"
                      >
                        <el-select
                          v-model="platformUserForm.subordinateDepartments"
                          placeholder="请选择活动区域"
                          size="mini"
                        >
                          <el-option
                            label="区域一"
                            value="shanghai"
                          ></el-option>
                          <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item
                        label="所属病区"
                        prop="subordinateInpatientWard"
                        size="mini"
                      >
                        <el-select
                          v-model="platformUserForm.subordinateInpatientWard"
                          placeholder="请选择活动区域"
                          size="mini"
                        >
                          <el-option
                            label="区域一"
                            value="shanghai"
                          ></el-option>
                          <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item
                        label="应用系统"
                        prop="applicationSystem"
                        size="mini"
                      >
                        <el-checkbox-group
                          v-model="platformUserForm.applicationSystem"
                          style="width:200px;"
                        >
                          <el-checkbox
                            label="美食/餐厅线上活动"
                            name="type"
                          ></el-checkbox>
                          <el-checkbox
                            label="地推活动"
                            name="type"
                          ></el-checkbox>
                          <el-checkbox
                            label="线下主题活动"
                            name="type"
                          ></el-checkbox>
                          <el-checkbox
                            label="单纯品牌曝光"
                            name="type"
                          ></el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                      <el-form-item label="状态" prop="statu" size="mini">
                        <el-radio-group v-model="platformUserForm.statu">
                          <el-radio label="在用"></el-radio>
                          <el-radio label="停用"></el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item label="描述" size="mini">
                        <el-input
                          type="textarea"
                          :rows="3"
                          v-model="textarea"
                          resize="none"
                          style="width:200px;"
                        >
                        </el-input>
                      </el-form-item>
                      <el-form-item size="mini">
                        <el-button type="primary" @click="next()">
                          下一步
                        </el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                  <div v-show="dialogId === 2 ? true : false">
                    <span
                      style="display: block;margin-bottom: 10px;font-weight: bold;"
                    >
                      选择角色
                    </span>
                    <template>
                      <div>
                        <el-col :span="10" style="border:1px solid #ccc;">
                          <el-row
                            style="height: 30px; line-height:29px; background:#ddd; padding: 0 5px;"
                          >
                            <span>
                              待选平台角色列表
                            </span>
                            <SearchInput
                              @searchValue="searchPlatformUser"
                              placeholder="请输入用户名/ID"
                              class="fr"
                            ></SearchInput>
                          </el-row>
                          <el-table
                            :data="platformUserData"
                            ref="selection"
                            @selection-change="checkAll"
                            style="width: 100%; overflow:auto;"
                            height="320px"
                          >
                            <el-table-column
                              type="selection"
                              width="30"
                              fixed
                            ></el-table-column>
                            <el-table-column
                              prop="date"
                              label="日期"
                              width="100"
                            >
                            </el-table-column>
                            <el-table-column
                              prop="name"
                              label="姓名"
                              width="100"
                            >
                            </el-table-column>
                            <el-table-column prop="address" label="地址">
                            </el-table-column>
                          </el-table>
                        </el-col>
                        <el-col :span="2">
                          <div class="opSetting">
                            <div @click="handelSelect">
                              <el-button
                                icon="el-icon-d-arrow-right"
                                :disabled="nowSelectData.length ? false : true"
                                :size="buttonSize"
                                type="primary"
                              >
                              </el-button>
                            </div>
                            <div class="spacing" @click="handleRemoveSelect">
                              <el-button
                                icon="el-icon-d-arrow-left"
                                :disabled="
                                  nowSelectRightData.length ? false : true
                                "
                                :size="buttonSize"
                                type="primary"
                              >
                              </el-button>
                            </div>
                          </div>
                        </el-col>
                        <el-col :span="11" style="border:1px solid #ccc;">
                          <el-row
                            style="height: 30px; line-height:29px; background:#ddd; padding: 0 5px;"
                          >
                            <span>
                              已选平台角色
                            </span>
                          </el-row>
                          <el-table
                            :data="selectArr"
                            ref="selection"
                            @selection-change="checkRightAll"
                            style="width: 100 %;overflow:auto;"
                            height="320px"
                          >
                            <el-table-column
                              type="selection"
                              width="30"
                            ></el-table-column>
                            <el-table-column
                              prop="date"
                              label="日期"
                              width="100"
                            >
                            </el-table-column>
                            <el-table-column
                              prop="name"
                              label="姓名"
                              width="100"
                            >
                            </el-table-column>
                            <el-table-column prop="address" label="地址">
                            </el-table-column>
                          </el-table>
                        </el-col>
                        <el-button
                          style="margin-top: 12px;"
                          @click="last()"
                          size="mini"
                        >
                          上一步
                        </el-button>
                        <el-button
                          type="primary"
                          style="margin-top: 12px;"
                          @click="next()"
                          size="mini"
                        >
                          下一步
                        </el-button>
                      </div>
                    </template>
                  </div>
                  <div v-show="dialogId === 3 ? true : false">
                    <div>
                      <template>
                        <el-row style="margin-bottom:5px;">用户信息</el-row>
                        <el-table
                          :data="UserInfoData"
                          style="width: 100%"
                          border
                        >
                          <el-table-column prop="date" label="日期" width="180">
                          </el-table-column>
                          <el-table-column prop="name" label="姓名" width="180">
                          </el-table-column>
                          <el-table-column prop="address" label="地址">
                          </el-table-column>
                        </el-table>
                      </template>
                      <div style="height:30px;"></div>
                      <template>
                        <el-row style="margin-bottom:5px;">角色权限</el-row>
                        <el-table
                          :data="UserLimitsData"
                          style="width: 100%"
                          border
                        >
                          <el-table-column prop="date" label="日期" width="180">
                          </el-table-column>
                          <el-table-column prop="name" label="姓名" width="180">
                          </el-table-column>
                          <el-table-column prop="address" label="地址">
                          </el-table-column>
                        </el-table>
                      </template>
                    </div>
                    <div style="margin-top:65px;">
                      <el-button
                        style="margin-top: 12px;"
                        @click="last()"
                        size="mini"
                      >
                        上一步
                      </el-button>
                      <el-button
                        type="primary"
                        style="margin-top: 12px;"
                        @click="submitForm(formName)"
                        size="mini"
                      >
                        完成
                      </el-button>
                    </div>
                  </div>
                </el-main>
              </el-container>
            </el-container>
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
export default {
  components: { SearchInput, Pagination },
  data() {
    return {
      //树形控件
      filterText: "",
      //树形结构数据
      organizationData: [
        {
          id: 1,
          label: "一级 1",
          icon: "el-icon-folder",
          children: [
            {
              id: 4,
              label: "二级 你好",
              icon: "el-icon-folder",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1",
                  icon: "el-icon-folder"
                },
                {
                  id: 10,
                  label: "三级 1-1-2",
                  icon: "el-icon-folder"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          icon: "el-icon-folder",
          children: [
            {
              id: 5,
              label: "二级 2-1",
              icon: "el-icon-folder"
            },
            {
              id: 6,
              label: "二级 2-2",
              icon: "el-icon-folder"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          icon: "el-icon-folder",
          children: [
            {
              id: 7,
              label: "二级 3-1",
              icon: "el-icon-folder"
            },
            {
              id: 8,
              label: "二级 3-2",
              icon: "el-icon-folder"
            }
          ]
        }
      ],
      //树形结构默认树形
      defaultProps: {
        children: "children",
        label: "label"
      },
      //左侧高度
      platformAsideHeight: {
        height: ""
      },
      organizationStatus: "", //组织状态
      //组织表格数据
      organizationTableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      //选中的表格数据
      multipleSelection: [],
      tableHeight: "", //表格高度
      dialogFormVisible: false, //弹窗是否显示
      active: 0, //步骤条
      dialogId: 1, //弹窗内默认显示内容
      platformUserForm: {
        platformUserId: "", //用户ID
        platformUserName: "", //用户名称
        platformUserType: "", //用户类型
        subordinateDepartments: "", //所属科室
        subordinateInpatientWard: "", //所属病区
        applicationSystem: [], //应用系统
        statu: ""
      },
      platformUserFormRules: {
        platformUserId: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        platformUserName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        platformUserType: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        subordinateDepartments: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        subordinateInpatientWard: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        applicationSystem: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ],
        statu: [
          { required: true, message: "请选择活动资源", trigger: "change" }
        ]
      },
      textarea: "",

      selectArr: [], // 右边列表
      buttonSize: "large",
      options: [],
      value: "",
      platformUserData: [
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      nowSelectData: [], // 左边选中列表数据
      nowSelectRightData: [], // 右边选中列表数据
      UserInfoData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      UserLimitsData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ]
    };
  }, // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    window.addEventListener("resize", this.getPlatformAsideHeight); // 注册监听器
    this.getPlatformAsideHeight(); // 页面创建时先调用一次

    window.addEventListener("resize", this.getTableHeight); // 注册监听器
    this.getTableHeight(); // 页面创建时先调用一次
  },
  watch: {
    //树形结构搜索方法
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getPlatformAsideHeight() {
      // 获取浏览器高度，减去顶部导航栏的值70（可动态获取）
      this.platformAsideHeight.height = window.innerHeight - 172 + "px";
    },
    searchOrganization(value) {
      console.log(value);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getTableHeight() {
      // 获取浏览器高度，减去顶部导航栏的值70（可动态获取）
      this.tableHeight = window.innerHeight - 323 + "px";
    },
    //设置表格数据
    setTableData(data) {
      this.organizationTableData = data;
    },
    next() {
      //步骤条事件:下一步
      if (this.active++ > 2) {
        this.active = 2;
        this.dialogId = 3;
      } else {
        this.dialogId++;
      }
    },
    last() {
      if (this.active-- < 0) {
        this.active = 1;
        this.dialogId = 1;
      } else {
        this.dialogId--;
      }
    },
    //提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    checkAll(val) {
      this.nowSelectData = val;
    },
    checkRightAll(val) {
      this.nowSelectRightData = val;
    },
    //搜索弹窗内平台用户
    searchPlatformUser(value) {
      console.log(value);
    },

    // 选中
    handelSelect() {
      this.selectArr = this.handleConcatArr(this.selectArr, this.nowSelectData);
      this.handleRemoveTabList(this.nowSelectData, this.platformUserData);
      this.nowSelectData = [];
    },
    // 取消
    handleRemoveSelect() {
      this.platformUserData = this.handleConcatArr(
        this.platformUserData,
        this.nowSelectRightData
      );
      this.handleRemoveTabList(this.nowSelectRightData, this.selectArr);
      this.nowSelectRightData = [];
    },
    handleConcatArr(selectArr, nowSelectData) {
      let arr = [];
      arr = arr.concat(selectArr, nowSelectData);
      return arr;
    },
    handleRemoveTabList(isNeedArr, originalArr) {
      if (isNeedArr.length && originalArr.length) {
        for (let i = 0; i < isNeedArr.length; i++) {
          for (let k = 0; k < originalArr.length; k++) {
            if (isNeedArr[i]["name"] === originalArr[k]["name"]) {
              originalArr.splice(k, 1);
            }
          }
        }
      }
    }
  }
};
</script>

<style>
.organization-main {
  padding: 0;
  padding-top: 5px;
}
.organization-header {
  min-width: 630px;
}

.fr {
  float: right;
}
#platform-user .el-dialog {
  margin: 0 auto;
  margin-top: 5px !important;
  width: 70%;
  height: 600px;
}
#platform-user .el-dialog__body {
  padding: 0;
  padding-left: 5px;
}

.opSetting {
  text-align: center;
  margin-top: 120px;
}
.spacing {
  margin-top: 10px;
}
</style>
