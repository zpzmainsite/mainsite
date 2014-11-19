global.scrollingLoader = {
    index: 0,
    pageSize: 12,
    identify: 0,
    q: '',
    hasNext : true
};

$(function () {

    // load first page
    productCardLoader();

    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() >= 
            $('.content').offset().top + $('.content').height() ) { 

            if ( global.scrollingLoader.identify >= $(window).scrollTop()-100 && global.scrollingLoader.identify <= $(window).scrollTop()+100 ) {

            } else {
                global.scrollingLoader.identify = $(window).scrollTop();

                global.scrollingLoader.index ++;
                productCardLoader();
            }
        }
    });

    $('#q').on('keydown', function (e) {
        if (e.keyCode == 13) {
        	product_reload();
        }
    });
    
    $(".search-bar-button").on('click',function(){
    	product_reload();
    });

    $('.relogin').on('click', function () {
        location.href = "login.html";
    });

    $('.advsrch-trigger').on('click', function () {
        $('.advsrch').animate({
            top: '50px'
        }, 400).addClass('active');
    });
    $('.btn-close').on('click', function () {
        $('.advsrch').animate({
            top: '-220px'
        }, 400).removeClass('active');
    });
    
    $(".product-info-dialog .closebtn").click(function(){
    	Dialog.hide();
    });
});

function product_reload(){
	$('.content dl').html("");
	var keyword = $("#q").val();
	global.scrollingLoader = {
	    index: 0,
	    pageSize: 6,
	    identify: 0,
	    q: keyword,
	    hasNext : true
	};
	productCardLoader();
}

var productCardLoader = function (opt) {

    var makeProductCards = function (datas) {
        var dataToDate = function (data) {
            if (!data) return "";
            var date = new Date(data);
            return date.getFullYear() + '-' + (date.getMonth()*1+1) + '-' + date.getDate();
        };
        var card = function (data) {
            var el = $('<dd class="porduct-card"> \
                            <div class="image"> \
                                <img id="productImage" src="" /> \
                            </div> \
            				<p class="detail" id="productDescription"></p> \
                            <p class="comment"><span id="commentsCount"></span>条评论</p> \
                            <div class="commentFlag"></div> \
            				<div class="focus"><div class="off"></div></div> \
                        </dd>');
            el.find('#productDescription').text(
                data.content ? data.content : ''
            );
            if(data.isFocused){
            	el.find('.focus div').attr("class","on");
            };
            var imageLocation = global.server + data.imageLocation;
            el.find('#productImage').attr({'src': imageLocation});
            el.find('#commentsCount').text(data.productCommentsNumber ? data.productCommentsNumber: 0 );
            el.attr({'ref': data.id});
            el.on('click', function () {
            	makeDetailDialog($(this).attr('ref'));
            });
            el.find('.focus').on('click', function () {
            	if(global.isLogin()){
            		var _btn = $(this).find("div");
                	if(_btn.hasClass("on")){
                		deleteFocus(el, _btn);
                	} else {
                		addFocus(el, _btn);
                	}
            	}else{
            		global.remindLogin();
            	}
                return false;
            });
            return el;
        };

        var addFocus = function(el, btn){
        	var productId = el.attr("ref");
        	var url = '/ProductionUserFocus/AddProductionUserFocus';
        	var data = {
        		"productId" : productId,
        		"userId" : global.getUserId()
        	};
        	$.post(global.serviceUrl + url, data, function (msg) {
    			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
    				btn.attr("class","on");
    			}
			});
        };
        
        var deleteFocus = function(el, btn){
        	var productId = el.attr("ref");
        	var url = '/ProductionUserFocus/DeleteProductionUserFocus';
        	var data = {
        		"productId" : productId,
        		"userId" : global.getUserId()
        	};
        	$.post(global.serviceUrl + url, data, function (msg) {
    			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
    				btn.attr("class","off");
    			}
			});
        };
        

        var pageCount = Math.round(datas.status.totalCount / global.scrollingLoader.pageSize);
        var pageRecordStartAt = global.scrollingLoader.index * global.scrollingLoader.pageSize + 1;
        var pageRecordEndAt = (global.scrollingLoader.index+1) * global.scrollingLoader.pageSize;
        pageRecordEndAt = pageRecordEndAt > datas.status.totalCount ? datas.status.totalCount : pageRecordEndAt;
        console.log( "第["+(global.scrollingLoader.index+1)+"]页，共["+pageCount+"]页，第["+pageRecordStartAt+"]-["+pageRecordEndAt+"]条，共["+datas.status.totalCount+"]条" );
        
        // $('.content dl dd').remove();
        $(datas.data).each(function () {
            $('.content dl').append(card(this));
        });
        $('.endOfPage').show();
        
        if(datas.data.length < global.scrollingLoader.pageSize){
        	global.scrollingLoader.hasNext = false;
        }
    };

    var url = '/ProductInformation/ProductInformation';
    var data = {
		pageIndex : global.scrollingLoader.index,
		pageSize : global.scrollingLoader.pageSize,
		productDescription : global.scrollingLoader.q
    };
    console.log(global.serviceUrl + url);
    
    if(global.scrollingLoader.hasNext){
    	$.get(global.serviceUrl + url, data, function (msg) {
	    	if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
	    		makeProductCards(msg.d);
	    	}
	    });
    }
    
};

