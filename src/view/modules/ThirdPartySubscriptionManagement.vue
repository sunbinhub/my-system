<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="用户管理" name="first">
        <el-container>
          <el-header class="user-managed-header">
            <el-row>
              <el-button type="primary" @click="dialogFormVisible = true">
                添加应用
              </el-button>
              <div class="fr">
                <el-select v-model="selectValue" placeholder="请选择">
                  <el-option
                    v-for="item in selectOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <!-- <el-input
                  placeholder="请输入内容"
                  v-model="searchValue"
                  class="search-input"
                >
                  <i
                    class="el-icon-search el-input__icon cursor-point"
                    slot="suffix"
                    @click="searchIconClick"
                  >
                  </i>
                </el-input> -->

                <SearchInput @searchValue="searchUsers"></SearchInput>
                <el-button
                  class="refresh-btn"
                  icon="el-icon-refresh"
                  @click="refreshIconClick"
                >
                </el-button>
              </div>
            </el-row>
          </el-header>
          <el-main class="user-managed-table">
            <el-table
              :data="tableData"
              style="width: 100%, overflow: auto;"
              :height="tableHeight"
            >
              <el-table-column fixed prop="date" label="日期" width="150">
              </el-table-column>
              <el-table-column prop="name" label="姓名" width="120">
              </el-table-column>
              <el-table-column prop="province" label="省份" width="120">
              </el-table-column>
              <el-table-column prop="city" label="市区" width="120">
              </el-table-column>
              <el-table-column prop="address" label="地址" width="300">
              </el-table-column>
              <el-table-column prop="zip" label="邮编" width="120">
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                  <el-button
                    @click="disableClick(scope.row)"
                    type="text"
                    size="small"
                  >
                    停用
                  </el-button>
                  <el-button
                    @click="deleteClick(scope.row)"
                    type="text"
                    size="small"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="page">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="paginations.page_index"
                :page-sizes="paginations.page_sizes"
                :page-size="paginations.page_size"
                :layout="paginations.layout"
                :total="paginations.total"
                :pager-count="paginations.pager_count"
              >
              </el-pagination>
            </div>
          </el-main>
        </el-container>
        <el-dialog
          title="添加应用"
          :visible.sync="dialogFormVisible"
          class="user-managed-dialog"
        >
          <el-form>
            <el-form-item label="选择机构" :label-width="formLabelWidth">
              <el-select
                v-model="dialogOrganizationValue"
                placeholder="请选择活动区域"
              >
                <el-option
                  v-for="item in dialogOrganizationOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择应用" :label-width="formLabelWidth">
              <el-select
                v-model="dialogApplicationValue"
                placeholder="请选择活动区域"
              >
                <el-option
                  v-for="item in dialogApplicationOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述" :label-width="formLabelWidth">
              <el-input
                type="textarea"
                :rows="5"
                placeholder="最多200个字"
                v-model="textarea"
                resize="none"
                @input="descInput"
                maxlength="200"
              >
              </el-input>
              <div class="textarea-tip">还可以输入{{ remnant }}个字符</div>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">关闭</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">
              提交
            </el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="第三方服务申请审批" name="second">
        <el-container>
          <el-header>
            <el-row>
              <template>
                <div class="block">
                  <el-date-picker
                    v-model="timeValue"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  >
                  </el-date-picker>
                </div>
              </template>
              <template>
                <el-select v-model="applicationListValue" placeholder="请选择">
                  <el-option
                    v-for="item in applicationListOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-row>
          </el-header>
          <el-main>Main</el-main>
        </el-container>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import SearchInput from "@/components/common-components/SearchInput";
export default {
  components: { SearchInput },
  data() {
    return {
      activeName: "first",
      selectOptions: [
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
      selectValue: "",
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333
        }
      ],
      paginations: {
        page_index: 1, //当前页
        total: 15, //总数
        page_size: 1, //一页显示多少条数据
        page_sizes: [1, 10, 15, 20], //下拉框：每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper", //组件布局，子组件名用逗号分隔
        pager_count: 7 //页码按钮的数量，当总页数超过该值时会折叠
      },
      allTableData: [],
      tableHeight: "",
      dialogFormVisible: false,
      formLabelWidth: "120px",
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
      dialogOrganizationValue: "",
      dialogApplicationOptions: [
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
      dialogApplicationValue: "",
      textarea: "",
      remnant: 200,
      timeValue: "",
      applicationListOptions: [
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
      applicationListValue: ""
    };
  },
  created() {
    // this.getUserList().then(() => {
    //   this.allTableData = this.userList;
    //   this.setPaginations();
    // });
    this.allTableData = this.tableData;
    this.setPaginations();

    window.addEventListener("resize", this.getTableHeight); // 注册监听器
    this.getTableHeight(); // 页面创建时先调用一次
  },
  // 生命周期 - 销毁完成
  destroyed() {
    window.removeEventListener("resize", this.getTableHeight);
  },
  methods: {
    addApplication(ev) {
      console.log(ev);
    },
    searchIconClick(ev) {
      console.log(ev);
    },
    refreshIconClick(ev) {
      let target = ev.target;
      // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
      // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
      if (target.nodeName == "SPAN" || target.nodeName == "I") {
        target = ev.target.parentNode;
      }
      target.blur();
      console.log(ev);
    },
    disableClick(row) {
      console.log(row);
    },
    deleteClick(row) {
      console.log(row);
    },
    setPaginations() {
      //设置分页 显示数据
      // console.log("设置分页显示数据");
      this.paginations.total = this.allTableData.length; //数据的数量
      this.paginations.page_index = 1; //默认显示第一页
      this.paginations.page_size = 1; //每页显示多少数据

      //显示数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    handleSizeChange(page_size) {
      // console.log("pageSize改变时触发");
      //pageSize改变时触发
      this.paginations.page_index = 1; //第一页
      this.paginations.page_size = page_size; //每页先显示多少数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size;
      });
    },
    handleCurrentChange(page) {
      // 5
      // console.log("当前页：", page, "currentPage改变时会触发");
      //currentPage 改变时会触发
      //获取前一页的总条数
      let index = this.paginations.page_size * (page - 1); // 20
      //获取总条数
      let allData = this.paginations.page_size * page; // 25

      let tablist = []; // 显示的当前页数据：20条-25条
      for (let i = index; i < allData; i++) {
        if (this.allTableData[i]) {
          //如果最后只要23条数据，只显示到23条
          tablist.push(this.allTableData[i]);
        }
        this.tableData = tablist;
      }
    },
    getTableHeight() {
      // 获取浏览器高度，减去顶部导航栏的值70（可动态获取）
      this.tableHeight = window.innerHeight - 243 + "px";
    },
    descInput() {
      let txtVal = this.textarea.length;
      this.remnant = 200 - txtVal;
      if (this.textarea.length === 200) {
        this.descInputTip();
      }
    },
    descInputTip() {
      this.$message("字数超出限制！");
    },
    searchUsers(value) {
      console.log("接收到："+value)
    }
  }
};
</script>

<style scoped>
.cursor-point {
  cursor: pointer;
}
.user-managed-header {
  min-width: 800px;
}
.refresh-btn {
  padding: 12px;
}
/* 分页样式 */
.page {
  float: left;
  margin: 10px 0;
}
.user-managed-table {
  padding: 0;
  border: 1px solid #ccc;
}
</style>
