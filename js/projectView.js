var Project = function (options) {
    this.opt = $.extend({}, options);
    this.content = $('.sections');
    this.top = $(".landstage_info");
    this.process = $(".progress");
    this.rightMap = false;

    this.init = function (options) {

        if (options && options.projectId) {
            console.log('init project data with id: ' + options.projectId);
            
            var url = "/Projects/projects?projectId=" + options.projectId;
            var _this = this;

            $.get(global.serviceUrl + url, function (msg) {
                if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
                    var data = msg.d.data;
                    _this.fillContentFromJsonData(data);
                }
            }).done(function (msg) {
            	
            });
        } else {
        	this.error();
            console.log('no projectId');
        }
    };
    this.init(options);
};
Project.prototype.error = function () {
	alert("no projectId");
};
Project.prototype.fillTopInfo = function (data){
	if (!data) return;
	this.data = data;
    var _this = this;
    this.top.find(".field").each(function () {
    	var valuetype = $(this).attr('valuetype');
        var fieldid = $(this).attr('fieldId');
        var fieldstage = $(this).attr('stage');
        var value = data[fieldstage][fieldid];
        if (value != undefined) {
            $el = $(this);
            _this.setValue($el, value, valuetype);
        }
    });
};
Project.prototype.fillTopContact = function (data) {
	if (!data) return;
	var _this = this;
    this.top.find(".contact-field").each(function () {
    	var category = $(this).attr('category');
    	if(data.contactCategory == category){
    		var valuetype = $(this).attr('valuetype');
        	var fieldid = $(this).attr('fieldId');
        	var value = data[fieldid];
        	if (value != undefined) {
        		$el = $(this);
            	_this.setValue($el, value, valuetype);
        	}
    	}
    });
};
Project.prototype.fillContentFromJsonData = function (data) {
    if (!data) return;

    this.data = data;
    var _this = this;
    this.content.find(".field").each(function () {

        // fill value to field one by one
        var valuetype = $(this).attr('valuetype');
        var fieldid = $(this).attr('fieldId');
        var fieldstage = $(this).attr('stage');
        var value = data[fieldstage][fieldid];

        if (value != undefined) {
            $el = $(this);
            _this.setValue($el, value, valuetype);
        }
    });
    //fill contact
    _this.fillContact(data);
    //fill top
    _this.fillTopInfo(data);
    //fill map
    _this.fillMap(data);
};
Project.prototype.fillMap = function (data) {
	var point = {};
	if (data.projectLandStage.longitude && data.projectLandStage.latitude) {
        point = {
            longitude: data.projectLandStage.longitude,
            latitude: data.projectLandStage.latitude,
            type: 'geo'
        };
    } else if(data.projectLandStage.landAddress){
    	point = {
            address: data.projectLandStage.landAddress,
            type: 'address'
        };
    }
	new mapapi(point, 'map');
	
};
Project.prototype.fillContact = function (data) {
	if (!data) return;
	var contacts = data.projectBaseContacts;
    var _this = this;
    this.content.find(".contact").each(function () {
    	var category = this.id;
    	var contact = null;
    	$.each(contacts,function(i,j){
    		if(j.contactCategory == category){
    			contact = j;
    			return false;
    		}
    	});
    	if(contact != null){
    		//fill top contact
    		_this.fillTopContact(contact);
    		$(this).find(".contact-field").each(function () {
    			var valuetype = $(this).attr('valuetype');
                var fieldid = $(this).attr('fieldId');
                var value = contact[fieldid];
                if (value != undefined) {
                    $el = $(this);
                    _this.setValue($el, value, valuetype);
                }
    		});
    	}
    });
};
Project.prototype.setValue = function ($el, value, valuetype) {
	var _this = this;
	switch (valuetype) {
    case 'string':
		if ($el[0].tagName == 'DIV' || $el[0].tagName == 'SPAN') {
			$el.text(value);
		} else {
			$el.val(value);
		}
        break;
    case 'number':
        $el.val(value);
        break;
    case 'bool':
    	value = (value) ? "是" : "否";
    	if ($el[0].tagName == 'DIV' || $el[0].tagName == 'SPAN') {
			$el.text(value);
		} else {
			$el.val(value);
		}
        break;
    case 'date':
        var conv = _this.stringToDate(value);
        if ($el[0].tagName == 'DIV' || $el[0].tagName == 'SPAN') {
			$el.text(conv.date);
		} else {
			$el.val(conv.date);
		}
        break;
     default : break;
	}
};

