<template>
  <div class="user-list box">
    <div class="user-search-bar">
      <el-form :inline="true" size="meidum">
        <el-form-item label="用户名">
          <el-input v-model="search.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="search.email" placeholder="请输入邮箱地址">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch">搜 索</el-button>
          <el-button type="danger" @click="cleanSearch">清 空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="list-box">
      <el-table :data="userList" style="width: 100%" v-loading="loading">
        <el-table-column fixed prop="id" label="ID" width="200">
        </el-table-column>
        <el-table-column prop="avatar" label="头像" width="60">
          <template slot-scope="scope">
            <el-avatar size="medium" :src="scope.row.avatar"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名" width="120">
        </el-table-column>
        <el-table-column prop="email" label="用户邮箱" width="200">
        </el-table-column>
        <el-table-column prop="sign" label="签名" width="200">
        </el-table-column>
        <el-table-column label="创建日期" width="200">
          <template slot-scope="scope">
            <span v-text="formatDate(scope.row.createTime)"></span>
          </template>
        </el-table-column>
        <el-table-column label="更新日期" width="200">
          <template slot-scope="scope">
            <span v-text="formatDate(scope.row.updateTime)"></span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="resetPassword(scope.row)" type="primary" size="small"
            >重置密码
            </el-button>
            <el-button type="danger" size="small" @click="deleteRow(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-navigation-box">
      <el-pagination
          background
          @current-change="onPageChange"
          :page-size="pageNavigation.size"
          :total="pageNavigation.total"
          :current-page="pageNavigation.current"
          :page-count="pageNavigation.pages"
      ></el-pagination>
    </div>
    <div class="user-list-dialog-box">
      <el-dialog
          title="警告"
          :visible.sync="deleteDialogShow"
          width="400px"
          :close-on-click-modal="false">
        <span>你确定要删除： [{{ deleteMessage }}] 这个用户吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button
              @click="deleteDialogShow = false"
              size="medium"
              type="danger">
            取 消
          </el-button>
          <el-button type="primary" @click="doDeleteItem" size="medium">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
          title="密码重置"
          :visible.sync="resetPasswordDialogShow"
          width="400px"
          :close-on-click-modal="false">
        <div class="reset-password-box">
          <div>重置 [{{ targetResetUserName }}] 的密码</div>
          <el-form label-width="70px" size="medium">
            <el-form-item label="新密码">
              <el-input type="password" v-model="resetPasswordValue" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
              @click="resetPasswordDialogShow = false"
              size="medium"
              type="danger">
            取 消
          </el-button>
          <el-button type="primary" @click="doResetPassword" size="medium">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {hex_md5} from "@/utils/md5";
import * as api from "../../api/api";
import * as dateUtil from "../../utils/date";

export default {
  data() {
    return {
      targetResetUserId: '',
      targetResetUserName: '',
      resetPasswordValue: '',
      resetPasswordDialogShow: false,
      deleteTargetId: '',
      deleteMessage: '',
      deleteDialogShow: false,
      search: {
        userName: '',
        email: ''
      },
      loading: false,
      userList: [],
      pageNavigation: {
        current: 1,
        pages: 1,
        total: 0,
        size: 10,
      }
    }
  },

  methods: {
    onPageChange(page) {
      this.pageNavigation.current = page
      this.listUsers()
    },
    cleanSearch() {
      this.search = {
        userName: '',
        email: ''
      }
    },
    doSearch() {
      api.doUserSearch(this.search.userName, this.search.email).then(response => {
        this.handleUserListResult(response)
        this.loading = false
      })
    },
    deleteRow(item) {
      //不是立马删除，而是给出提示
      this.deleteDialogShow = true;
      this.deleteMessage = item.userName;
      this.deleteTargetId = item.id;
    },
    doDeleteItem() {
      api.deleteUserById(this.deleteTargetId).then((response) => {
        this.deleteDialogShow = false;
        if (response.code === api.success_code) {
          this.$message.success(response.message);
          this.listUsers();
        } else {
          this.$message.error(response.message)
        }
      });
    },
    resetPassword(item) {
      this.resetPasswordDialogShow = true
      this.targetResetUserName = item.userName
      this.targetResetUserId = item.id

    },
    doResetPassword() {
      //检查密码不为空
      if (this.resetPasswordValue === '') {
        this.$message.error("新密码不可以为空")
        return
      }
      api.resetPassword(this.targetResetUserId, hex_md5(this.resetPasswordValue)).then(response => {
        this.resetPasswordDialogShow = false
        if (response.code === api.success_code) {
          this.$message.success(response.message)
        } else {
          this.$message.error(response.message)
        }
      })
    },
    listUsers() {
      this.loading = true
      api.listUsers(this.pageNavigation.current, this.pageNavigation.size).then(response => {
        this.handleUserListResult(response)
        this.loading = false
      });
    },
    handleUserListResult(result) {
      if (result.code === api.success_code) {
        this.userList = result.data.records
        this.pageNavigation.current = result.data.current;
        this.pageNavigation.pages = result.data.pages;
        this.pageNavigation.size = result.data.size;
        this.pageNavigation.total = result.data.total;
      } else {
        this.$message.error(result.message)
      }
    },
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtil.formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
  },

  mounted() {
    this.listUsers()
  }
}
</script>

<style>

</style>