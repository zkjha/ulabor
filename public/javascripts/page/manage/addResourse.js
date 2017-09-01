// zkj 2017/8/4
require.config({
    baseUrl:GV.STATIC_ROOT+"javascripts",
    shim:{
        "lib/requstUtil":{
            deps:['lib/jquery']
        },
        "lib/bootstrap":{
            deps: ['lib/jquery']
        },
        "lib/layer":{
            deps:["lib/jquery"]
        },
    }
});
requirejs(['lib/jquery',"lib/layer","lib/myi18n",'lib/requstUtil',"lib/bootstrap"],
    function ($,layer,myi18n,requstUtil) {
        var Add = {
            init:function () {
                //获取当前新增资源类型
                Add.strType = location.href.split("?")[1];
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
                    var inputs = $(".form-control");
                    var params = [],options={
                        strType:Add.strType
                    };
                    inputs.each(function (index,param) {
                        var id = $(param).attr("id");
                        var value = $(param).val();
                        params.push($(param).val()+"-"+$(param).attr("id"));
                        options[id] = value;
                    })
                    var msg = Add.checkParams(params);
                    if(msg){
                        alert(msg);
                        return;
                    }
                    requstUtil.request({
                        url:"/admin/manage/ajaxResourse/addResourse",
                        data:options,
                        callback:function (data) {
                            if(data.code == 1){
                                var id = data.data.strResourcesId;
                                layer.layer({
                                    type:"confirm",
                                    name:'resourse',
                                    lan:localStorage.getItem('lan'),
                                    title:'addResourseSuc',
                                    callback:function (datas) {
                                        if(datas == 1){
                                            location.href= "/admin/manage/resourse/storage?strResourcesId="+id+","+Add.strType
                                        }else{
                                            location.href="/admin/manage/resourse/resourseList?"+Add.strType;
                                        }
                                    }
                                });


                            }else{
                                alert(data.msg);
                                return;
                            }
                        }
                    });

                });

            },
            checkParams:function (params) {
                var msg = '';
                for(var i = 0,l=params.length;i<l;i++){
                    var item = params[i].split("-");
                    var name = item[1],value = item[0];
                    if(name =='strName'&&!value){
                        return msg="请输入资源名称";
                    }
                    // if(name =='strType'&&!value){
                    //     return msg = "请选择资源类型";
                    // }
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
                    // if(name=="iNumber"){
                    //     if(isNaN(value)){
                    //
                    //         return msg = "库存请输入数字";
                    //     }
                    // }
                }
                return msg;
            },
            changeLan:function (lan) {
                var lan = lan||localStorage.getItem("lan");
                myi18n.common({
                    name:"resourse",
                    lan:lan
                })
            }

        }
        Add.init();
    })