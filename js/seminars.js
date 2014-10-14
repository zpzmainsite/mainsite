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
	        var el = $('<div class="seminars-card"><p id="seminarName"></p></div>');
	        
	        el.find('#seminarName').text(data.seminarName);
	        
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
				var info = msg.d.data[0];
				_this.fillContent(info);
			}
		});
		allProject(id);
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
		});
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
                            <div class="focus"></div> \
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
            });
            el.find('.focus').on('click', function () {
                console.log('focus focus');
            })
            return el;
        };
	};
	
	this.init(id);
};
SeminarsDetail.prototype.fillContent = function(data){
	var _this = this;
	var img = global.server + data.seminarPictureLocation;
	var html = '<div class="seminars_name">' + data.seminarName+ '</div> \
	  <div class="seminars_trip"> \
	  	<div class="seminars_image"><img src="' + img + '"/></div> \
	  	<div class="seminars_desc">' + data.seminarDescription + '</div> \
	  	<div class="clear"></div> \
	  </div> \
	  <div class="seminars_time">' + _this.dataToDate(data.publishTime) + '</div>';
	
	_this.container.html(html);
};

SeminarsDetail.prototype.dataToDate = function (data) {
    if (!data) return "";
    var date = new Date(data);
    return date.getFullYear() + '-' + (date.getMonth()*1+1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
}
