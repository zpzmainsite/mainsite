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
	}
	
	this.init(data, type);
}

var Setting = function(){
	var config = null;
	var init = function(){
		var configUrl = '/UserInformation/GetSysUserConfig';
		var data = {userId : global.getUserId()};
		$.get(global.serviceUrl + configUrl, data, function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				var setting = msg.d.data[0];
				config = new Config(setting);
			}
		}).done(function(){
			$(".privacy-config .save-btn").click(function(){
				var parent = $(".privacy-config");
				config.saveConfig(parent);
			});
			$(".notify-email-config .save-btn").click(function(){
				var parent = $(".notify-email-config");
				config.saveConfig(parent);
			});
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
};

var Config = function(data){
	this.init = function(data){
		var _this = this;
		
		$(".btn.check-btn i.check.single").on('click',function(){
			$(this).toggleClass("checked");
		});
		
		$(".btn.check-btn i.check.group").each(function(i, j){
			var field = $(this).data("field");
			$(this).addClass(field);
		}).on('click',function(){
			var field = $(this).data("field");
			var group = $("i.check.group." + field);
			group.removeClass("checked");
			$(this).addClass("checked");
		});
		
		_this.fillData(data);
	};
	
	this.fillData = function(data){
		var _this = this;
		
		$(".btn.check-btn i.check.single").each(function(i, j){
			var field = $(this).data("field");
			var checked = data[field];
			if(checked){
				$(this).addClass("checked");
			}
		});
		
		$(".btn.check-btn i.check.group").each(function(i, j){
			var field = $(this).data("field");
			var value = data[field];
			var checked = $(this).data("value");
			if(value == checked){
				$(this).addClass("checked");
			}
		})
		
	}
	
	this.getConfig = function(parent){
		var data = {};
		parent.find("i.check.single").each(function(){
			var field = $(this).data("field");
			data[field] = $(this).hasClass("checked");
		});
		parent.find("i.check.group.checked").each(function(){
			var field = $(this).data("field");
			data[field] = $(this).data("value");
		});
		return data;
	};
	
	this.saveConfig = function(parent){
		var _this = this;
		var data = _this.getConfig(parent);
		data.userId = global.getUserId();
		var url = '/UserInformation/UpdateSysUserConfig';
		$.ajax({
			type : "post",
			url : global.serviceUrl + url,
			data : data,
			async : false,
			dataType : "json",
			success : function(msg) {
				if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
					alert("设置保存成功");
		        }
			}
		});
		
	};
	
	this.init(data);
}





$(function(){
	new Setting();
	
	
});