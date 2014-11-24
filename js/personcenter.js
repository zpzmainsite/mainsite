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
		
    	if(data.userId != global.getUserId()){
    		this.container.find(".tools").html("&nbsp;");
    	}
	};
	
	this.fillParticular = function(data){
		console.log(data);
		var _this = this;
		this.container = $(".user-info");
		var el = $('<div class="detail-row"> \
				<div class="companyName"></div> \
				<div class="work_day">2014年10月——目前</div> \
				<div class="duties"></div> \
				<div class="information"></div>\
				</div>');
		el.find(".companyName").text("就职公司：" + data.companyName);
		var d_in = _this.formatDate(data.indate);
		var d_out = _this.formatDate(data.outDate);
		var inDay = d_in.string;
		var outDay = null;
		var isIn = data.isIn;
		if(isIn){
			outDay = '目前';
		} else {
			outDay = d_out.string; 
		}
		
		el.find(".work_day").text(inDay + "——" + outDay);
		el.find(".duties").text("就职职位 " + data.duties);
		el.find(".information").text(data.information);
		this.container.append(el);
	};
	
	this.init();
	
};

personCenter.prototype.calcdiff = function(d1, d2){
	console.log(d1);
	console.log(d2);
	
	var y = Math.abs(d1.date - d2.date ) / 1000 / 60 / 60 /24 /30 /12;
	alert(y);
}

personCenter.prototype.formatDate = function(string){
    try {
		var v = string.split('T');
		var date = new Date(v[0]);
		var y = date.getFullYear();
		var m = date.getMonth()+1;
		var d = date.getDate();
		return {
			date : date,
			year : y,
			month : m < 10 ? '0' + m : m,
			day : d < 10 ? '0' + d : d,
			'string': date.Format('yyyy年MM月'),
		};
	} catch (e) {
		return null;
	}
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