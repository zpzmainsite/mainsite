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
            el.on('click', function () {
            	
                return false;
            });
            el.find('.btn').on('click', function () {
            	var userId = $(el).attr("ref");
            	var dest = $(this).find("div");
            	if(dest.hasClass("on")){
            		alert("already");
            	} else {
            		var url = '/networking/addUserFocus';
            		$.post(global.serviceUrl + url, {"userId":global.getUserId(),"focusId":userId}, function(msg){
                		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
                			dest.attr("class", "on");
                		}
                	});
            	}
                return false;
            });
            return el;
        };
        
        var initFocus = function(){
        	var url = '/networking/findfocus?userId='+global.getUserId();
        	
        	console.log(global.serviceUrl + url);
        	
        	$.get(global.serviceUrl + url, function(msg) {
    			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
    				$(msg.d.data).each(function (i,j) {
    					var userId = j.userId;
    					var dest = _this.container.find("div[ref='" + userId+ "']");
    					dest.find('.btn div').attr("class", "on");
    		        });
    			}
    		})
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