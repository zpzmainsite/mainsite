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
						<div class='left' style='width: 30%;'><img src='" + imgUrl + "'/></div> \
						<div class='right' style='width: 70%;'> \
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
        return "<img src='' /><input type='text' class='cmt' id='cmt'>";
    }
}


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
    this.opt.form.append(this.template.commentForm());
}

Comments.prototype.alive = function () {
    // TODO
}

Comments.prototype.init = function (options) {
    this.opt = $.extend(this.opt, options);
    this.opt.content.html("");//清空
    this.opt.form.html("");//清空
    this.makeRows(this.opt.data);
    this.makeForm();
    // TODO:
    // this.alive();
}
