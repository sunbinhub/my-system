<template>
  <div v-show="dialogId === 3 ? true : false">
    <el-container>
      <el-header style="height: 10px;font-weight:700;">
        选择策略
      </el-header>
      <el-main>
        <template>
          <el-radio v-model="tactic" label="1">不设策略</el-radio>
          <el-radio v-model="tactic" label="2">添加策略</el-radio>
        </template>
        <div style="height:333px;">
          <div v-show="tactic === '2'" style="margin-top:10px;">
            <template>
              <el-row
                style="border: 1px solid #ccc;background: #eee;padding:0 5px;height:30px;"
              >
                <span class="fl" style="line-height:28px;">
                  选中策略
                </span>
                <div class="fr">
                  <el-button
                    type="text"
                    @click="addTactic"
                    style="padding:0; padding-top:6px;"
                  >
                    新增策略
                  </el-button>
                  <el-button
                    type="text"
                    @click="removeTactic"
                    style="padding:0;padding-top:6px;"
                  >
                    删除策略
                  </el-button>
                </div>
              </el-row>
              <el-table
                ref="multipleTable"
                :data="organizationTableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                height="260px"
                border
                size="mini"
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
                <el-table-column label="操作" width="130">
                  <template slot-scope="scope">
                    <el-button
                      @click="setValueClick(scope.row)"
                      type="text"
                      size="small"
                    >
                      值设置
                    </el-button>
                    <el-button
                      @click="removeClick(scope.row)"
                      type="text"
                      size="small"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div>
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
            </template>
          </div>
        </div>
        <template>
          <el-button style="margin-top: 12px;" @click="last()" size="mini">
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
        </template>
      </el-main>
      <el-dialog
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <template>
          <el-table
            ref="tacticsTable"
            :data="tacticsTableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="tacticsSelectionChange"
            height="300px"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="name" label="姓名" width="120">
            </el-table-column>
            <el-table-column label="操作" width="130">
              <template slot-scope="scope">
                <el-button
                  @click="changeClick(scope.row)"
                  type="text"
                  size="small"
                >
                  查看数据时间范围
                </el-button>
                <el-button
                  @click="removeClick(scope.row)"
                  type="text"
                  size="small"
                >
                  添加说明
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="page">
            <el-pagination
              @size-change="tacticsHandleSizeChange"
              @current-change="tacticsHandleCurrentChange"
              :current-page="paginations.page_index"
              :page-sizes="paginations.page_sizes"
              :page-size="paginations.page_size"
              :layout="paginations.layout"
              :total="paginations.total"
              :pager-count="paginations.pager_count"
            >
            </el-pagination>
          </div>
        </template>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "RoleManagementTactics",
  data() {
    return {
      //策略选择
      tactic: "2",
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
      paginations: {
        page_index: 1, //当前页
        total: 15, //总数
        page_size: 1, //一页显示多少条数据
        page_sizes: [1, 10, 15, 20], //下拉框：每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper", //组件布局，子组件名用逗号分隔
        pager_count: 7 //页码按钮的数量，当总页数超过该值时会折叠
      },
      allTableData: [], //实际展示的表格数据
      dialogFormVisible: false, //弹窗是否显示
      formLabelWidth: "120px", //弹窗内部左侧的距离
      dialogVisible: false //新增策略弹框};
    };
  },
  methods: {
    //策略表格事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //策略表格修改事件
    setValueClick(row) {
      this.dialogFormVisible = true;
      console.log(row);
      //...这一行的数据赋值
    },
    //策略表格删除事件
    removeClick(row) {
      //...删除接口
    },
    //策略表格头部新增策略
    addTactic() {
      //...
    },
    //策略表格头部删除策略
    removeTactic() {
      //...
    },
    //关闭新增策略弹窗
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
};
</script>

<style></style>
