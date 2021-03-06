if(!global.isLogin()){
	location.href = 'home.html';
} else {
	var type = global.getUserType();
	if(type != 'Personal'){
		location.href = 'home.html';
	}
}


var companyImage = [null,null,null,null];

var CompanyBase = function(opt){
	this.data = {};
	this.init = function(){
		var _this = this;
		var container = $("#base-info-table");
		container.find("input[type='text']").each(function(i, j){
			var obj = $(j);
			var field = obj.attr("fieldId");
			if(field){
				_this.data[field] = obj.val();
			}
		});
		_this.data['createdBy'] = global.getUserId();
	}
	
	this.init();
};

CompanyBase.prototype.postToServer = function(){
	var _this = this;
	var url = '/CompanyBaseInformation/AddCompanyBaseInformation';
	var data = _this.data;
	if(global.isLogin()){
		$.ajax({
			type : "post",
			url : global.serviceUrl + url,
			async : true,
			dataType : "json",
			data : data,
			success : function(msg) {
				if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
					var companyId = msg.d.data.id;
					if(companyId != null){
						$.each(companyImage,function(i,j){
							if(j != null){
								j.postToServer(companyId);
							}
						});
					}
					alert("申请创建公司提交成功");
				}
			}
		});
	} else {
		global.remindLogin();
	}
};

var Photo = function(options){
	this.category = options.category;
	this.file = options.file;
	this.imgContent = options.imgContent;
	
	this.postToServer = function(id){
		var _this = this;
		var url = '/CompanyBaseInformation/AddCompanyImages';
		var data = {
			"companyId" : id,
			"imageContent" : _this.imgContent.replace('data:image/jpeg;base64,',''),
			"imageCategory" : _this.category
		};
		$.ajax({
			type : "post",
			url : global.serviceUrl + url,
			async : true,
			dataType : "json",
			data : data,
			success : function(msg) {
				if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
					
				}
			}
		});
	};
	
	this.show = function(){
		var _this = this;
		return $('<div class="thumb"><img src="' + _this.imgContent + '" /></div>');
	};
};




var readMultipleFiles = function (evt) {
    //Retrieve all the files from the FileList object
	var category = $(this).attr('ref');
	var index = $(this).attr('index');
    var files = evt.target.files; 
    		
    if (files) {
        for (var i = 0; i < files.length; i++) {
        	if (files[i].type != 'image/jpeg') {
		        var pop = new PopingView();
		        pop.show({ text: files[i].name+" 文件类型错误，请上传JPG格式的文件！", parent: '.wrapper', view: "errorView", timeout: 4000, css: {top: '60px'} });
        		continue;
        	}
        	if (files[i].size > 200000) {
		        var pop = new PopingView();
		        pop.show({ text: files[i].name+" 文件过大，请上传200K以内的文件！", parent: '.wrapper', view: "errorView", timeout: 4000, css: {top: '60px'} });
        		continue;
        	}
            (function (i) {
                var reader = new FileReader();
                reader.onload = function (event) {
                    var photo = new Photo({
                        "imgContent": event.target.result,
                        "category": category,
                        "file": files[i]
                    });
                    $("div[fieldId='" + category + "']").html("").append(photo.show());
                    companyImage[index] = photo;
                };
                reader.readAsDataURL(files[i]);
            })(i);
        }
    } else {
		console.log("Failed to load files"); 
    }
};


$(function(){
	
	$('.attach').on('click', function () {
		var trigger = $(this).find('input:file')[0];
		trigger.addEventListener('change', readMultipleFiles, false);
        trigger.click();
    });
	
	$("#userName").val(global.getUser().userName);
	
	$("#btn-submit").click(function(){
		new CompanyBase().postToServer();
	});
});
