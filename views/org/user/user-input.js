var Vue = require('vue');
var VueValidator=require('vue-validator');
Vue.use(VueValidator);
require('/src/directives/tree.js');
module.exports = Vue.extend({
    route: {
        activate: function (transition) {
            transition.next()
        }
    },
    template: __inline('./user-input.html'),
    el: function() {
        return "#userinput";
    },
    data:function(){
        return{
        	roleselect:[],
            user:{
                state:"1",
                userThirdpartAccountList:[],
                password:'111111',
                compassword:'111111'
            },
            types:[{value:0,label:"²Ëµ¥"},{value:1,label:"°´Å¥"}],
            roles:[],
            medias:[],
            usertemp:{},
            treeOfUser:[],
            isInfo:'',
        }
    },
    ready:function(){
        var nurl=this.$route.path;
        $("span[data-url='"+nurl+"']").addClass("lanmuz");
        $("span[data-url='"+nurl+"']").parent("a").siblings("a").find("span").removeClass("lanmuz");
        var self=this;
        self.getRoles();
        self.getMedias();
        self.getTreeOfUser();
        var id=$("input[name='id']").val();
        if(id=='-1'){
            $("input[name='id']").val('');
            self.$data.usertemp=$.extend(true,{},self.$data.user);
        }else{
         self.get(id);
         if(self.$data.user&&self.$data.user.userThirdpartAccountList){
        	 var userThirdpartAccountList = self.$data.user.userThirdpartAccountList;
             if(userThirdpartAccountList!=null&&userThirdpartAccountList.length>0){
            	 for(var z=0;z<userThirdpartAccountList.length;z++){
             		self.addThirdpartAccount(userThirdpartAccountList[z]);
             	 }
             }
         }
         if(self.$data.user!=null&&self.$data.user.id>=1){
        	 self.$data.user.password = '111111';
             self.$data.user.compassword = '111111';
         }
         $('div.password').hide();
         $('div.identity').hide();
        }
        
       
        var _roleIdString = self.$data.user.roleIds;
        if(_roleIdString!=null&&_roleIdString!=''){
        	if(_roleIdString.indexOf(',')>-1){
        		var _roleIdArray = _roleIdString.split(",");
        		for(var r=0;r<_roleIdArray.length;r++){
        			self.$data.roleselect.push(parseInt(_roleIdArray[r]));
        		}
        	}else{
        		self.$data.roleselect.push(parseInt(_roleIdString));
        	}
        }
        
      //Ê÷ÐÎ²Ëµ¥µÄµã»÷ÊÂ¼þ
        $("#treeOfUser").on('click', 'li.subNode-expand>a',
        function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).find('i.fa').toggleClass("fa-plus-square").toggleClass("fa-minus-square");
            //×Ó½ÚµãµÄÕ¹¿ªºÍÒþ²Ø
            var subUl = $(this).parent('li').find('ul.zeta-bgcolor05:eq(0)');
            var expandLi = $(this).parent('li').find('.subNode-expand');

            if ($(this).find('i.fa:eq(0)').hasClass('fa-minus-square')) {

                $(subUl).collapse('show');
 
            } else {
                $(this).parent('li').find('ul.zeta-bgcolor05').collapse('hide');

                expandLi.children('a').find('i.fa').addClass("fa-plus-square").removeClass("fa-minus-square");
            }
        });
        //°ó¶¨ÊäÈëÊÂ¼þ
        $('#treeOfUser-form [name="orgName"]').bind('input',function(){
        	self.getTreeOfUser();
        	$('#treeOfUser .org li.subNode-expand>a').trigger('click');
        });
        
        //°ó¶¨µ¥Ñ¡¿òÊÂ¼þ
        $("#treeOfUser").on('click', '.org-checkbox',
        function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if(!$(this).parent('label').hasClass('disabled')){
                var currentLabel=$(this).parent('label');
                $(currentLabel).toggleClass("active");
            }
            
            var ids=[];
            var names=[];
            $('#treeOfUser li label.active').each(function(index,items){
                ids.push($(items).closest('li').attr('data-node-id'));
                names.push($(items).closest('li').attr('data-node-name'));
            });
            $('[name="orgIds"]').val(ids.toString());
            $('[name="orgNames"]').val(names.toString());
        });
    },
    methods:{
       get:function(id){
          var self=this;
          self.$data.isInfo = id;
          var dt;
          var form=$("#save-form")
          if(id!='-1'){
              vueUI.ajaxCall({
                url:vueUI.conf.host+'/user/'+id,
                async:false,
                type:"get",
                data:'{"pageNo":1,"id":'+id+'}',
                success:function (rsp){
                    dt=rsp.data;
                    self.$data.user=dt;
                    self.$data.usertemp=$.extend(true,{},dt);
                }
            })
          }
        },
        filterval:function(e){
            var val=$(e.currentTarget).val().replace(/\W/g,'');
            $(e.currentTarget).val(val);
        },
        toggleRadio:function(e){
            $(e.currentTarget).addClass("active");
            $(e.currentTarget).parent("label").siblings("label").removeClass("active");
        },
        save:function (){
            var self=this;
            this.$validate(true);
            if(self.$validation.valid){
                vueUI.closeDialog('#portalDialog');
                var form=$("#save-form");
                var userThirdpartAccountArray =new Array();
                var _index = 0;
                $('div.thirdpart_account_temp').each(function(){
                	_index++;
                	var _info = {};
                	var _inputId = $(this).find('input.inputId').val();
                	var _mediaId = $(this).find('select').val();
                	var _accountName = $(this).find('input.inputAccountName').val();
                	var _url = $(this).find('input.inputUrl').val();
                	var _siteName = $(this).find('input.inputSiteName').val();
                	
                	if(_mediaId!=null&&_accountName!=null&&_accountName!=''&&_url!=''&&_url!=null&&_siteName!=''&&_siteName!=null){
                		_info.id = _inputId;
                		_info.mediaId = _mediaId;
                		_info.accountName = _accountName;
                		_info.url = _url;
                		_info.siteName = _siteName;
                		userThirdpartAccountArray.push(_info);
                	}
                });
                var _formData = $('#save-form').serializeObject();
                _formData.userThirdpartAccountList = JSON.stringify(userThirdpartAccountArray);
                var json=JSON.stringify(_formData);
                vueUI.ajaxCall({
                    url:vueUI.conf.host+form.attr('action'),
                    async:false,
                    data:json,
                    type:"POST",
                    success:function (){
                        vueUI.toolTips("success","±£´æ³É¹¦");
                    }
                });
                routers.route.go({ path: '/org/user'});   
            }
        },
        getRoles:function(){
        	var self=this;
        	vueUI.ajaxCall({
                  url:vueUI.conf.host+"/role/queryList/",
                  async:false,
                  type:"post",
                  data:'{"params":"params"}',
                  success:function(rsp){
                	  if(rsp.data&&rsp.data.length>0){
                		  var _data = [];
                		  for(var r=0;r<rsp.data.length;r++){
                			  var _info = {};
                			  _info.value = rsp.data[r].id;
                			  _info.label = rsp.data[r].chineseName;
                			  _data.push(_info);
                		  }
                		  self.$data.roles = _data;
                	  }
                  }
           });
        },
        getMedias:function(){
        	var self=this;
        	vueUI.ajaxCall({
                  url:vueUI.conf.host+"/schSettingsMedia/get_all/",
                  async:false,
                  type:"GET",
                  success:function(rsp){
                	  self.$data.medias = rsp.data;
                  }
           });
        },
        addThirdpartAccount:function(data){
        	var self=this;
        	var _html = $('div.thirdpart_account_temp.temp_index').prop('outerHTML');
        	var _length = $('div.thirdpart_account_temp').length;
        	_html = _html.replace('temp_index','temp_'+_length);
        	
        	$('div.thirdpart_account_head').after(_html);
        	$('div.thirdpart_account_temp.temp_'+_length).removeAttr('style');
        	
        	$('div.thirdpart_account_temp.temp_'+_length).find('a').on('click',function(){
        		self.deleteThirdpartAccount(this);
    		});
        	
        	$('div.thirdpart_account_temp.temp_'+_length).find('input.inputUrl').on('blur',function(){
        		self.getSiteName(this);
    		});
        	
        	
        	
        	
        	var _medias = self.$data.medias;
        	if(_medias!=null&&_medias.length>0){
        		for(var m=0;m<_medias.length;m++){
        			var _option = '<option value="'+_medias[m].id+'"';
        			if(data!=null&&data.mediaId==_medias[m].id){
        				_option +=' selected="selected" ';
                	}
        			_option+='>'+_medias[m].name+'</option>';
        			$('div.thirdpart_account_temp.temp_'+_length).find('select').append(_option);
        		}
        		if(data!=null){
        			$('div.thirdpart_account_temp.temp_'+_length).find('input.inputId').val(data.id);
            		$('div.thirdpart_account_temp.temp_'+_length).find('input.inputAccountName').val(data.accountName);
            		$('div.thirdpart_account_temp.temp_'+_length).find('input.inputUrl').val(data.url);
            		$('div.thirdpart_account_temp.temp_'+_length).find('input.inputSiteName').val(data.siteName);
            	}
        	}
        	
        },
        deleteThirdpartAccount:function(e){
        	$(e).closest('div.thirdpart_account_temp').remove();
        	var _id = $(e).closest('div.thirdpart_account_temp').find('input.inputId').val();
        	if(_id!=null&&_id!=''){
        		var _json = {};
        		_json.id = _id;
        		_json.state = -1;
        		vueUI.ajaxCall({
                    url:vueUI.conf.host+"/userThirdpartAccount/save/",
                    async:false,
                    type:"POST",
                    data:JSON.stringify(_json),
                    success:function(rsp){
                  	  console.log(rsp);
                  	 console.log(rsp);
                    }
              });
        	}
        },
		hideTree:function(){
            $("#organization-tree-modal").toggleClass("in").hide();
            $("#organization-modal").toggleClass("in").show();
        },
        showTree:function(){
        	$("#organization-modal").toggleClass("in").hide();
            $("#organization-tree-modal").toggleClass("in").show();
            
            var _orgIds = $('[name="orgIds"]').val();
            if(_orgIds!=null&&_orgIds!=''){
            	
            	var orgIdArray = _orgIds.split(',');
            	if(orgIdArray!=null&&orgIdArray.length>0){
            		for(var o=0;o<orgIdArray.length;o++){
            			 $('#treeOfUser').find('li[data-node-id="'+orgIdArray[o]+'"]').find('label.form-checkbox:eq(0)').addClass('active');
            		}
            	}
            }
        },
        getTreeOfUser:function(){
            var self=this;
            var form=$("#treeOfUser-form");
            var josn=JSON.stringify($('#treeOfUser-form').serializeObject());
            vueUI.ajaxCall({
                  url:vueUI.conf.host+"/organization/tree/",
                  async:false,
                  data:josn,
                  type:"POST",
                  success:function(rsp){
                      self.$data.treeOfUser=rsp.data;
                  }
           });
        },
        getSiteName:function(e){
        	var _url = $(e).val();
        	if(_url==null||_url=='')return;
        	var _json = {};
        	_json.url = _url;
            vueUI.ajaxCall({
                url:vueUI.conf.host+"/schSettingsSiteRecord/queryNameByUrl/",
                async:false,
                data:JSON.stringify(_json),
                type:"POST",
                success:function(rsp){
                   if(rsp.data!=null){
                	   $(e).closest('div.thirdpart_account_temp').find('input.inputSiteName').val(rsp.data);
                   }
                }
         });
        },
        getOpenId:function(v){
       	 var slef = this;
       	 var _openName = $('[name="openName"]').val();
       	 var dataInfo = {'openName':_openName};
       	 vueUI.ajaxCall({
                url:vueUI.conf.host+"/user/getOpenId/",
                async:true,
                data:JSON.stringify(dataInfo),
                type:"POST",
                beforeSend:function(){
               	 $('#openIdBtn').button('loading');
                },
                success:function(rsp){
               	 var openId = rsp.data;
               	 if(openId!=null&&openId!=''){
               		 $('[name="openId"]').val(openId);
               		 vueUI.toolTips("success","ÑéÖ¤³É¹¦");
               		 $('#openIdBtn').button('reset');
               	 }else{
               		 vueUI.toolTips("warning","ÑéÖ¤Ê§°Ü");
               		 $('#openIdBtn').button('reset');
               	 }
                }
       	 });
       	 
       }
    }
});