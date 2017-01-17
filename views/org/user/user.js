var Vue = require('vue');
require('/src/components/widge/vueGrid/vueGrid.js');

module.exports = Vue.extend({
    route: {
        activate: function (transition) {
            transition.next()
        }
    },
    template: __inline('./user.html'),
    el: function() {
        return "#setuser";
    },
    data: function() {
        return {
        	parentOrgId:'',
            gridColumns:[
             {name:'fullname',displayName:'姓名',headerCls:'text-left',dataCls:'text-left',sortable:false }, 
             {name:'orgNames',displayName:'所属组织',headerCls:'text-left',dataCls:'text-left',render:'renderOrgNames',sortable:false }, 
             {name:'roleNames',displayName:'角色',headerCls:'text-left',dataCls:'text-left',sortable:false }, 
             {name:'leaderProvince',displayName:'省级负责人',headerCls:'text-center',dataCls:'text-center',render:'renderLeaderProvince',renderCls:'showClassProvince',onclick:'saveLeader',sortable:false },
             {name:'leaderArea',displayName:'片区负责人',headerCls:'text-center',dataCls:'text-center',render:'renderLeaderArea',renderCls:'showClassArea',onclick:'saveLeader',sortable:false },
             {name:'email',headerStyle:'width:200px;',displayName:'邮箱',headerCls:'text-left',dataCls:'text-left',sortable:false }, 
             {name:'mobile',displayName:'手机',sortable:false }, 
             {name:'state',headerStyle:'width:55px;',displayName:'状态',render:'renderState',sortable:false }, 
             {type:'btn',headerStyle:'width:50px;',btnCls:'btn fa fa-pencil-square-o fa-lg',displayName:'编辑',onclick:'goEdit',sortable:false},
             {type:'btn',headerStyle:'width:50px;',btnCls:'btn fa fa-trash fa-lg',displayName:'删除',onclick:'goDel',sortable:false}
             ]
        }
    },
    ready: function(){
        var nurl=this.$route.path;
        $("span[data-url='"+nurl+"']").addClass("lanmuz");
        $("span[data-url='"+nurl+"']").parent("a").siblings("a").find("span").removeClass("lanmuz");
    	//this.getCurrUser();
    },
    methods:{
    	add:function(){
            $("#user-modal").toggleClass("in").show();
        },
        hideadd:function(){
            $("#user-modal").toggleClass("in").hide();
        },
        showClassArea:function(v){
        	var parentOrgId = $('[name="parentOrgId"]').val();
        	if(parentOrgId==145||parentOrgId==146||parentOrgId==147||parentOrgId==148||parentOrgId==149){
        		return 'text-center';
        	}else{
        		return 'zeta-showno';
        	}
        },
        showClassProvince:function(v){
        	var parentOrgId = $('[name="parentOrgId"]').val();
        	if(parentOrgId==7){
        		return 'text-center';
        	}else{
        		return 'zeta-showno';
        	}
        },
        renderState:function(v){
            if(v.state==1)
                return '<span title="启用">启用</span>';
            else
                return '<span title="禁用">禁用</span>';
        },
        renderOrgNames:function(v){
        	var _label = '';
        	var _orgNames = v.orgNames;
        	if(_orgNames!=null&&_orgNames!=''){
        		var arr = _orgNames.split(",");
        		for(var a=0;a<arr.length;a++){
        			var b= arr[a];
        			if(a<2){
        				if(b!=null&&b!=''&&b.length>3){
        					b = b.substring(0,3)+"..";
        				}
        				_label += '<div class="label label-success text-lg" title="'+arr[a]+'">'+b+'</div>';
        			}else if(a==2){
        				_label += '<div class="label label-success text-lg" title="'+_orgNames+'">...</div>';
        			}
        		}
        	}
        	return _label;
        },
        renderLeaderArea:function(v){
        	if(v.orgId!=null&&v.orgId!=''){
        		var _checked = "";
        		if(v.leaderArea==1){
        			_checked = 'checked="checked"';
        		}
        		return '<input name="leaderArea" '+_checked+' type="radio"/>'
        	}
        	return '';
        },
        renderLeaderProvince:function(v){
        	if(v.orgId!=null&&v.orgId!=''){
        		var _checked = "";
        		if(v.leaderProvince==1){
        			_checked = 'checked';
        		}
        		return '<input name="leaderProvince" '+_checked+' type="radio"/>'
        	}
        	return '';
        },
        renderRoleNames:function(v){
        	var _label = '';
        	var _roleNames = v.roleNames;
        	if(_roleNames!=null&&_roleNames!=''){
        		var arr = _roleNames.split(",");
        		for(var a=0;a<arr.length;a++){
        			var b= arr[a];
        			if(a<2){
        				_label += '<div class="label label-success text-lg">'+b+'</div>';
        			}else if(a==2){
        				_label += '<div class="label label-success text-lg" title="'+_roleNames+'">...</div>';
        			}
        		}
        	}
        	return _label;
        },
        goDel:function(v){
            var ids = null;
            if(null!=v)
                ids = v.id;
            if(null == ids){
            	 ids = this.$refs.grid.getSelectIds()+"0";
            }
            var self=this;
            if(null != ids){
            	var _json = {};
        		_json.ids = ids;
        		_json.state = -1;
                vueUI.confirm('操作提示','确定删除？',function(){
                    vueUI.ajaxCall({
                    	url:vueUI.conf.host+"/user/save/",
                        type:"POST",
                        data:JSON.stringify(_json),
                        success:function (){
                            $("#pageNo").val(1);
                            self.search();
                            vueUI.toolTips("success","删除成功");
                        }
                    });
                });
            }
            
        },
        search:function (page){
        	$('#table-top').find('table.table-striped.zeta-table').removeAttr('style');
            if(page!=null&&page!=''){
          		$("#pageNo").val(page);
          	}
            this.$refs.grid.query();
        	
          
        },
        goEdit:function(v){
            var nid = null;
            if(null!=v)
                nid=v.id;
            else
                nid = this.$refs.grid.getSelected();
            var self=this;
            if(null != nid){
                routers.route.go({ path: '/org/user/edit/'+nid, params: { id: nid }})
            }
               
        },
        goAdd:function(){
            routers.route.go({path: '/org/user/edit/-1', params: { id: '-1' }})
        },
        enable:function(v){
			var ids = null;
            if(null!=v)
                ids = v.id;
            if(null == ids)
                ids = this.$refs.grid.getSelectIds()+"0";
			var self=this;
			if(null != ids){
				var _json = {};
        		_json.ids = ids;
        		_json.state = 1;
				vueUI.confirm('操作提示','确定启用？',function(){
					vueUI.ajaxCall({
						url:vueUI.conf.host+"/user/save/",
						data:JSON.stringify(_json),
						contentType:'application/json;charset=utf-8',
						type:"POST",
						success:function (){
							self.search();
							vueUI.toolTips("success","启用成功");
						}
					});
				});
			}
		},disable:function(v){
			var ids = null;
            if(null!=v)
                ids = v.id;
            if(null == ids)
                ids = this.$refs.grid.getSelectIds()+"0";
			var self=this;
			if(null != ids){
				var _json = {};
        		_json.ids = ids;
        		_json.state = 0;
				vueUI.confirm('操作提示','确定禁用？',function(){
					vueUI.ajaxCall({
						url:vueUI.conf.host+"/user/save/",
						data:JSON.stringify(_json),
						contentType:'application/json;charset=utf-8',
						type:"POST",
						success:function (){
							self.search();
							vueUI.toolTips("success","禁用成功");
						}
					});
				});
			}
		},saveLeader:function(v){
			var userId = v.id;
			var orgId = v.orgId;
			var self=this;
			if(null != userId && null != orgId){
				var _json = {};
        		_json.userId = userId;
        		_json.orgId = orgId;
				vueUI.confirm('操作提示','确定设置为负责人？',function(){
					vueUI.ajaxCall({
						url:vueUI.conf.host+"/userOrganization/saveLeader/",
						data:JSON.stringify(_json),
						contentType:'application/json;charset=utf-8',
						type:"POST",
						success:function (){
							self.search();
							vueUI.toolTips("success","设置成功");
						}
					});
				});
			}
		},
		getCurrUser:function(){
			var self=this;
			vueUI.ajaxCall({
				url:vueUI.conf.host+"/user/get_curr_user/",
				contentType:'application/json;charset=utf-8',
				type:"get",
				success:function (rsp){
					if(rsp.data&&rsp.data.orgIds!=null)
					$('[name="orgIds"]').val(rsp.data.orgIds);
					self.search();
				}
			});
		},
		queryOfName:function(v){
			$('[name="orgIds"]').val('');
		}
		
    }
});