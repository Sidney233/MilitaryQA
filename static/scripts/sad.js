(function () {
    function i(e) {
        if (!e) return;
        e = e.split(","), window.sadLog = {};
        var t;
        for (var n = 0, r = e.length; n < r; n++) t = "log_" + +(new Date), sadLog[t] = new Image, sadLog[t].onload = sadLog[t].onerror = function () {
            delete sadLog[t]
        }, sadLog[t].src = e[n]
    }

    function s(e) {
        So.lib.isVisible(e.find("a"), !0) && !e.data("imptked") && (i(e.attr("data-imptk")), e.data("imptked", 1))
    }

    function o(e, t, n) {
        return e.replace(/__OFFSET_X__|__OFFSET_Y__|__EVENT_TIME_START__|__EVENT_TIME_END__/g, function (e) {
            return {
                __OFFSET_X__: t.offsetX,
                __OFFSET_Y__: t.offsetY,
                __EVENT_TIME_START__: n,
                __EVENT_TIME_END__: +(new Date)
            }[e]
        })
    }

    function u(n, r) {
        $.ajax({
            url: So.comm.ssl ? "//show-g.mediav.com/s?scheme=https" : "//show.g.mediav.com/s",
            type: "get",
            jsonp: "jsonp",
            dataType: "jsonp",
            data: {type: 1, of: 4, newf: 2, showids: n, uid: So.comm.guid, impct: 1, reqtimes: 1},
            success: function (u) {
                if ($(".gold-wrap").length) return;
                if (u && u.adspaces && u.adspaces[n] && u.adspaces[n].ads && u.adspaces[n].ads.length > 0) {
                    var a = u.adspaces[n].ads[0];
                    a.imptk.push(u.impurl + a.imparg), $("#bd_search").after(So.lib.template(e, $.extend(a, {
                        imgHeight: r,
                        style: r == 100 ? "big" : ""
                    }))).addClass("has-jinju"), setTimeout(function () {
                        var e = $(".gold-wrap"), n;
                        e.find("a").on("mousedown", function () {
                            n = +(new Date)
                        }).on("mouseup", function (r) {
                            var s = $(this);
                            s.attr("href", o(s.attr("data-href"), r, n)), i(o(e.data("clktk"), r, n)), So.lib.log(t, {type: "click"})
                        }), s(e), $(window).on("scroll", function () {
                            s(e)
                        })
                    }, 0), So.lib.log(t, {type: "show"})
                }
            }
        })
    }

    function a() {
        if ($(".gold-wrap").length || $("body").hasClass("skin") || So.lib.browser.isIE() && So.lib.browser.isIE() < 9) return;
        u(r, 100), u(n, 40)
    }

    var e = ['<p class="gold-wrap skin-text <%= style %>" data-imptk="<%= imptk %>" data-clktk="<%= clktk %>">', '<a data-href="<%= curl %>" target="_blank" class="gold">', '<img width="210px" height="<%= imgHeight %>px" title="<%= desc %>" src="<%= img %>">', "<i></i>", "</a>", "</p>"].join(""),
        t = "homesad", n = "qtlTUf", r = "FkBsNx";
    a()
})();