Project.prototype.stringToDate = function (string) {
    var v = string.split('T');
    return {
        'date': new Date(v[0]).Format('yyyy/MM/dd'),
        'time': v[1]
    };
};
Project.prototype.sectionBig = function (index) {
    if(index < 0 || index > 4) return;
    var _this = this;
    //_this.getSectionHeader(index);
    _this.getProterties(index);
    _this.getContact(index);
};
Project.prototype.getSectionHeader = function (index) {
    if(index < 0 || index > 4) return;
    var _this = this;
    if(index == 1){
    	if(!_this.rightMap){
    		var data = _this.data;
        	var point = {};
        	if (data.projectLandStage.longitude && data.projectLandStage.latitude) {
                point = {
                    longitude: data.projectLandStage.longitude,
                    latitude: data.projectLandStage.latitude,
                    type: 'geo'
                };
            } else if(data.projectLandStage.landAddress){
            	point = {
                    address: data.projectLandStage.landAddress,
                    type: 'address'
                };
            }
        	$(".header_info_right").html("<div id='info_right_map'></div>");
        	new mapapi(point, 'info_right_map');
        	_this.rightMap = true;
    	}
    } else {
    	var image_show = "<div class='left'><img src='http://192.168.222.95:801/Pictures/CompressImages/0868a0b9-2e35-4d7f-b450-cddab90b9ab3.png'/></div> \
    	   <div class='right'> \
    	   <img src='http://192.168.222.95:801/Pictures/CompressImages/0868a0b9-2e35-4d7f-b450-cddab90b9ab3.png'/> \
    	   <img src='http://192.168.222.95:801/Pictures/CompressImages/0868a0b9-2e35-4d7f-b450-cddab90b9ab3.png'/> \
    	   <img src='http://192.168.222.95:801/Pictures/CompressImages/0868a0b9-2e35-4d7f-b450-cddab90b9ab3.png'/> \
    	   </div><div class='clear'></div>";
    	$(".header_info_right").html(image_show);
    	_this.rightMap = false;
    }
};
Project.prototype.getProterties = function (index) {
    if(index < 0 || index > 4) return;
    var _this = this;
    var config = _properties_section[index];
    data = _this.data;
    $(".project_info > .info_properties").html("");
    $.each(config, function(i, j){
    	 var valuetype = j.valuetype;
         var fieldid = j.fieldId;
         var fieldstage = j.stage;
         var label = j.label;
         var value = data[fieldstage][fieldid];
         if (value != undefined) {
        	 switch (valuetype) {
             case 'string':
                 break;
             case 'number':
                 break;
             case 'bool':
             	value = (value) ? "是" : "否";
                 break;
             case 'date':
                 var conv = _this.stringToDate(value);
                 value = conv.date;
                 break;
              default : break;
         	}
         }
        value = _this.convertValue(value);
        var content = "<div class='info_row'><span>" + label + "</span><span>" + value + "</span></div>";
        $(".project_info > .info_properties").append(content);
    });
};

