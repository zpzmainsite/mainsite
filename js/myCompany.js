var _mycompanyId = null;
var myCompany = function(companyId){
	var _this = this;
	this.init = function(companyId){
		var _this = this;
		if(companyId == null){
			_this.companyInfo();
		} else {
			_this.otherCompany(companyId);
		}
	};
	this.otherCompany = function(companyId){
		var url ='/CompanyBaseInformation/GetCompanyBaseInformation';
		var _this = this;
		$.get(global.serviceUrl + url,{"CompanyId":companyId}, function (msg) {
    		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
    			if(msg.d.data.length > 0){
    				var company = msg.d.data[0];
        			_this.show(company);
    			}
    		}
        }).done(function(msg){
        	$('.left-tag').remove();
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				if(msg.d.data.length > 0){
					var company = msg.d.data[0];
					_mycompanyId = company.id;
					var opt = {"tag":'trends',"id":_mycompanyId};
					new dataCardLoader(opt);
				}
			}
		});;
	};
	this.companyInfo = function(){
		var _this = this;
		var url = '/CompanyBaseInformation/GetMyCompany';
		$.get(global.serviceUrl + url,function(msg){
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				if(msg.d.data.length > 0){
					var company = msg.d.data[0];
					_this.show(company);
				}
			}
		}).done(function(msg){
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				if(msg.d.data.length > 0){
					var company = msg.d.data[0];
					_mycompanyId = company.id;
					$('.left-tag dd').click(function(){
						var opt = {"tag":$(this).data("tag"),"id":_mycompanyId};
				    	new dataCardLoader(opt);
				    });
					var opt = {"tag":'trends',"id":_mycompanyId};
					new dataCardLoader(opt);
				}
			}
		});
	}
	this.show = function(data){
		this.container = $(".my-company");
		this.container.find(".field").each(function(i, j){
			var fieldId = $(j).attr("fieldId");
			var type = $(j).attr("valuetype");
			var value = data[fieldId];
			if(type == 'string'){
				$(j).text(value);
			} else if(type == 'image') {
				$(j).attr("src", value);
			}
		});
	};
	this.init(companyId);
};

$(function(){
	var companyId = global.QueryString.companyId;
	if(companyId === undefined){
		companyId = null;
	} else if (companyId == ""){
		companyId = null;
	}
	new myCompany(companyId);
});