var makeDetailDialog = function(id){
	var content = $(".product-info-dialog");
	
	var fillInfoData = function(data){
		var infoContain = content.find(".dialog-left");
		infoContain.find(".info_pic").html("<img src='" + global.server + data.imageLocation + "'/>");
		infoContain.find(".info_content").text(data.content);
		fillavatar(data);
	};
	var fillComments = function(id){
		new Comments({
		    entityType: "Product",
		    entityId: id,
		    content: $('.comments-container'),
		    form: $('.sender-container')
		});
	};
	var fillavatar = function(data){
		var infoContain = content.find(".dialog-left");
		infoContain.find(".author_head img").attr("src", data.avatarUrl);
		infoContain.find(".nickname").text(data.userName);
		var timePassed = moment(data.createdTime).fromNow();
		infoContain.find(".time").text(timePassed+"发布");
		infoContain.find(".comments-num span").text("("+data.productCommentsNumber+")");
	};
//	var createUserInfo = function(userId, userType){
//		if(userType == 'Company'){
//			var url = '/CompanyBaseInformation/GetCompanyBaseInformation?CompanyId='+userId;
//			$.get(global.serviceUrl + url, function (msg) {
//				if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
//					var obj = msg.d.data[0];
//					var name = obj.companyName;
//					var logo = obj.companyLogo;
//				}
//		    });
//		} else {
//			var url = '/account/UserInformation?userId='+userId;
//			$.get(global.serviceUrl + url, function (msg) {
//				if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
//					console.log(msg);
//				}
//		    });
//		}
//	};
	
	var url = '/ProductInformation/ProductInformation?productId=' + id;
	
	$.get(global.serviceUrl + url, function (msg) {
		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
			var data = msg.d.data[0];
			var actives = data.actives;
			fillInfoData(actives);
			fillComments(actives.id);
			Dialog.show();
		}
    });
	
};
var Dialog = {
	"mask" : $(".window-mask"),
	"content" : $(".product-info-dialog"),
	"show" : function(){
		var body = {'height': $("body").outerHeight(), 'width': $("body").outerWidth()};
		var w = body.width<800?800:body.width;
		var left = w/2 - 350;
		this.content.css({"left":left}).show();
		this.mask.css(body).click(function(){
			Dialog.hide();
		}).show();
	},
	"hide" : function(){
		this.content.hide();
		$("#sender-comment-content").val("");
		this.mask.hide();
	}
}
