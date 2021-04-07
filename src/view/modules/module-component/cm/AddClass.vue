<template>
  <div>
    <div
      style="height:30px;background:#ccc;line-height:29px;margin-bottom:10px;padding-left:10px;"
    >
      <span>新增类别</span>
    </div>
    <el-form
      :model="userInfoData"
      :rules="userInfoDataRules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="类型代码" prop="username">
        <el-input
          v-model="userInfoData.username"
          size="mini"
          style="width:200px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="类型名称" prop="realName">
        <el-input
          v-model="userInfoData.realName"
          size="mini"
          style="width:200px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="选择类型" prop="type" size="mini">
        <el-select
          v-model="userInfoData.type"
          placeholder="请选择"
          size="mini"
          @change="getDepartment"
        >
          <el-option label="普通用户" value="0"></el-option>
          <el-option label="管理员" value="8"></el-option>
          <el-option label="系统管理员" value="9"></el-option>
          <el-option label="第三方测试人员" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属类别" prop="organizationId" size="mini">
        <el-select placeholder="请选择" v-model="userInfoData.organizationId">
          <el-option
            :value="userInfoData.organizationId"
            :label="userInfoData.organizationName"
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
      <el-form-item label="备注" size="mini">
        <el-input
          type="remark"
          :rows="3"
          v-model="userInfoData.remark"
          resize="none"
          style="width:200px;"
        >
        </el-input>
      </el-form-item>
      <el-form-item size="mini">
        <el-button @click="close">
          关闭
        </el-button>
        <el-button type="primary" @click="next('ruleForm')">
          确定
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "AddClass"
};
</script>

<style></style>
