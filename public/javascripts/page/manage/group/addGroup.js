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
    "lib/myi18n",
    "lib/jqueryPage"
],function ($,requstUtil,myi18n) {
    var add = {
        init:function () {
            //初始化所有实验室列表问题
            add.getPageToView(1);
            //监听事件
            add.event();
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
            add.nowPage = nowPage;
            requstUtil.request({
                url:'/admin/manage/ajaxGroup/getAllLabor',
                data:option,
                callback:function (data) {
                    if(data.code == 1){
                        // console.log(data.data);
                        add.createElement(data);
                    }else{
                        alert(data.msg);
                        return
                    }
                }
            });
        },
        event:function () {
            //监听全选按钮点击事件;
            $(".allChecked").on("change",function () {
                var checked = $(this).is(":checked");
                if(checked){
                    $(".ulabor_checkbox").prop("checked","true");
                }else{
                    $(".ulabor_checkbox").removeProp("checked");
                }


            });

            //监听顶部语言切换事件
            $(parent.document.body).on("change","#changLan_select",function (e) {
                // Layer.loading();
                var lan =add.lan =  e.target.value;
                add.changLan(lan);
            });

            //监听input选中事件,并将获取到的id保存并展示出选中
            $(".add").on("change",'input[type=checkbox]',function () {
                $(".checkedname").html("");
                var strIdArr = [],strNameArr=[];
                //被点击事件如果是全部则遍历全部，否则记录当前的
                $(".ulabor_checkbox").each(function (index,input) {
                    if($(input).is(":checked")){
                        strIdArr.push($(input).attr("data-id"));
                        strNameArr.push($(input).attr("data-name"));
                    }
                });
                add.strLaboratoryIds = strIdArr.join(",");
                $(".checkedname").html(strNameArr.join(","));

            });

            //新增按钮点击事件
            $("#addbutton").on("click",function () {
                var strGroupName = $("#strGroupName").val();//组名
                var strLaboratoryIds = add.strLaboratoryIds//组名
                if(!strGroupName){
                    alert("请填写分组名称");
                    return;
                }
                if(!strLaboratoryIds){
                    alert("请选择分组成员");
                    return
                }
                requstUtil.request({
                    url:'/admin/manage/ajaxGroup/addGroup',
                    data:{
                        strGroupName:strGroupName,
                        strLaboratoryIds:strLaboratoryIds
                    },
                    callback:function (data) {
                        if(data.code == 1){
                            // console.log(data.data);
                            alert("操作成功");
                            location.href="/admin/manage/group/groupList";
                        }else{
                            alert(data.msg);
                            return
                        }
                    }
                });
            });
        },
        createElement:function (dataList) {
                var rootPath = dataList.strImgRootPath;
                var datas = dataList.data||{};
                var list = datas.dataList||[];
                var str = "";
                for(var i = 0,l=list.length;i<l;i++){
                    var data = list[i]||{};
                    var dataId = data.strLaboratoryId||'';
                    str +="<tr>";
                    str +="<td><input class='ulabor_checkbox' data-name='"+data.strName+"'data-id='"+dataId+"' type='checkbox'></td>";
                    str +="<td>"+(data.strName||'')+"</td>";//实验室名称
                    str +="<td>"+(data. strParentUnit||'')+"</td>";//所属机构
                    str +="</tr>"

                }
                $("#j_body").html(str);
                $("#j_footer").html("<span><span class='i18n' data-title='tips_one'>总共</span>&nbsp&nbsp"+dataList.data.iTotalpages+"&nbsp&nbsp<span class='i18n' data-title='pages'>页</span> ，<span class='i18n' data-title='tips_two'>当前为第</span>&nbsp&nbsp"+ add.nowPage +"&nbsp&nbsp<span  class='i18n' data-title='pages'> 页</span></span>");
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
                add.changLan();

        },
        changLan:function (lan) {
            var lan  = add.lan=(lan||localStorage.getItem("lan"));
            myi18n.common({
                name:"group",
                lan:lan
            })
        }
    };
    add.init();
});