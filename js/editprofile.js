/**
 * 
 */
var profile = function(opt) {
	this.opt = {"id":opt,"sex":null};
	this.blood = ['O型', 'A型', 'B型', 'AB型', '其他'];
	this.constellationData = [ '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座' ];
	this.initBaseInfo = function(data){
		var _this = this;
		this.container = $(".user-info");
		var bloodSelect = _this.container.find(".blood");
		$.each(_this.blood,function(i, j){
			bloodSelect.append($('<option value=' + j + '>'+j+'</option>'));
		});
		var constellationSelect = _this.container.find(".constellation");
		$.each(_this.constellationData,function(i, j){
			constellationSelect.append($('<option value=' + j.substring(0,2) + '>'+j+'</option>'));
		});
		
		var birthday = _this.stringToDate(data.birthday);
		
		if(birthday != null){
			var con = _this.constellation(birthday.date);
			constellationSelect.val(con);
			var format_birthday = birthday.year +"/"+birthday.month +"/"+birthday.day;
			_this.container.find(".birthday").val(format_birthday);
		}
		
		var bloodType = data.bloodType;
		bloodSelect.val(bloodType);
		this.container.find(".user_head img").attr("src",global.server + data.userImage);
		this.container.find(".real_name").val(data.realName);
		
		$("input[name='sex'][value='"+data.sex+"']").iCheck('check');
		this.container.find(".cell_phone").val(data.cellphone);
		this.container.find(".email").val(data.email);
		this.container.find(".company_name").val(data.company);
		this.container.find("#btn_save").click(function(){
			_this.updateBaseInfo();
		});
		
		_this.opt.sex = data.sex;
		
		$("input[name='sex']").on('ifChecked', function(event){
			_this.opt.sex = this.value;
		});
		
		console.log(data);
	};
	this.updateBaseInfo = function(){
		var _this = this;
		this.container = $(".user-info");
		var data = {};
		data.userId = global.getUserId();
		data.realName = _this.container.find(".real_name").val();
		data.email = this.container.find(".email").val();
		data.sex = _this.opt.sex;
		data.constellation = this.container.find(".constellation").val();
		data.birthday = this.container.find(".birthday").val();
		data.bloodType = this.container.find(".blood").val();
		var url = '/account/InformationImproved';
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
	this.initParticular = function(data){
		this.container = $(".data-panel");
		var _this = this;
		var readonly = function(el){
			el.find("input[type='text']").attr("readonly",true);
			el.find("textarea").attr("readonly",true);
			el.find("#init").show();
			el.find("#edit").hide();
			el.find("select").attr("disabled",true);
			el.find("input[type='checkbox']").attr("disabled",true);
		};
		var edit = function(el){
			el.find("input[type='text']").removeAttr("readonly");
			el.find("textarea").removeAttr("readonly");
			el.find("select").removeAttr("disabled");
			el.find("input[type='checkbox']").removeAttr("disabled");
			el.find("#edit").show();
			el.find("#init").hide();
		};
		var row = function(data){
			var el = $('<div class="data-block"> \
					<table class="person-info" border="0" cellspacing="0" cellpadding="0"> \
						<tr> \
							<td>公司名称</td> \
							<td><input type="text" class="company_name" value="" /></td> \
						</tr> \
						<tr> \
							<td>个人职位</td> \
							<td><input type="text" class="duties" value="" /></td> \
						</tr> \
						<tr> \
							<td>在职时间</td> \
							<td> \
								<select class="in_year"></select> \
								<select class="in_month"></select> \
								至 \
								<select class="out_year"></select> \
								<select class="out_month"></select> \
								<label><input type="checkbox" class="still"/>仍然在职</label> \
							</td> \
						</tr> \
						<tr> \
							<td style="vertical-align: top;">个人介绍</td> \
							<td><textarea class="introduce"></textarea></td> \
						</tr> \
						<tr> \
							<td>&nbsp;</td> \
							<td id="init"><input type="button" id="editBtn" value="编辑"/>&nbsp;&nbsp;<input type="button" id="delBtn" value="删除"/></td> \
							<td id="edit"><input type="button" id="saveBtn" value="保存"/>&nbsp;&nbsp;<input type="button" id="cancelBtn" value="取消"/></td> \
						</tr> \
					</table> \
				</div>');
			var yearHtml = _this.getYearOptions();
			var monthHtml = _this.getMonthOptions();
			el.find(".in_year").html(yearHtml);
			el.find(".out_year").html(yearHtml);
			el.find(".in_month").html(monthHtml);
			el.find(".out_month").html(monthHtml);
			var inDate = _this.stringToDate(data.inDate);
			var outDate = _this.stringToDate(data.outDate);
			if(inDate != null){
				el.find(".in_year").val(inDate.year);
				el.find(".in_month").val(inDate.month);
			}
			if(outDate != null){
				el.find(".out_year").val(outDate.year);
				el.find(".out_month").val(outDate.month);
			}
			el.find(".company_name").val(data.companyName);
			el.find(".duties").val(data.duties);
			el.find(".still").prop("checked", data.isIn);
			
			if(data.isIn){
				_this.stillWork(true, el);
			}
			
			el.find(".introduce").val(data.information);
			el.attr("ref", data.id);
			el.find(".still").click(function(){
				_this.stillWork(this.checked, el);
			});
			el.find("#delBtn").click(function(){
				var ref = $(el).attr("ref");
				var url ='/UserInformation/DeleteUserParticulars';
				$.post(global.serviceUrl + url, {"id":ref}, function(msg){
	        		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
	        			$(el).remove();
	        		}
	        	});
			});
			el.find("#saveBtn").click(function(){
				var data = {};
				data.userId = global.getUserId();
				data.companyName = el.find(".company_name").val();
				data.duties = el.find(".duties").val();
				data.inDate = el.find(".in_year").val() +"-"+el.find(".in_month").val();
				data.outDate = el.find(".out_year").val() +"-"+el.find(".out_month").val();
				data.isIn = el.find(".still").prop("checked");
				if(data.isIn){
					data.outDate = '';
				}
				data.Information = el.find(".introduce").val();
				data.id = $(el).attr("ref");
				
				var url = '/UserInformation/UpdateUserParticulars';
				$.post(global.serviceUrl + url, data, function(msg){
	        		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
	        			readonly(el);
	        		}
	        	});
			});
			el.find("#editBtn").click(function(){
				edit(el);
			});
			el.find("#cancelBtn").click(function(){
				readonly(el);
			});
			
			readonly(el);
			return el;
		};
		_this.container.html("");
		$.each(data, function(i, j){
			_this.container.append(row(j));
		});
	};
	this.refresh = function(){
		var url = '/account/Particulars';
		var _this = this;
		$.get(global.serviceUrl + url,{"userId":_this.opt.id}, function (msg) {
    		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
    			var userParticulars = msg.d.data;
    			if(userParticulars.length > 0){
    				_this.initParticular(userParticulars);
    			} else {
    				_this.addparticulars();
    			}
    		} else {
    			_this.addparticulars();
    		}
        });
	};
	
	this.init = function(){
		var url ='/networking/UserDetails';
		var _this = this;
		$.get(global.serviceUrl + url,{"userId":_this.opt.id}, function (msg) {
    		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
    			var baseInformation = msg.d.data.baseInformation;
    			_this.initBaseInfo(baseInformation);
    			_this.refresh();
    		}
        });
	};
	
	this.init();
};

