var readMultipleFiles = function (evt, content) {
    //Retrieve all the files from the FileList object
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
                	content.setFile(files[i]);
                	content.setImgContent(event.target.result);
                };
                reader.readAsDataURL(files[i]);
            })(i);
        }
    } else {
		console.log("Failed to load files"); 
    }
};

var TrendsContent = function(){
	this.file = null;
	this.imgContent = null;
	this.content = null;
	
	this.setFile = function(file){
		var _this = this;
		_this.file = file;
	};
	this.setImgContent = function(imgContent){
		var _this = this;
		_this.imgContent = imgContent.replace('data:image/jpeg;base64,','');
	};

	this.sendActives = function(category){
		if(global.isLogin()){
			var _this = this;
			var content = $(".message-content").val();
			if(category == 'Product'){
				var data = {
					"createdBy"	: global.getUserId(),
					"productDescription" : content
				};
				if(_this.imgContent != null){
					data.productImageStrings = _this.imgContent;
					data.productImageName = _this.file.name;
				}
				if(content != ''){
					_this.postProduct(data);
				}
			} else {
				var data = {
					"EntityID"	: global.getUserId(),
					"Category" : category,
					"ActiveText" : content
				};
				if(_this.imgContent != null){
					data.PictureStrings = _this.imgContent;
					data.ActivePicture = _this.file.name;
				}
				if(content != ''){
					_this.postData(data);
				}
			}
		} else {
			global.remindLogin();
		}
	};
	
	this.postData = function(data){
		var _this = this;
		var url = "/ActiveCenter/SendActives";
		$.ajax({
			type : "post",
			url : global.serviceUrl + url,
			data : data,
			dataType : "json",
			success : function(msg) {
				if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
					alert("发布成功");
					_this.reset();
		        }
			}
		});
	};
	
	this.postProduct = function(data){
		var _this = this;
		var url = "/ProductInformation/AddProductInformation";
		$.ajax({
			type : "post",
			url : global.serviceUrl + url,
			data : data,
			dataType : "json",
			success : function(msg) {
				if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
					alert("发布成功");
					_this.reset();
		        }
			}
		});
	};
	
	this.reset = function(){
		var _this = this;
		_this.file = null;
		_this.imgContent = null;
		_this.content = null;
		$(".message-content").val("");
		$(".maxlength").text('0/120字');
	}
};

$(function(){
	var content = new TrendsContent();
	
	$('.attach').hover(function () {
        $(this).find('.cmps').addClass('cmps-hover');
    }, function () {
        $(this).find('.cmps').removeClass('cmps-hover');
    }).on('click', function () {
		var trigger = $(this).find('input:file')[0];
		trigger.addEventListener("change",function(event){readMultipleFiles(event, content);},false); 
        trigger.click();
    });
	
	$('.trends_tab').click(function(){
    	var tag = $(this).attr("tag");
    	$('.trends_tab').removeClass("active");
    	if(tag == 'Company'){
    		$(this).addClass("active");
    		$(".triangle").css("left",52);
    	} else if (tag == 'Product'){
    		$(this).addClass("active");
    		$(".triangle").css("left",112);
    	}
    	content.reset();
    });
	
	$("#post-trends-btn").on('click',function(){
		var category = $("div[class='trends_tab active']").attr('tag');
		content.sendActives(category);
	});
	
	
	
});