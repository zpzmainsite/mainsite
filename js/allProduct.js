global.scrollingLoader = {
    index: 0,
    pageSize: 12,
    identify: 0,
    q: global.QueryString.q
};

$(function () {

    // load first page
    productCardLoader(global.scrollingLoader);

    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() >= 
            $('.content').offset().top + $('.content').height() ) { 

            if ( global.scrollingLoader.identify >= $(window).scrollTop()-100 && global.scrollingLoader.identify <= $(window).scrollTop()+100 ) {

            } else {
                global.scrollingLoader.identify = $(window).scrollTop();

                global.scrollingLoader.index ++;
                productCardLoader(global.scrollingLoader);
            }
        }
    });

    $('#q').on('keydown', function (e) {
        if (e.keyCode == 13) {
            console.log($(this).val());
            location.href="?q=" + $(this).val();
            $(this).select();
        }
    }).on('click', function () {
        $(this).select();
    }).focus().val(decodeURIComponent(global.QueryString.q || ''));

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

var productCardLoader = function (opt) {

    var makeProductCards = function (datas) {
        var dataToDate = function (data) {
            if (!data) return "";
            var date = new Date(data);
            return date.getFullYear() + '-' + (date.getMonth()*1+1) + '-' + date.getDate();
        };
        var card = function (data) {
            var el = $('<dd class="porduct-card"> \
                            <p class="detail" id="productDescription"></p> \
                            <div class="image"> \
                                <img id="productImage" src="" /> \
                            </div> \
                            <p class="comment"><span id="commentsCount"></span>条评论</p> \
                            <div class="commentFlag"></div> \
                        </dd>');
            el.find('#productDescription').text(
                data.productDescription ?
                ( data.productDescription.length < 10 ? data.productDescription : (data.productDescription.substring(0, 9) + '...') ) : ''
            );

            var imageLocation = global.server + data.productImageLocation;
            el.find('#productImage').attr({'src': imageLocation});
            el.find('#commentsCount').text(data.productCommentsNumber ? data.productCommentsNumber: 0 );
            el.attr({'ref': data.id});
            el.on('click', function () {
            	makeDetailDialog($(this).attr('ref'));
            });
            el.find('.focus').on('click', function () {
                console.log('focus focus');
            });
            return el;
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
        
        
    };

    var url = '/ProductInformation/ProductInformation?' + 'pageIndex=' + opt.index + '&pageSize=' + opt.pageSize;

    console.log(global.serviceUrl + url);

    $.get(global.serviceUrl + url, function (msg) {
        console.log(msg);
        makeProductCards(msg.d);
    });
    
};

var makeDetailDialog = function(id){
	var content = $(".product-info-dialog");
	
	var fillInfoData = function(data){
		var infoContain = content.find(".dialog-left");
		infoContain.find(".info_pic").html("<img src='" + global.server + data.imageLocation + "'/>");
		infoContain.find(".info_content").text(data.content);
	};
	var fillComments = function(data){
		new Comments({
		    entityType: "Product",
		    entityId: data.id,
		    content: $('.comments-container'),
		    form: $('.sender-container')
		});
	};
	
	var url = '/ProductInformation/ProductInformation?productId=' + id;
	
	$.get(global.serviceUrl + url, function (msg) {
		var data = msg.d.data[0];
		fillInfoData(data.actives);
		fillComments(data.actives);
		Dialog.show();
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
