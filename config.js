/**
 * 前端部署（包括了对代码的混淆，压缩，和对模板文件的修改，版本号的计算，以及后续CDN的推送等等）配置文件。
 *  目前公司还没有cdn
 * 
 * 
 */

// 前端js和css文件的路径
exports.staticFolder = __dirname + '/public';

// 远程服务器的地址路径
exports.staticServer = '/static';//'http://yun.lu';等有了cdn之后再说

//jsp整体的配置文件路径
//exports.freemarkerConfig = __dirname + '/../WEB-INF/view/decorators';
exports.freemarkerFolder = __dirname + '/views/version.ejs';

// 目标版本号，如果未定义则默认为Unix时间戳
exports.version = '';
exports.cssDirName = "/stylesheets";
exports.jsDirName = "/javascripts";
exports.imgDirName = "/images";
exports.basePath = __dirname;
//测试
// ---------------------------------------------------------------------------
// 需要运行的模块列表
var runModules = [];

// 移动所在的文件到目标目录
runModules.push('copy_files');
//压缩资源图片
//runModules.push('compress_img');
//runModules.push('compress_fe');

// 压缩混淆静态文件
runModules.push('compress_js');
// 替换掉css中的静态文件图片信息(需要有cdn)
//runModules.push('replace_pictures');
runModules.push('compress_css');

// 修改文件的版本号
//runModules.push('change_version');

// 修改jsp的配置文件static
runModules.push('change_config');

// 移动静态文件到指定的位置
runModules.push('move_static');

exports.runModules = runModules;
// ------------------------------------------------------------------------------