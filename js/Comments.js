var Comments = function (options) {
    this.opt = {};
    this.rows = [];
    this.init(options);
};

Comments.prototype.template = {
    "commentRow": function (data) {
        var timePassed = moment(data.createdTime).fromNow();
        var imgUrl = global.server + data.userImage;
        return "<div class='comment-row'> \
						<div class='c_head'><img src='" + imgUrl + "'/></div> \
						<div class='c_content'> \
							<div> \
								<span class='nickname'>" + data.userName + "</span> \
								<span class='time'>" + timePassed + "</span> \
							</div> \
							<div class='text'>" + data.commentContents + "</div> \
						</div> \
					<div class='clear'></div> \
				</div>";//更改了HTML
    },
    "commentForm": function () {
        return "<img src='' /><input type='text' class='cmt' id='cmt' />";
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
                _this.rows.push(row);
                _this.opt.content.append(row);
            });
        }
    });
};

Comments.prototype.makeForm = function () {
	var _this = this;
    this.opt.form.append(this.template.commentForm());
    
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
	console.log(data);
	
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
