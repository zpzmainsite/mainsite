var dataCardLoader = function(opt) {
	this.container = $(".data-panel");

	var makeProjectCards = function(container) {
		this.container = container;
		var _this = this;
		var dataToDate = function (data) {
            if (!data) return "";
            var date = new Date(data);
            return date.getFullYear() + '-' + (date.getMonth()*1+1) + '-' + date.getDate();
        };
		var card = function (data) {
            var el = $('<div class="project-card"> \
                            <div class="fakemap" id="map"> \
                                <img src="images/fakemap.png" /> \
                            </div> \
                            <p class="gray" id="projectName"></p> \
                            <p class="" id="projectProgress"> \
                                <img src="images/projectCardSection1.png" id="projectSection" /> \
                            </p> \
                            <p class="" id="mapicon"></p> \
                            <p class="blue" id="investment-title">投资额</p> \
                            <p class="gray" id="investment"></p> \
                            <p class="blue" id="areaOfStructure-title">建筑面积</p> \
                            <p class="gray" id="areaOfStructure"></p> \
                            <p class="gray" id="expectedStartTime"></p> \
                            <p class="orange" id="expectedFinishTime"></p> \
                            <div class="mappoint" id=""></div> \
                            <p class="blue" id="district"></p> \
                            <p class="gray" id="province_city"></p> \
            				<div class="btn"><div class="on"></div></div> \
                        </div>');
            el.find('#projectName').text(
                data.projectName ?
                ( data.projectName.length < 10 ? data.projectName : (data.projectName.substring(0, 9) + '...') ) : ''
            );
            el.find('#province_city').text(
                data.landAddress ?
                ( data.landAddress.length < 10 ? data.landAddress : (data.landAddress.substring(0, 9) + '...') ) : ''
            );
            el.find('#district').text(
                data.landProvince ?
                ( data.landProvince.length < 5 ? data.landProvince : (data.landProvince.substring(0, 4) + '...') ) + ' - ' : ''
            );

            el.find('#investment').text('￥' + (data.investment || "").toLocaleString());
            el.find('#areaOfStructure').text((data.landArea || "").toLocaleString() + '㎡');
            el.find('#expectedStartTime').text(dataToDate(data.expectedStartTime));
            el.find('#expectedFinishTime').text(dataToDate(data.expectedFinishTime));
            el.attr({'ref': data.id});
            el.on('click', function () {
                var surl = 'projectView.html?projectId=' + $(this).attr('ref');
                location.href = surl;
            });
            el.find('.btn').on('click', function () {
            	var dest = $(this).find("div");
            	if(dest.hasClass("on")){
            		cancelFocus(el, dest);
            	} else {
            		addFocus(el, dest);
            	}
                return false;
            });
            return el;
        };
        
        var cancelFocus = function(el, dest){
        	var url = '/Projects/DeleteFocusProjects';
        	var projectId = $(el).attr('ref');
    		$.post(global.serviceUrl + url, {"userId":global.getUserId(),"DeletedBy":global.getUserId(),"projectId":projectId}, function(msg){
        		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
        			dest.attr("class", "off");
        		}
        	});
        };
        
        var addFocus = function(el, dest){
        	var projectId = $(el).attr('ref');
        	var url = '/Projects/AddProjectFocus';
        	$.post(global.serviceUrl + url, {"UserId":global.getUserId(),"ProjectId":projectId}, function(msg){
        		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
        			dest.attr("class", "on");
        		}
        	});
        };
        
		var url = '/Projects/FocusProjectDetails?UserId=' + global.getUserId();

		console.log(global.serviceUrl + url);

		$.get(global.serviceUrl + url, function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				$(msg.d.data).each(function (i,j) {
					_this.container.append(card(j));
		        });
			}
		});
	};

	var makePersonCards = function(container) {
		this.container = container;
		var _this = this;
		
		var card = function (data) {
            var el = $('<div class="person-card"> \
		            		<div class="person-head"> \
            					<img src="" /> \
			                </div> \
            				<p id="realName">&nbsp;</p> \
            				<p id="duties">&nbsp;</p> \
            				<p>&nbsp;</p> \
            				<p>&nbsp;</p> \
            				<div class="btn"><div class="on"></div></div> \
                        </div>');
            el.find('.person-head img').attr('src', data.imageLocation);
            el.find('#realName').text(data.name);
            el.find('#duties').text(data.duties);
            el.attr({'ref': data.focusId});
            el.find(".btn").click(function(){
            	var dest = $(this).find("div");
            	if(dest.hasClass("on")){
            		cancelFocus(el, dest);
            	} else {
            		addFocus(el, dest);
            	}
                return false;
            	
            });
            el.click(function(){
            	var userId = $(el).attr("ref");
            	location.href = 'personcenter.html?userId='+userId;
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
    		focus.FocusType = 'Personal';
    		focus.UserType = userType;
			$.post(global.serviceUrl + url, focus, function(msg) {
				if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
        			dest.attr("class", "on");
				}
			});
        };
		
    	var url = '/networking/findfocus?userId='+global.getUserId();
    	
    	console.log(global.serviceUrl + url);
    	
    	$.get(global.serviceUrl + url, function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				$(msg.d.data).each(function (i,j) {
					if(j.focusType == "Personal"){
						_this.container.append(card(j));
					}
		        });
			}
		});
	};

	var makeCompanyCards = function(container) {
		this.container = container;
		var _this = this;
		
		var card = function (data) {
            var el = $('<div class="company-card"> \
		            		<div class="company-head"> \
            					<img src="" /> \
			                </div> \
            				<p id="realName">&nbsp;</p> \
            				<p id="duties">&nbsp;</p> \
            				<p>&nbsp;</p> \
            				<p>&nbsp;</p> \
            				<div class="btn"><div class="on"></div></div> \
                        </div>');
            el.find(".company-head img").attr("src", data.imageLocation);
            el.find('#realName').text(data.name);
            el.find('#duties').text(data.duties);
            el.attr({'ref': data.focusId});
            el.find(".btn").click(function(){
            	var dest = $(this).find("div");
            	if(dest.hasClass("on")){
            		cancelFocus(el, dest);
            	} else {
            		addFocus(el, dest);
            	}
                return false;
            	
            });
            el.click(function(){
            	var companyId = $(el).attr("ref");
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
		
		
    	var url = '/networking/findfocus?userId='+global.getUserId();
    	
    	console.log(global.serviceUrl + url);
    	
    	$.get(global.serviceUrl + url, function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				$(msg.d.data).each(function (i,j) {
					if(j.focusType == "Company"){
						_this.container.append(card(j));
					}
		        });
			}
		});
	};
	
	var makeProductCards = function(container) {
		this.container = container;
		var _this = this;
		
		var card = function (data) {
			var el = $('<div class="product-card"> \
                    <div class="image"> \
                        <img id="productImage" src="" /> \
                    </div> \
    				<p class="detail" id="productDescription"></p> \
                    <p class="comment"><span id="commentsCount"></span>条评论</p> \
                    <div class="commentFlag"></div> \
    				<div class="focus"><div class="off"></div></div> \
                </div>');
			el.find('#productDescription').text(
                data.content ? data.content : ''
            );
            if(data.isFocused){
            	el.find('.focus div').attr("class","on");
            };
            var imageLocation = global.server + data.imageLocation;
            el.find('#productImage').attr({'src': imageLocation});
            el.find('#commentsCount').text(data.productCommentsNumber ? data.productCommentsNumber: 0 );
            el.attr({'ref': data.id});
            el.find('.focus').on('click', function () {
            	var _btn = $(this).find("div");
            	if(_btn.hasClass("on")){
            		deleteFocus(el, _btn);
            	} else {
            		addFocus(el, _btn);
            	}
                return false;
            });
            el.click(function(){
            	return false;
            });
            return el;
        };
        
        var addFocus = function(el, btn){
        	var productId = el.attr("ref");
        	var url = '/ProductionUserFocus/AddProductionUserFocus';
        	var data = {
        		"productId" : productId,
        		"userId" : global.getUserId()
        	};
        	$.post(global.serviceUrl + url, data, function (msg) {
    			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
    				btn.attr("class","on");
    			}
			});
        };
        
        var deleteFocus = function(el, btn){
        	var productId = el.attr("ref");
        	var url = '/ProductionUserFocus/DeleteProductionUserFocus';
        	var data = {
        		"productId" : productId,
        		"userId" : global.getUserId()
        	};
        	$.post(global.serviceUrl + url, data, function (msg) {
    			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
    				btn.attr("class","off");
    			}
			});
        };
        
		var url = '/ProductInformation/ProductInformation';
		var data = {"pageIndex":0,"pageSize":12,"userId":global.getUserId()};
		$.get(global.serviceUrl + url, data, function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				$(msg.d.data).each(function (i,j) {
					_this.container.append(card(j));
		        });
			}
		}).done(function(msg){
			_this.container.append($('<div class="clear"/>'));
		});
	};

	this.container.html(""); // clear
	
	if(global.isLogin()){
		if (opt == 'project') {
			makeProjectCards(this.container);
		} else if (opt == 'person') {
			makePersonCards(this.container);
		} else if (opt == 'company') {
			makeCompanyCards(this.container);
		} else if (opt == 'product'){
			makeProductCards(this.container);
		}
	}
};

