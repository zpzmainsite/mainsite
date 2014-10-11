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
						<div class='left'><img src='" + imgUrl + "'/></div> \
						<div class='left'> \
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
    	msg = {"d":{"status":{"statusCode":1300},"data":[{"commentContents":"产品评论2！","entityType":"Product","entityId":"8891938d-0896-4d45-ae3a-934bf2ab063c","createdBy":"39123a9b-24a9-4ad8-a042-94ac4ca3106e","id":"b6b8c3c5-06be-4d73-bdc5-78cb4934e49e","createdTime":"2014-10-10T13:52:44.42","userName":null,"userImage":null},{"commentContents":"给个好评！","entityType":"Product","entityId":"8891938d-0896-4d45-ae3a-934bf2ab063c","createdBy":"39123a9b-24a9-4ad8-a042-94ac4ca3106e","id":"224ab060-5e3b-486d-99b6-147f1eb03750","createdTime":"2014-10-10T13:52:02.813","userName":null,"userImage":null},{"commentContents":"产品评论1！","entityType":"Product","entityId":"8891938d-0896-4d45-ae3a-934bf2ab063c","createdBy":"39123a9b-24a9-4ad8-a042-94ac4ca3106e","id":"bc6b96ad-707b-4809-a059-6ec59d78243f","createdTime":"2014-10-10T13:51:37.323","userName":null,"userImage":null}]}};
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
