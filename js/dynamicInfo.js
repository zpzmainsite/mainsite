var dynamicLoader = function (tag) {
	
	var makerendsRows = function (datas, opt) {
		
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
		
		var makeReply = function(data, row){
			if(global.isLogin()){
				var dom = function(data){
					var $rowHtml = $('<div class="reply_trends"> \
							<div class="reply_trends-input"> \
								<input type="text" value="" class="reply_trends-field" id="q" placeholder="输入内容回复"/> \
							</div> \
							<div class="reply_trends-button"> \
								<span>确定</span> \
							</div> \
						</div>');
					$rowHtml.attr("category",data.category);
					$rowHtml.find(".reply_trends-button").click(function(){
						var el = $(this).parent(".reply_trends").parent();
						var val = $rowHtml.find("#q").val();
						var category = $rowHtml.attr("category");
						var id = el.attr("ref");
						var data = {};
						data.EntityId = id;
						data.entityType = category;
						data.CommentContents = val;
						data.CreatedBy = global.getUserId();
						addComment(data);
					});
					return $rowHtml;
				}
				row.append(dom(data));
			}
		};
		
		var addComment = function(data){
			if(global.isLogin()){
				var url = '/EntityComments/Add';
				$.ajax({
					type : "post",
					url : global.serviceUrl + url,
					data : data,
					dataType : "json",
					success : function(msg) {
						if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				            alert("评论成功");
				        }
					}
				});
				refreshReply(data);
			}
		};
		
		var refreshReply = function(data){
			var url = global.serviceUrl + '/EntityComments/Get'
			$.get(url, data, function (msg) {
			    if (msg && msg.d && msg.d.status && msg.d.status.statusCode == 1300) {
			        console.log(msg);
			    }
			});
		}
		
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
        	} else if(category == 'Company'){
        		_el = company_row(actives);
        	}
        	if(_el != null){
        		var comments = data.comments;
        		if(comments.length > 0){
        			makeComments(comments, _el);
        		}
        		if(actives.eventType == 'Actives'){
        			makeReply(actives, _el);
            	}
        	}
        	return _el;
        };
        
        var toolsbar = function(actives){
        	var views = function(count){
    			return '<div class="views-count"><i class="icon"></i><span>('+count+')</span></div>';
    		};
    		var comment = function(count){
    			return '<div class="coments-count"><i class="icon"></i><span>('+count+')</span></div>';
    		};
    		var focus = function(count){
    			return '<div class="focus-count"><i class="icon"></i><span>('+count+')</span></div>';
    		};
    		
        	var el = "";
        	if(actives.eventType == 'Actives'){
//        		el += focus(actives.commentsCount);
        		el += comment(actives.commentsCount);
//        		el += views(actives.commentsCount);
    		} else {
    			
    		}
    		return el;
        };
        
        
        
        var person_row = function(actives){
        	if(actives.eventType == 'Actives'){
        		var el = $('<div class="row panel-shadow row-friend"> \
        				<div class="trends friend-trends"> \
        					<div> \
        						<div class="left f_avatar"> \
        							<img id="avatar_img" src=""> \
        						</div> \
        						<div class="right content"> \
        							<div><span id="user_name"></span> <span id="create_time"></span></div> \
        							<div>个人动态</div> \
        							<div id="content"></div> \
        						</div> \
        						<div class="clear"></div> \
        					</div> \
    	        			<div class="tools_bar"> \
    		            	</div> \
        					<div class="image"> \
        						<img id="image" src="" /> \
        					</div> \
        				</div> \
        			</div>');
    	        el.find('#avatar_img').attr("src", global.server + actives.avatarUrl).click(function(){
    	        	var uId = el.attr("uId");
    	        	location.href = 'personcenter.html?userId='+uId;
    	        	return false;
    	        });
    	        el.find(".tools_bar").html(toolsbar(actives));
    	        el.find('#user_name').text(actives.userName);
    	        el.find('#create_time').text(moment(actives.createdTime).fromNow());
    	        el.find('#content').text(actives.content);
    	        if(actives.imageLocation != undefined){
    	        	el.find("#image").attr("src", global.server + actives.imageLocation);
    	        } else {
    	        	el.find("#image").remove();
    	        }
    	        el.attr("ref", actives.id);
    	        el.attr("uId", actives.createdBy);
    	        return el;
        	} else {
        		var el = $('<div class="row panel-shadow row-friend"> \
        				<div class="trends friend-trends"> \
        					<div> \
        						<div class="left f_avatar"> \
        							<img id="avatar_img" src=""> \
        						</div> \
        						<div class="right content"> \
        							<div><span id="user_name"></span> <span id="create_time"></span></div> \
        							<div id="content"></div> \
        						</div> \
        						<div class="clear"></div> \
        					</div> \
    	        			<div class="tools_bar"> \
    		            	</div> \
        				</div> \
        			</div>');
    	        el.find('#avatar_img').attr("src", global.server + actives.avatarUrl).click(function(){
    	        	var uId = el.attr("uId");
    	        	location.href = 'personcenter.html?userId='+uId;
    	        	return false;
    	        });
    	        el.find(".tools_bar").html(toolsbar(actives));
    	        el.find('#user_name').text(actives.title);
    	        el.find('#create_time').text(moment(actives.createdTime).fromNow());
    	        el.find('#content').text(actives.content);
    	        el.attr("ref", actives.id);
    	        el.attr("uId", actives.createdBy);
    	        return el;
        	}
        };
        
        var product_row = function(actives){
        	var el = $('<div class="row panel-shadow row-product"> \
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
					</div> \
				</div> \
			</div>');
        	el.find(".tools_bar").html(toolsbar(actives));
	        el.find('#avatar_img').attr("src", global.server + actives.avatarUrl);
	        el.find('#title').text(actives.title);
	        el.find('#create_time').text(moment(actives.createdTime).fromNow());
	        el.find('#content').text(actives.content);
	        el.attr("ref", actives.id);
	        return el;
        };
        
        var project_row = function(actives){
        	var el = $('<div class="row panel-shadow row-project"> \
				<div class="trends project-trends"> \
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
					</div> \
				</div> \
			</div>');
	        el.find('#avatar_img').attr("src", global.server + actives.avatarUrl);
	        el.find('#title').text(actives.title);
	        el.find('#create_time').text(moment(actives.createdTime).fromNow());
	        el.find('#content').text(actives.content);
	        el.attr("ref", actives.id);
	        el.find(".tools_bar").html(toolsbar(actives));
	        return el;
        };
        
        var company_row = function(actives){
        	var el = $('<div class="row panel-shadow row-company"> \
    				<div class="trends company-trends"> \
    					<div> \
    						<div class="left f_avatar"> \
    							<img id="avatar_img" src=""> \
    						</div> \
    						<div class="right content"> \
    							<div><span id="user_name"></span> <span id="create_time"></span></div> \
    							<div>公司动态</div> \
    							<div id="content"></div> \
    						</div> \
    						<div class="clear"></div> \
    					</div> \
    					<div class="tools_bar"> \
                    	</div> \
	        			<div class="image"> \
							<img id="image" src="" /> \
						</div> \
    				</div> \
    			</div>');
	        el.find('#avatar_img').attr("src", global.server + actives.avatarUrl).click(function(){
	        	var cId = el.attr("cId");
	        	location.href = 'myCompany.html?companyId='+cId;
	        	return false;
	        });
	        el.find(".tools_bar").html(toolsbar(actives));
	        el.find('#user_name').text(actives.userName);
	        el.find('#create_time').text(moment(actives.createdTime).fromNow());
	        el.find('#content').text(actives.content);
	        if(actives.imageLocation != undefined){
	        	el.find("#image").attr("src", global.server + actives.imageLocation);
	        } else {
	        	el.find("#image").remove();
	        }
	        el.attr("ref", actives.id);
	        el.attr("cId", actives.createdBy);
	        return el;
        };
        
        var tag = opt.tag;
        $(datas.data).each(function (i, j) {
			var _row = makeRow(j);
        	if(_row != null){
        		$('.trends_row').append(_row);
        	}
        });
        
        // $('.content dl dd').remove();
        
        //$('.endOfPage').show();
    };
    var tag = {
		"tag" : tag
	};
    
	var opt = $.extend({}, dynamicLoader.scrollingLoader, tag);
    if(global.isLogin()){
    	var url = '/ActiveCenter/Actives';
    	
    	var data = {"pageIndex":opt.index,"pageSize":opt.pageSize};
    	
    	if($.cookie("mytrends")){
    		$.removeCookie("mytrends");
    		url = '/ActiveCenter/MyActives';
    		data.UserId = opt.userId;
    	}
        
        if(opt.tag != 'all'){
        	data.UserId = opt.userId;
        	data.category = opt.tag;
        }
        
        console.log(global.serviceUrl + url);
        
        $('.trends_row').html("");
        
    	$.get(global.serviceUrl + url, data, function (msg) {
            if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
                makerendsRows(msg.d, opt);
            }
        }).done(function (msg) {
        	
        });
    } else {
    	if(opt.tag == 'all'){
    		var url = '/ActiveCenter/Actives';
        	
            var data = {"pageIndex":opt.index,"pageSize":opt.pageSize};
            
            console.log(global.serviceUrl + url);
            
            $('.trends_row').html("");
            
        	$.get(global.serviceUrl + url, data, function (msg) {
                if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
                    makerendsRows(msg.d, opt);
                }
            }).done(function (msg) {
            	
            });
    	}
    }
};

dynamicLoader.scrollingLoader = {
    index: 0,
    pageSize: 12,
    identify: 0,
    userId: global.getUserId()
};
