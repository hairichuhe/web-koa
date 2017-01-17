var Vue = require('vue');
require('/src/components/widge/vueGrid/vueGrid.js');
var VueValidator = require('vue-validator');
Vue.use(VueValidator);

module.exports = Vue.extend({
	route : {
		activate : function(transition) {
			transition.next()
		}
	},
	template : __inline('./organization.html'),
	el : function() {
		return "#setorganization";
	},
	data : function() {
		return {
			gridColumns : [ {
				name : 'name',
				displayName : '名称',
				headerCls:'text-left',dataCls:'text-left',
				sortable : false
			}, {
				name : 'state',
				displayName : '是否启用',
				render : 'renderState',
				sortable : false
			}, {
				name : 'createTime',
				displayName : '创建日期',
				sortable : false
			}, {
				name : 'modifyTime',
				displayName : '最后更新日期',
				sortable : false
			}, {
				type : 'btn',
				headerStyle : 'width:56px;',
				btnCls : 'btn fa fa-pencil-square-o fa-lg',
				displayName : '编辑',
				onclick : 'goEdit',
				sortable : false
			}, {
				type : 'btn',
				headerStyle : 'width:56px;',
				btnCls : 'btn fa fa-trash fa-lg',
				displayName : '删除',
				onclick : 'goDel',
				sortable : false
			} ],
			organization : {state : '1'},
			form : {
				parentId : '',
				name : '',
				parentName : '',
				state : '1'
			},
			treeOfOrg : [],
			temp : {}
		}
	},
	created : function() {
		this.$clone = $.extend(true, {}, this.form);
	},
	ready : function() {
        var nurl=this.$route.path;
        $("span[data-url='"+nurl+"']").addClass("lanmuz");
        $("span[data-url='"+nurl+"']").parent("a").siblings("a").find("span").removeClass("lanmuz");
		var self = this;
		self.getTreeOfOrg();
		//树形菜单的点击事件
		$("#treeOfOrg")
				.on(
						'click',
						'li.subNode-expand>a',
						function(e) {
							e.preventDefault();
							e.stopPropagation();
							$(this).find('i.fa').toggleClass("fa-plus-square")
									.toggleClass("fa-minus-square");
							//子节点的展开和隐藏
							var subUl = $(this).parent('li').find(
									'ul.zeta-bgcolor05:eq(0)');
							var expandLi = $(this).parent('li').find(
									'.subNode-expand');

							if ($(this).find('i.fa:eq(0)').hasClass(
									'fa-minus-square')) {

								$(subUl).collapse('show');

							} else {
								$(this).parent('li').find('ul.zeta-bgcolor05')
										.collapse('hide');

								expandLi.children('a').find('i.fa').addClass(
										"fa-plus-square").removeClass(
										"fa-minus-square");
							}
						});
		//绑定回车事件
		 //绑定输入事件
        $('#treeOfOrg-form [name="orgName"]').bind('input',function(){
        	self.getTreeOfOrg();
        	$('#treeOfOrg .org li.subNode-expand>a').trigger('click');
        });

		//绑定单选框事件
		$("#treeOfOrg").on('click', '.org-radio', function(e) {
			e.preventDefault();
			e.stopPropagation();
			if (!$(this).parent('label').hasClass('disabled')) {
				var currentLabel = $(this).parent('label');
				$('#treeOfOrg li label.active').removeClass("active");
				currentLabel.toggleClass('active');
			}
			var ids = [];
			var names = [];
			$('#treeOfOrg li label.active').each(function(index, items) {
				ids.push($(items).closest('li').attr('data-node-id'));
				names.push($(items).closest('li').attr('data-node-name'));
			});
			console.log(ids.toString());
			$('[name="parentId"]').val(ids.toString());
			$('[name="parentName"]').val(names.toString());
		});
	},
	methods : {
		add : function() {
			this.$resetValidation();
			this.$data.organization ={state : '1'};
			this.$data.temp =null;
			$("#organization-modal").toggleClass("in").show();
		},
		hideadd : function() {
			this.resetForm();
			$("#organization-modal").toggleClass("in").hide();
		},
		toggleRadio:function(e){
            $(e.currentTarget).addClass("active");
            $(e.currentTarget).parent("label").siblings("label").removeClass("active");
        },
		renderState : function(v) {
			if (v.state == 1)
				return '<span title="启用">启用</span>';
			else
				return '<span title="禁用">禁用</span>';
		},
		goDel : function(v) {

			var ids = null;
			if (null != v)
				ids = v.id;
			if (null == ids)
				ids = this.$refs.grid.getSelectIds();
			var self = this;
			if (null != ids) {
				var _json = {};
				_json.ids = ids;
				_json.state = -1;
				vueUI.confirm('操作提示', '确定删除？', function() {
					vueUI.ajaxCall({
						url : vueUI.conf.host + "/organization/save/",
						data : JSON.stringify(_json),
						contentType : 'application/json;charset=utf-8',
						type : "POST",
						success : function() {
							$("#pageNo").val(1);
							self.search();
							vueUI.toolTips("success", "删除成功");
						}
					});
				});
			}

		},
		search : function(page) {
			if(page!=null&&page!=''){
        		$("#pageNo").val(page);
        	}
			this.$refs.grid.query();
		},
		goEdit : function(v) {
			var nid = null;
			if (null != v)
				nid = v.id;
			else
				nid = this.$refs.organization.getSelected();
			var self = this;
			if (null != nid) {
				var self = this;
				var dt;
				var organization = $("#save-form");
				vueUI.ajaxCall({
					url : vueUI.conf.host + '/organization/' + nid,
					type : "get",
					data : '{"pageNo":1,"id":' + nid + '}',
					success : function(rsp) {
						dt = rsp.data;
						self.$data.organization = dt;
						self.$data.temp = $.extend(true, {}, dt);
					}
				});
				$("#organization-modal").toggleClass("in").show();
			}
		},
		save : function() {
			var self = this;
			this.$validate(true);
			if (self.$validation.valid) {
				vueUI.closeDialog('#portalDialog');
				var form = $("#save-form");
				var josn = JSON.stringify($('#save-form').serializeObject());
				console.log(josn);
				vueUI.ajaxCall({
					url : vueUI.conf.host + form.attr('action'),
					data : josn,
					type : "POST",
					success : function() {
						vueUI.toolTips("success", "保存成功");
						self.hideadd();
						var _parentId = $("input[name='parentId']").val();
						self.search();
						self.resetForm();
						$("input[name='parentId']").val(_parentId);
						self.$resetValidation();
					}
				});
			}
		},
		resetForm : function() {
			this.$data.organization =$.extend(true,{},this.$clone); 
		},
		getTreeOfOrg : function() {
			var self = this;
			var form = $("#treeOfOrg-form");
			var josn = JSON.stringify($('#treeOfOrg-form').serializeObject());
			vueUI.ajaxCall({
				url : vueUI.conf.host + "/organization/tree/",
				data : josn,
				type : "POST",
				success : function(rsp) {
					self.$data.treeOfOrg = rsp.data;
				}
			});
		},
		enable : function(v) {
			var ids = null;
			if (null != v)
				ids = v.id;
			if (null == ids)
				ids = this.$refs.grid.getSelectIds() + "0";
			var self = this;
			if (null != ids) {
				var _json = {};
				_json.ids = ids;
				_json.state = 1;
				vueUI.confirm('操作提示', '确定启用？', function() {
					vueUI.ajaxCall({
						url : vueUI.conf.host + "/organization/save/",
						data : JSON.stringify(_json),
						contentType : 'application/json;charset=utf-8',
						type : "POST",
						success : function() {
							self.search();
							vueUI.toolTips("success", "启用成功");
						}
					});
				});
			}
		},
		disable : function(v) {
			var ids = null;
			if (null != v)
				ids = v.id;
			if (null == ids)
				ids = this.$refs.grid.getSelectIds() + "0";
			var self = this;
			if (null != ids) {
				var _json = {};
				_json.ids = ids;
				_json.state = 0;
				vueUI.confirm('操作提示', '确定禁用？', function() {
					vueUI.ajaxCall({
						url : vueUI.conf.host + "/organization/save/",
						data : JSON.stringify(_json),
						contentType : 'application/json;charset=utf-8',
						type : "POST",
						success : function() {
							self.search();
							vueUI.toolTips("success", "禁用成功");
						}
					});
				});
			}
		},
		hideTree : function() {
			$("#organization-tree-modal").toggleClass("in").hide();
			$("#organization-modal").toggleClass("in").show();
		},
		showTree : function() {
			$("#organization-modal").toggleClass("in").hide();
			$("#organization-tree-modal").toggleClass("in").show();
			var _parentId = $('[name="parentId"]').val();
			
			$('#org-list').find('ul').removeClass('in');
			
			$('#org-list').find('li[data-node-id="' + _parentId + '"]').find('input[type="radio"]:eq(0)').trigger('click');
			$('#org-list').find('li[data-node-pid="' + _parentId + '"]').parents('ul').each(function(){
				$(this).addClass('in');
			});
			
		},
		setOrgIds:function(orgIds){
			var self = this;
			$('[name="orgIds"]').val(orgIds);
			self.search();
		}
	}
});