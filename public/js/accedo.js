// JavaScript Document
var Accedo = {
    init: function () {
        this.debug = false;
        if (this.debug) console.log("init");
        this.feeds = ["http://rss.cnn.com/services/podcasting/incaseyoumissed/rss.xml", "http://rss.cnn.com/services/podcasting/ac360/rss.xml"];
        this.proxy = "google";
        this.data = null;
        this.cur_index = 0;
        this.cur_item = null;
        this.loadFeeds();
        this.maxItemsInNav = 4;
        this.player = "jwplayer";
        this.playerobj = null;
        this.Player.init(this);
    },
    loadFeeds: function () {
        //Load Feeds function is intended to load all feeds in the feeds array, for now, only using the first one
        /*The application must read the RSS file for one of ... */
        if (this.debug) console.log("loadFeeds");
        this.loadRSS(this.feeds[0]);
    },
    loadRSS: function (url) {
        if (this.debug) console.log("loadRSS");
        switch (this.proxy) {
        case "google":
            if (this.debug) console.log("using google");
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
            if (this.debug) console.log("using custom");
            this.displayFeed([]);
            break;
        }
    },
    displayFeed: function (data) {
        this.data = data;
        if (this.debug) console.log("displayFeed");
        this.displayItem(this.cur_index); //Dispay the first item when the feed is loaded
        this.populateNavBar();
        var $c = this;
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
        if (this.debug) console.log("displayItem " + index);
        this.cur_item = this.data.entries[index];
        $("#tit_ctrl").html(this.cur_item.title);
        $("#desc_ctrl").html(this.cur_item.contentSnippet);
        $("#video_desc_ctrl").html(this.cur_item.content);
        if (this.debug) console.log(this.cur_item);
        this.Player.video(this);
    },
    countItems: function () {
        if (this.debug) console.log("countItems");
        if (this.debug) console.log($(this.data.entries).size());
        return $(this.data.entries).size();
    },
    populateNavBar: function () {
        //recorrer this.data
        if (this.debug) console.log("populate nav bar");
        if (this.debug) console.log(this.data);
        var $i = 0;
        $.each(this.data.entries, function (key, value) {
            $class = "";
            if ($i == 0) $class = "selected";
            //console.log(value);
            $(".itemlist").append("<li class='item " + $class + "' id='item" + $i + "'><span class='title'>" + value.title + "</span><span class='date'>" + value.publishedDate + "</span></li>");
            $i++;
        });
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
        if (this.debug) console.log(t);
    },
    Controls: {
        up: function (ctx) {
            if (ctx.cur_index > 0) ctx.cur_index = ctx.cur_index - 1;
            ctx.selectItem(ctx.cur_index);
        },
        down: function (ctx) {
            if (ctx.cur_index < ctx.countItems() - 1) ctx.cur_index = ctx.cur_index + 1;
            ctx.selectItem(ctx.cur_index);
        },
        left: function (ctx) {},
        right: function (ctx) {},
        enter: function (ctx) {
            ctx.displayItem(ctx.cur_index);
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