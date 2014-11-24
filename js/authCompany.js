var AuthCompany = function(opt){
	this.opt = opt;
	var _this = this;
	
	this.makeCompanyRows = function(data){
		this.container = $(".company-data");
		
		var row = function(d){
			 var el = $('<div class="company-card"> \
					 <div class="btn"><div></div></div> \
	            		<div class="company-logo"> \
     						<img src="images/fakemap.png" /> \
		                </div> \
     				<p class="companyName"></p> \
     				<p class="industry">&nbsp;</p> \
     				<p class="apply">申请员工认证</p> \
                 </div>');
			el.find(".company-logo img").attr("src", global.server + d.companyLogo);
			el.find(".companyName").text(d.companyName);
			el.attr("ref", d.id);
			if(d.focused){
				el.find(".btn div").addClass("on");
			} else {
				el.find(".btn div").addClass("off");
			}
			
			
			el.find(".btn").click(function(){
				var dest = $(this).find("div");
	        	if(dest.hasClass("on")){
	        		cancelFocus(el);
	        	} else {
	        		addFocus(el);
	        	}
	        	return false;
			});
			el.click(function(){
				var companyId = $(el).attr("ref");
	        	location.href = 'myCompany.html?companyId='+companyId;
				return false;
			});
			
			if(d.reviewStatus == null){
				el.find(".apply").addClass("on");
			}
			el.find(".apply").click(function(){
				if($(this).hasClass("on")){
					applyEmp(el);
				} else {
					alert("您已申请过该公司的认证申请");
				}
			});
			return el;
		};
		
		var applyEmp = function(el){
			if(global.isLogin()){
				var companyId = $(el).attr("ref");
				var userId = global.getUserId();
				var url = '/CompanyBaseInformation/AddCompanyEmployees';
				var data = {"companyId":companyId,"employeeId":userId};
				$.post(global.serviceUrl + url, data, function (msg) {
					if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
						el.find(".apply").removeClass("on").addClass("off");
					}
			    });
			} else {
				global.remindLogin();
			}
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
			} else {
				global.remindLogin();
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
			} else {
				global.remindLogin();
			}
		 };
		
		var _this = this;
		this.container.html("");
		$.each(data, function(i, j){
			_this.container.append(row(j));
		});
		
	};
	
	var url = '/CompanyBaseInformation/GetCompanyBaseInformation';
	$.get(global.serviceUrl + url, opt, function (msg) {
		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
			var data = msg.d.data
			_this.makeCompanyRows(data);
		}
    });
};