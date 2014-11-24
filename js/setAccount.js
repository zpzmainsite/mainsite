var SettingDomain = function(data, type){
	
	this.init = function(data, type){
		var _this = this;
		var obj = null;
		if(type == 'Company'){
			obj = _this.initCompany(data);
		} else {
			obj = _this.initPerson(data);
		}
		_this.fillData(obj);
	}
	
	this.initPerson = function(data){
		var obj = new Object();
		obj.userName = data.userName;
		obj.logo = data.userImage;
		obj.email = data.email;
		obj.location = data.city;
		obj.remark = data.company + "-" + data.duties;
		obj.industry = data.industry;
		return obj;
	}
	
	this.initCompany = function(data){
		var obj = new Object();
		obj.userName = data.companyName;
		obj.logo = data.companyLogo;
		obj.email = data.companyContactEmail;
		obj.location = data.companyLocation;
		obj.remark = data.companyType;
		obj.industry = data.companyIndustry;
		return obj;
	}
	
	this.fillData = function(obj){
		this.container = $(".col-left-two");
		var _this = this;
		this.container.find(".field").each(function(i, j){
			var fieldId = $(j).attr("fieldId");
			var type = $(j).attr("dataType");
			if(type == 'image'){
				$(j).attr("src", obj[fieldId]);
			} else if (type == 'string'){
				$(j).text(obj[fieldId]);
			}
		});
		
		console.log(obj);
	}
	
	this.init(data, type);
}

var Setting = function(){
	
	var init = function(){
		var configUrl = '/UserInformation/GetSysUserConfig';
		var data = {userId : global.getUserId()};
		$.get(global.serviceUrl + configUrl, data, function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				var setting = msg.d.data[0];
//				console.log(setting);
			}
		});
		
		if(global.getUserType() == 'Company'){
			var url ='/CompanyBaseInformation/GetCompanyBaseInformation';
			$.get(global.serviceUrl + url, {CompanyId:global.getUserId()}, function(msg) {
				if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
					var info = msg.d.data[0];
					new SettingDomain(info,'Company');
				}
			});
		} else {
			var url = '/networking/UserDetails';
			$.get(global.serviceUrl + url, {userId : global.getUserId()}, function(msg) {
				if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
					var info = msg.d.data.baseInformation;
					new SettingDomain(info,'Person');
				}
			});
		}
		
	}
	
	init();
}



$(function(){
	$(".btn.check-btn i.check").on('click',function(){
		$(this).toggleClass("checked");
	});
	
	new Setting();
});