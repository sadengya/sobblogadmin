<template>
  <div class="category-box">
    <div class="category-action-bar">
      <el-button type="primary" size="medium" @click="showAddCategory"
      >添加分类
      </el-button
      >
    </div>
    <div class="category-list-box">
      <el-table :data="categories" style="width: 100%" v-loading="loading">
        <el-table-column fixed prop="id" label="ID" width="200">
        </el-table-column>
        <el-table-column prop="name" label="名称" width="120">
        </el-table-column>
        <el-table-column prop="pinyin" label="拼音" width="200">
        </el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
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
            <el-button @click="edit(scope.row)" type="primary" size="small"
            >编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteRow(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="category-dialog-box">
      <el-dialog
          title="警告"
          :visible.sync="deleteDialogShow"
          width="400px"
          :close-on-click-modal="false"
      >
        <span>你确定要删除： [{{ deleteMessage }}] 这个分类吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button
              @click="deleteDialogShow = false"
              size="medium"
              type="danger"
          >
            取 消
          </el-button>
          <el-button type="primary" @click="doDeleteItem" size="medium"
          >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 添加/编辑的dialog -->
      <el-dialog
          :title="editTitle"
          :visible.sync="editDialogShow"
          width="500px"
          :close-on-click-modal="false"
      >
        <div class="category-edit-box">
          <el-form label-width="80px" size="medium">
            <el-form-item label="分类名称" required>
              <el-input v-model="category.name"></el-input>
            </el-form-item>
            <el-form-item label="分类描述" required>
              <el-input
                  v-model="category.description"
                  type="textarea"
                  :rows="3"
                  resize="none"
                  maxlength="128"
              ></el-input>
            </el-form-item>
            <el-form-item label="拼音" required>
              <el-input v-model="category.pinyin"></el-input>
            </el-form-item>
            <el-form-item label="顺序" required>
              <el-input-number
                  v-model="category.order"
                  :min="1"
                  :max="100"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="状态" required>
              <el-select v-model="category.state" placeholder="请选择状态">
                <el-option label="已删除" value="0"></el-option>
                <el-option label="正常" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogShow = false" size="medium" type="danger"
          >取 消
          </el-button>
          <el-button type="primary" @click="addCategory" size="medium">
            {{ editCommitText }}
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as api from "../../api/api";
import * as dateUtil from "../../utils/date";

export default {
  data() {
    return {
      loading: false,
      editCommitText: "修改分类",
      editTitle: "编辑分类",
      categories: [],
      deleteDialogShow: false,
      editDialogShow: false,
      deleteMessage: "",
      deleteTargetId: "",
      category: {
        name: "",
        id: "",
        description: "",
        order: "1",
        pinyin: "",
        state: "1",
      },
    };
  },
  methods: {
    edit(item) {
      //赋值，最好的做法是请求单个数据
      this.category.name = item.name;
      this.category.description = item.description;
      this.category.id = item.id;
      this.category.order = item.order;
      this.category.pinyin = item.pinyin;
      this.category.state = item.state;
      //显示对话框
      this.editDialogShow = true;
      this.editTitle = "编辑分类";
      this.editCommitText = "更新";
    },
    addCategory() {
      //检查内容
      if (this.category.name === "") {
        this.showWarning("分类名称不可以为空");
        return;
      }
      if (this.category.description === "") {
        this.showWarning("分类描述不可以为空");
        return;
      }
      if (this.category.pinyin === "") {
        this.showWarning("分类拼音不可以为空");
        return;
      }
      if (this.category.order === "") {
        this.showWarning("分类顺序不可以为空");
        return;
      }
      if (this.category.state === "") {
        this.showWarning("分类状态不可以为空");
        return;
      }
      if (this.category.id === "") {
        //提交数据
        api.postCategory(this.category).then((response) => {
          this.editDialogShow = false;
          if (response.code === api.success_code) {
            this.$message.success(response.message);
            //重置数据
            this.resetCategory();
            //刷新数据
            this.listCategroy();
          } else {
            this.showWarning(response.message);
          }
        });
      } else {
        api.putCategory(this.category.id, this.category).then((response) => {
          this.editDialogShow = false;
          if (response.code === api.success_code) {
            this.$message.success(response.message);
            //重置数据
            this.resetCategory();
            //刷新数据
            this.listCategroy();
          } else {
            this.$message.error(response.message);
          }
        });
      }
    },
    resetCategory() {
      this.category = {
        name: "",
        id: "",
        description: "",
        order: "1",
        pinyin: "",
        state: "1",
      }
    },
    deleteRow(item) {
      //不是立马删除，而是给出提示
      this.deleteDialogShow = true;
      this.deleteMessage = item.name;
      this.deleteTargetId = item.id;
    },
    doDeleteItem() {
      api.deleteCategoryById(this.deleteTargetId).then((response) => {
        console.log(this.deleteTargetId + " " + response.code);
        if (response.code === api.success_code) {
          this.$message({
            type: "success",
            center: true,
            message: response.message,
          });
          this.listCategroy();
        }
      });
      this.deleteDialogShow = false;
    },
    showAddCategory() {
      this.resetCategory()
      this.editDialogShow = true;
      this.editCommitText = "添加";
      this.editTitle = "添加分类";
    },
    listCategroy() {
      this.loading = true;
      api.listCategories().then((response) => {
        this.loading = false;
        if (response.code === api.success_code) {
          this.categories = response.data;
        }
      });
    },
    showWarning(msg) {
      this.$message({
        message: msg,
        center: true,
        type: "warning",
      });
    },
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtil.formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
  },
  mounted() {
    this.listCategroy();
  },
};
</script>

<style>
.category-list-box .el-table {
  min-height: 200px;
}
</style>
