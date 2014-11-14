var Seminars = function() {
	
	this.init = function() {
		
		var url ='/Projects/Seminars';

		console.log(global.serviceUrl + url);

		$.get(global.serviceUrl + url, function(msg) {
			makeRows(msg.d);
		});
	};
	
	var makeRows = function(datas){
		this.container = $('#all_seminars .row-content');
		
		var _this = this;
		
		var row = function (data) {
	        var el = $('<div class="seminars-card"> \
	        		<span class="seminarName"></span> \
	        		<span class="projectCounts"></span> \
	        		<span class="clear"></span> \
	        		</div>');
	        
	        el.find('.seminarName').text(data.seminarName);
	        el.find('.projectCounts').text(data.projectCounts);
	        
	        el.attr({'ref': data.id});
	        
	        el.on('click', function () {
	        	new SeminarsDetail($(this).attr('ref'));
	        });
	        return el;
	    };
		var init = null;
		$(datas.data).each(function (i, j) {
			if(i == 0){
				init = j;
			}
			_this.container.append(row(j));
        });
		if(init != null){
			new SeminarsDetail(init.id);
		}
	};
	
	this.init();
};

var SeminarsDetail = function(id){
	this.container = $(".seminars_detail");
	
	this.init = function(id){
		var _this = this;
		
		_this.container.html("");//clear
		
		var url = '/Projects/Seminars?SeminarId=' + id;
		
		$.get(global.serviceUrl + url, function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				if(msg.d.data.length > 0){
					var info = msg.d.data[0];
					_this.fillContent(info);
				}
			}
		}).done(function(msg){
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				allProject(id);
			}
		});
		
	};
	
	var allProject = function(id){
		this.container = $(".projects dl");
		var _this = this;
		
		_this.container.html("");//clear
		
		var url = '/Projects/SeminarProjects?SeminarId=' + id;
		
		$.get(global.serviceUrl + url, function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				$(msg.d.data).each(function(i, j) {
					_this.container.append(card(this));
				});
				_this.container.append("<div class='clear'></div>");
			}
		}).done(function(msg){
			initFocus();
		});
		
		var initFocus = function(){
			if(global.isLogin()){
				var url = '/Projects/FocusProjects?UserId=' + global.getUserId();
            	$.get(global.serviceUrl + url, function (msg) {
            		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
            			var parent = $(".projects");
            			$(msg.d.data).each(function (i, j) {
            				var tar = parent.find(".porject-card[ref='"+j.projectId+"']");
            				tar.find(".focus div").attr("class","on");
            	        });
            		}
                });
			}
		}
		
		var dataToDate = function (data) {
            if (!data) return "";
            var date = new Date(data);
            return date.getFullYear() + '-' + (date.getMonth()*1+1) + '-' + date.getDate();
        };
        
		var card = function (data) {
            var el = $('<dd class="porject-card"> \
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
                            <div class="focus"><div class="off"></div></div> \
                        </dd>');
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
                return false;
            });
            
            el.find('.focus div').on('click', function () {
            	if(global.isLogin()){
            		var dest = $(this);
                	if(dest.hasClass("on")){
                		cancelFocus(el, dest);
                	} else {
                		addFocus(el, dest);
                	}
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
        
        
	};
	
	this.init(id);
};
SeminarsDetail.prototype.fillContent = function(data){
	console.log(data);
	var _this = this;
	var img = global.server + data.seminarPictureLocation;
	var html = '<div style="padding: 10px 0px 0px 10px;"><div class="seminars_name">' + data.seminarName+ '</div><div class="seminars_projectCounts">' + data.projectCounts+ '个关联项目</div><div class="clear"></div></div> \
	  <div class="seminars_trip"> \
	  	<div class="seminars_image"><img src="' + img + '"/></div> \
	  	<div class="seminars_desc">' + data.seminarDescription + '</div> \
	  	<div class="clear"></div> \
	  </div> \
	  <div class="seminars_time">' + _this.dataToDate(data.createTime) + '</div>';
	
	_this.container.html(html);
};

SeminarsDetail.prototype.dataToDate = function (data) {
    if (!data) return "";
    var date = new Date(data);
    return date.getFullYear() + '-' + (date.getMonth()*1+1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
}
