/**
 * 
 */
var profile = function(opt) {
	this.opt = {"id":opt};
	
	this.initBaseInfo = function(data){
		this.container = $(".col-left-two");
		var _this = this;
		var user = global.getUser();
		this.container.find(".userName").val(user.userName);
		this.container.find(".filed").each(function(i, j){
			var fieldId = $(j).attr("fieldId");
			var type = $(j).attr("valuetype");
			var value = data[fieldId];
			if(type == 'string'){
				$(j).val(value);
			} else if(type == 'image'){
				$(j).attr("src", value);
			}
		});
		
		console.log(data);
	};
	
	this.init = function(){
		var url ='/CompanyBaseInformation/GetCompanyBaseInformation';
		var _this = this;
		$.get(global.serviceUrl + url,{"CompanyId":_this.opt.id}, function (msg) {
    		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
    			var company = msg.d.data[0];
    			_this.initBaseInfo(company);
    		}
        });
		
		$("#save_description_btn").click(function(){
			_this.updateDesc();
		});
	};
	
	this.updateDesc = function(){
		var url = '/CompanyBaseInformation/UpdateCompanyBaseInformation';
		var desc = $("#companyDescription").val();
		var data = {
			"id" : global.getUserId(),
			"companyDescription" : desc
		}
		$.ajax({
			type : "post",
			url : global.serviceUrl + url,
			data : data,
			async : false,
			dataType : "json",
			success : function(msg) {
				if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
					
		        } 
			}
		});
	};
	
	this.init();
	
};

$(function(){
	new profile(global.getUserId());
});

var Photo = function(options){
	this.imgContent = options.imgContent;
	
	this.postToServer = function(){
		var _this = this;
		var url = '/CompanyBaseInformation/AddCompanyImages';
		var data = {
			"companyId" : global.getUserId(),
			"imageContent" : _this.imgContent.replace('data:image/jpeg;base64,',''),
			"imageCategory" : "Logo"
		};
		$.ajax({
			type : "post",
			url : global.serviceUrl + url,
			async : true,
			dataType : "json",
			data : data,
			success : function(msg) {
				if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
					console.log(msg);
				}
			}
		});
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
                        "imgContent": event.target.result
                    });
                    photo.postToServer();
                };
                reader.readAsDataURL(files[i]);
            })(i);
        }
    } else {
		console.log("Failed to load files"); 
    }
};


$(function() {
	
	$('.attach').on('click', function () {
		var trigger = $(this).find('input:file')[0];
		trigger.addEventListener('change', readMultipleFiles, false);
        trigger.click();
    });
	
});

