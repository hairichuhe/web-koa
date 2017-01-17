var Vue = require('vue');
require('/src/components/widge/vueGrid/vueGrid.js');

module.exports = Vue
		.extend({
			route : {
				activate : function(transition) {
					transition.next()
				}
			},
			template : __inline('./userlist.html'),
			el : function() {
				return "#userlist";
			},
			data : function() {
				return {
					gridColumns : [ {
						name : 'fullname',
						displayName : '姓名',
						headerCls : 'text-left',
						dataCls : 'text-left',
						sortable : false
					}, {
						name : 'orgNames',
						displayName : '所属组织',
						headerCls : 'text-left',
						dataCls : 'text-left',
						render : 'renderOrgNames',
						sortable : false
					}, {
						name : 'roleNames',
						displayName : '角色',
						headerCls : 'text-left',
						dataCls : 'text-left',
						sortable : false
					}, {
						name : 'leaderProvince',
						displayName : '省级负责人',
						headerCls : 'text-center',
						dataCls : 'text-center',
						render : 'renderLeaderProvince',
						renderCls : 'showClassProvince',
						sortable : false
					}, {
						name : 'leaderArea',
						displayName : '片区负责人',
						headerCls : 'text-center',
						dataCls : 'text-center',
						render : 'renderLeaderArea',
						renderCls : 'showClassArea',
						sortable : false
					},

					{
						name : 'email',
						displayName : '邮箱',
						headerCls : 'text-left',
						dataCls : 'text-left',
						sortable : false
					}, {
						name : 'mobile',
						displayName : '手机',
						sortable : false
					}, ]
				}
			},
			ready : function() {
				var nurl = this.$route.path;
				$("span[data-url='" + nurl + "']").addClass("lanmuz");
				$("span[data-url='" + nurl + "']").parent("a").siblings("a")
						.find("span").removeClass("lanmuz");
				this.getCurrUser();
			},
			methods : {
				getCurrUser : function() {
					var self = this;
					vueUI.ajaxCall({
						url : vueUI.conf.host + "/user/get_curr_user/",
						contentType : 'application/json;charset=utf-8',
						type : "get",
						success : function(rsp) {
							if (rsp.data && rsp.data.orgIds != null)
								$('[name="orgIds"]').val(rsp.data.orgIds);
							self.search();
						}
					});
				},
				showClassArea : function(v) {
					var parentOrgId = $('[name="parentOrgId"]').val();
					if (parentOrgId == 145 || parentOrgId == 146
							|| parentOrgId == 147 || parentOrgId == 148
							|| parentOrgId == 149) {
						return 'text-center';
					} else {
						return 'zeta-showno';
					}
				},
				showClassProvince : function(v) {
					var parentOrgId = $('[name="parentOrgId"]').val();
					if (parentOrgId == 7) {
						return 'text-center';
					} else {
						return 'zeta-showno';
					}
				},
				renderOrgNames : function(v) {
					var _label = '';
					var _orgNames = v.orgNames;
					if (_orgNames != null && _orgNames != '') {
						var arr = _orgNames.split(",");
						for (var a = 0; a < arr.length; a++) {
							var b = arr[a];
							if (a < 2) {
								if(b!=null&&b!=''&&b.length>3){
		        					b = b.substring(0,3)+"..";
		        				}
		        				_label += '<div class="label label-success text-lg" title="'+arr[a]+'">'+b+'</div>';
							} else if (a == 2) {
								_label += '<div class="label label-success text-lg" title="'
										+ _orgNames + '">...</div>';
							}
						}
					}
					return _label;
				},
				renderLeaderArea : function(v) {
					if (v.orgId != null && v.orgId != '') {
						var _checked = "否";
						if (v.leaderArea == '1') {
							_checked = '是';
						}
						return _checked;
					}
					return '否';
				},
				renderLeaderProvince : function(v) {
					if (v.orgId != null && v.orgId != '') {
						var _checked = "否";
						if (v.leaderProvince == '1') {
							_checked = '是';
						}
						return _checked;
					}
					return '否';
				},
				renderRoleNames : function(v) {
					var _label = '';
					var _roleNames = v.roleNames;
					if (_roleNames != null && _roleNames != '') {
						var arr = _roleNames.split(",");
						for (var a = 0; a < arr.length; a++) {
							var b = arr[a];
							if (a < 2) {
								_label += '<div class="label label-success text-lg">'
										+ b + '</div>';
							} else if (a == 2) {
								_label += '<div class="label label-success text-lg" title="'
										+ _roleNames + '">...</div>';
							}
						}
					}
					return _label;
				},

				search : function(page) {
					$('#table-top').find('table.table-striped.zeta-table')
							.removeAttr('style');
					if (page != null && page != '') {
						$("#pageNo").val(page);
					}
					this.$refs.grid.query();
				},
				queryOfName : function(v) {
					$('[name="orgIds"]').val('');
				}
			}
		});