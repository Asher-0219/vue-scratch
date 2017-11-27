(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
var v = new Vue({
    el: 'body',
    data: {
        fixed: false,
        uri: 'https://api.xys.ren/interface/html.php',
        // uri: 'http://120.27.194.197/1/206/interface/html.php',
        wait: false,
        ios: false,
        imgs: null,
        hash: '#',
        h: 0,
        scr: 0,
        page: 1,
        bonus: [],
        input: null,
        require: false,
        myCard: null,
        modalShow: 0,
        orBuy: 0,
        mySurplus: 0,
        cardImg: null,
        cardSuccess: 0,
        firstRequire: 0,
        barrageList: null, //中奖列表
        myBarrageList: null,
        cardId: null,
        showRecord: false,
        code: null // 兑换码
    },
    methods: {
        back: function(id) {
            window.open('http://xys/xys_force_back');
        },
        openId: function(id) {
            window.open('xys://xys/goods?goods_id=' + id)
        },
        getMore: function(index) {
            window.location.href = './more.html?index=' + index;
        },
        refresh: function() {
            window.location.reload()
        },
        getId: function(id) {
            var that = this

            if (!that.input) {
                alert("请在App上打开")
                return false
            }

            if (this.wait) return
            this.wait = true
            $.post('https://port.xys.ren/245/interface/shop.php?input=' + that.input, {
                    key: 　id,
                    action: "exchange_package"
                },
                function(e) {
                    that.wait = false;
                    e = JSON.parse(e)
                    if (e.content == "请登录") {
                        alert("请登录,如果已登录,请重新打开App");
                    } else {
                        alert(e.content);
                    }
                }
            )
        },
        post: function(goodsIds, thi) {
            var that = this
            // if (this.wait) return;
            // this.wait = true
            $.post(this.uri, {
                    goodsId: goodsIds,
                    action: 'getGoodslist',
                    num: 3
                },
                function(e) {
                    var pos
                    e = JSON.parse(e)
                    // that.wait = false
                    if (e.status > 0) {
                        for (var j = 0; j < e.info.length; j++) {
                            if (j % 2 == 1) {
                                e.info[j].ou = "padding-left: .11rem;"
                            } else {
                                e.info[j].ou = "padding-right: .11rem;"
                            }
                            thi.push(e.info[j]);
                        }

                        that.$nextTick(function() {
                            that.imgs = $('.box .img')
                            that.imgs.each(function() {
                                pos = this.getBoundingClientRect()
                                if (pos.top < that.h && pos.bottom > 0) {
                                    $(this).attr('src', this.dataset.lazy)
                                }
                            })
                        })
                    }
                }
            )
        },
        post_1: function() {
            var that = this
            if (this.require) return
            if (this.wait) return
            this.wait = true
            $.post(this.uri, {
                    cateId: that.moreGoods.cateId,
                    action: 'showGoodslist',
                    num: 4,
                    page: that.page
                },
                function(e) {
                    var pos
                    e = JSON.parse(e)
                    that.wait = false;
                    $('.loading-more').hide();
                    if (e.status > 0) {
                        if (!e.data.length) {
                            that.require = true;
                            $('#prompt').show();
                        } else {
                            that.page++;
                        }
                        for (var j = 0; j < e.data.length; j++) {
                            if (j % 2 == 1) {
                                e.data[j].ou = "padding-left: .11rem;"
                            } else {
                                e.data[j].ou = "padding-right: .11rem;"
                            }
                            that.moreGoods.goodslist.push(e.data[j]);
                        }
                        if (that.page == 2) {
                            that.scroll();
                        }
                        that.$nextTick(function() {
                            that.imgs = $('.box .img')
                            that.imgs.each(function() {
                                pos = this.getBoundingClientRect()
                                if (pos.top < that.h && pos.bottom > 0) {
                                    $(this).attr('src', this.dataset.lazy)
                                }
                            })
                        })
                    }
                }
            )
        },
        scroll: function() {
            var that = this;
            $(window).scroll(function() {
                if ($(this).scrollTop() + window.innerHeight >= ($('.condom li:last').offset().top) - 300) {
                    if (!that.require) {
                        $('.loading-more').show();
                    }
                    that.post_1();
                }
            });
        },
        getBarrageList: function() {
            var that = this;
            $.post(that.uri + "?input=" + that.input, {
                action: 'twoElevenlist',
                type: 1
            }, function(e) {
                var e = JSON.parse(e)
                console.log(e);
                if (e.status == 1) {
                    that.barrageList = e.data;
                }
            })
        },
        getMyBarrageList: function() {
            var that = this;
            $.post(that.uri + "?input=" + that.input, {
                action: 'twoElevenlist',
                type: 0
            }, function(e) {
                var e = JSON.parse(e)
                console.log(e);
                if (e.status == 1) {
                    that.myBarrageList = e.data;
                }
            })
        },
        seeMyCard: function() {
            var t = this;
            $.post(t.uri + "?input=" + t.input, {
                action: "decChristmasshow"
            }, function(i) {
                i = JSON.parse(i),
                 1 == i.status ? (t.myCard = i.data, t.code = i.code, t.cardSuccess = 0, t.modalShow = !0) : ($(".ch-toast").show(), setTimeout(function() {
                    $(".ch-toast").hide()
                }, 1500))
            })
        },
        autoScroll: function(obj) {
            if (this.barrageList) {
                $(obj).find("ul").animate({
                    marginTop: "-0.31rem"
                }, 500, function() {
                    $(this).css({
                        marginTop: "0px"
                    }).find("li:first").appendTo(this);
                })
            }
        },
        isOrBuy: function() {
            var t = this;
            $.post(t.uri + "?input=" + t.input, {
                action: "twoEleven",
                type: 0
            }, function(i) {
                i = JSON.parse(i), 1 == i.status && (t.mySurplus = i.times);
                if (i.status < 1) {
                    $('.alert').css('display', 'block').delay(1500).queue(function() {
                        $(this).css('display', 'none').dequeue();
                    })
                }
            })
        },
        getAward: function() {
            var t = this;
            t.mySurplus <= 0 || $.post(t.uri + "?input=" + t.input, {
                action: "twoEleven",
                type: 1
            }, function(i) {
                i = JSON.parse(i), 1 == i.status && (--t.mySurplus, t.code = i.code, t.cardId = i.data, $(".sc-area img").attr("src", "img/result" + i.data + ".png"))
            })
        },
        hideModal: function() {
            var that = this
            setTimeout(function() {
                $(".sc-area").wScratchPad("reset")
                that.cardId = null
                that.getBarrageList();
                that.getMyBarrageList();
            }, 5000)
        }
    },
    ready: function() {
        var that = this
        var pos
        var condom = document.querySelector('#condom');
        this.h = window.innerHeight + 100;
        $('body').show();
        setInterval(function() {
            that.autoScroll(".barrage")
        }, 2000);
        $.ajax({
            async: false
        });

        if (/iphone/ig.test(navigator.appVersion)) {
            this.ios = true
        }
        var args = location.search.replace('?', '').split('=');
        if (args[0] == "input") {
            this.input = args[1];
            this.isOrBuy();
            this.getBarrageList();
            this.getMyBarrageList();
        }
        if ($('#index')[0]) {
            setTimeout(function() {
                var t = $("body").css("font-size"),
                    o = 6.31 * t,
                    e = 2.38 * t;
                $(".sc-area").css({
                    width: o,
                    height: e
                });
                $(".sc-area").wScratchPad({
                    bg: "img/ch7.png",
                    fg: "img/ch7.png",
                    size: 20,
                    scratchDown: function(t, o) {
                        that.input && 0 == that.firstRequire && that.mySurplus > 0 && (that.firstRequire = 1, that.getAward())
                    },
                    scratchMove: function(t, o) {
                        that.input && o > 50 && that.firstRequire > 0 && (that.hideModal(),that.isOrBuy() , that.cardSuccess = 1, that.modalShow = !0, that.firstRequire = 0)
                    }
                })
            }, 0)
        };
    }
});