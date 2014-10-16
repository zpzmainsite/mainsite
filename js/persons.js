var dataCardLoader = function(opt) {
	this.container = $(".data-panel");

	var makePersonCards = function(container, opt) {
		this.container = container;
		this.opt = opt;
		
		var _this = this;
		var card = function (data) {
            var el = $('<div class="person-card"> \
                        </div>');
            el.attr({'ref': data.userId});
            el.on('click', function () {
            	
                return false;
            });
            el.find('.btn').on('click', function () {
            	
                return false;
            });
            return el;
        };
        
		var url = '/networking/search';
		
		console.log(global.serviceUrl + url);

		$.get(global.serviceUrl + url, this.opt, function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				$(msg.d.data).each(function (i,j) {
					_this.container.append(card(j));
		        });
			}
		});
	};

	this.container.html(""); // clear
		
	makePersonCards(this.container, opt);
};