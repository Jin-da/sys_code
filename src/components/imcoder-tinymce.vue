<template>
    <div style="display:flex;justify-content: start;min-width:1429px">
        <editor v-model="content" :init="init"></editor>
        <div class="noselect" style="margin-left:20px;width:420px;min-width:420px;height:295px;border:1px dashed rgb(204,204,204);padding:15px;padding-top:15px;text-align:left"><!--tips-->
                <el-card shadow="never" style="margin-bottom:10px;position:relative;">1 添加横向铺满的底部图片使用<img src="../assets/p1.png" alt="" style="position:absolute;top:13px">.......并且只需要宽度给定750</el-card>
                <el-card shadow="never" style="margin-bottom:10px;position:relative;">2 添加浮于其他元素上方的图片的使用<img src="../assets/p2.png" alt="" style="position:absolute;top:13px"></el-card>
                <el-card shadow="never" style="margin-bottom:10px;position:relative;">3 <img src="../assets/p3.png" alt="" style="position:absolute;top:14px">....... / <img src="../assets/p4.png" alt="" style="position:absolute;top:13px">......  应在落地页完成后最后添加</el-card>
                <el-card shadow="never" style="margin-bottom:10px;position:relative;">4 插入notweixin使用<img src="../assets/p5.png" alt="" style="position:absolute;top:13px"></el-card>
        </div>

        <el-dialog title="插入底部悬浮框" :visible.sync="bottom_suspension_frame.dialog_showIf" :close-on-click-modal="false" width="400px">
            <el-form :rules="rules" ref="bottom_suspension_frame" :model="bottom_suspension_frame" label-width="100px" label-position="right">
                <el-row>
                    <el-col :span="24">
                        <el-form-item  label="选择类型" class="noselect" style="margin-right:40px" prop="choice">
                            <el-select v-model="bottom_suspension_frame.choice" placeholder="筛选" clearable>
                                <el-option v-for="item in bottom_suspension_frame.options" :key="item" :label="item" :value="item"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-button size="small" type="primary" @click="submitForm('bottom_suspension_frame')" style="margin-right: -220px;">确 定</el-button>
            </el-form>
        </el-dialog>

        <el-dialog title="添加悬浮选框-双号" :visible.sync="bottom_suspension_frame.frame_lv.dialog_showIf" :close-on-click-modal="false" width="800px">
            <el-form :rules="rules" ref="bottom_suspension_frame.frame_lv" :model="bottom_suspension_frame.frame_lv" label-width="120px" label-position="right">
                <el-row>
                <el-col :span="12">
                    <el-form-item label="首行文本" style="margin-right:40px" prop="first_text">
                        <el-input v-model="bottom_suspension_frame.frame_lv.first_text"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="次行文本" style="margin-right:40px" prop="last_text">
                        <el-input v-model="bottom_suspension_frame.frame_lv.last_text"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="按钮文本-v" style="margin-right:40px" prop="wechat_btn_text">
                        <el-input v-model="bottom_suspension_frame.frame_lv.wechat_btn_text"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="按钮文本-l" style="margin-right:40px" prop="line_btn_text">
                        <el-input v-model="bottom_suspension_frame.frame_lv.line_btn_text"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="按钮颜色RGB" style="margin-right:40px" prop="btn_rgb">
                        <el-input v-model="bottom_suspension_frame.frame_lv.btn_rgb"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="背景色RGBA" style="margin-right:40px" prop="background_color">
                        <el-input v-model="bottom_suspension_frame.frame_lv.background_color"></el-input>
                    </el-form-item>
                </el-col>
                </el-row>
                <el-button size="small" type="primary" @click="submitForm('bottom_suspension_frame.frame_lv')" style="margin-right: -620px;">确 定</el-button>
            </el-form>
        </el-dialog>

        <el-dialog title="添加悬浮选框-line" :visible.sync="bottom_suspension_frame.frame_line.dialog_showIf" :close-on-click-modal="false" width="800px">
            <el-form :rules="rules" ref="bottom_suspension_frame.frame_line" :model="bottom_suspension_frame.frame_line" label-width="120px" label-position="right">
                <el-row>
                <el-col :span="12">
                    <el-form-item label="首行文本" style="margin-right:40px" prop="first_text">
                        <el-input v-model="bottom_suspension_frame.frame_line.first_text"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="次行文本" style="margin-right:40px" prop="last_text">
                        <el-input v-model="bottom_suspension_frame.frame_line.last_text"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="按钮文本-l" style="margin-right:40px" prop="line_btn_text">
                        <el-input v-model="bottom_suspension_frame.frame_line.line_btn_text"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="按钮颜色RGB" style="margin-right:40px" prop="btn_rgb">
                        <el-input v-model="bottom_suspension_frame.frame_line.btn_rgb"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="背景色RGBA" style="margin-right:40px" prop="background_color">
                        <el-input v-model="bottom_suspension_frame.frame_line.background_color"></el-input>
                    </el-form-item>
                </el-col>
                </el-row>
                <el-button size="small" type="primary" @click="submitForm('bottom_suspension_frame.frame_line')" style="margin-right: -620px;">确 定</el-button>
            </el-form>
        </el-dialog>

        <el-dialog title="选择客服号点击跳转地" :visible.sync="notweixin.dialog_showIf" :close-on-click-modal="false" width="400px">
            <el-form :rules="rules" ref="notweixin" :model="notweixin" label-width="100px" label-position="right">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="选择类型" class="noselect" style="margin-right:40px" prop="notweixin_choice">
                            <el-select v-model="notweixin.notweixin_choice" placeholder="筛选" clearable>
                                <el-option v-for="item in notweixin.options" :key="item" :label="item" :value="item"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-button size="small" type="primary" @click="submitForm('notweixin')" style="margin-right: -220px;">确 定</el-button>
            </el-form>
        </el-dialog>

        <el-dialog title="插入绝对定位文本" :visible.sync="absolute_position_text.dialog_showIf" :close-on-click-modal="false" width="400px">
            <el-form :rules="rules" ref="absolute_position_text" :model="absolute_position_text" label-width="120px" label-position="right">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="距离顶部位置" style="margin-right:40px" prop="position_top">
                            <el-input v-model.number="absolute_position_text.position_top" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="距离左侧位置" style="margin-right:40px" prop="position_left">
                            <el-input v-model.number="absolute_position_text.position_left" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="输入文本" style="margin-right:40px" prop="text">
                            <el-input v-model="absolute_position_text.text" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-button size="small" type="primary" @click="submitForm('absolute_position_text')" style="margin-right: -220px;">确 定</el-button>
            </el-form>
        </el-dialog>

        <el-dialog title="插入绝对定位图片" :visible.sync="absolute_position_img.dialog_showIf" :close-on-click-modal="false" width="400px">
        <el-form ref="absolute_position_img" :rules="rules" :model="absolute_position_img" label-width="120px" label-position="right">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="距离左侧距离" style="margin-right:40px" prop="position_left">
                            <el-input v-model.number="absolute_position_img.position_left"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="距离顶部距离" style="margin-right:40px" prop="position_top">
                            <el-input v-model.number="absolute_position_img.position_top"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="宽度" style="margin-right:40px" prop="width">
                            <el-input v-model.number="absolute_position_img.width"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="高度" style="margin-right:40px" prop="height">
                            <el-input v-model.number="absolute_position_img.height"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            <el-form-item size="small" label="上传图片" class="noselect" prop="url">
                <span style="color:red;position:absolute;left:-77px">*</span>
                <el-upload
                required
                    class="avatar-uploader"
                    action=''
                    :show-file-list="false"
                    :auto-upload="false"
                    :on-change="uploadFile">
                    <img v-if="absolute_position_img.url" :src="absolute_position_img.url" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
        </el-form>
            <el-button size="small" type="primary" @click="submitForm('absolute_position_img')" class="formSubmitBtn" style="margin-right: -210px;">确 定</el-button>
        </el-dialog>

        <el-dialog title="插入底部悬浮图片" :visible.sync="bottom_suspension_img.dialog_showIf" :close-on-click-modal="false" width="400px">
            <el-form ref="bottom_suspension_img" :rules="rules" :model="bottom_suspension_img" label-width="120px" label-position="right">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="宽度" style="margin-right:40px" prop="width">
                                <el-input v-model.number="bottom_suspension_img.width"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="高度" style="margin-right:40px" prop="height">
                                <el-input v-model.number="bottom_suspension_img.height"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                <el-form-item size="small" label="上传图片" class="noselect" prop="url">
                    <span style="color:red;position:absolute;left:-77px">*</span>
                    <el-upload
                    required
                        class="avatar-uploader"
                        action=''
                        :show-file-list="false"
                        :auto-upload="false"
                        :on-change="uploadFile">
                        <img v-if="bottom_suspension_img.url" :src="bottom_suspension_img.url" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <el-button size="small" type="primary" @click="submitForm('bottom_suspension_img')" class="formSubmitBtn" style="margin-right: -210px;">确 定</el-button>
        </el-dialog>

        <el-dialog title="插入绝对定位按钮" :visible.sync="absolute_position_btn.dialog_showIf" :close-on-click-modal="false" width="800px">
            <el-form ref="absolute_position_btn" :rules="rules" :model="absolute_position_btn" label-width="140px" label-position="right">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="宽度" style="margin-right:30px" prop="width">
                                <el-input v-model.number="absolute_position_btn.width"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="高度" style="margin-right:30px" prop="height">
                                <el-input v-model.number="absolute_position_btn.height"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="距离左侧距离" style="margin-right:30px" prop="position_left">
                                <el-input v-model.number="absolute_position_btn.position_left"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="距离顶部距离" style="margin-right:30px" prop="position_top">
                                <el-input v-model.number="absolute_position_btn.position_top"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否添加动态效果" style="margin-right:30px" prop="move_abled">
                                <el-select v-model="absolute_position_btn.move_abled" placeholder="筛选" clearable>
                                    <el-option v-for="item in ['是','否']" :key="item" :label="item" :value="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="按钮跳转地" style="margin-right:30px" prop="link">
                                <el-select v-model="absolute_position_btn.link" placeholder="筛选" clearable>
                                    <el-option v-for="item in ['转到WeChat','转到Line','弹出窗口-jf','弹出窗口-fx']" :key="item" :label="item" :value="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item size="small" label="上传图片" class="noselect" prop="url">
                                <span style="color:red;position:absolute;left:-77px">*</span>
                                <el-upload
                                required
                                    class="avatar-uploader"
                                    action=''
                                    :show-file-list="false"
                                    :auto-upload="false"
                                    :on-change="uploadFile">
                                    <img v-if="absolute_position_btn.url" :src="absolute_position_btn.url" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                        </el-col>
                    </el-row>
            </el-form>
            <el-button size="small" type="primary" @click="submitForm('absolute_position_btn')" class="formSubmitBtn" style="margin-right: -650px;">确 定</el-button>
        </el-dialog>
    </div>
