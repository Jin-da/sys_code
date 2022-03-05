<template>
    <div>
        <!-- 页面提交表单 -->
        <div style="display: flex;position:relative;margin-left: 30px;min-width: 1500px;" v-loading.fullscreen.lock="fullscreenLoading">
            <el-form size="mini" :inline="true" class="demo-form-inline" style="display:flex;flex-wrap:wrap">
                <el-form-item  class="noselect" style="margin-right:30px">
                    <div style="text-align:left;margin-bottom:5px">落地页类别</div>
                    <el-select v-model="submitParams.pageType" placeholder="落地页类别" clearable style="width:150px">
                        <el-option v-for="item in pageTypeOptions" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="noselect" style="margin-top:32px;margin-bottom:5px;margin-right:30px">
                    <el-input v-model="submitParams.pageName" placeholder="落地页名称" clearable style="width:200px">
                    </el-input>
                </el-form-item>
                <el-form-item class="noselect" style="margin-top:32px;margin-bottom:5px">
                    <el-input v-model="submitParams.fileName" placeholder="文件夹名称" clearable style="width:200px">
                    </el-input>
                </el-form-item>
                <el-form-item class="noselect">
                    <el-button @click="submit" type="info" style="height: 30px;position:relative;margin-top:32px">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <!-- 富文本编辑器插入位置 -->
            <editor style="margin:20px 30px" v-model="yourContent"></editor>
        </div>
    </div>
</template>

<script>
import Editor from "@/components/imcoder-tinymce";
export default {
    components: { Editor },
    data() {
        return {
            fullscreenLoading:false,
            file_title_diabled:false,
            del_e: null,//暂存需要删除的数据
            dialog_comfirm_del_params:false,
            dialog_comfirm_del:false,
            dialog_comfirm:false,
            yourContent:'',//编辑器内容
            page: 1,
            pageCount: 3,
            searchType:'',//搜索类别
            searchTitle:'',//搜索落地页名称
            dnl_refresh_loading: false,
            alert_error: false,
            alert: false,
            alert_copy:false,
            dialog1: false,
            editOrNew: null,//判断新建/编辑
            showif_table: true,
            showif: false,
            isShow: true,
            tableData: [],//列表数据
            userid: null,//用户信息
            title: null,//落地页命名
            type:null,//类别搜索选项
            file_title:null,//文件夹名
            file_title_4id:null,//4位id
            //提交数据
            submitParams: {
                pageType:'',
                pageName:'',
                fileName:'',
                submitContent:''
            },
            pageTypeOptions: ["jf","fx","zy","zc","by","bf"]
        };
    },
    methods: {
        async submit() {//新增/编辑提交
            if (this.submitParams.pageName === "" || this.yourContent === "" || this.submitParams.fileName === '' || this.submitParams.pageType === '') {
                this.$message.error('提交格式错误，请检查后再提交');
            } else {
                if (this.submitParams.pageName === "" || this.yourContent === "" ||this.submitParams.pageType.length !== 2 ||['fx','jf','zy','zc','by','bf'].indexOf(this.submitParams.pageType) === -1||['fx','jf','zy','zc','by','bf'].indexOf(this.submitParams.fileName.substr(0,2)) === -1||this.submitParams.fileName === ''||this.submitParams.fileName.substr(0,2)!=this.submitParams.pageType||['lv','line'].indexOf(this.submitParams.fileName.match(/-(\S*)-/)[1]) === -1||['0','1','2','3','4','5','6','7','8','9'].indexOf(this.submitParams.fileName.charAt(this.submitParams.fileName.length - 2)) === -1||['0','1','2','3','4','5','6','7','8','9'].indexOf(this.submitParams.fileName.charAt(this.submitParams.fileName.length - 1)) === -1) {
                    this.$message.error('提交格式错误，请检查后再提交');
                } else {
                    this.fullscreenLoading = true
                    var submitData = {
                        "content": this.yourContent,
                        "name": this.submitParams.pageName,
                        "filename": this.submitParams.fileName,
                        "type": this.submitParams.pageType
                    }
                    await this.$http.post("http://localhost:3000/sys/api/landingpage",submitData).then((res) => {
                        this.fullscreenLoading = false
                        this.$message.success('提交成功');
                        this.$router.push('/landingpagelist')
                    }).catch((err) => {
                        //
                    });
                }
            }
        },
    },
    created() {
    },
    watch: {
    },
    beforeRouteLeave(to, from, next) {
        if (this.yourContent != this.$store.state.data.content ||this.submitParams.fileName != this.$store.state.data.filename||this.submitParams.pageName != this.$store.state.data.pageName ||this.submitParams.pageType != this.$store.state.data.pageType) {
            this.$store.state.data.content = this.yourContent 
            this.$store.state.data.filename = this.submitParams.fileName
            this.$store.state.data.pageName = this.submitParams.pageName
            this.$store.state.data.pageType = this.submitParams.pageType
        }
        this.$destroy('TynimceEditor')
        next()
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.yourContent = vm.$store.state.data.content
            vm.submitParams.fileName = vm.$store.state.data.filename
            vm.submitParams.pageName = vm.$store.state.data.pageName
            vm.submitParams.pageType = vm.$store.state.data.pageType
        })
    }
};
</script>

<style scoped>
    .el-button--info {
        background-color: white!important;
        color: #606266!important;
    }
</style>
