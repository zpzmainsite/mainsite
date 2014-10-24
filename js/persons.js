var dataCardLoader = function(opt) {
	this.container = $(".data-panel");

	var makePersonCards = function(container, opt) {
		this.container = container;
		this.opt = opt;
		
		var _this = this;
		var card = function (data) {
            var el = $('<div class="person-card"> \
            				<div class="btn"><div class="off"></div></div> \
		            		<div class="person-head"> \
            					<img src="images/fakemap.png" /> \
			                </div> \
            				<p id="realName">&nbsp;</p> \
            				<p id="duties">&nbsp;</p> \
            				<p>&nbsp;</p> \
            				<p>&nbsp;</p> \
                        </div>');
            el.find('#realName').text(data.realName);
            el.find('#duties').text(data.duties);
            el.attr({'ref': data.userId});
            
            el.find('.btn').on('click', function () {
            	var userId = $(el).attr("ref");
            	var dest = $(this).find("div");
            	if(global.isLogin()){
            		if(dest.hasClass("on")){
                		var dfocus = {};
                    	dfocus.id = $(el).data("did");
                    	dfocus.focusId = $(el).attr("ref");
                    	dfocus.UserId = global.getUserId();
                    	var url = '/networking/DeleteFocus';
                    	$.post(global.serviceUrl + url, dfocus, function(msg){
                    		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
                    			dest.attr("class", "off");
                    		}
                    	});
                	} else {
                		var url = '/networking/addUserFocus';
                		var userType = global.getUser() != 'Company'?'Personal':'Company';
    					$.post(global.serviceUrl + url,{"userId" : global.getUserId(),
    													"focusId" : userId,
    													"FocusType" : "Personal",
    													"UserType" : userType},
    					function(msg) {
    						if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
    							dest.attr("class", "on");
    						}
    					});
                	}
            	}
                return false;
            });
            return el;
        };
        
        var initFocus = function(){
        	if(global.isLogin()){
        		var url = '/networking/findfocus?userId='+global.getUserId();
            	
            	console.log(global.serviceUrl + url);
            	
            	$.get(global.serviceUrl + url, function(msg) {
        			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
        				$(msg.d.data).each(function (i,j) {
        					if(j.focusType == 'Personal'){
        						var userId = j.focusId;
            					var dest = _this.container.find("div[ref='" + userId+ "']");
            					dest.find('.btn div').attr("class", "on");
            					dest.data("did",j.id);
        					}
        		        });
        			}
        		});
        	}
        	
        };
        
		var url = '/networking/search';
		
		console.log(global.serviceUrl + url);

		$.get(global.serviceUrl + url, this.opt, function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				$(msg.d.data).each(function (i,j) {
					_this.container.append(card(j));
		        });
			}
		}).done(function(msg){
			initFocus();
		});
	};

	this.container.html(""); // clear
		
	makePersonCards(this.container, opt);
};