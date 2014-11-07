var Organization = function(){
	this.container = $(".company-data");
	var _this = this;
		
	var row = function(d){
		 var el = $('<div class="company-card"> \
 				<div class="btn"><div class="off"></div></div> \
            		<div class="company-logo"> \
 					<img src="images/fakemap.png" /> \
	                </div> \
 				<p class="companyName"></p> \
 				<p class="industry">&nbsp;</p> \
 				<p class="focusNumber"></p> \
             </div>');
		el.find(".company-logo img").attr("src", global.server + d.companyLogo);
		el.find(".companyName").text(d.companyName);
		el.find(".industry").text(d.industry);
		el.find(".focusNumber").text(d.companyFocusNumber+"位关注者");
		el.attr("ref", d.focusId);
		el.find('.btn').on('click', function () {
        	var dest = $(this).find("div");
        	if(dest.hasClass("on")){
        		cancelFocus(el);
        	} else {
        		addFocus(el);
        	}
            return false;
        });
		return el;
	};
	
	var addFocus = function(el){
		if(global.isLogin()){
			var companyId = $(el).attr("ref");
			var url = '/networking/addUserFocus';
			var userType = global.getUser() != 'Company'?'Personal':'Company';
			var data = {"userId" : global.getUserId(), "focusId" : companyId, "FocusType" : "Company", "UserType" : userType};
			$.post(global.serviceUrl + url, data, function(msg){
	    		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
	    			var did = msg.d.data.id;
	    			$(el).data("did", did);
	    			el.find('.btn div').attr("class", "on");
	    		}
	    	});
		}
	 };
	 
	 var cancelFocus = function(el){
		 if(global.isLogin()){
			 var data = {};
				data.id = $(el).data("did");
				data.focusId = $(el).attr("ref");
				data.UserId = global.getUserId();
				var url = '/networking/DeleteFocus';
				$.post(global.serviceUrl + url, data, function(msg){
	      		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
	      			el.find('.btn div').attr("class", "off");
	      		}
	      	});
		 }
	 };
		
	var initFocus = function(){
		if(global.isLogin()){
			var url = '/networking/findfocus?userId='+global.getUserId();
	    	$.get(global.serviceUrl + url, function(msg) {
				if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
					$(msg.d.data).each(function (i,j) {
						if(j.focusType == "Company"){
							var companyId = j.focusId;
	    					var dest = _this.container.find("div[ref='" + companyId+ "']");
	    					dest.find('.btn div').attr("class", "on");
	    					dest.data("did",j.id);
						}
			        });
				}
			});
		}
    };
    
	_this.container.html("");
	var url = '/CompanyBaseInformation/GetCompanyBaseInformation';
	$.get(global.serviceUrl + url, function (msg) {
		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
			var data = msg.d.data
			$.each(data, function(i, j){
				_this.container.append(row(j));
			});
		}
    }).done(function(){
    	initFocus();
    });
	
};

$(function(){
	new Organization();
});