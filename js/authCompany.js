if(global.isLogin()){
	var type = global.getUserType();
	if(type == 'Company'){
		location.href = 'home.html';
	}
};


global.scrollingLoader = {
	pageIndex: 0,
	pageSize: 12,
    identify: 0,
    keyWords:'',
    hasNext: true
};

$(function () {
    // load first page
	dataCardLoader();
	
    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() >= $('.company-data').offset().top + $('.company-data').height() ) { 

            if (global.scrollingLoader.identify >= $(window).scrollTop()-100 && global.scrollingLoader.identify <= $(window).scrollTop()+100 ) {

            } else {
            	if(global.scrollingLoader.hasNext){
            		global.scrollingLoader.identify = $(window).scrollTop();
                    global.scrollingLoader.pageIndex ++;
                    dataCardLoader();
            	}
            }
        }
    });
    
    $('#q').on('keydown', function (e) {
        if (e.keyCode == 13) {
        	do_company_search();
        }
    });
    
    $(".search-bar-button").click(function(){
    	do_company_search();
    });
    
    var do_company_search = function(){
    	$(".company-data").html("");
    	var keyword = $('#q').val();
    	global.scrollingLoader = {
			pageIndex: 0,
			pageSize: 12,
		    identify: 0,
		    keyWords:keyword,
		    hasNext: true
		};
    	dataCardLoader();
    }
    
});



var dataCardLoader = function(){
	this.container = $(".company-data");
	var _this = this;
	
	this.makeCompanyRows = function(datas){
		
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
				return false;
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
		
		var rows = datas.data.length;
        
        if(rows < global.scrollingLoader.pageSize){
        	global.scrollingLoader.hasNext = false;
        } 
        
    	var pageCount = Math.round(datas.status.totalCount / global.scrollingLoader.pageSize);
        var pageRecordStartAt = global.scrollingLoader.pageIndex * global.scrollingLoader.pageSize + 1;
        var pageRecordEndAt = (global.scrollingLoader.pageIndex+1) * global.scrollingLoader.pageSize;
        pageRecordEndAt = pageRecordEndAt > datas.status.totalCount ? datas.status.totalCount : pageRecordEndAt;
        console.log( "第["+(global.scrollingLoader.pageIndex+1)+"]页，共["+pageCount+"]页，第["+pageRecordStartAt+"]-["+pageRecordEndAt+"]条，共["+datas.status.totalCount+"]条" );
        $(datas.data).each(function(i, j) {
        	_this.container.append(row(j));
        });
		
	};
	
	var url = '/CompanyBaseInformation/GetCompanyBaseInformation';
	$.get(global.serviceUrl + url, global.scrollingLoader, function (msg) {
		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
			_this.makeCompanyRows(msg.d);
		}
    });
	
};