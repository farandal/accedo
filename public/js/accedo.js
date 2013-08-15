// JavaScript Document
var Accedo = {
    init: function () {
        this.debugging = true;
        this.debug = function(msg) {
			if(this.debugging) console.log(msg);
	    }
        this.feeds = []; //Feeds loaded dinamically from js/feeds.json
        this.proxy = "google";
        this.data = null;
        this.cur_index = 0;
        this.cur_item = null;
		this.feed_index = 0;
		this.cur_feed = null;
        this.loadFeeds();
        this.maxItemsInNav = 4;
        this.player = "jwplayer";
        this.playerobj = null;
        this.Player.init(this);
		this.state = "items";
		this.keyboardListener(); 
    },
	
    loadFeeds: function () {
        //Load Feeds function is intended to load all feeds in the feeds array, for now, only using the first one on load
		
        this.debug("loadFeeds");
		
		
		var $t = this;
		
		$.getJSON('js/feeds.json', function(data) {
		  var json_feeds = [];
		  $.each(data, function(key, val) {
			json_feeds.push({'name':key,'url':val});
		  });
		  
		  $t.debug(json_feeds);
		  $t.feeds = json_feeds;
		  $t.countFeeds($t.feed_index);
		  $t.previewFeed($t.feed_index);
		  $t.loadRSS($t.feed_index);
		
		});
		
    },
	changeFeed: function() {
		 
		 this.loadRSS(this.feed_index);
		
	},
	previewFeed: function(idx) {
		this.debug(idx);
		this.debug(this.feeds[idx]);
		var feed_name = this.feeds[idx].name;
		$("#feed_name div#text").html(feed_name);
		
		
	},
    loadRSS: function (idx) {
		this.cleanNavBar();
		url = this.feeds[idx].url;
        this.debug("loadRSS");
        switch (this.proxy) {
        case "google":
            this.debug("using google");
            proxy_url = document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(url);
         
			$.ajax({
                context: this,
                url: proxy_url,
                dataType: 'json',
                success: function (data) {
                   this.displayFeed(data.responseData.feed);
                }
            });
            break;
        case "custom":
            //Not implemented, using google as proxy
            this.debug("using custom");
            this.displayFeed([]);
            break;
        }
    },
    displayFeed: function (data) {
        this.data = data;
        this.debug("displayFeed");
        this.populateNavBar();
		this.displayItem(0); //Dispay the first item when the feed is loaded
       
       
    },
	keyboardListener: function() {
	
		var $c = this; //This is not elegant, should improve this, I should not send the context as parameter, just a bug fix.
		$(document).keydown(function (e) {
            
			if (e.keyCode == 37) {
                $c.Controls.left($c);
                return false;
            }
            if (e.keyCode == 38) {
                $c.Controls.up($c);
                return false;
            }
            if (e.keyCode == 39) {
                $c.Controls.right($c);
                return false;
            }
            if (e.keyCode == 40) {
                $c.Controls.down($c);
                return false;
            }
            if (e.keyCode == 13) {
                $c.Controls.enter($c);
                return false;
            }
			
			
        });
		
	},
    displayItem: function (index) {
        //current item
        this.debug("displayItem " + index);
        this.cur_item = this.data.entries[index];
        $("#tit_ctrl").html(this.cur_item.title);
        $("#desc_ctrl").html(this.cur_item.contentSnippet);
        $("#video_desc_ctrl").html(this.cur_item.content);
        this.debug(this.cur_item);
        this.Player.video(this);
    },
    countItems: function () {
        this.debug("countItems "+$(this.data.entries).size());
       
        return $(this.data.entries).size();
    },
	countFeeds: function () {
        this.debug("countFeeds");
        this.debug($(this.feeds).size());
        return $(this.feeds).size();
    },
    populateNavBar: function () {
        //recorrer this.data
        this.debug("populate nav bar");
        this.debug(this.data);
        var $i = 0;
        $.each(this.data.entries, function (key, value) {
            $class = "";
            if ($i == 0) $class = "selected";
            //console.log(value);
            $(".itemlist").append("<li class='item " + $class + "' id='item" + $i + "'><span class='title'>" + value.title + "</span><span class='date'>" + value.publishedDate + "</span></li>");
            $i++;
        });
    },
	cleanNavBar: function () {
        //recorrer this.data
		//this.cur_index = 0;
        $(".itemlist li").remove();
    },
    selectItem: function (i)  {
        $(".itemlist .item").removeClass("selected");
        $(".itemlist #item" + i).addClass("selected");
        delta = Math.abs(this.maxItemsInNav / 2);
        t = 0;
        if (i > delta) {
            t = $(".itemlist #item" + i).height() * (i - delta);
        }
        $(".itemlist").css({
            "top": -t + "px"
        });
        this.debug(t);
    },
    Controls: {
        up: function (ctx) {
            ctx.state = "items";
			ctx.countItems();
			if (ctx.cur_index > 0) ctx.cur_index -= 1;
            ctx.selectItem(ctx.cur_index);
			ctx.debug("cur_index = "+ctx.cur_index);
        },
        down: function (ctx) {
			ctx.state = "items";
            if (ctx.cur_index < ctx.countItems() - 1) ctx.cur_index += 1;
            ctx.selectItem(ctx.cur_index);
			ctx.debug("cur_index = "+ctx.cur_index);
        },
        left: function (ctx) {
			 ctx.state = "feeds";
			 if (ctx.feed_index > 0) ctx.feed_index -= 1;
             ctx.previewFeed(ctx.feed_index);
			 ctx.debug("feed_index = "+ctx.feed_index);
			
		},
        right: function (ctx) {
			 ctx.state = "feeds";
			 if (ctx.feed_index < ctx.countFeeds() - 1) ctx.feed_index += 1;
             ctx.previewFeed(ctx.feed_index);
			 ctx.debug("feed_index = "+ctx.feed_index);
			
		},
        enter: function (ctx) {
			if(ctx.state == "items") ctx.displayItem(ctx.cur_index);
			if(ctx.state == "feeds") ctx.changeFeed(ctx.cur_feed);
			
        },
    },
    Player: {
        video: function (ctx) {
            video = ctx.cur_item;
            switch (ctx.player) {
            case "html5":
                //Not implememented
                break;
            case "jwplayer":
                jwplayer("player").setup({
                    modes: [{
                        type: 'html5'
                    }, {
                        type: 'flash',
                        src: 'http://cdn.cengage.com/js/jwplayer/latest/player.swf'
                    }],
                    height: 360,
                    width: 640,
                    file: video.link,
                }).play();
                break;
            case "jplayer":
                //Not implemented
                break;
            }
        },
        init: function (ctx) {
            switch (ctx.player) {
            case "html5":
                //Not implemented
                break;
            case "jwplayer":
                //Not implementend	  
                break;
            case "jplayer":
                //Not implemented
                break;
            }
        }
    }
};
$(document).ready(function () {
    Accedo.init();
});