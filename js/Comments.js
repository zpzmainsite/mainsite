var Comments = function (options) {
    this.opt = {};
    this.rows = [];
    this.init(options);
};

Comments.prototype.template = {
    "commentRow": function (data) {
        var timePassed = moment(data.createdTime).fromNow();
        var imgUrl = global.server + data.userImage;
        var html = "<div class='comment-row'> \
			<div class='c_head'><img src='" + imgUrl + "'/></div> \
			<div class='c_content'> \
				<div> \
					<span class='nickname'>" + data.userName + "</span> \
					<span class='time'>- " + timePassed + "</span>";
        if(data.createdBy == global.getUserId()){
        	html += "<span class='btn' ref='" + data.id + "'></span>";
        }
		html += "</div> \
					<div class='text'>" + data.commentContents + "</div> \
				</div> \
				<div class='clear'></div> \
			</div>";
        
        
        return html;//更改了HTML
    },
    "commentForm": function (head) {
        return "<img src='"+head+"' /><input type='text' placeholder='添加评论或@好友评论 按回车发布' class='cmt' id='cmt' />";
    }
};


Comments.prototype.makeRows = function (data) {
    var _this = this;
    var url = global.serviceUrl + '/EntityComments/Get' + 
                '?entityType=' + this.opt.entityType + 
                '&entityId=' + this.opt.entityId;
    $.get(url, function (msg) {
        if (msg && msg.d && msg.d.status && msg.d.status.statusCode == 1300) {
            $(msg.d.data).each(function () {
                var rowHtml = _this.template.commentRow(this),
                    row = $(rowHtml);
                row.find(".btn").click(function(){
                	delCom($(this).attr("ref"), row);
                });
                _this.rows.push(row);
                _this.opt.content.append(row);
            });
        }
    });
    
    var delCom = function(id, target){
    	var url = '/EntityComments/Delete';
    	$.post(global.serviceUrl + url,{"id":id} , function (msg) {
            if (msg && msg.d && msg.d.status && msg.d.status.statusCode == 1300) {
            	target.remove();
            }
        });
    }
};

Comments.prototype.makeForm = function () {
	var _this = this;
	var user = global.getUser();
	_this.opt.form.append(_this.template.commentForm(user.imageLocation));
    
    this.opt.form.find("#cmt").keydown(function(e){
    	if(e.keyCode==13){
    		_this.commitData();
    	} 
    }); 
};
Comments.prototype.commitData = function () {
	var _this = this;
	
	var content = this.opt.form.find("#cmt").val();
	var url = '/EntityComments/Add';
	
	var data = {};
	data.EntityId = this.opt.entityId;
	data.entityType = this.opt.entityType;
	data.CommentContents = content;
	data.CreatedBy = global.getUserId();
	if(global.isLogin()){
		$.ajax({
			type : "post",
			url : global.serviceUrl + url,
			data : data,
			dataType : "json",
			success : function(msg) {
				console.log(msg);
				if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
		            alert("评论成功");
		            _this.refresh(_this.opt);
		        }
			}
		});
	} else {
		global.remindLogin();
	}
};

Comments.prototype.alive = function () {
    // TODO
};

Comments.prototype.refresh = function(options){
	this.opt.content.html("");
	this.makeRows(this.opt.data);
	this.opt.form.find("#cmt").val("");
};

Comments.prototype.init = function (options) {
	this.opt = $.extend(this.opt, options);
    this.opt.content.html("");//清空
    this.opt.form.html("");//清空
    this.makeRows(this.opt.data);
    this.makeForm();
    // TODO:
    // this.alive();
};
