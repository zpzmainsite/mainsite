if(global.isLogin()){
	var type = global.getUserType();
	if(type != 'Company'){
		location.href = 'home.html';
	}
}


var dataCardLoader = function(opt) {
	this.container = $(".data-panel");

	var makeBackgroundCards = function(container) {
		this.container = container;
		var _this = this;
		var card = function (data) {
			var imgUrl = global.server + data.companyLogo;
            var el = $('<div class="company-base-info"> \
					<div class="logo"><img src=""></div> \
					<div class="intro"></div> \
				</div>');
            el.find(".logo img").attr("src",imgUrl);
            el.find(".intro").text(data.companyDescription);
            return el;
        };
        
		var url = '/CompanyBaseInformation/GetCompanyBaseInformation?CompanyId=' + global.getUserId();

		console.log(global.serviceUrl + url);

		$.get(global.serviceUrl + url, function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				var company = msg.d.data[0];
				_this.container.append(card(company));
			}
		});
	};

	var makeEmployeeCards = function(container) {
		this.container = container;
		var _this = this;
		
		var card = function (data) {
			var imgUrl = global.server + data.userIamge;
            var el = $('<div class="employee-card"> \
            				<div class="btn"></div> \
		            		<div class="person-head"> \
            					<img src="images/fakemap.png" /> \
			                </div> \
            				<p id="userName">&nbsp;</p> \
            				<p id="duties">&nbsp;</p> \
            				<p id="tip">&nbsp;</p> \
            				<div class="process"><label></label></div> \
                        </div>');
            el.find(".person-head img").attr("src",imgUrl);
            el.find("#userName").text(data.userName);
            el.find("#duties").text(data.duties);
            if(data.reviewStatus != 'Success'){
            	el.find("label").text("通过验证").addClass("on");
            	el.find("#tip").text('用户希望通过公司认证');
            } else {
            	el.find("label").text("已通过验证").addClass("off");
            	el.find("#tip").text('用户已经通过公司认证');
            }
            el.attr("ref", data.userId);
            el.attr("aid", data.id);
            el.find("label").click(function(){
            	if(global.isLogin()){
            		agreeEmp(el,this);
            	}
            });
            el.find(".btn").click(function(){
            	if(global.isLogin()){
            		deleteEmp(el);
            	}
            });
            return el;
        };
        
        var agreeEmp = function(el,btn){
        	var _btn = $(btn);
        	if(_btn.hasClass("on")){
        		var id = el.attr("aid");
        		var url = '/CompanyBaseInformation/AgreeCompanyEmployees';
        		var data = {"id" : id};
        		$.post(global.serviceUrl + url, data, function (msg) {
        			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
        				_btn.removeClass("on").addClass("off").text("已通过验证");
        			}
    			});
        	}
        };
        
        var deleteEmp = function(el){
        	var id = el.attr("aid");
        	var url = '/CompanyBaseInformation/DeleteCompanyEmployees';
        	var data = {"id" : id};
    		$.post(global.serviceUrl + url, data, function (msg) {
    			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
    				el.remove();
    			}
			});
        };
        
        
    	var url = '/CompanyBaseInformation/GetCompanyEmployeeForWeb';
    	var data = {"CompanyId" : global.getUserId(),"pagesize" : "12", "pageindex" : "0"};
    	console.log(global.serviceUrl + url);
    	
    	$.get(global.serviceUrl + url, data, function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				$(msg.d.data).each(function (i,j) {
					_this.container.append(card(j));
		        });
			}
		});
	};

	var makeProjectCards = function(container) {
		this.container = container;
		var _this = this;
		var dataToDate = function (data) {
            if (!data) return "";
            var date = new Date(data);
            return date.getFullYear() + '-' + (date.getMonth()*1+1) + '-' + date.getDate();
        };
		var card = function (data) {
			var el = $('<div class="porject-card"> \
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
		    return el;
        };
		
    	var url = '/Projects/MyProjects?userId='+global.getUserId();
    	
    	console.log(global.serviceUrl + url);
    	
    	$.get(global.serviceUrl + url, function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				$(msg.d.data).each(function (i,j) {
					_this.container.append(card(j));
		        });
			}
		});
	};
	
	var makeTrendCards = function(container) {
		this.container = container;
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
		
		var makeRow = function (data) {
        	var actives = data.actives;
        	var _el = null;
        	if(actives.category == 'Company'){
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
//        		if(actives.eventType == 'Actives'){
//        			makeReply(actives, _el, $rowHtml);
//            	}
        	}
        	return _el;
        };
        
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
		}
        
        var makeComments = function(data, row){
			$(data).each(function (i, j) {
	        	var _row = makeCommentRow(j);
	        	if(_row != null){
	        		row.append(_row);
	        	}
	        });
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
		var data = {"CompanyId":global.getUserId(),"pagesize":"12","pageIndex":"0"};
		console.log(global.serviceUrl + url);
		
		$.get(global.serviceUrl + url,data, function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				$.each(msg.d.data, function(i, j){
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
		if (opt == 'background') {
			makeBackgroundCards(this.container);
		} else if (opt == 'employee') {
			makeEmployeeCards(this.container);
		} else if (opt == 'project') {
			makeProjectCards(this.container);
		} else if (opt == 'trends') {
			makeTrendCards(this.container);
		}
	}
};