Project.prototype.getContact = function (index) {
    if(index < 0 || index > 4) return;
    var _this = this;
    var config = _contact_section[index];
    data = _this.data;
    $(".project_info > .info_contact").html("");
    var contactData = data.projectBaseContacts;
    $.each(config, function(i, j){
    	 var label = j.label;
    	 var category = j.category;
    	 $.each(contactData, function(i, j){
    		 if(j.contactCategory == category){
    			 var content = "<div class='contact_title'><span>" + label + "：" + _this.convertValue(j.contactCompany) + "</span> \
    			 		<span>" + label + "地址："+ _this.convertValue(j.contactCompanyAddress) +"</span> \
    			 		</div>";
    			 $(".project_info > .info_contact").append(content);
    			 return false;
    		 };
    	 });
    });
    $(".project_info > .info_contact").append("<div class='contact_title'>联系人</div>");
    $.each(config, function(i, j){
	   	 var category = j.category;
	   	 $.each(contactData, function(i, j){
	   		 if(j.contactCategory == category){
	   			 var content = "<div class='info_row font14'><div class='name border-bottom block'>姓名：" + _this.convertValue(j.contactName) + "</div><div class='cellphone border-bottom block'>电话：" + _this.convertValue(j.contactCellphone) + "</div><div class='duties block'>岗位：" + _this.convertValue(j.contactDuties) + "</div></div>";
	   			 $(".project_info > .info_contact").append(content);
	   			 return false;
	   		 };
	   	 });
    });
};
Project.prototype.convertValue = function (value) {
	if (value != undefined) {
		return value;
	} else {
		return "&nbsp;";
	}
};
$(function () {
	projectView = new Project({
		projectId: global.QueryString.projectId
	});
    console.log('user: ' + $.cookie('userID') + ' token: ' + ($.cookie('token') ? '(c)'+$.cookie('token') : '(o)'+global.test_token) );

});
var _contact_section = {
	"1" : [ {
		"category" : "auctionUnitContacts",
		"label" : "拍卖单位"
	} , {
		"category" : "ownerUnitContacts",
		"label" : "业主单位"
	} ],
	"2" : [ {
		"category" : "explorationUnitContacts",
		"label" : "地堪公司"
	} , {
		"category" : "designInstituteContacts",
		"label" : "设计院"
	} ],
	"3" : [ {
		"category" : "contractorUnitContacts",
		"label" : "施工总承包单位"
	} , {
		"category" : "pileFoundationUnitContacts",
		"label" : "桩基分包单位"
	} ],
	"4" : []
};


