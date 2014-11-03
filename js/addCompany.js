var AddCompany = function(opt) {
	this.container = opt;
	this.pagintion = {index: 0,pageSize: 3,keyword:"",hasNext:true};
	var _this = this;
	this.content = $('<div class="company-search-title"> \
            	<span >添加公司</span> \
            </div> \
            <div class="company-search-input"> \
            	<input id="search-input" type="text" placeholder="输入公司关键字"/> \
            </div> \
            <div class="company-result-list"> \
            </div> \
            <div class="company-search-control"> \
             	<span>下一页</span> \
            </div>');
	
	this.init = function(panel){
		var _this = this;
		panel.addClass("add-company-panel");
		panel.html(_this.content);
		
		panel.find("#search-input").keypress(function(event){
			if(event.keyCode == "13"){
				_this.load();
	        }
		});
		
		panel.find(".company-search-control").click(function(){
			_this.nextPage();
		});
	};
	
	this.init(this.container);
};
AddCompany.prototype.load = function(){
	var _this = this;
	_this.pagintion.index = 0;
	_this.pagintion.hasNext = true;
	_this.pagintion.keyword = _this.content.find("#search-input").val();
	_this.reload();
};
AddCompany.prototype.reload = function(){
	var _this = this;
	_this.getData(_this.pagintion.keyword);
};
AddCompany.prototype.nextPage = function(){
	var _this = this;
	if(_this.pagintion.hasNext){
		_this.reload();
	}
};
AddCompany.prototype.getData = function(keyword){
	var _this = this;
	var url = '/CompanyBaseInformation/GetCompanyBaseInformation';
	var data = {"KeyWords":keyword,"PageIndex":_this.pagintion.index,"PageSize":_this.pagintion.pageSize};
	$.get(global.serviceUrl + url, data, function(msg) {
		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
			_this.fillData(msg.d.data);
		}
	}).done(function(msg){
		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
			if(msg.d.data.length < _this.pagintion.pageSize){
				_this.pagintion.hasNext = false;
			} else {
				_this.pagintion.index++;
			}
		}else{
			_this.pagintion.hasNext = false;
		}
	});
};
AddCompany.prototype.fillData = function(data){
	var _this = this;
	var rows = _this.container.find(".company-result-list");
	
	var makeRow = function(d){
		var row = $('<div class="result-row"> \
	        	<div class="row-info"> \
		        	<img src=""/> \
		        	<p id="companyName"></p> \
		        	<p>&nbsp;</p> \
	    	</div> \
	    	<div class="row-btn"><span class="off">加关注</span></div> \
	    </div>');
		row.attr("ref", d.id);
		row.find("img").attr("src", d.companyLogo);
		row.find("#companyName").text(d.companyName);
		if(d.focused){
			row.find(".row-btn span").text("已关注").attr("class", "on");
		}
		row.find(".row-btn span").click(function(){
			if(global.isLogin()){
				var id = row.attr("ref");
				if($(this).hasClass("on")){
					cancelFocus(id,this);
				} else {
					addFocus(id,this);
				}
			}
		});
		return row;
	};
	
	var addFocus = function(id,btn){
		var userType = global.getUser() != 'Company'?'Personal':'Company';
		var data = {
			  "userId": global.getUserId(),
			  "focusId": id,
			  "focusType": "Company",
			  "userType": userType,
		};
		
		var url = '/networking/addUserFocus';
		$.post(global.serviceUrl + url,data,function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				$(btn).attr("class","on").text("已关注");
			}
		});
	};
	
	var cancelFocus = function(id,btn){
		var data = {"focusId":id,"userId":global.getUserId()};
    	var url = '/networking/DeleteFocus';
    	$.post(global.serviceUrl + url, data, function(msg){
    		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
    			$(btn).attr("class","off").text("加关注");
    		}
    	});
	};
	
	rows.html("");
	
	$(data).each(function (i,j) {
		rows.append(makeRow(j));
    });
};

