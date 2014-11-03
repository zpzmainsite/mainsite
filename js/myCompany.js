var _mycompanyId = null;
var myCompany = function(){
	var _this = this;
	this.init = function(){
		var url = '/CompanyBaseInformation/GetMyCompany';
		$.get(global.serviceUrl + url,function(msg){
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				var company = msg.d.data[0];
				_this.show(company);
			}
		}).done(function(msg){
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				var company = msg.d.data[0];
				_mycompanyId = company.id;
				$('.left-tag dd').click(function(){
					var opt = {"tag":$(this).data("tag"),"id":_mycompanyId};
			    	new dataCardLoader(opt);
			    });
				var opt = {"tag":'trends',"id":_mycompanyId};
				new dataCardLoader(opt);
			}
		});
	};
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
	this.init();
};

$(function(){
	new myCompany();
});