var _properties_section = {
	"1" : [ {
		"stage" : "projectLandStage",
		"fieldId" : "expectedStartTime",
		"valuetype" : "date",
		"label" : "预计开工时间"
	} , {
		"stage" : "projectLandStage",
		"fieldId" : "expectedFinishTime",
		"valuetype" : "date",
		"label" : "预计竣工时间"
	} , {
		"stage" : "projectLandStage",
		"fieldId" : "storeyHeight",
		"valuetype" : "number",
		"label" : "建筑层高"
	} , {
		"stage" : "projectLandStage",
		"fieldId" : "landArea",
		"valuetype" : "string",
		"label" : "土地面积"
	} , {
		"stage" : "projectLandStage",
		"fieldId" : "investment",
		"valuetype" : "number",
		"label" : "投资额"
	} , {
		"stage" : "projectLandStage",
		"fieldId" : "foreignInvestment",
		"valuetype" : "bool",
		"label" : "外资参与"
	} , {
		"stage" : "projectLandStage",
		"fieldId" : "landPlotRatio",
		"valuetype" : "number",
		"label" : "土地容积率"
	} , {
		"stage" : "projectLandStage",
		"fieldId" : "storeyArea",
		"valuetype" : "number",
		"label" : "建筑面积"
	} , {
		"stage" : "projectLandStage",
		"fieldId" : "ownerType",
		"valuetype" : "string",
		"label" : "业主类型"
	} , {
		"stage" : "projectLandStage",
		"fieldId" : "landUsages",
		"valuetype" : "string",
		"label" : "地块用途"
	}],
	"2" : [ {
		"stage" : "projectLandStage",
		"fieldId" : "expectedStartTime",
		"valuetype" : "date",
		"label" : "预计开工时间"
	} , {
		"stage" : "projectLandStage",
		"fieldId" : "expectedFinishTime",
		"valuetype" : "date",
		"label" : "预计竣工时间"
	} , {
		"stage" : "projectMainDesignStage",
		"fieldId" : "mainDesignStage",
		"valuetype" : "string",
		"label" : "主体设计阶段"
	} , {
		"stage" : "projectMainDesignStage",
		"fieldId" : "elevator",
		"valuetype" : "bool",
		"label" : "电梯"
	} , {
		"stage" : "projectMainDesignStage",
		"fieldId" : "airCondition",
		"valuetype" : "bool",
		"label" : "空调"
	} , {
		"stage" : "projectMainDesignStage",
		"fieldId" : "heating",
		"valuetype" : "bool",
		"label" : "供暖方式"
	} , {
		"stage" : "projectMainDesignStage",
		"fieldId" : "externalWallMeterial",
		"valuetype" : "bool",
		"label" : "外墙材料"
	} , {
		"stage" : "projectMainDesignStage",
		"fieldId" : "stealStructure",
		"valuetype" : "bool",
		"label" : "钢结构"
	} ],
	"3" : [ {
		"stage" : "projectMainConstructStage",
		"fieldId" : "actureStartTime",
		"valuetype" : "date",
		"label" : "实际开工时间"
	} , {
		"stage" : "projectMainConstructStage",
		"fieldId" : "fireControl",
		"valuetype" : "string",
		"label" : "消防"
	} , {
		"stage" : "projectMainConstructStage",
		"fieldId" : "green",
		"valuetype" : "string",
		"label" : "景观绿化"
	} ],
	"4" : [ {
		"stage" : "projectDecorateStage",
		"fieldId" : "electroWeakInstallation",
		"valuetype" : "string",
		"label" : "弱电安装"
	} , {
		"stage" : "projectDecorateStage",
		"fieldId" : "decorationSituation",
		"valuetype" : "string",
		"label" : "装修情况"
	} , {
		"stage" : "projectDecorateStage",
		"fieldId" : "decorationProcess",
		"valuetype" : "string",
		"label" : "装修进度"
	} ]
};


var mapapi = function (options, el) {

	this.search = function (map, address) {
		address = address.replace('undefined ', '').replace('undefined ', '');
	    console.log("BMap Search: " + address);

	    var myGeo = new BMap.Geocoder();
		// 将地址解析结果显示在地图上,并调整地图视野
		var _this = this;
		myGeo.getPoint(address, function(point){
		  if (point) {
		    map.centerAndZoom(point, 16);
		    map.addOverlay(new BMap.Marker(point));
		  } else {
			if (_this.geo) {
				_this.locate(map, _this.geo);
			} else {
				map.centerAndZoom(new BMap.Point(121.480486, 31.236193), 15);
			}
		  }
		}, $('#city').val());
	};
	this.locate = function (map, point) {
	    console.log("BMap Geo: " + point.longitude + ", " + point.latitude);
	    var pp = new BMap.Point(point.longitude, point.latitude);
        map.centerAndZoom(pp, 15);
        map.addOverlay(new BMap.Marker(pp));
	};
	this.initMap = function (map) {
		console.log("BMap init at shanghai");
        map.centerAndZoom(new BMap.Point(121.480486, 31.236193), 15);
	};

	this.init = function (options, el) {
		var _this = this;
		
		$("#" + el).on('click', function (event) {
			return false;
		});

		var map = new BMap.Map(el);            // 创建Map实例

		map.addControl(new BMap.NavigationControl({
			type: BMAP_NAVIGATION_CONTROL_ZOOM
		}));
		map.disableDragging();//禁止拖拽
		map.disableScrollWheelZoom();//禁用滚轮放大缩小
		map.disableDoubleClickZoom();//禁用双击放大。
		
		

//		map.addEventListener("tilesloaded", function() {
//			$('div.BMap_cpyCtrl').remove();
//		});

		if(options.type == 'address'){
			_this.search(map, options.address);
		} else if (options.type == 'geo'){
			_this.locate(map, options);
		} else {
			_this.initMap(map);
		}
		return map;
	};
	
	return this.init(options, el);
};



