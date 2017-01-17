var Vue = require('vue');
require('/src/directives/tree.js');

module.exports = Vue.extend({
    route: {
        activate: function (transition) {
            transition.next()
        }
    },
    template: __inline('./org.html'),
    ready: function(){
    	var self=this;
    	this.getTree();
    	this.getCurrUser();
        //树形菜单的点击事件
        $("#mainnav-menu").on('click', 'li.subNode-expand>a',
        function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).find('i.fa').toggleClass("fa-plus-square").toggleClass("fa-minus-square");
            //子节点的展开和隐藏
            var subUl = $(this).parent('li').find('ul.zeta-bgcolor05:eq(0)');
            var expandLi = $(this).parent('li').find('.subNode-expand');
            var subLiai= $(this).parent('li').siblings("li").children("a").find('i.fa');
            $(subLiai).addClass("fa-plus-square");
            $(subLiai).removeClass("fa-minus-square");

            if ($(this).find('i.fa:eq(0)').hasClass('fa-minus-square')) {

                $(subUl).collapse('show');
 
            } else {
                $(this).parent('li').find('ul.zeta-bgcolor05').collapse('hide');

                expandLi.children('a').find('i.fa').addClass("fa-plus-square").removeClass("fa-minus-square");
            }
        });
        //绑定输入事件
        $('[name="orgName"]').bind('input',function(){
        	self.getTree();
        	$('.org li.subNode-expand>a').trigger('click');
        });
        //绑定复选框事件
        $("#mainnav-menu").on('click', '.org-checkbox',
        function(e) {
            e.preventDefault();
            e.stopPropagation();
            if(!$(this).parent('label').hasClass('disabled')){
                var currentLabel=$(this).parent('label');
                
                
                if($(currentLabel).hasClass('active')){
                	$('[name="parentOrgId"]').val('');
                }else{
                	 var parentOrgId = $(this).closest('li').attr('data-node-pid');
                	 if(parentOrgId==7||parentOrgId==145||parentOrgId==146||parentOrgId==147||parentOrgId==148||parentOrgId==149)
                     $('[name="parentOrgId"]').val(parentOrgId);
                }
                
                currentLabel.toggleClass('active');
               
            }
            
           
            
            
            var ids=[];
            $('.org li label.active').each(function(index,items){
                ids.push($(items).closest('li').attr('data-node-id'));
            });
            $('[name="orgIds"]').val(ids.toString());
            self.$children[0].search(1);
            
            
        });
        
       //二级导航选中样式设置
    	$("div.panel-titlez a span.lanmu2").bind({
    		"click":function(){
    			$(this).addClass("lanmuz").parent().siblings().find("span").removeClass("lanmuz");
    		}
    	});
        this.equalurl();
        
        
        //选中当前登录用户的组织
        if(self.$data.currUser.orgIds!=null&&self.$data.currUser.orgIds!=''){
        	//this.selectCurrOrg(self.$data.currUser.orgIds);
        }
    },
    data:function(){ 
        var menus=[];
        var arrp=this.$root.$children[0].menus;
        for(var i=0;i<arrp.length;i++){
            if(arrp[i].url=='/org'){
                menus=arrp[i].children;
                break;
            }
        };
        return{
        	currUser:{},
        	tree:[],
        	menus:menus
        }
    },
    methods:{
        goRouter:function(url){
            routers.route.go(url);
        },
        getTree:function(){
        	var self=this;
        	var form=$("#orgTree-form");
            var josn=JSON.stringify($('#orgTree-form').serializeObject());
        	vueUI.ajaxCall({
                  url:vueUI.conf.host+"/organization/tree/",
                  data:josn,
                  type:"POST",
                  success:function(rsp){
                	  self.$data.tree=rsp.data;
                  }
           });
        },
        getCurrUser:function(){
        	var self=this;
        	vueUI.ajaxCall({
                  url:vueUI.conf.host+"/user/get_curr_user/",
                  type:"get",
                  success:function(rsp){
                	  self.$data.currUser=rsp.data;
                  }
           });
        },
        equalurl:function(){
            var nurl=this.$route.path;
            $("span[data-url='"+nurl+"']").addClass("lanmuz");
        },
        selectCurrOrg:function(orgIds){
        	var self=this;
        	//默认选中当前用户下的组织
        	if(orgIds!=null&&orgIds!=''){
        		var arr = orgIds.split(',');
        		if(arr!=null&&arr.length>0){
        			for(var i=0;i<arr.length;i++){
        				var orgId = arr[i];
        				Vue.nextTick(function () {
        					$('#mainnav-menu li[data-node-id="'+orgId+'"] label:eq(0)').addClass('active');
        				})
        			}
        		}
        		//self.$children[0].setOrgIds(orgIds);
        	}
        }
    }
});
