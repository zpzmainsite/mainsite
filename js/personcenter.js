var personCenter = function(opt){
	this.opt = opt;
	var _this = this;
	
	this.init = function(){
		var url ='/networking/UserDetails';
		var _this = this;
		$.get(global.serviceUrl + url,{"userId":_this.opt}, function (msg) {
    		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
    			var baseInformation = msg.d.data.baseInformation;
    			var userParticulars = baseInformation.userParticulars;
    			_this.fillData(baseInformation);
    			_this.fillParticular(userParticulars);
    		}
        });
	};
	this.fillData = function(data){
		console.log(data);
		this.container = $(".info-tips");
		this.container.find(".user_head img").attr("src",global.server + data.userImage);
		this.container.find(".nick_name").text(data.userName);
		this.container.find(".real_name").text(data.realName);
		this.container.find(".location").text(data.city);
		this.container.find(".cell_phone").text(data.cellphone);
		this.container.find(".email").text(data.email);
	};
	
	this.fillParticular = function(data){
		console.log(data);
		this.container = $(".user-info");
		var el = $('<div class="detail-row"> \
				<div class="companyName"></div> \
				<div class="work_day">2014年10月——目前</div> \
				<div class="duties"></div> \
				<div class="information"></div>\
				</div>');
		el.find(".companyName").text("就职公司：" + data.companyName);
//		el.find(".work_day").text(data.companyName);
		el.find(".duties").text("就职职位 " + data.duties);
		el.find(".information").text(data.information);
		this.container.append(el);
	};
	
	this.init();
	
};

$(function(){
	var userId = global.QueryString.userId;
	if(userId === undefined){
		userId = global.getUserId();
	} else if (userId == ""){
		userId = global.getUserId();
	}
	new personCenter(userId);
});