var initMyCompany = function(){
	this.container = $(".my-company");
	
	this.init = function(){
		var _this = this;
		if(global.isLogin()){
			var url = '/CompanyBaseInformation/GetMyCompany';
			$.get(global.serviceUrl + url,function(msg){
				if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
					if(msg.d.data.length > 0){
						var company = msg.d.data[0];
						_this.container.append(_this.showInfo(company));
						_this.container.append(_this.showBottom(company));
					} else {
						_this.container.append(_this.normal());
					}
				}
			});
		} else {
			_this.container.append(_this.normal());
		}
	};
	
	this.normal = function(){
		var el = '<table border="0"> \
					<tr> \
				<td><img src="http://www.ylrb.com/uploadfile/news/uploadfile/201107/20110713090025350.jpg"/></td> \
				<td><p>公司</p> \
				<p>您的公司还未被平台收录，或者您还未被公司认证为员工。</p> \
				<p><a href="authCompany.html">查找公司，获得认证</a></p> \
				</td> \
				</tr> \
			</table> \
			<div class="hr"></div>';
		return el;
	}
	
	
	this.showInfo = function(data){
		var el = $('<div class="company-info"> \
				<img class="field" src="" fieldId="companyLogo" valuetype="image"/> \
				<div class="company-desc field" fieldId="companyDescription" valuetype="string"></div> \
				<div class="company_t"> \
					<table> \
						<tr> \
							<td>公司总部</td> \
							<td>公司规模</td> \
							<td>公司类型</td> \
						</tr> \
						<tr> \
							<td class="field" fieldId="companyLocation" valuetype="string"></td> \
							<td class="field" fieldId="companyScale" valuetype="string"></td> \
							<td class="field" fieldId="companyType" valuetype="string"></td> \
						</tr> \
					</table> \
				</div> \
				<div class="clear"></div> \
			</div>');
		el.find(".field").each(function(i, j){
			var fieldId = $(j).attr("fieldId");
			var type = $(j).attr("valuetype");
			var value = data[fieldId];
			if(type == 'string'){
				$(j).text(value);
			} else if(type == 'image') {
				$(j).attr("src", value);
			}
		});
		return el;
	};
	
	this.showBottom = function(data){
		var el = $('<div class="company-bottom">已有<span class="field" fieldId="companyFocusNumber" valuetype="string"></span>人关注</div>');
		el.find(".field").each(function(i, j){
			var fieldId = $(j).attr("fieldId");
			var type = $(j).attr("valuetype");
			var value = data[fieldId];
			if(type == 'string'){
				$(j).text(value);
			} else if(type == 'image') {
				$(j).attr("src", value);
			}
		});
		return el;
	};
	
	this.init();
	
}