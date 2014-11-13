var Organization = function(){
	this.container = $(".company-data");
	var _this = this;
		
	var row = function(d){
		 var el = $('<div class="company-card"> \
 				<div class="btn"><div></div></div> \
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
		el.attr("ref", d.id);
		
		if(d.focused){
			el.find(".btn div").addClass("on");
		} else {
			el.find(".btn div").addClass("off");
		}
		
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
	    			el.find('.btn div').attr("class", "on");
	    		}
	    	});
		}
	 };
	 
	 var cancelFocus = function(el){
		 if(global.isLogin()){
				var url = '/networking/DeleteFocus';
				var companyId = $(el).attr("ref");
				var data = {
					focusId : companyId,
					UserId : global.getUserId()
				};
				$.post(global.serviceUrl + url, data, function(msg){
	      		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
	      			el.find('.btn div').attr("class", "off");
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
    });
	
};

$(function(){
	new Organization();
});