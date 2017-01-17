var Vue = require('vue');

module.exports = Vue.extend({
    route: {
        activate: function (transition) {
            transition.next()
        }
    },
    template: __inline('./usertree.html'),
    el: function() {
        return "#usertree";
    },
    data:function(){
        return{
        	form:{
        		orgNames:'',
        		orgIds:''
        	},
            tree:[]
        }
    },
    ready:function(){
        var nurl=this.$route.path;
        $("span[data-url='"+nurl+"']").addClass("lanmuz");
        $("span[data-url='"+nurl+"']").parent("a").siblings("a").find("span").removeClass("lanmuz");
        var self=this;
        self.getTree();
      //树形菜单的点击事件
        $("#org-list").on('click', 'li.subNode-expand>a',
        function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).find('i.fa').toggleClass("fa-plus-square").toggleClass("fa-minus-square");
            //子节点的展开和隐藏
            var subUl = $(this).parent('li').find('ul.zeta-bgcolor05:eq(0)');
            var expandLi = $(this).parent('li').find('.subNode-expand');

            if ($(this).find('i.fa:eq(0)').hasClass('fa-minus-square')) {

                $(subUl).collapse('show');
 
            } else {
                $(this).parent('li').find('ul.zeta-bgcolor05').collapse('hide');

                expandLi.children('a').find('i.fa').addClass("fa-plus-square").removeClass("fa-minus-square");
            }
        });
        //绑定回车事件
        $("#org-list").on('keypress', '[name="organizationName"]',function(e){
            if(event.keyCode == "13"){
                loadTree();
                $('.org li.subNode-expand>a').trigger('click');
            }
        });
        
        //绑定单选框事件
        $("#org-list").on('click', '.org-checkbox',
        function(e) {
            e.preventDefault();
            e.stopPropagation();
            if(!$(this).parent('label').hasClass('disabled')){
                var currentLabel=$(this).parent('label');
                currentLabel.toggleClass('active');
            }
            var orgIds=[];
            var orgNames=[];
            $('#org-list li[data-node-type="0"] label.active').each(function(index,items){
            	orgIds.push($(items).closest('li').attr('data-node-id'));
                orgNames.push($(items).closest('li').attr('data-node-name'));
            });
            $('[name="orgIds"]').val(orgIds.toString());
            $('[name="orgNames"]').val(orgNames.toString());
            
            
            var userIds=[];
            var userNames=[];
            $('#org-list li[data-node-type="1"] label.active').each(function(index,items){
            	userIds.push($(items).closest('li').attr('data-node-id'));
            	userNames.push($(items).closest('li').attr('data-node-name'));
            });
            $('[name="userIds"]').val(userIds.toString());
            $('[name="userNames"]').val(userNames.toString());
            
            
            
            
            
        });
    },
    methods:{
		hideTree:function(){
            $("#organization-tree-modal").toggleClass("in").hide();
            $("#organization-modal").toggleClass("in").show();
        },
        showTree:function(){
        	$("#organization-modal").toggleClass("in").hide();
            $("#organization-tree-modal").toggleClass("in").show();
        },
        getTree:function(){
            var self=this;
            var form=$("#orgTree-form");
            var josn=JSON.stringify($('#orgTree-form').serializeObject());
            vueUI.ajaxCall({
                  url:vueUI.conf.host+"/userOrganization/tree/",
                  data:josn,
                  type:"POST",
                  success:function(rsp){
                      self.$data.tree=rsp.data;
                      console.log(self.$data.tree)
                  }
           });
        }
    }
});