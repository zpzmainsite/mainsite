/**
 * 
 */
var profile = function(opt) {
	this.opt = opt;
	this.init = function(){
		var url ='/networking/UserDetails';
		var _this = this;
		$.get(global.serviceUrl + url,{"userId":_this.opt}, function (msg) {
    		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
    			var baseInformation = msg.d.data.baseInformation;
    			var userParticulars = msg.d.data.userParticulars;
    			var userProjects = msg.d.data.userProjects;
    			_this.initBaseInfo(baseInformation);
    			_this.initParticular(userParticulars);
    		}
        });
	};
	this.initBaseInfo = function(data){
		this.container = $(".user-info");
		this.container.find(".user_head img").attr("src",global.server + data.userImage.imageLocation);
		this.container.find(".real_name").val(data.fullName);
	};
	this.initParticular = function(data){
		this.container = $(".data-panel");
		var _this = this;
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
								<select class="in_year"><option>2013</option></select> \
								<select class="in_month"><option>06</option></select> \
								至 \
								<select class="out_year"><option>2014</option></select> \
								<select class="out_month"><option>09</option></select> \
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
			el.find(".company_name").val(data.companyName);
			el.find(".duties").val(data.duties);
			el.find(".still").prop("checked", data.isIn);
			el.find(".introduce").val(data.information);
			el.attr("ref", data.id);
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
				data.Information = el.find(".introduce").val();
				data.id = $(el).attr("ref");
				var url = '/UserInformation/UpdateUserParticulars';
				$.post(global.serviceUrl + url, data, function(msg){
	        		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
	        			readonly();
	        		}
	        	});
			});
			el.find("#editBtn").click(function(){
				edit();
			});
			el.find("#cancelBtn").click(function(){
				readonly();
			});
			
			var readonly = function(){
				el.find("input").attr("readonly","true");
				el.find("textarea").attr("readonly","true");
				el.find("#init").show();
				el.find("#edit").hide();
			};
			var edit = function(){
				el.find("input").removeAttr("readonly");
				el.find("textarea").removeAttr("readonly");
				el.find("#edit").show();
				el.find("#init").hide();
			};
			readonly();
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
		$.get(global.serviceUrl + url,{"userId":_this.opt}, function (msg) {
    		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
    			var userParticulars = msg.d.data;
    			_this.initParticular(userParticulars);
    		}
        });
	};
	this.init();
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
							<select class="in_year"><option>2013</option></select> \
							<select class="in_month"><option>06</option></select> \
							至 \
							<select class="out_year"><option>2014</option></select> \
							<select class="out_month"><option>09</option></select> \
							<label><input type="checkbox" class="still"/>仍然在职</label> \
						</td> \
					</tr> \
					<tr id="introduce"> \
						<td style="vertical-align: top;">个人介绍</td> \
						<td><textarea class="introduce"></textarea></td> \
					</tr> \
					<tr> \
						<td>&nbsp;</td> \
						<td><input id="saveBtn" type="button" value="保存"/>&nbsp;&nbsp;<input type="button" id="cancelBtn" value="取消"/></td> \
					</tr> \
				</table> \
			</div>');
		el.attr("ref","insert");
		el.find("#saveBtn").click(function(){
			var url = '/account/addparticulars';
			var data = {};
			data.userId = global.getUserId();
			data.companyName = el.find(".company_name").val();
			data.duties = el.find(".duties").val();
			data.inDate = el.find(".in_year").val() +"-"+el.find(".in_month").val();
			data.outDate = el.find(".out_year").val() +"-"+el.find(".out_month").val();
			data.isIn = el.find(".still").prop("checked");
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

$(function() {
	profile = new profile(global.getUserId());
});