profile.prototype.getYearOptions = function(){
	var date = new Date();
	var year = date.getFullYear();
	var html = "";
	for(var i=0;i<30;i++){
		html += "<option>" + (year - i)+ "</option>";
	}
	return html;
};
profile.prototype.getMonthOptions = function(){
	var html = "";
	for(var i=1;i<=12;i++){
		var tip = i<10?'0'+i:i;
		html += "<option>" + tip + "</option>";
	}
	return html;
};

profile.prototype.stillWork = function(still, el){
	var _this = this;
	if(still){
		el.find(".out_year").html("<option selected>-</option>");
		el.find(".out_month").html("<option selected>-</option>");
	} else {
		var yearHtml = _this.getYearOptions();
		var monthHtml = _this.getMonthOptions();
		el.find(".out_year").html(yearHtml);
		el.find(".out_month").html(monthHtml);
	}
};

profile.prototype.addparticulars = function(){
	this.container = $(".data-panel");
	var _this = this;
	var row = function(){
		var el = $('<div class="data-block"> \
				<table class="person-info" border="0" cellspacing="0" cellpadding="0"> \
					<tr> \
						<td>公司名称</td> \
						<td><input type="text" class="company_name" value="" /></td> \
					</tr> \
					<tr> \
						<td>个人职位</td> \
						<td><input type="text" class="duties" value="" /></td> \
					</tr> \
					<tr> \
						<td>在职时间</td> \
						<td> \
							<select class="in_year"></select> \
							<select class="in_month"></select> \
							至 \
							<select class="out_year"></select> \
							<select class="out_month"></select> \
							<label><input type="checkbox" class="still"/>仍然在职</label> \
						</td> \
					</tr> \
					<tr id="introduce"> \
						<td style="vertical-align: top;">个人介绍</td> \
						<td><textarea class="introduce"></textarea></td> \
					</tr> \
					<tr> \
						<td>&nbsp;</td> \
						<td><input id="saveBtn" type="button" class="save-btn" value="保存"/>&nbsp;&nbsp;<input class="cancel-btn" type="button" id="cancelBtn" value="取消"/></td> \
					</tr> \
				</table> \
			</div>');
		el.attr("ref","insert");
		var yearHtml = _this.getYearOptions();
		var monthHtml = _this.getMonthOptions();
		el.find(".in_year").html(yearHtml);
		el.find(".out_year").html(yearHtml);
		el.find(".in_month").html(monthHtml);
		el.find(".out_month").html(monthHtml);
		
		el.find(".still").click(function(){
			_this.stillWork(this.checked, el);
		});
		
		el.find("#saveBtn").click(function(){
			var url = '/account/addparticulars';
			var data = {};
			data.userId = global.getUserId();
			data.companyName = el.find(".company_name").val();
			data.duties = el.find(".duties").val();
			data.inDate = el.find(".in_year").val() +"-"+el.find(".in_month").val();
			data.outDate = el.find(".out_year").val() +"-"+el.find(".out_month").val();
			data.isIn = el.find(".still").prop("checked");
			
			if(data.isIn){
				data.outDate = '';
			}
			
			data.Information = el.find(".introduce").val();
			
			$.post(global.serviceUrl + url, data, function(msg){
        		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
        			_this.refresh();
        		}
        	});
			
		});
		el.find("#cancelBtn").click(function(){
			$(el).remove();
		});
		return el;
	};
	if(_this.container.find("div[ref='insert']").length == 0){
		_this.container.prepend(row());
	}
};

