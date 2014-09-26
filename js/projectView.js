var Project = function (options) {
    this.opt = $.extend({}, options);
    this.content = $('.sections');
    this.top = $(".landstage_info");
    this.process = $(".progress");

    this.init = function (options) {

        if (options && options.projectId) {
            console.log('init project data with id: ' + options.projectId);
            
            var url = "/Projects/projects?projectId=" + options.projectId;
            var _this = this;

            $.get(global.serviceUrl + url, function (msg) {
                if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
                    var data = msg.d.data;
                    console.log(data);
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
    _this.getSectionHeader(index);
    _this.getProterties(index);
    _this.getContact(index);
};
Project.prototype.getSectionHeader = function (index) {
    if(index < 0 || index > 4) return;
    if(index == 1){
    	$(".project_info > .info_header").html($(".section-big-page1").html());
    } else {
    	$(".project_info > .info_header").html($(".section-big-page2").html());
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
        var content = "<div class=\"info_row\"><span class=\"left\">" + label + "</span><span class=\"right\">" + value + "</span><div class=\"clear\"></div></div>";
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
    	 var content = "<div class=\"contact_title\">" + label + "</div>";
    	 $.each(contactData, function(i, j){
    		 if(j.contactCategory == category){
    			 content += "<div class=\"info_row font14\"><div><span class=\"left\">" + _this.convertValue(j.contactName) + "</span><span class=\"right\">" + _this.convertValue(j.contactDuties) + "</span><div class=\"clear\"></div></div><div>" + _this.convertValue(j.contactCellphone) + "</div><div>" + _this.convertValue(j.contactCompany) + "</div><div class=\"address\">" + _this.convertValue(j.contactCompanyAddress) + "</div></div>";
    		 }
    	 });
    	 $(".project_info > .info_contact").append(content);
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
		"label" : "拍卖单位联系人"
	} , {
		"category" : "ownerUnitContacts",
		"label" : "业主单位联系人"
	} ],
	"2" : [ {
		"category" : "explorationUnitContacts",
		"label" : "地堪公司联系人"
	} , {
		"category" : "designInstituteContacts",
		"label" : "设计单位联系人"
	} ],
	"3" : [ {
		"category" : "contractorUnitContacts",
		"label" : "施工总承包"
	} , {
		"category" : "pileFoundationUnitContacts",
		"label" : "桩基分包"
	} ],
	"4" : []
};


var _properties_section = {
	"1" : [ {
		"stage" : "projectLandStage",
		"fieldId" : "landArea",
		"valuetype" : "string",
		"label" : "土地面积"
	} , {
		"stage" : "projectLandStage",
		"fieldId" : "landPlotRatio",
		"valuetype" : "number",
		"label" : "土地容积率"
	} , {
		"stage" : "projectLandStage",
		"fieldId" : "landUsages",
		"valuetype" : "string",
		"label" : "地块用途"
	} , {
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
		"fieldId" : "investment",
		"valuetype" : "number",
		"label" : "投资额"
	} , {
		"stage" : "projectLandStage",
		"fieldId" : "storeyArea",
		"valuetype" : "number",
		"label" : "建筑面积"
	} , {
		"stage" : "projectLandStage",
		"fieldId" : "storeyHeight",
		"valuetype" : "number",
		"label" : "建筑层高"
	} , {
		"stage" : "projectLandStage",
		"fieldId" : "foreignInvestment",
		"valuetype" : "bool",
		"label" : "外资参与"
	} , {
		"stage" : "projectLandStage",
		"fieldId" : "ownerType",
		"valuetype" : "string",
		"label" : "业主类型"
	} ],
	"2" : [ {
		"stage" : "projectMainDesignStage",
		"fieldId" : "mainDesignStage",
		"valuetype" : "string",
		"label" : "主体设计阶段"
	} , {
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





