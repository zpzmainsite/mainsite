var dataCardLoader = function(opt) {
	this.opt = opt;
	this.container = $(".data-panel");

	var makeFocusCards = function(container, id) {
		this.container = container;
		this.id = id;
		var _this = this;
		
		var card = function(d){
			 var el = $('<div class="company-card"> \
	 				<div class="btn"><div class="off"></div></div> \
	            		<div class="company-logo"> \
	 					<img src="images/fakemap.png" /> \
		                </div> \
	 				<p class="companyName"></p> \
	 				<p class="industry">&nbsp;</p> \
	 				<p class="focusNumber"></p> \
	             </div>');
			el.find(".company-logo img").attr("src", global.server + d.imageLocation);
			el.find(".companyName").text(d.name);
			el.find(".focusNumber").text(d.companyFocusNumber+"位关注者");
			el.attr("ref", d.focusId);
			el.find('.btn').on('click', function () {
	        	var dest = $(this).find("div");
	        	if(dest.hasClass("on")){
	        		cancelFocus(el, dest);
	        	} else {
	        		addFocus(el, dest);
	        	}
	            return false;
	        });
			el.click(function(){
				var companyId = $(this).attr("ref");
				location.href = 'myCompany.html?companyId='+companyId;
			});
			return el;
		};
		
		 var cancelFocus = function(el, dest){
        	var dfocus = {};
        	dfocus.focusId = $(el).attr("ref");
        	dfocus.UserId = global.getUserId();
        	var url = '/networking/DeleteFocus';
        	$.post(global.serviceUrl + url, dfocus, function(msg){
        		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
        			dest.attr("class", "off");
        		}
        	});
        };
	        
        var addFocus = function(el, dest){
        	var url = '/networking/addUserFocus';
    		var userType = global.getUser() != 'Company'?'Personal':'Company';
    		var userId = $(el).attr("ref");
    		var focus = {};
    		focus.userId = global.getUserId();
    		focus.focusId = userId;
    		focus.FocusType = 'Company';
    		focus.UserType = userType;
			$.post(global.serviceUrl + url, focus, function(msg) {
				if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
        			dest.attr("class", "on");
				}
			});
        };
		
		var initSelfFocus = function(){
			var url = '/networking/findfocus';
			var data = {"userId" : global.getUserId()};
	    	$.get(global.serviceUrl + url, data, function(msg) {
				if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
					$(msg.d.data).each(function (i,j) {
						if(j.focusType == 'Company'){
							$('.company-card[ref="'+j.focusId+'"]').find(".btn div").attr("class","on");
						}
			        });
				}
			});
		};
		
		var url = '/networking/findfocus';
		var data = {"userId" : _this.id};
    	$.get(global.serviceUrl + url, data, function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				$(msg.d.data).each(function (i,j) {
					if(j.focusType == 'Company'){
						_this.container.append(card(j));
					}
		        });
			}
		}).done(function(msg){
			initSelfFocus();
		});
	};

	var makeEmployeeCards = function(container, id) {
		this.container = container;
		this.id = id;
		var _this = this;
		
		var card = function (data) {
			var imgUrl = global.server + data.userIamge;
            var el = $('<div class="employee-card"> \
            				<div class="focus"><div class="off"></div></div> \
		            		<div class="person-head"> \
            					<img src="" /> \
			                </div> \
            				<p id="userName">&nbsp;</p> \
            				<p id="duties">&nbsp;</p> \
            				<p id="tip">&nbsp;</p> \
            				<p id="telephone">&nbsp;</p> \
                        </div>');
            el.find(".person-head img").attr("src",imgUrl);
            el.find("#userName").text(data.userName);
            el.find("#duties").text(data.duties);
            if(data.isFocused){
            	el.find(".focus div").attr("class","on");
            }
            el.attr("ref", data.userId);
            el.find(".focus div").click(function(){
            	if(global.isLogin()){
            		if($(this).hasClass("on")){
            			cancelFocus(el, this);
            		} else {
            			addFocus(el, this);
            		}
            	}
            	return false;
            });
            el.click(function(){
            	var userId = el.attr("ref");
            	location.href = 'personcenter.html?userId='+userId;
            	return false;
            });
            return el;
        };
        
        var cancelFocus = function(el,btn){
        	var _btn = $(btn);
    		var userId = el.attr("ref");
    		var data = {"focusId":userId,"userId":global.getUserId()};
        	var url = '/networking/DeleteFocus';
        	$.post(global.serviceUrl + url, data, function(msg){
        		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
        			_btn.attr("class","off");
        		}
        	});
        };
        
        var addFocus = function(el,btn){
        	var _btn = $(btn);
    		var userId = el.attr("ref");
    		var userType = global.getUser() != 'Company'?'Personal':'Company';
    		var data = {
    			  "userId": global.getUserId(),
    			  "focusId": userId,
    			  "focusType": "Personal",
    			  "userType": userType,
    		};
    		
    		var url = '/networking/addUserFocus';
    		
    		$.post(global.serviceUrl + url,data,function(msg) {
    			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
    				_btn.attr("class","on");
    			}
    		});
        };
        
        
        var url = '/CompanyBaseInformation/GetCompanyEmployees';
    	var data = {"CompanyId" : _this.id,"pagesize" : "12", "pageindex" : "0"};
    	console.log(global.serviceUrl + url);
    	$.get(global.serviceUrl + url, data, function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				$(msg.d.data).each(function (i,j) {
					_this.container.append(card(j));
		        });
			}
		});
	};
	
	var makeTrendCards = function(container, id) {
		this.container = container;
		this.id = id;
		var _this = this;
		
		var refreshReply = function(entityId, entityType, row){
			var url = '/EntityComments/Get';
			var data = {entityId:entityId,entityType:entityType};
			$.ajax({
				type : "get",
				url : global.serviceUrl + url,
				data : data,
				dataType : "json",
				async : false,
				success : function(msg) {
					if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
						row.html("");
						makeComments(msg.d.data, row);
						row.parent().find(".tools_bar .coments-count span").text("("+msg.d.data.length+")");
			        }
				}
			});
		};
		var makeComments = function(data, row){
			$(data).each(function (i, j) {
	        	var _row = makeCommentRow(j);
	        	if(_row != null){
	        		row.append(_row);
	        	}
	        });
		};
		var makeReply = function(data, row, comments){
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
						addComment(data, comments);
						$rowHtml.find("#q").val("");
					});
					return $rowHtml;
				}
				row.append(dom(data));
			}
		};
		var addComment = function(data, comments){
			if(global.isLogin()){
				var url = '/EntityComments/Add';
				$.ajax({
					type : "post",
					url : global.serviceUrl + url,
					data : data,
					dataType : "json",
					async : false,
					success : function(msg) {
						if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				            alert("评论成功");
				        }
					}
				});
				refreshReply(data.EntityId, data.entityType, comments);
			}
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
        	if(category == "Company"){
        		_el = company_row(actives);
        	}
        	if(_el != null){
        		var $rowHtml = $('<div class="trend_comments"/>');
        		
        		if(actives.commentsCount > 0){
        			if(actives.commentsCount > 3){
            			refreshReply(actives.id, actives.category, $rowHtml);
            		} else {
            			var comments = data.comments;
                		if(comments.length > 0){
                			makeComments(comments, $rowHtml);
                		}
            		}
        		}
        		
        		_el.append($rowHtml);
        		if(actives.eventType == 'Actives'){
        			makeReply(actives, _el, $rowHtml);
            	}
        	}
        	return _el;
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
		
		var url = '/ActiveCenter/CompanyActives';
		var data = {"CompanyId":this.id,"pagesize":"12","pageIndex":"0"};
		
		$.get(global.serviceUrl + url,data, function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				$.each(msg.d.data, function(i, j){
					var actives = j.actives;
					var _row = makeRow(j);
					if(_row != null){
						_this.container.append(_row);
		        	}
				});
			}
		});
	};

	this.container.html(""); // clear
	
	if(global.isLogin()){
		var tag = this.opt.tag;
		if (tag == 'employee') {
			makeEmployeeCards(this.container, this.opt.id);
		} else if (tag == 'focus') {
			makeFocusCards(this.container, this.opt.id);
		} else if (tag == 'trends') {
			makeTrendCards(this.container, this.opt.id);
		}
	}
};