profile.prototype.stringToDate = function (string) {
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
			day : d < 10 ? '0' + d : d
		};
	} catch (e) {
		return null;
	}
};

profile.prototype.changeBirthday = function (string) {
	var _this = this;
	var date = new Date(string);
	var con = _this.constellation(date);
	$(".user-info").find(".constellation").val(con);
};

profile.prototype.constellation = function(date){
	var day = date.getDate();
	var month = date.getMonth() + 1;
	if (month == 1 && day >= 20 || month == 2 && day <= 18) {
		return "水瓶";
	}
	if (month == 2 && day >= 19 || month == 3 && day <= 20) {
		return "双鱼";
	}
	if (month == 3 && day >= 21 || month == 4 && day <= 19) {
		return "白羊";
	}
	if (month == 4 && day >= 20 || month == 5 && day <= 20) {
		return "金牛";
	}
	if (month == 5 && day >= 21 || month == 6 && day <= 21) {
		return "双子";
	}
	if (month == 6 && day >= 22 || month == 7 && day <= 22) {
		return "巨蟹";
	}
	if (month == 7 && day >= 23 || month == 8 && day <= 22) {
		return "狮子";
	}
	if (month == 8 && day >= 23 || month == 9 && day <= 22) {
		return "处女";
	}
	if (month == 9 && day >= 23 || month == 10 && day <= 22) {
		return "天秤";
	}
	if (month == 10 && day >= 23 || month == 11 && day <= 21) {
		return "天蝎";
	}
	if (month == 11 && day >= 22 || month == 12 && day <= 21) {
		return "射手";
	}
	if (month == 12 && day >= 22 || month == 1 && day <= 19) {
		return "摩羯";
	}
	return null;
};

var Photo = function(options){
	this.imgContent = options.imgContent;
	
	this.postToServer = function(){
		var _this = this;
		var url = '/account/AddUserImage';
		var data = {
			"userId" : global.getUserId(),
			"userImageStrings" : _this.imgContent.replace('data:image/jpeg;base64,','')
		};
		$.ajax({
			type : "post",
			url : global.serviceUrl + url,
			async : true,
			dataType : "json",
			data : data,
			success : function(msg) {
				if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
					var url = msg.d.data.imageLocation;
					global.changeHead(url);
					alert("头像更新成功");
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
	var p = new profile(global.getUserId());
	
	$('.attach').on('click', function () {
		var trigger = $(this).find('input:file')[0];
		trigger.addEventListener('change', readMultipleFiles, false);
        trigger.click();
    });
	
	// 启动日历插件
    $('.datepicker').datepicker({
        showButtonPanel: true,
        changeMonth: true,
        changeYear: true,
        yearRange:'-50:-18',
        showOptions: { direction: "down" },
        onSelect : function(dateText, inst){
        	p.changeBirthday(dateText);
        }
    });
    
    $(".addparticulars").on('click',function(){
    	p.addparticulars();
    });
});



