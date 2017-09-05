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
        var Detail = {
            init:function () {
                //获取当前资源id
                var param = location.href.split("?")[1]||'';
                var search = param.split("=")[1]||'';
                Detail.strResourcesId = search.split(",")[0];
                Detail.strType = search.split(",")[1];
                //初始化界面显示
                Detail.initView();
                Detail.event();
                Detail.changeLan();
            },
            initView:function () {
              //根据资源id初始化界面显示
              requstUtil.request({
                  url:"/admin/manage/ajaxResourse/getResourseById",
                  data:{
                      strResourcesId:Detail.strResourcesId
                  },
                  callback:function (data) {
                      if(data.code == 1){
                          console.log(data);
                          Detail.initViewByData(data);
                      }else{
                          alert(data.msg);
                          return
                      }
                  }
              })
            },
            initViewByData:function (data) {
                var resData = data&&data.data||{};
                var resource = resData.resource;

                //资源名称初始化
                $("#strName").val(resource.strName);

                //单位
                $("#strUnit").val(resource.strUnit);

                //规格
                $("#strSpecifications").val(resource.strSpecifications);

                //公司
                $("#strCompany").val(resource.strCompany);

                //货号
                $("#strModel").val(resource.strModel);

                //存放位置
                $("#strPosition").val(resource.strPosition);

                //存放位置
                $("#strRemarks").val(resource.strRemarks);
                if(resource.iInsideIsNeedBack == 0) {
                    document.getElementById("checked_1").checked = false;
                }else{
                    document.getElementById("checked_1").checked = true;
                }

            },
            event:function () {
                //点击切换按钮转换语言
                $(parent.document.body).on("change","#changLan_select",function (e) {
                    Detail.changeLan(e.target.value);
                })

                //绑定修改按钮点击事件
                $("#addbutton").on("click",function () {
                    var inputs = $(".form-control");
                    var params = [],options={
                        strResourcesId:Detail.strResourcesId
                    };
                    inputs.each(function (index,param) {
                        var id = $(param).attr("id");
                        var value = $(param).val();
                        params.push($(param).val()+"-"+$(param).attr("id"));
                        options[id] = value;
                    })
                    var msg = Detail.checkParams(params);
                    if(msg){
                        alert(msg);
                        return;
                    }
                    document.getElementById("checked_1").checked == true?(options.iInsideIsNeedBack=1):(options.iInsideIsNeedBack=0);//是否归还
                    requstUtil.request({
                        url:"/admin/manage/ajaxResourse/changeDetail",
                        data:options,
                        callback:function (data) {
                            if(data.code == 1){
                                alert("操作成功");
                                location.href="/admin/manage/resourse/resourseList?"+Detail.strType;
                                // var id = data.data.strResourcesId;
                                //
                                // layer.layer({
                                //     type:"confirm",
                                //     name:'resourse',
                                //     lan:localStorage.getItem('lan'),
                                //     title:'DetailResourseSuc',
                                //     callback:function (datas) {
                                //         if(datas == 1){
                                //             location.href= "/admin/manage/resourse/storage?strResourcesId="+id+","+Detail.strType
                                //         }else{
                                //             location.href="/admin/manage/resourse/resourseList?"+Detail.strType;
                                //         }
                                //     }
                                // });


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
        Detail.init();
    })