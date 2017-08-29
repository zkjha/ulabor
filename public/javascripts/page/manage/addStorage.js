// zkj 2017/8/8
require.config({
    baseUrl:GV.STATIC_ROOT+"javascripts",
    shim:{
        "lib/requstUtil":{
            deps:['lib/jquery']
        },
    }
});
requirejs(['lib/jquery','lib/requstUtil',"lib/myi18n"],
    function ($,requstUtil,myi18n) {
        var Add = {
            init:function () {
                //获取当前资源类型，用作操作成功后的跳转
                var param = location.href.split("?")[1];
                Add.strType = param.split(",")[1]
                Add.event();
                Add.changeLan();
            },
            event:function () {
                //点击切换按钮转换语言
                $(parent.document.body).on("change","#changLan_select",function (e) {
                    Add.changeLan(e.target.value);
                })
                //绑定新增按钮点击事件
                $("#addbutton").on("click",function () {
                    var strResourcesId;
                    var param = location.href.split("?")[1];
                    var searchParam = param.split(",")[0];
                    if(searchParam){
                        strResourcesId = searchParam.split("=")[1];
                    }
                    if(!strResourcesId){
                        alert("没有资源id");
                        return;
                    }
                    var inputs = $(".form-control");
                    var options={
                        strResourcesId:strResourcesId
                    };
                    inputs.each(function (index,param) {
                        var id = $(param).attr("id");
                        var value = $(param).val();
                        options[id] = value;
                    })
                    requstUtil.request({
                        url:"/admin/manage/ajaxResourse/addStorage",
                        data:options,
                        callback:function (data) {
                            if(data.code == 1){
                                alert("新增成功");
                                location.href="/admin/manage/resourse/resourseList?"+Add.strType;
                            }else{
                                alert(data.msg);
                                return;
                            }
                        }
                    });

                });

            },
            changeLan:function (lan) {
                var lan = lan||localStorage.getItem("lan");
                myi18n.common({
                    name:"resourse",
                    lan:lan
                })
            },
            checkParams:function (params) {
                var msg = '';
                for(var i = 0,l=params.length;i<l;i++){
                    var item = params[i].split("-");
                    var name = item[1],value = item[0];
                    if(name =='strName'&&!value){
                        return msg="请输入资源名称";
                    }
                    if(name =='strType'&&!value){
                        return msg = "请选择资源类型";
                    }
                    if(name == 'strUnit'&&!value){
                        return msg = "请输入单位";
                    }
                    if(name == 'strSpecifications'&&!value){
                        return msg = "请填写获取规格";
                    }
                    if(name == "decMoney"){
                        if(isNaN(value)){

                            return msg = "单价请输入数字";
                        }
                    }
                    if(name=="iNumber"){
                        if(isNaN(value)){

                            return msg = "库存请输入数字";
                        }
                    }
                }
                return msg;
            }

        }
        Add.init();
    })