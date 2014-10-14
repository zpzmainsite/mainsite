$(function () {
	
	dynamicLoader(dynamicLoader.scrollingLoader);
	
    console.log('user: ' + $.cookie('userID') + ' token: ' + ($.cookie('token') ? '(c)'+$.cookie('token') : '(o)'+global.test_token) );

});

var dynamicLoader = function (opt) {
	
	var makerendsRows = function (datas) {
		var makeComments = function(data, row){
			$rowHtml = $('<div class="trend_comments"/>');
			$(data).each(function (i, j) {
	        	var _row = makeCommentRow(j);
	        	if(_row != null){
	        		$rowHtml.append(_row);
	        	}
	        });
			row.append($rowHtml);
		};
		
		var makeCommentRow = function(data){
			var timePassed = moment(data.createdTime).fromNow();
	        var imgUrl = global.server + data.userImage;
			return "<div class='comment-row'> \
						<div class='left' style='width: 10%;'><img src='" + imgUrl + "'/></div> \
						<div class='right' style='width: 90%;'> \
							<div> \
								<span class='nickname'>" + data.userName + "</span> \
								<span class='time'>" + timePassed + "</span> \
							</div> \
							<div class='text'>" + data.commentContents + "</div> \
						</div> \
					<div class='clear'></div> \
				</div>";
		};
		
        var makeRow = function (data) {
        	var actives = data.actives;
        	var category = actives.category;
        	var _el = null;
        	if(category == 'Personal'){
        		_el = person_row(actives);
        	} else if(category == 'Product'){
        		_el = product_row(actives);
        	} else if(category == 'Project'){
        		_el = project_row(actives);
        	}
        	if(_el != null){
        		var comments = data.comments;
        		if(comments.length > 0){
        			makeComments(comments, _el);
        		}
        	}
        	return _el;
        };
        
        var person_row = function(actives){
        	var el = $('<div class="row panel-shadow"> \
    				<div class="trends friend-trends"> \
    					<div> \
    						<div class="left avatar"> \
    							<img id="avatar_img" src=""> \
    						</div> \
    						<div class="right content"> \
    							<div><span id="user_name"></span> <span id="create_time"></span></div> \
    							<div>个人动态</div> \
    							<div id="content"></div> \
    						</div> \
    						<div class="clear"></div> \
    					</div> \
    					<div> \
    						<img id="image" src="" /> \
    					</div> \
    					<div class="tools_bar"> \
    						<div>c</div> \
                    	</div> \
    				</div> \
    			</div>');
	        el.find('#avatar_img').attr("src", global.server + actives.avatarUrl);
	        el.find('#user_name').text(actives.userName);
	        el.find('#create_time').text(moment(actives.createdTime).fromNow());
	        el.find('#content').text(actives.content);
	        if(actives.imageLocation != undefined){
	        	el.find("#image").attr("src", global.server + actives.imageLocation);
	        } else {
	        	el.find("#image").remove();
	        }
	        el.attr("ref", actives.id);
	        return el;
        };
        
        var product_row = function(actives){
        	var el = $('<div class="row panel-shadow"> \
				<div class="trends product-trends"> \
					<div> \
						<div class="left p_avatar"> \
							<img id="avatar_img" src=""> \
						</div> \
						<div class="right content"> \
							<div> \
								<span id="title"></span> <span id="create_time"></span> \
							</div> \
							<div id="content"></div> \
						</div> \
						<div class="clear"></div> \
					</div> \
					<div class="tools_bar"> \
						<div>c</div> \
					</div> \
				</div> \
			</div>');
	        el.find('#avatar_img').attr("src", global.server + actives.avatarUrl);
	        el.find('#title').text(actives.title);
	        el.find('#create_time').text(moment(actives.createdTime).fromNow());
	        el.find('#content').text(actives.content);
	        el.attr("ref", actives.id);
	        return el;
        };
        
        var project_row = function(actives){
        	var el = $('<div class="row panel-shadow"> \
				<div class="trends project-trends"> \
					<div> \
						<div class="left avatar"> \
							<img id="avatar_img" src=""> \
						</div> \
						<div class="right content"> \
							<div> \
								<span id="title"></span> <span id="create_time"></span> \
							</div> \
							<div id="content"></div> \
						</div> \
						<div class="clear"></div> \
					</div> \
					<div class="tools_bar"> \
						<div>c</div> \
					</div> \
				</div> \
			</div>');
	        el.find('#avatar_img').attr("src", global.server + actives.avatarUrl);
	        el.find('#title').text(actives.title);
	        el.find('#create_time').text(moment(actives.createdTime).fromNow());
	        el.find('#content').text(actives.content);
	        el.attr("ref", actives.id);
	        return el;
        };
        
        // $('.content dl dd').remove();
        $(datas.data).each(function (i, j) {
        	var _row = makeRow(j);
        	if(_row != null){
        		$('.trends_row').append(_row);
        	}
        });
        //$('.endOfPage').show();
    };
    
    var url = '/ActiveCenter/Actives?UserId=' + opt.userId + '&pageIndex=' + opt.index + '&pageSize=' + opt.pageSize;
    
    console.log(global.serviceUrl + url);
    
    
	$.get(global.serviceUrl + url, function (msg) {
        if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
            makerendsRows(msg.d);
        }
    }).done(function (msg) {
    	
    });
};

dynamicLoader.scrollingLoader = {
    index: 0,
    pageSize: 12,
    identify: 0,
    userId: global.getUserId()
};
