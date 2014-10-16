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
            				<div class="btn"><div class="on"><p class="label">已关注</p></div></div> \
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
            		var url = '/Projects/DeleteFocusProjects';
            		var fId = $(el).data('fId');
            		$.post(global.serviceUrl + url, {"DeletedBy":global.getUserId(),"ID":fId}, function(msg){
                		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
                			dest.attr("class", "off");
                			dest.find(".label").text("关注");
                		}
                	});
            	} else {
            		var projectId = $(el).attr('ref');
                	var url = '/Projects/AddProjectFocus';
                	$.post(global.serviceUrl + url, {"UserId":global.getUserId(),"ProjectId":projectId}, function(msg){
                		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
                			$(el).data("fId",msg.data.id);
                			dest.attr("class", "on");
                			dest.find(".label").text("已关注");
                		}
                	});
            	}
            	
                return false;
            });
            return el;
        };
		
        var initFocus = function (){
        	var url = '/Projects/FocusProjects?UserId=' + global.getUserId();
        	$.get(global.serviceUrl + url, function (msg) {
        		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
        			$(msg.d.data).each(function (i, j) {
        				var dataId = j.id;
        				var projectId = j.projectId;
        	            var dest = _this.container.find("div[ref='" + projectId+ "']");
        	            dest.data("fId", dataId);
        	        });
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
		}).done(function(msg){
			initFocus();
		});
	};

	var makePersonCards = function(container) {
		this.container = container;
		var _this = this;
	};

	var makeCompanyCards = function(container) {
		this.container = container;
		var _this = this;
	};

	this.container.html(""); // clear

	if (opt == 'project') {
		makeProjectCards(this.container);
	} else if (opt == 'person') {
		makePersonCards(this.container);
	} else if (opt == 'company') {
		makeCompanyCards(this.container);
	}
};