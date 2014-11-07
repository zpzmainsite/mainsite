var companyCenter = function(opt){
	this.opt = opt;
	var _this = this;
	
	this.init = function(){
		var url ='/CompanyBaseInformation/GetCompanyBaseInformation';
		var _this = this;
		$.get(global.serviceUrl + url,{"CompanyId":_this.opt}, function (msg) {
    		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
    			var company = msg.d.data[0];
    			_this.fillData(company);
    			
    		}
        });
	};
	this.fillData = function(data){
		var user = global.getUser();
		this.container = $(".info-tips");
		this.container.find(".user_head img").attr("src",global.server + data.companyLogo);
		this.container.find(".nick_name").text(user.userName);
		this.container.find(".email").text(data.companyContactEmail);
		$(".company-info .companyDescription").text(data.companyDescription);
	};
	
	this.init();
	
};

$(function(){
	var companyId = global.QueryString.companyId;
	if(companyId === undefined){
		companyId = global.getUserId();
	} else if (companyId == ""){
		companyId = global.getUserId();
	}
	new companyCenter(companyId);
});