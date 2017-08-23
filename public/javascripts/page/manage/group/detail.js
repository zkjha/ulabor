require.config({
    baseUrl:GV.STATIC_ROOT+"javascripts",
    shim:{
        "lib/requstUtil":{
            deps:['lib/jquery']
        },
        "lib/jqueryPage":{
            deps:['lib/jquery']
        },
        "lib/bootstrap":{
            deps: ['lib/jquery']
        }
    }
});
requirejs([
    'lib/jquery',
    "lib/requstUtil",
    "lib/jqueryPage"
],function ($,requstUtil) {
    var detail = {
        init:function () {
            //初始化所有实验室成员列表问题
            var queryParam = location.href.split("?")[1];
            var arr = queryParam.split(",");
            var strGroupId = arr[0];
            var groupName = decodeURI(arr[1]);
            $(".groupName").html(groupName);
            detail.getPageToView(1,{strGroupId:strGroupId});

        },
        getPageToView:function (nowPage,options) {
            var option = {
                pageSize:10,
                pageNumber:nowPage
            }
            if(options){
                for(var i in options){
                    option[i] = options[i];
                }
            }
            detail.nowPage = nowPage;
            requstUtil.request({
                url:'/admin/manage/ajaxGroup/getAllMenbers',
                data:option,
                callback:function (data) {
                    if(data.code == 1){
                        // console.log(data.data);
                        detail.createElement(data);
                    }else{
                        alert(data.msg);
                        return
                    }
                }
            });
        },
        createElement:function (dataList) {
            var rootPath = dataList.data.strImgRootPath;
            var datas = dataList.data||{};
            var list = datas.list||[];
            var str = "";
            for(var i = 0,l=list.length;i<l;i++){
                var data = list[i]||{};
                var dataId = data.strLaboratoryId||'';
                str +="<tr>";
                str +="<td><img src='"+(rootPath+data.strImage)+"'></td>";//头像
                str +="<td>"+(data.strName||'')+"</td>";//实验室名称
                str +="<td>"+(data. strParentUnit||'')+"</td>";//所属机构
                switch (data.isAgree){
                    case 0:
                        str +="<td class='groupType_td' ><span class='notInGroup groupType i18n'  data-title='Shared'>未加入</span></td>";//是否加入
                        break;
                    case 1:
                        str +="<td class='groupType_td' ><span class='groupType joinGroup i18n'  data-title='Shared'>已加入</span></td>";//是否加入
                        break;
                    case -1:
                        str +="<td class='groupType_td' ><span class='groupType refuseGroup i18n'  data-title='Shared'>已拒绝</span></td>";//是否加入
                        break;
                    default:
                        str +="<td class='groupType_td' ><span class='groupType i18n'  data-title='Shared'></td>";
                }
                str +="</tr>"

            }
            $("#j_body").html(str);
            $("#j_footer").html("<span><span class='i18n' data-title='tips_one'>总共</span>&nbsp&nbsp"+dataList.data.iTotalpages+"&nbsp&nbsp<span class='i18n' data-title='pages'>页</span> ，<span class='i18n' data-title='tips_two'>当前为第</span>&nbsp&nbsp"+ detail.nowPage +"&nbsp&nbsp<span  class='i18n' data-title='pages'> 页</span></span>");
            $("#j_pageNum").html("");
            $("#j_pageNum").pagination({
                count: dataList.data.iTotalrecords, //总数
                size: 10, //每页数量
                index: list.nowPage,//当前页
                lrCount: 3,//当前页左右最多显示的数量
                lCount: 0,//最开始预留的数量
                rCount: 0,//最后预留的数量
                callback: function (options) {
                    list.getPageToView(options.index);
                }
            });

            //转换语言
            // list.changeLan();

        }
    };
    detail.init();
});