</template>
<script>
// 编辑器及各类插件,基础配置的引入
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/icons/default/icons";
import "tinymce/themes/silver";
import "tinymce/plugins/image";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/contextmenu";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/colorpicker";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/preview";
import "tinymce/plugins/code";
import "tinymce/plugins/link";
import "tinymce/plugins/advlist";
import "tinymce/plugins/codesample";
import "tinymce/plugins/hr";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/textpattern";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/autolink";
import "tinymce/plugins/directionality";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/visualchars";
import "tinymce/plugins/template";
import "tinymce/plugins/charmap";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/imagetools";
import "tinymce/plugins/autosave";
import "tinymce/plugins/autoresize";
import 'tinymce/skins/ui/oxide/skin.css'
export default {
    components: {
        Editor
    },
    props: {
        value: {
        type: String,
        default: ""
        },
        disabled: {
        type: Boolean,
        default: false
        },
        plugins: {
        type: [String, Array],
        default:
            // "preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr nonbreaking insertdatetime advlist lists wordcount imagetools textpattern autosave bdmap autoresize lineheight"
            "preview searchreplace autolink directionality visualblocks visualchars fullscreen image imagetools link media template code codesample table charmap hr nonbreaking insertdatetime advlist lists wordcount textpattern autosave  autoresize"
        },
        toolbar: {
        type: [String, Array],
        default:
            // "code undo redo restoredraft  cut copy paste pastetext  forecolor backcolor bold italic underline strikethrough link codesample  alignleft aligncenter alignright alignjustify outdent indent lineheight formatpainter  styleselect formatselect fontselect fontsizeselect  bullist numlist  blockquote subscript superscript removeformat  table  media charmap hr pagebreak insertdatetime bdmap fullscreen preview | image absolute_img absolute_text fiexd_img fiexd_top dynamic_btn notweixin",//bdmap fullscreen preview

        "preview |code undo redo | forecolor backcolor bold italic underline strikethrough  | alignleft aligncenter alignright alignjustify lineheight formatpainter |\
        image absolute_img absolute_text fiexd_img fiexd_top dynamic_btn notweixin | fontselect fontsizeselect | ",
        //  | fullscreen preview formatselect | cut copy paste pastetext |table media charmap hr pagebreak insertdatetime  |bullist numlist styleselect  | blockquote subscript superscript removeformat |link codesample |outdent indent restoredraft
        },
        // imagetools_cors_hosts: ['mydomain.com', 'otherdomain.com'],
        // imagetools_credentials_hosts: ['mydomain.com', 'otherdomain.com'],
        
    },
    data() {
        return {
            // 底部悬浮框
            bottom_suspension_frame: {
                dialog_showIf: false,
                choice:null,
                options: ["单图-双号-jf","单图-双号-fx","单图-line","选框-双号","选框-line"],
                frame_lv: {
                    dialog_showIf:false,
                    first_text:null,
                    last_text:null,
                    wechat_btn_text:'點擊添加',
                    line_btn_text:'加入好友',
                    btn_rgb:'255,121,182',
                    background_color:'255,255,255,0.8'
                },
                frame_line: {
                    dialog_showIf:false,
                    first_text:null,
                    last_text:null,
                    line_btn_text:'加入好友',
                    btn_rgb:'255,121,182',
                    background_color:'255,255,255,0.8'
                }
            },
            // 底部悬浮图片
            bottom_suspension_img: {
                dialog_showIf: false,
                width:null,
                height:null,
                url:null
            },
            // 添加客服号
            notweixin:{
                dialog_showIf:false,
                notweixin_choice:null,
                options: ["Line","WeChat"]
            },
            // 插入绝对定位文本
            absolute_position_text: {
                dialog_showIf:false,
                position_top:'',
                position_left:'',
                text:null
            },
            // 插入绝对定位图片
            absolute_position_img: {
                dialog_showIf:false,
                position_top:null,
                position_left:null,
                width:null,
                height:null,
                url:null,
            },
            // 插入绝对定位按钮
            absolute_position_btn: {
                dialog_showIf:false,
                position_top:null,
                position_left:null,
                width:null,
                height:null,
                url:null,
                link:null,
                move_abled:null
            },
            //校验规则
            rules: {
                position_top: [
                    { required: true, message: '必填' },
                    { type: 'number', message: '必须为数字'}
                ],
                position_left: [
                    { required: true, message: '必填'},
                    { type: 'number', message: '必须为数字'}
                ],
                width: [
                    { required: true, message: '必填'},
                    { validator: (rule, value, callback) => {
                            if (!Number.isInteger(value)) {
                                return callback(new Error('必须为数字'));
                            } else {
                                if (value<=0) {
                                    return callback(new Error("输入值必须大于0"));
                                } else {
                                    callback();
                                }
                            }
                    },
                    trigger: "blur",
                    },
                ],
                height: [
                    { required: true, message: '必填'},
                    { validator: (rule, value, callback) => {
                            if (!Number.isInteger(value)) {
                                return callback(new Error('必须为数字'));
                            } else {
                                if (value<=0) {
                                    return callback(new Error("输入值必须大于0"));
                                } else {
                                    callback();
                                }
                            }
                    },
                    trigger: "blur",
                    },
                ],
                url: [
                    { required: true, message: '必填',trigger: 'blur'}
                ],
                text: [
                    { required: true, message: '必填'}
                ],
                choice: [
                    { required: true, message: '必选'}
                ],
                notweixin_choice: [
                    { required: true, message: '必选'}
                ],
                link: [
                    { required: true, message: '必选'}
                ],
                move_abled: [
                    { required: true, message: '必选'}
                ],
                first_text: [
                    { required: true, message: '必填' }
                ],
                last_text: [
                    { required: true, message: '必填' }
                ],
                line_btn_text: [
                    { required: true, message: '必填' }
                ],
                wechat_btn_text: [
                    { required: true, message: '必填' }
                ],
                btn_rgb: [
                    { required: true, message: '必填' }
                ],
                background_color: [
                    { required: true, message: '必填' }
                ]
            },
            //tinymce初始化配置
            tinyID:'tinydemo',
            init: {
                object_resizing:'img',
                menubar:false,
                statusbar: false,
                selector: '#'+this.tinyID,
                language_url: "/tinymce/langs/zh_CN.js",
                language: "zh_CN",
                skin_url: "../../public/tinymce/skins/ui/oxide",
                height: 840,
                width:778,
                plugin_preview_width : "500",
                min_height: 840,
                max_height: 840,
                toolbar_mode: "wrap",
                plugins: this.plugins,
                toolbar: this.toolbar,
                content_style: "p {margin: 5px 0;}",
                fontsize_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px",
                font_formats:
                "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;",
                branding: false,
                images_upload_handler: (blobInfo, success, failure) => {//修改图片上传方式
                    // const img = "data:image/jpeg;base64," + blobInfo.base64();
                    // success(img);
                    this.tinymceUploadImage(blobInfo, success, failure)
                },
                setup: (editor) => {//用于添加自定义功能
                    var _editor = editor
                    editor.ui.registry.addButton('absolute_img', {
                        tooltip: '插入绝对定位图片',
                        icon: 'paste',
                        onAction: (editor) => {
                            this.absolute_position_img.dialog_showIf = true
                        }
                    })
                    editor.ui.registry.addButton('absolute_text', {
                        tooltip: '插入绝对定位文本',
                        icon: 'paste-text',
                        onAction: (_editor) => {
                            this.absolute_position_text.dialog_showIf = true
                        }
                    })
                    editor.ui.registry.addButton('fiexd_img', {
                        tooltip: '插入底部悬浮框',
                        icon: 'paste-row-after',
                        onAction: (_editor) => {
                            this.bottom_suspension_frame.dialog_showIf = true
                        }
                    })
                    editor.ui.registry.addButton('fiexd_top', {
                        tooltip: '插入顶部轮播文本',
                        icon: 'paste-row-before',
                        onAction: (_editor) => {
                            tinymce.activeEditor.execCommand('mceInsertContent', false, '<div id="scroll-box" style="position: fixed;top: 0px;overflow: hidden;z-index: 3;"><ul><li style="list-style: none;">李**  已添加導師領取豐胸方案</li><li style="list-style: none;">王**  已添加導師領取豐胸方案</li><li style="list-style: none;">羅**  已添加導師領取豐胸方案</li></ul><ul>(该段文字不可删除)</ul></div>');
                        }
                    })
                    editor.ui.registry.addButton('notweixin', {
                        tooltip: '插入客服号',
                        icon: 'permanent-pen',
                        onAction: (_editor) => {
                            this.notweixin.dialog_showIf = true
                        }
                    })
                    editor.ui.registry.addButton('dynamic_btn', {
                        tooltip: '插入按钮',
                        icon: 'duplicate-row',
                        onAction: (_editor) => {
                            this.absolute_position_btn.dialog_showIf = true
                        }
                    })
                }
            },
            content: this.value
        };
    },
    mounted() {
        // 编辑器初始化
        tinymce.init({});
    },
    methods: {
        submitForm(formName) {//表单提交
            this.$refs[formName].validate((valid) => {
                if(valid) {
                    if (formName === 'absolute_position_text') {//插入绝对定位文本
                        tinymce.activeEditor.execCommand('mceInsertContent', false, `<p style="position:absolute;top:${this.absolute_position_text.position_top}px;left:${this.absolute_position_text.position_left}px;font-size:24px;z-index:2;">${this.absolute_position_text.text}</p>`);
                        this.absolute_position_text.dialog_showIf = false
                    } else if (formName === 'bottom_suspension_frame') {//选择要添加的底部悬浮框类型
                        this.bottom_suspension_frame.dialog_showIf = false
                        if (this.bottom_suspension_frame.choice.indexOf('单图') !== -1) {
                            setTimeout(() => {
                                this.bottom_suspension_img.dialog_showIf = true
                            }, 230);
                        } else if(this.bottom_suspension_frame.choice === "选框-双号") {
                            setTimeout(() => {
                                this.bottom_suspension_frame.frame_lv.dialog_showIf = true
                            }, 230);
                        } else if(this.bottom_suspension_frame.choice === "选框-line") {
                            setTimeout(() => {
                                this.bottom_suspension_frame.frame_line.dialog_showIf = true
                            }, 230);
                        }
                    } else if (formName === 'notweixin') {//客服号插入
                        if (this.dialog_notweixin_choose === "Line") {
                            tinymce.activeEditor.execCommand('mceInsertContent', false, '<span class="selector2" style="font-size:24px;color:red;">{{notweixin}}</span>');
                        } else {
                            tinymce.activeEditor.execCommand('mceInsertContent', false, '<span class="selector" style="font-size:24px;color:red;">{{notweixin}}</span>');
                        }
                        this.notweixin.dialog_showIf = false
                    } else if (formName === 'bottom_suspension_frame.frame_line') {//添加悬浮选框-line
                        this.bottom_suspension_frame.frame_line.dialog_showIf = false
                        tinymce.activeEditor.execCommand('mceInsertContent', false, `<div class="fixed"style="width: 98%;max-width: 750px;text-align: center;position: fixed;margin: 0 auto;font-size: 0.18rem;left: 0;right: 0;bottom: 3px;background-color: rgba(${this.bottom_suspension_frame.frame_line.background_color});z-index: 3;padding-bottom: 10px;box-shadow: 0 1px 3px rgba(51, 51, 51, 0.8);border-radius: 5px;"><div class="fixed_top" style="padding-top: 12px;font-size: 0.16rem;"><p>${this.bottom_suspension_frame.frame_line.first_text}<span id="target"class="selector2"style="color: red;user-select: auto;-webkit-user-select: auto;">{{notweixin}}</span></p><p>${this.bottom_suspension_frame.frame_line.last_text}</p></div><div class="fixed_bottom" style="display: flex;justify-content: space-evenly;padding-top: 12px;"><div class="fixed_img_right selector2"style="width: 38%;height: 40px;line-height: 40px;background-color:rgb(${this.bottom_suspension_frame.frame_line.btn_rgb});background-repeat: no-repeat;background-size: 36px 36px;background-position: 8px 4px;border-radius: 8px;color: #fff;padding-left: 11px;box-sizing: border-box;font-weight: normal;font-size: 0.16rem;">${this.bottom_suspension_frame.frame_line.line_btn_text}</div></div></div>`)
                    } else if (formName === 'bottom_suspension_frame.frame_lv') {//添加悬浮选框-双号
                        this.bottom_suspension_frame.frame_lv.dialog_showIf = false
                        tinymce.activeEditor.execCommand('mceInsertContent', false, `<div class="fixed"style="width: 98%;max-width: 750px;text-align: center;position: fixed;margin: 0 auto;font-size: 0.18rem;left: 0;right: 0;bottom: 3px;background-color: rgba(${this.bottom_suspension_frame.frame_lv.background_color});z-index: 3;padding-bottom: 10px;box-shadow: 0 1px 3px rgba(51, 51, 51, 0.8);border-radius: 5px;"><div class="fixed_top" style="padding-top: 12px;font-size: 0.16rem;"><p>${this.bottom_suspension_frame.frame_lv.first_text}<span id="target"class="selector"style="color: red;user-select: auto;-webkit-user-select: auto;">{{notweixin}}</span></p><p>${this.bottom_suspension_frame.frame_lv.last_text}</p></div><div class="fixed_bottom" style="display: flex;justify-content: space-evenly;padding-top: 12px;"><div class="fixed_img_left selector"style="width: 38%;height: 40px;line-height: 40px;background-color:rgb(${this.bottom_suspension_frame.frame_lv.btn_rgb});background-repeat: no-repeat;background-size: 36px 36px;background-position: 8px 4px;border-radius: 8px;color: #fff;padding-left: 11px;box-sizing: border-box;font-weight: normal;font-size: 0.16rem;">${this.bottom_suspension_frame.frame_lv.wechat_btn_text}</div><div class="fixed_img_right selector2"style="width: 38%;height: 40px;line-height: 40px;background-color:rgb(${this.bottom_suspension_frame.frame_lv.btn_rgb});background-repeat: no-repeat;background-size: 36px 36px;background-position: 8px 4px;border-radius: 8px;color: #fff;padding-left: 11px;box-sizing: border-box;font-weight: normal;font-size: 0.16rem;">${this.bottom_suspension_frame.frame_lv.line_btn_text}</div></div></div>`)
                    } else if (formName === 'absolute_position_img') {//插入绝对定位图片
                        tinymce.activeEditor.execCommand('mceInsertContent', false, `<img src="${this.absolute_position_img.url}" width="${this.absolute_position_img.width}px" height="${this.absolute_position_img.height}px" style="z-index:1;top:${this.absolute_position_img.position_top}px;left:${this.absolute_position_img.position_left}px;position:absolute;vertical-align: bottom;">`);
                        this.absolute_position_img.dialog_showIf = false
                    } else if (formName === 'bottom_suspension_img') {//插入底部悬浮图片
                        if (this.bottom_suspension_frame.choice === "单图-双号-jf") {
                            tinymce.activeEditor.execCommand('mceInsertContent', false, `<img id="openWindow" class="openWindow" width="${this.bottom_suspension_img.width}px" height="${this.bottom_suspension_img.height}px" src="${this.bottom_suspension_img.url}" style="z-index:3;bottom:0px;left:0px;right:0px;margin:auto;position:fixed;vertical-align: bottom;">`);
                        } else if (this.bottom_suspension_frame.choice === "单图-双号-fx") {
                            tinymce.activeEditor.execCommand('mceInsertContent', false, `<img class="openWindow2" width="${this.bottom_suspension_img.width}px" height="${this.bottom_suspension_img.height}px" src="${this.bottom_suspension_img.url}" style="z-index:3;bottom:0px;left:0px;right:0px;margin:auto;position:fixed;vertical-align: bottom;">`);
                        } else if (this.bottom_suspension_frame.choice === "单图-line") {
                            tinymce.activeEditor.execCommand('mceInsertContent', false, `<img class="selector2" width="${this.bottom_suspension_img.width}px" height="${this.bottom_suspension_img.height}px" src="${this.bottom_suspension_img.url}" style="z-index:3;bottom:0px;left:0px;right:0px;margin:auto;position:fixed;vertical-align: bottom;">`);
                        }
                        this.bottom_suspension_img.dialog_showIf = false
                    } else if (formName === 'absolute_position_btn') {//添加绝对定位按钮
                        var dynamic_input
                        var link_input
                        if (this.absolute_position_btn.move_abled === '是') {
                            dynamic_input = 'btn_dynamic'
                        } else {
                            dynamic_input = ''
                        }
                        if (this.absolute_position_btn.link === '转到WeChat') {
                            link_input = 'selector '
                        } else if (this.absolute_position_btn.link === '转到Line') {
                            link_input = 'selector2 '
                        } else if(this.absolute_position_btn.link === '弹出窗口-jf') {
                            link_input = 'openWindow '
                        } else {
                            link_input = 'openWindow2 '
                        }
                        tinymce.activeEditor.execCommand('mceInsertContent', false, `<img src="${this.absolute_position_btn.url}" class="${link_input}${dynamic_input}" width="${this.absolute_position_btn.width}px" height="${this.absolute_position_btn.height}px" style="z-index:1;top:${this.absolute_position_btn.position_top}px;left:${this.absolute_position_btn.position_left}px;position:absolute;vertical-align: bottom;">`);
                        this.absolute_position_btn.dialog_showIf = false
                    }
                } else {
                    return false
                }
            });
        },
        async uploadFile(file) {//自定义添加的功能中的图片上传
            var formData = new FormData();
            formData.append('img', file.raw);
            // console.log(this.fileInfo);
            await this.$http.post("http://192.168.3.108:8082/index.php/index/index/upload/",formData,{ headers: { "Content-Type": "multipart/form-data" } }).then((res) => {
                if (this.absolute_position_img.dialog_showIf) {
                    this.absolute_position_img.url = res.data;
                } else if(this.bottom_suspension_img.dialog_showIf) {
                    this.bottom_suspension_img.url = res.data;
                } else {
                    this.absolute_position_btn.url = res.data;
                }
            });
        },
        handleAvatarSuccess(file) {//显示缩略图
            if (this.absolute_position_img.dialog_showIf) {
                this.absolute_position_img.url = URL.createObjectURL(file.raw);
            } else if(this.bottom_suspension_img.dialog_showIf) {
                this.bottom_suspension_img.url = URL.createObjectURL(file.raw);
            } else {
                this.absolute_position_btn.url = URL.createObjectURL(file.raw);
            }
        },

        async tinymceUploadImage(blobInfo, success, failure){//修改编辑器默认图片上传功能
            let formData = new FormData()
            // console.log(blobInfo.filename())
            formData.append('img',blobInfo.blob())
            // console.log(formData);
            await this.$http.post('http://192.168.3.108:8082/index.php/index/index/upload/',formData)
            .then(response =>{
                // console.log(response);
                if(response['status']==200){
                    success(response.data)
                }else{
                    failure('上传失败！')
                }
            })
        },
    },
    watch: {
        value(newValue) {
            this.content = newValue;
        },
        content(newValue) {
            this.$emit("input", newValue);
        }
    }
};
</script>
<style scoped>
    .noselect {
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Chrome/Safari/Opera */
        -khtml-user-select: none; /* Konqueror */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently not supported by any browser */
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 195px;
        height: 195px;
        line-height: 195px;
        text-align: center;
    }
    .avatar {
        width: 195px;
        height: 195px;
        display: block;
    }
</style>
