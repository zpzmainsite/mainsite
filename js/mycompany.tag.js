var dataCardLoader = function(opt) {
	this.opt = opt;
	this.container = $(".data-panel");

	var makeFocusCards = function(container, id) {
		this.container = container;
		this.id = id;
		var _this = this;
		
		var card = function(data){
			console.log(data);
			var imgUrl = global.server + data.iamgeLocation;
			var el = $('<div class="focus-company-card"> \
    					<img src="" /> \
						<span class="company_name">&nbsp;</span> \
	    				<span class="company_industry">&nbsp;</span> \
						<span class="btn_focus">已关注</span> \
	                </div>');
			el.find("img").attr("src", imgUrl);
			el.find(".company_name").text(data.name);
			el.find(".company_industry").text(data.industry);
			el.attr("ref",data.id);
			return el;
		};
		
		var url = '/networking/findfocus';
		var data = {"userId" : _this.id};
    	console.log(global.serviceUrl + url);
    	$.get(global.serviceUrl + url, data, function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				$(msg.d.data).each(function (i,j) {
					if(j.focusType == 'Company'){
						_this.container.append(card(j));
					}
		        });
			}
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
		
		var card = function (data) {
			this.actives = data.actives;
			this.comments = data.comments;
			
			var category = this.actives.category;
			var el = null;
			if(category == "Company"){
				el = $('<div class="trends-row"> \
						<div class="avatar"><img src="" /></div> \
						<div class="title"><span class="userName">中技控股</span><span class="createdTime">2014年10月30日</span><p>下一行描述</p></div> \
						<div class="clear"></div> \
						<div class="trends-content"></div> \
						<div class="images"><img src="" /></div> \
				</div>');
				el.find(".avatar img").attr("src", this.actives.avatarUrl);
				el.find(".userName").text(this.actives.userName);
				el.find(".createdTime").text(this.actives.createdTime);
				el.find(".trends-content").text(this.actives.content);
				if(this.actives.imageLocation != null){
					el.find(".images img").attr("src", this.actives.imageLocation);
				} else {
					el.find(".images").remove();
				}
			}
			
			var comment = function(data){
				var cr = $('<div class="comment-row"> \
						<div class="comment-avatar"><img src="" /></div> \
						<div class="comment-title"><span class="userName"></span><span class="createdTime"></span><p>老乡，快开门，有人来查水表了。</p></div> \
						<div class="clear"></div> \
						</div>');
				cr.find(".comment-avatar src").attr("src", data.userImage);
				cr.find(".userName").text(data.userName);
				cr.find(".createdTime").text(data.createdTime);
				cr.find("p").text(data.commentContents);
				return cr;
			};
			
			if(this.comments.length > 0){
				$.each(this.comments, function(i, j){
					el.append(comment(j));
				});
			}
			return el;
		};
		
		
		var url = '/ActiveCenter/CompanyActives';
		var data = {"CompanyId":this.id,"pagesize":"12","pageIndex":"0"};
		console.log(global.serviceUrl + url);
		
		$.get(global.serviceUrl + url,data, function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				$.each(msg.d.data, function(i, j){
					var _row = card(j);
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