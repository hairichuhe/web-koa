window.vueUI = {
	
	/**
	 * ajax 提交 <br>
	 * 参数：option，需要设置的内容type、url、data、success即可
	 */
	ajaxCall: function(option){
		var errorHandler = function(rsp,callback) {
			if(rsp.status==0){
				vueUI.alert("错误提示","服务器错误，请联系管理员或再试一次！",callback)
			}else{
		        var err=JSON.parse(rsp.responseText);
		        if(err.meta.code==400){
					vueUI.alert("错误提示","账号或密码错误",callback)
				}else if(err.meta.code==500){
					vueUI.alert("错误提示","服务器错误，请联系管理员!<br>错误信息："+err.meta.message,callback)
				}else if(err.meta.code==401){
					vueUI.gotoLogin();
				}else if(err.meta.code==403){
					vueUI.gotoLogin();
				}else{
					vueUI.alert("错误提示","你请求的页面发生错误，请联系管理员或再试一次！",callback)
				}
			}
	    };
		var defaults  = {
			beforeSend:function (XHR){
                XHR.setRequestHeader('Authorization','Bearer '+window.sessionStorage.access_token);////////设置消息头
            },
			type:"post",
			dataType : 'json',
			contentType:'application/json;charset=utf-8',
		};
		var settings = $.extend({},defaults,option);
		
		settings.error=function (rsp){
			if(option.error){
				errorHandler(rsp,function(){
					option.error(rsp);
				})
			}else{
				errorHandler(rsp)
			}
		};
		settings.success=function (rsp){
			if(rsp.meta&&rsp.meta.success&&rsp.meta.success==false){
				vueUI.alert("错误提示","错误信息："+rsp.meta.message)
			}else{
				option.success(rsp);
			}
		};
		$.ajax(settings);
	},
	/**
	 * 提示框 <br>
	 * 参数：title：标题，message：提示消息;callback：回调函数
	 */
  	alert: function(title,message,callback) {
	    $("#portalAlert",$("body")).remove();
		var self=this;
		if(arguments.length==1){
			message=title;
			title="错误提示";
		}else if(arguments.length==2 && typeof arguments[1]=='function'){
			callback=message;
			message=title;
			title="错误提示";
		}else if(arguments.length==0){
			title="错误提示";
		};
	    var modal = '<div class="modal" id="portalAlert" style="display: block;">'+
			'<div class="modal-dialog">'+
			'<div class="modal-content">'+
			'<div class="modal-header">'+
			'<button type="button" class="close closed" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>'+
			'<h4 class="modal-title" id="dialog-title">'+title+'</h4>'+
			'</div>'+
			'<div class="modal-body" style="padding-bottom:0">'+
			'<form id="save-form"  class="form-horizontal bv-form" novalidate="novalidate">'+
			'<validator name="validation">'+
			'<div>'+message+'</div>'+
			'<div class="modal-footer text-center" style="margin:0 -15px">'+
			'<button class="btn btn-bian2 btn-labeled ok" type="button" >'+
			'<span class="btn-label"><i class="fa fa-upload fa-lg"></i></span> 确定'+
			'</button>'+
			'</div>'+
			'</validator>'+
			'</form>'+
			'</div>'+
			'</div>'+
			'</div>'+
			'</div>';
		$("body").append(modal);
		$("#portalAlert",$("body")).addClass("in");
		$("button.closed",$("#portalAlert")).click(function(){
			$("#portalAlert",$("body")).removeClass("in").hide(30,function(){
				$("#portalAlert",$("body")).remove();
			});
		});
		$("button.ok",$("#portalAlert")).click(function(){
			$("#portalAlert",$("body")).removeClass("in").hide(30,function(){
				$("#portalAlert",$("body")).remove();
				if(callback){
					callback();
				}
			});
		});
 	},
	/**
	 * 确认提示框 <br>
	 * 参数：title：标题，message：提示消息，callback：回调函数
	 */
	confirm: function(title,message,callback){
		$("#portalConfirm",$("body")).remove();
		var self=this;
		if(arguments.length==1){
			message=title;
			title="错误提示";
		}else if(arguments.length==2 && typeof arguments[1]=='function'){
			callback=message;
			message=title;
			title="错误提示";
		}else if(arguments.length==0){
			title="错误提示";
		};
		
		var modal ='<div class="modal" id="portalConfirm" style="display: block;">'+
		'<div class="modal-dialog">'+
		'<div class="modal-content">'+
		'<div class="modal-header">'+
		'<button type="button" class="close closed" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>'+
		'<h4 class="modal-title" id="dialog-title">'+title+'</h4>'+
		'</div>'+
		'<div class="modal-body" style="padding-bottom:0">'+
		'<form id="save-form"  class="form-horizontal bv-form" novalidate="novalidate">'+
		'<validator name="validation">'+
		'<div>'+message+'</div>'+
		'<div class="modal-footer text-center" style="margin:0 -15px">'+
		'<button  type="button" class="btn btn-default closed" id="closeDialog">取消</button>'+
		'<button class="btn btn-bian2 btn-labeled ok" type="button">'+
		'<span class="btn-label"><i class="fa fa-upload fa-lg"></i></span> 确定'+
		'</button>'+
		'</div>'+
		'</validator>'+
		'</form>'+
		'</div>'+
		'</div>'+
		'</div>'+
		'</div>';

		$("body").append(modal);
		$("#portalConfirm",$("body")).addClass("in");
		$("button.closed",$("#portalConfirm")).click(function(){
			$("#portalConfirm",$("body")).removeClass("in").hide(30,function(){
				$("#portalConfirm",$("body")).remove();
			});
		});
		
		$("button.ok",$("#portalConfirm")).click(function(){
			$("#portalConfirm",$("body")).removeClass("in").hide(30,function(){
				$("#portalConfirm",$("body")).remove();
				if(callback){
					callback();
				}
			});
		});			
	},
	/**
	 * input界面的模态弹出窗口 <br>
	 * 参数：dom：form的div id
	 */
  	inputDialog: function(dom) {

		var mack = '<div class="modal-backdrop fade in"></div>';

		$("body").append(mack);
		$("body").append($(dom));
		$(dom,"#content-container").remove();
		$(dom).attr("max-height",$(window).height()-100+"px")
		$(dom).show(30);
		
		$("button.close,button.btn-close",$(dom)).click(function(){
			$(dom,$("body")).removeClass("in").delay(300).fadeOut(30,function(){
				$(dom,$("body")).remove();	
				$(".modal-backdrop",$("body")).remove();
			});
		});				
 	},

 	/**
	 * 关闭input界面的模态弹出窗口 <br>
	 * 参数：dom：form的div id
	 */
 	closeDialog:function(dom){
 		$(dom,$("body")).removeClass("in").delay(300).fadeOut(30,function(){
				$(dom,$("body")).remove();	
				$(".modal-backdrop",$("body")).remove();
			});
 	},

	/**
	 * 返回登录页 <br>
	 */
	gotoLogin:function (){
		window.sessionStorage.goto_url=window.location.href;
		window.location.href='/login';
	},
	/* 提示框的弹出事件
		参数1，弹出框的状态--成功,提示或者失败
		参数2，提示信息
	*/
	toolTips:function(status,msg){
		var icon;
		if(status=="success"){
			icon='<i class="fa fa-check-circle fa-4x"></i>'
		}else if(status=="warning"){
			icon='<i class="fa fa-warning fa-4x"></i>'
		}else if(status=="danger"){
			icon='<i class="fa fa-ban fa-4x"></i>'
		}else if(status=="info"){
			icon='<i class="fa fa-bell fa-4x"></i>'
		}
		var dom='<div class="message-form '+status+' move">'+
	        '<div class="m-l">'+
	            '<span class="l-t">操作提示</span>'+
	            icon+
	        '</div>'+
	        '<span class="m-r">'+msg+'</span>'+
	    '</div>';
	    $("body").append(dom);
	    setTimeout(function(){
	    	$("body>div.message-form").remove();
	    },1000)
	},
	/* 添加加载动画
		参数，提示文本
	*/
	showLoading:function(msg){
		$("#portalLoading",$("body")).remove();
		var textStatue;
		if(msg){
			textStatue=msg
		}else{
			textStatue="加载中"
		};
		var modal = '<div id="portalLoading" class="load">'+
	        '<div class="load-c">'+
	            '<i class="fa fa-spinner fa-spin fa-5x"></i>'+
	            '<span>'+textStatue+'</span>'+
	        '</div>'+
	    '</div>';
		modal = $(modal).addClass("fade");
		$("body").append(modal);
	},
	/* 移除加载动画
		
	*/
	hideLoading:function(){
		$("#portalLoading",$("body")).remove();
	},
	/* 各类图表分装 
	pie 传title，target，data：[{value:335, name:'直接访问'},{value:310, name:'邮件营销'}],type
	line || bar 传title target data:{name:'邮件营销',data:[120, 132, 101, 134, 90, 230, 210]},{name:'联盟广告',data:[220, 182, 191, 234, 290, 330, 310]}type,xdata	
	*/
	draw:function(params){
		var option;
		if (params.type=="pie") {
			var legenddata=[];
			for(var i=0;i<params.data.length;i++){
				legenddata.push(params.data[i].name)
			};
			option={
			    title : {
			        text: params.title,
			        x:'center'
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
			        orient: 'vertical',
			        left: 'left',
			        data: legenddata
			    },
			    series : [
			        {
			            name: params.title,
			            type: 'pie',
			            radius : '55%',
			            center: ['50%', '60%'],
			            data:params.data,
			            itemStyle: {
			                emphasis: {
			                    shadowBlur: 10,
			                    shadowOffsetX: 0,
			                    shadowColor: 'rgba(0, 0, 0, 0.5)'
			                }
			            }
			        }
			    ]
			};
		}else if (params.type=="bar" || params.type=="line") {
			var legenddata=[];
			var boundaryGap=false;
			if(params.type=="bar"){
				boundaryGap=true;
			};
			for(var i=0;i<params.data.length;i++){
				legenddata.push(params.data[i].name);
				params.data[i].type=params.type;
				params.data[i].stack="总量";
				params.data[i].areaStyle= {normal: {}};
				params.data[i].label= {normal: {show: true,position: 'top'}};
			};
			option={
			    title: {
			        text: params.title
			    },
			    tooltip : {
			        trigger: 'axis'
			    },
			    legend: {
			        data:legenddata,
			        top:25
			    },
			    toolbox: {
			        feature: {
			            saveAsImage: {}
			        }
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis : [
			        {
			            type : 'category',
			            boundaryGap : boundaryGap,
			            data : params.xdata
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value'
			        }
			    ],
			    series : params.data
			};
		};
		var chart=echarts.init(document.getElementById(params.target));
		chart.setOption(option);

		$(window).bind('resize', function(evt) {
			chart.resize();
		});
	},
	/* 数组去重，返回一个数组；
		传递arr example：[0,2,,5,0]
	*/
	unique:function(params){
		var temp=[];
		for(var i=0;i<params.length;i++){
			if(temp.indexOf(params[i])===-1){
				temp.push(params[i]);
			}
		};
		return temp;
	},
	
	/**
	 * 省市环境
	 */
	conf:{
		"host": "https://command.shadsj.com/api",  	//主机地址
		"auth_host": "https://command.shadsj.com",	//认证地址
		"client_id":"clientapp",				//app授权id
		"client_secret":"123456",				//app授权密码
	}
	/**
	 * 测试环境
	 */
	/*conf:{
		"host": "https://112.65.228.7/api",  	//主机地址
		"auth_host": "https://112.65.228.7",	//认证地址
		"client_id":"clientapp",				//app授权id
		"client_secret":"123456",				//app授权密码
	}*/
	
	/*
	 * 总部环境
	 * 
	 * */
	/*conf:{
		"host": "http://112.65.228.7/api",  	//主机地址
		"auth_host": "http://112.65.228.7",		//认证地址
		"client_id":"clientapp",				//app授权id
		"client_secret":"123456",				//app授权密码
	}*/
	
}