So.web.login = function () {
    function t(t) {
        e ? t() : $.ajax({
            url: "//jspassport.ssl.qhimg.com/quc6.js",
            dataType: "script",
            cache: !0,
            success: function () {
                e = !0, QHPass.init({
                    src: "pcw_so",
                    signIn: {types: ["normal", "mobile", "qrcode"], hideKeepAlive: !1},
                    signUp: {
                        types: ["mobile", "email"],
                        protocolText: "360\u641c\u7d22\u7528\u6237\u534f\u8bae",
                        protocolUrl: "http://www.so.com/help/help_uagreement.html",
                        privacyText: "360\u641c\u7d22\u9690\u79c1\u534f\u8bae",
                        privacyUrl: "http://www.so.com/help/help_privacy.html",
                        hidePasswordAgain: !1
                    }
                }), t()
            }
        })
    }

    function n(e) {
        QHPass.signIn(function () {
            e && e();
            var t = new Date;
            t.setDate(t.getDate() + 1), t.setHours(0, 0, 0), So.lib.cookie.set("loginrec", 1, {expires: t}), location.reload(!0)
        })
    }

    function r() {
        QHPass.signUp(function () {
            location.reload(!0)
        })
    }

    function i() {
        QHPass.signOut(["so.com"], function () {
            location.reload(!0)
        })
    }

    function s(e) {
        t(function () {
            n(e)
        }, !0)
    }

    function o() {
        t(i, !1)
    }

    function u() {
        $("#user-login").bind("click", function () {
            return t(n), !1
        }), $("#user-reg").bind("click", function () {
            return t(r), !1
        }), So.comm.pid != "home" && $("#user-logout").bind("click", function () {
            return t(i), !1
        })
    }

    var e = !1, a = {
        load: function () {
            $.ajax({
                url: "https://s.ssl.qhimg.com/pkg/quc/qhuc1.1.js?_=v1.1",
                dataType: "script",
                cache: !0,
                success: function () {
                    window.QHUC.on("ready", function (e) {
                        QHUC.getMid() && window.HUID && HUID.setMid(QHUC.getMid()), e && e.qid && !So.comm.user.qid && (a.createBtn(), a.bindEvent())
                    }), window.QHUC.init({src: "pcw_so", needFastSignIn: !0})
                }
            })
        }, controlPop: function () {
            if ($("._uc_").length && So.lib.isVisible1($("._uc_")[0])) a.hidePop(); else {
                QHUC.showPopup($("#header")[0]);
                var e = $("._uc_"), t = $("#user_onekey_login"), n = 0, r = 20;
                So.comm.pid != "home" && (t = $("#hd-rtools .user-group"), n = 20, r = 25), e.hide().slideDown(150).css({
                    left: t.offset().left + t.width() - e.width() + n,
                    top: t.position().top + t.height() + r,
                    position: "absolute",
                    zIndex: 3001
                })
            }
            return So.lib.log("login-onekey", {value: "click"}), !1
        }, hidePop: function () {
            $("._uc_").slideUp(150, function () {
                QHUC.hidePopup()
            })
        }, createBtn: function () {
            var e = $("#user-login");
            e.hide(), $('<a href="http://i.360.cn/login?src=pcw_so&destUrl=' + encodeURIComponent(location.href) + '" id="user_onekey_login">\u4e00\u952e\u767b\u5f55</a>').insertAfter(e).on("click", a.controlPop), So.lib.log("login-onekey", {value: "show"})
        }, bindEvent: function () {
            $(window).on("resize scroll", function () {
                a.hidePop()
            }), $("body").on("click", function (e) {
                $(e.target).closest("._uc_").length == 0 && a.hidePop()
            }), QHUC.on("fastSignIn", function () {
                So.lib.log("login-onekey", {value: "in"}), location.reload()
            }), QHUC.on("other", s)
        }
    };
    return a.load(), u(), {signIn: s, logout: o}
}(), So.web.weather = {
    weatherData: {},
    areaCache: {},
    elments: {},
    storageKey: "soWeather",
    logKey: "soWeather",
    storageObj: new So.web.storage("soWeather", 365),
    storageCustomKey: "soWeatherCustom",
    storageCustom: new So.web.storage("soWeatherCustom", 365),
    areaUrl: "//cdn.weather.hao.360.cn/sed_api_area_query.php",
    oneboxProxy: "https://open.onebox.so.com/api/proxy?__url__=",
    isFirstLoad: !0,
    init: function () {
        var e = new Date, t = "";
        t = e.getMonth() + 1 + "\u6708" + e.getDate() + "\u65e5";
        var n = this, r = n.elments,
            i = ['<div class="bar skin-text skin-text-top"></div>', '   <div class="detail">', '       <a class="seven" href="#" target="_blank">\u672a\u6765\u4e03\u5929\u5929\u6c14</a>', '       <div class="title">' + t + '\uff0d<span class="at"></span><a href="javascript:;" class="change">\u5207\u6362</a></div>', '       <div class="select">', '           <select class="province"></select>', '           <select class="city"></select>', '           <select class="town"></select>', '           <input type="button" class="ok" value="\u66f4\u6362">', "       </div>", '       <div class="curr-day"></div>', '       <div class="list"></div>', '       <i class="g-icon"><i>', "   </div>"],
            s = $("#so_weather").html(i.join("")).show();
        s.find(".skin-text").fadeIn(), r.$bar = s.find(".bar"), r.$detail = s.find(".detail"), r.$change = s.find(".change"), r.$currDay = s.find(".curr-day"), r.$list = s.find(".list"), r.$select = s.find(".select"), r.$province = s.find(".province"), r.$city = s.find(".city"), r.$town = s.find(".town"), r.$seven = s.find(".seven"), r.$at = s.find(".at"), r.$ok = s.find(".ok"), n.getWeatherData(), n.eventBind()
    },
    getWeatherData: function () {
        var e = this, t = e.storageObj.get(e.storageKey) || null, n = e.storageCustom.get(e.storageCustomKey) || null;
        if (!t) n ? e.requestWeatherData(n[0][0] + n[1][0] + n[2][0], n[2][1]) : e.requestWeatherData(); else {
            e.weatherData = t;
            try {
                Math.abs(+(new Date) - t.expires) > 3e5 ? n ? e.requestWeatherData(n[0][0] + n[1][0] + n[2][0], n[2][1]) : e.requestWeatherData() : e.fillWeatherData()
            } catch (r) {
                e.storageObj.remove(e.storageKey)
            }
        }
    },
    requestWeatherData: function (e, t) {
        var n = this, e = e || "", t = t || "";
        setTimeout(function () {
            var r = "//open.onebox.so.com/Dataapi", i = {
                query: e + "\u5929\u6c14",
                type: "weather",
                ip: So.comm.ip,
                src: "soindex",
                d: "pc",
                url: encodeURIComponent("http://cdn.weather.hao.360.cn/sed_api_weather_info.php?app=guideEngine&fmt=json&code=" + t)
            };
            e == "" && t == "" && (i.url = "weather"), $.ajax({
                url: r,
                data: i,
                dataType: "jsonp",
                jsonp: "callback",
                success: function (e) {
                    e && e.weather && e.weather.length && n.formatWeatherData(e)
                }
            })
        })
    },
    formatWeatherData: function (e) {
        var t = this, n = new Date, r = n.getHours(), i = e.weather[0].info, s = e.weather[1].info,
            o = e.weather[2].info, u = e.weather[3].info, a;
        if (!(i && i.night && i.day && s && s.night && s.day && o && o.night && o.day && u && u.day && u.night)) return;
        var f = {
            time: +n,
            area: e.area,
            pm25: "",
            today: {T: "", img: "", desc: "", wind: ""},
            tomorrow: {
                T: s.night[2] + "~" + s.day[2],
                img: "1-" + s.day[0],
                desc: s.day[1],
                date: e.weather[1].date,
                weekNumber: ((new Date).getDay() + 1) % 7
            },
            after: {
                T: o.night[2] + "~" + o.day[2],
                img: "1-" + o.day[0],
                desc: o.day[1],
                date: e.weather[2].date,
                weekNumber: ((new Date).getDay() + 2) % 7
            },
            threeDaysFromNow: {
                T: u.night[2] + "~" + u.day[2],
                img: "1-" + u.day[0],
                desc: u.day[1],
                date: e.weather[3].date,
                weekNumber: ((new Date).getDay() + 3) % 7
            },
            life: {chuanyi: "", yundong: "", ganmao: "", xiche: "", ziwaixian: ""},
            realtime: {T: e.realtime.weather.temperature},
            expires: +n
        };
        e.pm25.pm25 && (f.pm25 = e.pm25.pm25.curPm), r >= 5 && r <= 20 ? (a = 1, f.today.T = i.night[2] + "~" + i.day[2], f.today.img = a + "-" + i.day[0], f.today.desc = i.day[1], f.today.wind = i.day[3] + " " + i.day[4]) : (a = 0, f.today.T = i.night[2], f.today.img = a + "-" + i.night[0], f.today.desc = i.night[1], f.today.wind = i.night[3] + " " + i.night[4]), t.weatherData = f, t.storageObj.set(t.storageKey, f), t.fillWeatherData()
    },
    fillWeatherData: function () {
        var e = this, t = e.weatherData, n = e.elments, r = [], i, s;
        s = e.renderSearchWord(t), r = ['<a class="pos_weather" href="/s?ie=utf-8&src=search_weather&q=' + s + '" target="_blank">', "   <span>" + t.area[2][0] + "\uff1a</span>", "   <span>" + t.today.desc + "&nbsp;" + t.realtime.T + "\u00b0C</span>", "</a>", e.renderPm25QualityHtml(t)], n.$bar.html(r.join("")), n.$at.text(t.area[2][0]), n.$seven.attr("href", "http://tianqi.so.com/weather/" + t.area[2][1]), i = '<a href="/s?ie=utf-8&src=search_weather&q=' + s + '" target="_blank">', n.$list.html(e.renderListHtml(i, t)), n.$currDay.html(e.renderCurrDayHtml(i, t))
    },
    renderSearchWord: function (e) {
        var t = "";
        return e.area[0][0] == e.area[2][0] ? t = encodeURIComponent(e.area[0][0] + "\u5929\u6c14\u9884\u62a5") : t = encodeURIComponent(e.area[0][0] + e.area[2][0] + "\u5929\u6c14\u9884\u62a5"), t
    },
    renderCurrDayHtml: function (e, t) {
        var n = this, r = "", i = n.isFirstLoad ? "data-src" : "src",
            s = So.lib.sslReplace("https://p.ssl.qhimg.com/dm/120_120_/d/inn/3716a4d4/");
        return r = [e, '<img width="60" height="60" ' + i + '="' + s + t.today.img + '.png">', '<div class="curr-day-wrap">', '    <span class="weather">' + t.today.T + "\u00b0C</span>", '    <span class="feature">' + t.today.desc + "</span>", '    <span class="wind">' + t.today.wind + "</span>", "</div></a>"], r.join("")
    },
    renderListHtml: function (e, t) {
        var n = this, r = "", i = n.isFirstLoad ? "data-src" : "src",
            s = So.lib.sslReplace("https://p.ssl.qhimg.com/d/inn/3716a4d4/"), o = t.threeDaysFromNow.date.split("-");
        return r = [e, " <div>\u660e\u5929</div>", " <img " + i + '="' + s + t.tomorrow.img + '.png">', " <div>" + t.tomorrow.desc + "</div>", " <div>" + t.tomorrow.T + "\u00b0C</div>", "</a>", e, " <div>\u540e\u5929</div>", " <img " + i + '="' + s + t.after.img + '.png">', " <div>" + t.after.desc + "</div>", " <div>" + t.after.T + "\u00b0C</div>", "</a>", e, " <div>" + o[1].replace(/^0/gi, "") + "\u6708" + o[2].replace(/^0/gi, "") + "\u65e5</div>", " <img " + i + '="' + s + t.threeDaysFromNow.img + '.png">', " <div>" + t.threeDaysFromNow.desc + "</div>", " <div>" + t.threeDaysFromNow.T + "\u00b0C</div>", "</a>"], r.join("")
    },
    renderPm25QualityHtml: function (e) {
        var t = "", n = "", r = "", i = e.pm25;
        return i != "" && (i > 300 ? (n = 6, r = "\u4e25\u91cd") : i > 200 ? (n = 5, r = "\u91cd\u5ea6") : i > 150 ? (n = 4, r = "\u4e2d\u5ea6") : i > 100 ? (n = 3, r = "\u8f7b\u5ea6") : i > 50 ? (n = 2, r = "\u826f") : i >= 0 && (n = 1, r = "\u4f18"), t = '<a href="/s?ie=utf-8&src=search_weather&q=' + encodeURIComponent(e.area[2][0]) + ' pm2.5" target="_blank"><span><b class="pm25-l pm25-l' + n + '">' + r + "</b></span><span> " + i + "</span></a>"), t
    },
    eventBind: function () {
        var e = this, t = e.elments, n, r, i = !1;
        t.$bar.hover(function () {
            clearTimeout(n), r = setTimeout(function () {
                t.$detail.css({left: (t.$bar.width() - t.$detail.width()) / 2}).fadeIn(300), So.lib.log(e.logKey, {
                    type: "detail",
                    datatype: So.comm.nocard ? "nocard" : "card"
                })
            }, 300), e.isFirstLoad && (So.lib.lazyImg(t.$list), So.lib.lazyImg(t.$currDay), e.isFirstLoad = !1)
        }, function () {
            clearTimeout(r), n = setTimeout(function () {
                t.$detail.fadeOut(300)
            }, 300)
        }), t.$detail.mouseenter(function () {
            clearTimeout(n)
        }).mouseleave(function (e) {
            clearTimeout(r);
            var i = window.event || e;
            if (document.all) {
                if (!i.toElement) return
            } else if (!i.relatedTarget) return;
            n = setTimeout(function () {
                t.$detail.fadeOut(300), t.$select.hide()
            }, 200)
        }), $("body").on("click", function (e) {
            $(e.target).closest("#so_weather .detail").length == 0 && (t.$detail.fadeOut(300), t.$select.hide())
        }), t.$change.on("click", function () {
            e.showArea()
        }), t.$province.on("change", function () {
            e.getCity($(this).val(), "", function (t) {
                e.getTown(t)
            })
        }), t.$city.on("change", function () {
            e.getTown($(this).val())
        }), t.$province.on("mouseleave", function () {
            return !1
        }), t.$city.on("mouseleave", function () {
            return !1
        }), t.$town.on("mouseleave", function () {
            return !1
        }), t.$ok.on("click", function () {
            So.lib.log(e.logKey, {type: "changArea"}), t.$select.hide();
            var n = t.$province.find("option:selected"), r = t.$city.find("option:selected"),
                i = t.$town.find("option:selected"), s = [n.text(), r.text(), i.text()].join(""), o = i.val();
            e.requestWeatherData(s, o);
            var u = [[n.text(), n.val()], [r.text(), r.val()], [i.text(), i.val()]];
            e.storageCustom.set(e.storageCustomKey, u)
        })
    },
    showArea: function () {
        var e = this, t = e.weatherData, n = t.area[0][1], r = t.area[1][1], i = t.area[2][1];
        setTimeout(function () {
            e.getProvince(n), e.getCity(n, r), e.getTown(r, i), e.elments.$select.show()
        }, 20)
    },
    getProvince: function (e) {
        var t = this, n = t.areaCache;
        n.province ? t.fillProvince(n.province, e) : (n.province = [], $.ajax({
            url: t.areaUrl,
            data: {grade: "province", app: "guideEngine"},
            dataType: "jsonp",
            jsonp: "_jsonp",
            success: function (r) {
                !r || (n.province = r, t.fillProvince(r, e))
            }
        }))
    },
    fillProvince: function (e, t) {
        var n = this, r = n.elments.$province, i = [];
        for (var s = 0, o = e.length; s < o; s++) i.push('<option value="' + e[s][1] + '">' + e[s][0] + "</option>");
        r.html(i.join("")), !t || r.val(t)
    },
    getCity: function (e, t, n) {
        var r = this, i = "c" + e, s = r.areaCache;
        s.city || (s.city = {}), s.city[i] ? r.fillCity(s.city[i], t, n) : $.ajax({
            url: r.areaUrl,
            data: {grade: "city", code: e, app: "guideEngine"},
            dataType: "jsonp",
            jsonp: "_jsonp",
            success: function (e) {
                !e || (s.city[i] = e, r.fillCity(e, t, n))
            }
        })
    },
    fillCity: function (e, t, n) {
        var r = this, i = r.elments.$city, s = [];
        for (var o = 0, u = e.length; o < u; o++) s.push('<option value="' + e[o][1] + '">' + e[o][0] + "</option>");
        i.html(s.join("")), !t || i.val(t), n && n(e[0][1])
    },
    getTown: function (e, t) {
        var n = this, r = n.areaCache, i = "t" + e;
        r.town || (r.town = {}), r.town[i] ? n.fillTown(r.town[i], t) : $.ajax({
            url: n.areaUrl,
            data: {grade: "town", code: e, app: "guideEngine"},
            dataType: "jsonp",
            jsonp: "_jsonp",
            success: function (e) {
                !e || (r.town[i] = e, n.fillTown(e, t))
            }
        })
    },
    fillTown: function (e, t) {
        var n = this, r = n.elments.$town, i = [];
        for (var s = 0, o = e.length; s < o; s++) i.push('<option value="' + e[s][1] + '">' + e[s][0] + "</option>");
        r.html(i.join("")), !t || r.val(t)
    }
}, So.web.weather.init(), function () {
    $("body").on("mousedown", "a[href]", function () {
        var e = $(this).attr("href"), t = So.comm.sid || "", n = So.comm.fr || "",
            r = So.comm.monitor && So.comm.monitor.lm_extend || "", i = So.comm.monitor && So.comm.monitor.ls || "",
            s = So.comm.lmsid && So.comm.lmsid || "", o = "", u = "", a = {}, f = {}, l = e.indexOf("#");
        (t != "" || n != "" || i != "" || s != "" || r != "") && /^(https?\:\/\/www\.(so|haosou)\.com)?\/s\?/i.test(e) && (f = So.lib.parseQuery(e), So.newsFlow && So.newsFlow.type == "news" && $(this).closest("#mohe-know_side_nlp") && f.src == "know_side_nlp" && (e = e.replace("src=know_side_nlp", "src=know_side_nlp_new")), t != "" && !f.psid && (a.psid = t), n != "" && !f.fr && (a.fr = n), i != "" && !f.ls && (a.ls = i), s != "" && !f.lmsid && (a.lmsid = s), r != "" && !f.lm_extend && (a.lm_extend = r), $.isEmptyObject(a) || (u = "&" + $.param(a), l > -1 ? o = e.substring(0, l) + u + e.substr(l) : o = e + u, $(this).attr("href", o)))
    })
}();
var HUID = function () {
    function p() {
        var e = w();
        E(e)
    }

    function d() {
        var e = v();
        m(e)
    }

    function v() {
        var e;
        try {
            e = external.GetASC(external.GetSID(window))
        } catch (t) {
        }
        if (!e) try {
            e = window.wdextcmd.GetASC()
        } catch (t) {
        }
        return e
    }

    function m(e) {
        if (e) {
            var t = new Date;
            t.setFullYear(t.getFullYear() + 2), c(n, e, {expires: t, path: "/", domain: a})
        }
    }

    function g() {
        y()
    }

    function y() {
        try {
            external.AppCmd(external.GetSID(window), "", "GetASC2", "", "", function (e, t) {
                b(t)
            })
        } catch (e) {
        }
        try {
            var t = window.wdextcmd.GetASC2();
            b(t)
        } catch (e) {
        }
    }

    function b(e) {
        if (e) {
            var t = new Date;
            t.setFullYear(t.getFullYear() + 2), c(r, e, {expires: t, path: "/", domain: a})
        }
    }

    function w() {
        var e;
        try {
            e = external.GetMID(external.GetSID(window))
        } catch (t) {
        }
        if (!e) try {
            e = window.wdextcmd.GetMid()
        } catch (t) {
        }
        return e || ""
    }

    function E(n) {
        if (n) {
            var r = new Date;
            r.setFullYear(r.getFullYear() + 2), n = x(n), c(t, n, {
                expires: r,
                path: "/",
                domain: a
            }), c(e, n, {expires: r, path: "/", domain: a, SameSite: "None"})
        }
    }

    function S() {
        var e = h(t), n = e.split(".");
        if (n[0] !== "" && n[1] !== "") {
            var r = parseInt(n[1]);
            return n[0].substr(2, r) + n[0].substr(15 + r)
        }
        return ""
    }

    function x(e) {
        var t = 0, n = "", r = +(new Date), i = Math.floor(Math.random() * 15), s = "qihoo360socom";
        while (t < 2) n += s.charAt(Math.floor(Math.random() * 8)), t++;
        return n + e.substring(0, i) + r + e.substring(i) + "." + i
    }

    function T() {
        clearInterval(f), f = setInterval(function () {
            N()
        }, u * 60 * 1e3, !0);
        var e = h(s), t = h(i);
        h(o) && (t || e) ? l(t || e) : N()
    }

    function N() {
        var e = document.createElement("script");
        e.id = "_socomhuid_", e.src = "//socm.dmp.360.cn/HUID.set?_=" + +(new Date), document.body.appendChild(e)
    }

    function C(e) {
        var t = document.getElementById("_socomhuid_");
        t && document.body.removeChild(t);
        if (e["errno"] == 0 && e.huid) {
            var n = new Date;
            n.setFullYear(n.getFullYear() + 2), c(i, e.huid, {
                expires: n,
                path: "/",
                domain: a,
                SameSite: "None"
            }), c(s, e.huid, {expires: n, path: "/", domain: a});
            var r = new Date;
            r.setMinutes(r.getMinutes() + u), c(o, "1", {expires: r}), l(e.huid)
        }
    }

    function k() {
        return h(i) || h(s)
    }

    function L(e) {
        l = e || function () {
        }, p(), T(), d()
    }

    var e = "so_md", t = "__md", n = "__asc", r = "__asc2", i = "so_huid", s = "__huid", o = "gtHuid", u = 10,
        a = "so.com", f = null, l, c = function (e, t, n) {
            n = n || {};
            var r = n.expires, i = n.domain, s = n.path, o = n.SameSite, u = location.protocol == "https:" ? !0 : !1;
            if (!u && o) return;
            document.cookie = e + "=" + encodeURIComponent(t) + (r ? "; expires=" + r.toUTCString() : "") + (i ? "; domain=" + i : "") + (s ? "; path=" + s : "") + (u && o ? "; SameSite=" + o + "; Secure" : "")
        }, h = function (e) {
            var t = document.cookie.split(/\s*;\s*/), n = t.length - 1, r, i, s;
            while (n >= 0) {
                r = t[n].split("="), i = r[0], s = r[1];
                if (i === encodeURIComponent(e)) return decodeURIComponent(s);
                n--
            }
            return ""
        };
    return {init: L, set: C, getMid: w, getHuid: k, setMid: E}
}();
HUID.init(function (e) {
    if (!window.ActiveXObject && !("ActiveXObject" in window)) return;
    var t = So.lib.cookie.get("__md"), n;
    t ? n = "O" + t : e && (n = "H" + e), n && $.getScript("//smart.sug.so.com/setid?_=" + So.comm.t + "&id=" + n)
}), So.lib.sha1 = function () {
    "use strict";

    function h(e) {
        e ? (a[0] = a[16] = a[1] = a[2] = a[3] = a[4] = a[5] = a[6] = a[7] = a[8] = a[9] = a[10] = a[11] = a[12] = a[13] = a[14] = a[15] = 0, this.blocks = a) : this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], this.h0 = 1732584193, this.h1 = 4023233417, this.h2 = 2562383102, this.h3 = 271733878, this.h4 = 3285377520, this.block = this.start = this.bytes = 0, this.finalized = this.hashed = !1, this.first = !0
    }

    var e = {}, t = !e.JS_SHA1_NO_NODE_JS && typeof process == "object" && process.versions && process.versions.node;
    t && (e = global);
    var n = !e.JS_SHA1_NO_COMMON_JS && typeof module == "object" && module.exports,
        r = typeof define == "function" && define.amd, i = "0123456789abcdef".split(""),
        s = [-2147483648, 8388608, 32768, 128], o = [24, 16, 8, 0], u = ["hex", "array", "digest", "arrayBuffer"],
        a = [], f = function (e) {
            return function (t) {
                return (new h(!0)).update(t)[e]()
            }
        }, l = function () {
            var e = f("hex");
            t && (e = c(e)), e.create = function () {
                return new h
            }, e.update = function (t) {
                return e.create().update(t)
            };
            for (var n = 0; n < u.length; ++n) {
                var r = u[n];
                e[r] = f(r)
            }
            return e
        }, c = function (e) {
            var t = require("crypto"), n = require("buffer").Buffer, r = function (r) {
                if (typeof r == "string") return t.createHash("sha1").update(r, "utf8").digest("hex");
                if (r.constructor === ArrayBuffer) r = new Uint8Array(r); else if (r.length === undefined) return e(r);
                return t.createHash("sha1").update(new n(r)).digest("hex")
            };
            return r
        };
    h.prototype.update = function (t) {
        if (this.finalized) return;
        var n = typeof t != "string";
        n && t.constructor === e.ArrayBuffer && (t = new Uint8Array(t));
        var r, i = 0, s, u = t.length || 0, a = this.blocks;
        while (i < u) {
            this.hashed && (this.hashed = !1, a[0] = this.block, a[16] = a[1] = a[2] = a[3] = a[4] = a[5] = a[6] = a[7] = a[8] = a[9] = a[10] = a[11] = a[12] = a[13] = a[14] = a[15] = 0);
            if (n) for (s = this.start; i < u && s < 64; ++i) a[s >> 2] |= t[i] << o[s++ & 3]; else for (s = this.start; i < u && s < 64; ++i) r = t.charCodeAt(i), r < 128 ? a[s >> 2] |= r << o[s++ & 3] : r < 2048 ? (a[s >> 2] |= (192 | r >> 6) << o[s++ & 3], a[s >> 2] |= (128 | r & 63) << o[s++ & 3]) : r < 55296 || r >= 57344 ? (a[s >> 2] |= (224 | r >> 12) << o[s++ & 3], a[s >> 2] |= (128 | r >> 6 & 63) << o[s++ & 3], a[s >> 2] |= (128 | r & 63) << o[s++ & 3]) : (r = 65536 + ((r & 1023) << 10 | t.charCodeAt(++i) & 1023), a[s >> 2] |= (240 | r >> 18) << o[s++ & 3], a[s >> 2] |= (128 | r >> 12 & 63) << o[s++ & 3], a[s >> 2] |= (128 | r >> 6 & 63) << o[s++ & 3], a[s >> 2] |= (128 | r & 63) << o[s++ & 3]);
            this.lastByteIndex = s, this.bytes += s - this.start, s >= 64 ? (this.block = a[16], this.start = s - 64, this.hash(), this.hashed = !0) : this.start = s
        }
        return this
    }, h.prototype.finalize = function () {
        if (this.finalized) return;
        this.finalized = !0;
        var e = this.blocks, t = this.lastByteIndex;
        e[16] = this.block, e[t >> 2] |= s[t & 3], this.block = e[16], t >= 56 && (this.hashed || this.hash(), e[0] = this.block, e[16] = e[1] = e[2] = e[3] = e[4] = e[5] = e[6] = e[7] = e[8] = e[9] = e[10] = e[11] = e[12] = e[13] = e[14] = e[15] = 0), e[15] = this.bytes << 3, this.hash()
    }, h.prototype.hash = function () {
        var e = this.h0, t = this.h1, n = this.h2, r = this.h3, i = this.h4, s, o, u, a = this.blocks;
        for (o = 16; o < 80; ++o) u = a[o - 3] ^ a[o - 8] ^ a[o - 14] ^ a[o - 16], a[o] = u << 1 | u >>> 31;
        for (o = 0; o < 20; o += 5) s = t & n | ~t & r, u = e << 5 | e >>> 27, i = u + s + i + 1518500249 + a[o] << 0, t = t << 30 | t >>> 2, s = e & t | ~e & n, u = i << 5 | i >>> 27, r = u + s + r + 1518500249 + a[o + 1] << 0, e = e << 30 | e >>> 2, s = i & e | ~i & t, u = r << 5 | r >>> 27, n = u + s + n + 1518500249 + a[o + 2] << 0, i = i << 30 | i >>> 2, s = r & i | ~r & e, u = n << 5 | n >>> 27, t = u + s + t + 1518500249 + a[o + 3] << 0, r = r << 30 | r >>> 2, s = n & r | ~n & i, u = t << 5 | t >>> 27, e = u + s + e + 1518500249 + a[o + 4] << 0, n = n << 30 | n >>> 2;
        for (; o < 40; o += 5) s = t ^ n ^ r, u = e << 5 | e >>> 27, i = u + s + i + 1859775393 + a[o] << 0, t = t << 30 | t >>> 2, s = e ^ t ^ n, u = i << 5 | i >>> 27, r = u + s + r + 1859775393 + a[o + 1] << 0, e = e << 30 | e >>> 2, s = i ^ e ^ t, u = r << 5 | r >>> 27, n = u + s + n + 1859775393 + a[o + 2] << 0, i = i << 30 | i >>> 2, s = r ^ i ^ e, u = n << 5 | n >>> 27, t = u + s + t + 1859775393 + a[o + 3] << 0, r = r << 30 | r >>> 2, s = n ^ r ^ i, u = t << 5 | t >>> 27, e = u + s + e + 1859775393 + a[o + 4] << 0, n = n << 30 | n >>> 2;
        for (; o < 60; o += 5) s = t & n | t & r | n & r, u = e << 5 | e >>> 27, i = u + s + i - 1894007588 + a[o] << 0, t = t << 30 | t >>> 2, s = e & t | e & n | t & n, u = i << 5 | i >>> 27, r = u + s + r - 1894007588 + a[o + 1] << 0, e = e << 30 | e >>> 2, s = i & e | i & t | e & t, u = r << 5 | r >>> 27, n = u + s + n - 1894007588 + a[o + 2] << 0, i = i << 30 | i >>> 2, s = r & i | r & e | i & e, u = n << 5 | n >>> 27, t = u + s + t - 1894007588 + a[o + 3] << 0, r = r << 30 | r >>> 2, s = n & r | n & i | r & i, u = t << 5 | t >>> 27, e = u + s + e - 1894007588 + a[o + 4] << 0, n = n << 30 | n >>> 2;
        for (; o < 80; o += 5) s = t ^ n ^ r, u = e << 5 | e >>> 27, i = u + s + i - 899497514 + a[o] << 0, t = t << 30 | t >>> 2, s = e ^ t ^ n, u = i << 5 | i >>> 27, r = u + s + r - 899497514 + a[o + 1] << 0, e = e << 30 | e >>> 2, s = i ^ e ^ t, u = r << 5 | r >>> 27, n = u + s + n - 899497514 + a[o + 2] << 0, i = i << 30 | i >>> 2, s = r ^ i ^ e, u = n << 5 | n >>> 27, t = u + s + t - 899497514 + a[o + 3] << 0, r = r << 30 | r >>> 2, s = n ^ r ^ i, u = t << 5 | t >>> 27, e = u + s + e - 899497514 + a[o + 4] << 0, n = n << 30 | n >>> 2;
        this.h0 = this.h0 + e << 0, this.h1 = this.h1 + t << 0, this.h2 = this.h2 + n << 0, this.h3 = this.h3 + r << 0, this.h4 = this.h4 + i << 0
    }, h.prototype.hex = function () {
        this.finalize();
        var e = this.h0, t = this.h1, n = this.h2, r = this.h3, s = this.h4;
        return i[e >> 28 & 15] + i[e >> 24 & 15] + i[e >> 20 & 15] + i[e >> 16 & 15] + i[e >> 12 & 15] + i[e >> 8 & 15] + i[e >> 4 & 15] + i[e & 15] + i[t >> 28 & 15] + i[t >> 24 & 15] + i[t >> 20 & 15] + i[t >> 16 & 15] + i[t >> 12 & 15] + i[t >> 8 & 15] + i[t >> 4 & 15] + i[t & 15] + i[n >> 28 & 15] + i[n >> 24 & 15] + i[n >> 20 & 15] + i[n >> 16 & 15] + i[n >> 12 & 15] + i[n >> 8 & 15] + i[n >> 4 & 15] + i[n & 15] + i[r >> 28 & 15] + i[r >> 24 & 15] + i[r >> 20 & 15] + i[r >> 16 & 15] + i[r >> 12 & 15] + i[r >> 8 & 15] + i[r >> 4 & 15] + i[r & 15] + i[s >> 28 & 15] + i[s >> 24 & 15] + i[s >> 20 & 15] + i[s >> 16 & 15] + i[s >> 12 & 15] + i[s >> 8 & 15] + i[s >> 4 & 15] + i[s & 15]
    }, h.prototype.toString = h.prototype.hex, h.prototype.digest = function () {
        this.finalize();
        var e = this.h0, t = this.h1, n = this.h2, r = this.h3, i = this.h4;
        return [e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, e & 255, t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, t & 255, n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, n & 255, r >> 24 & 255, r >> 16 & 255, r >> 8 & 255, r & 255, i >> 24 & 255, i >> 16 & 255, i >> 8 & 255, i & 255]
    }, h.prototype.array = h.prototype.digest, h.prototype.arrayBuffer = function () {
        this.finalize();
        var e = new ArrayBuffer(20), t = new DataView(e);
        return t.setUint32(0, this.h0), t.setUint32(4, this.h1), t.setUint32(8, this.h2), t.setUint32(12, this.h3), t.setUint32(16, this.h4), e
    };
    var p = l();
    if (!n) return p;
    module.exports = p
}(), function () {
    "use strict";
    var e = "3.7.2", t = e, n = typeof atob == "function", r = typeof btoa == "function",
        i = typeof Buffer == "function", s = typeof TextDecoder == "function" ? new TextDecoder : undefined,
        o = typeof TextEncoder == "function" ? new TextEncoder : undefined,
        u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", a = Array.prototype.slice.call(u),
        f = function (e) {
            var t = {};
            return e.forEach(function (e, n) {
                return t[e] = n
            }), t
        }(a), l = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/,
        c = String.fromCharCode.bind(String),
        h = typeof Uint8Array.from == "function" ? Uint8Array.from.bind(Uint8Array) : function (e, t) {
            return t === void 0 && (t = function (e) {
                return e
            }), new Uint8Array(Array.prototype.slice.call(e, 0).map(t))
        }, p = function (e) {
            return e.replace(/=/g, "").replace(/[+\/]/g, function (e) {
                return e == "+" ? "-" : "_"
            })
        }, d = function (e) {
            return e.replace(/[^A-Za-z0-9\+\/]/g, "")
        }, v = function (e) {
            var t, n, r, i, s = "", o = e.length % 3;
            for (var u = 0; u < e.length;) {
                if ((n = e.charCodeAt(u++)) > 255 || (r = e.charCodeAt(u++)) > 255 || (i = e.charCodeAt(u++)) > 255) throw new TypeError("invalid character found");
                t = n << 16 | r << 8 | i, s += a[t >> 18 & 63] + a[t >> 12 & 63] + a[t >> 6 & 63] + a[t & 63]
            }
            return o ? s.slice(0, o - 3) + "===".substring(o) : s
        }, m = r ? function (e) {
            return btoa(e)
        } : i ? function (e) {
            return Buffer.from(e, "binary").toString("base64")
        } : v, g = i ? function (e) {
            return Buffer.from(e).toString("base64")
        } : function (e) {
            var t = 4096, n = [];
            for (var r = 0, i = e.length; r < i; r += t) n.push(c.apply(null, e.subarray(r, r + t)));
            return m(n.join(""))
        }, y = function (e, t) {
            return t === void 0 && (t = !1), t ? p(g(e)) : g(e)
        }, b = function (e) {
            if (e.length < 2) {
                var t = e.charCodeAt(0);
                return t < 128 ? e : t < 2048 ? c(192 | t >>> 6) + c(128 | t & 63) : c(224 | t >>> 12 & 15) + c(128 | t >>> 6 & 63) + c(128 | t & 63)
            }
            var t = 65536 + (e.charCodeAt(0) - 55296) * 1024 + (e.charCodeAt(1) - 56320);
            return c(240 | t >>> 18 & 7) + c(128 | t >>> 12 & 63) + c(128 | t >>> 6 & 63) + c(128 | t & 63)
        }, w = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g, E = function (e) {
            return e.replace(w, b)
        }, S = i ? function (e) {
            return Buffer.from(e, "utf8").toString("base64")
        } : o ? function (e) {
            return g(o.encode(e))
        } : function (e) {
            return m(E(e))
        }, x = function (e, t) {
            return t === void 0 && (t = !1), t ? p(S(e)) : S(e)
        }, T = function (e) {
            return x(e, !0)
        }, N = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g, C = function (e) {
            switch (e.length) {
                case 4:
                    var t = (7 & e.charCodeAt(0)) << 18 | (63 & e.charCodeAt(1)) << 12 | (63 & e.charCodeAt(2)) << 6 | 63 & e.charCodeAt(3),
                        n = t - 65536;
                    return c((n >>> 10) + 55296) + c((n & 1023) + 56320);
                case 3:
                    return c((15 & e.charCodeAt(0)) << 12 | (63 & e.charCodeAt(1)) << 6 | 63 & e.charCodeAt(2));
                default:
                    return c((31 & e.charCodeAt(0)) << 6 | 63 & e.charCodeAt(1))
            }
        }, k = function (e) {
            return e.replace(N, C)
        }, L = function (e) {
            e = e.replace(/\s+/g, "");
            if (!l.test(e)) throw new TypeError("malformed base64.");
            e += "==".slice(2 - (e.length & 3));
            var t, n = "", r, i;
            for (var s = 0; s < e.length;) t = f[e.charAt(s++)] << 18 | f[e.charAt(s++)] << 12 | (r = f[e.charAt(s++)]) << 6 | (i = f[e.charAt(s++)]), n += r === 64 ? c(t >> 16 & 255) : i === 64 ? c(t >> 16 & 255, t >> 8 & 255) : c(t >> 16 & 255, t >> 8 & 255, t & 255);
            return n
        }, A = n ? function (e) {
            return atob(d(e))
        } : i ? function (e) {
            return Buffer.from(e, "base64").toString("binary")
        } : L, O = i ? function (e) {
            return h(Buffer.from(e, "base64"))
        } : function (e) {
            return h(A(e), function (e) {
                return e.charCodeAt(0)
            })
        }, M = function (e) {
            return O(D(e))
        }, _ = i ? function (e) {
            return Buffer.from(e, "base64").toString("utf8")
        } : s ? function (e) {
            return s.decode(O(e))
        } : function (e) {
            return k(A(e))
        }, D = function (e) {
            return d(e.replace(/[-_]/g, function (e) {
                return e == "-" ? "+" : "/"
            }))
        }, P = function (e) {
            return _(D(e))
        }, H = function (e) {
            if (typeof e != "string") return !1;
            var t = e.replace(/\s+/g, "").replace(/={0,2}$/, "");
            return !/[^\s0-9a-zA-Z\+/]/.test(t) || !/[^\s0-9a-zA-Z\-_]/.test(t)
        }, B = function (e) {
            return {value: e, enumerable: !1, writable: !0, configurable: !0}
        }, j = function () {
            var e = function (e, t) {
                return Object.defineProperty(String.prototype, e, B(t))
            };
            e("fromBase64", function () {
                return P(this)
            }), e("toBase64", function (e) {
                return x(this, e)
            }), e("toBase64URI", function () {
                return x(this, !0)
            }), e("toBase64URL", function () {
                return x(this, !0)
            }), e("toUint8Array", function () {
                return M(this)
            })
        }, F = function () {
            var e = function (e, t) {
                return Object.defineProperty(Uint8Array.prototype, e, B(t))
            };
            e("toBase64", function (e) {
                return y(this, e)
            }), e("toBase64URI", function () {
                return y(this, !0)
            }), e("toBase64URL", function () {
                return y(this, !0)
            })
        }, I = function () {
            j(), F()
        }, q = {
            version: e,
            VERSION: t,
            atob: A,
            atobPolyfill: L,
            btoa: m,
            btoaPolyfill: v,
            fromBase64: P,
            toBase64: x,
            encode: x,
            encodeURI: T,
            encodeURL: T,
            utob: E,
            btou: k,
            decode: P,
            isValid: H,
            fromUint8Array: y,
            toUint8Array: M,
            extendString: j,
            extendUint8Array: F,
            extendBuiltins: I
        };
    So.lib.Base64 = q
}(), function (e, t) {
    t(e.jQuery)
}(this, function (e) {
    function u(t) {
        if (n.webkit && !t) return {height: 0, width: 0};
        if (!n.data.outer) {
            var r = {
                border: "none",
                "box-sizing": "content-box",
                height: "200px",
                margin: "0",
                padding: "0",
                width: "200px"
            };
            n.data.inner = e("<div>").css(e.extend({}, r)), n.data.outer = e("<div>").css(e.extend({
                left: "-1000px",
                overflow: "scroll",
                position: "absolute",
                top: "-1000px"
            }, r)).append(n.data.inner).appendTo("body")
        }
        return n.data.outer.scrollLeft(1e3).scrollTop(1e3), {
            height: Math.ceil(n.data.outer.offset().top - n.data.inner.offset().top || 0),
            width: Math.ceil(n.data.outer.offset().left - n.data.inner.offset().left || 0)
        }
    }

    function a() {
        var e = u(!0);
        return !e.height && !e.width
    }

    function f(e) {
        var t = e.originalEvent;
        return t.axis && t.axis === t.HORIZONTAL_AXIS ? !1 : t.wheelDeltaX ? !1 : !0
    }

    var t = !1, n = {
        data: {index: 0, name: "scrollbar"},
        macosx: /mac/i.test(navigator.platform),
        mobile: /android|webos|iphone|ipad|ipod|blackberry/i.test(navigator.userAgent),
        overlay: null,
        scroll: null,
        scrolls: [],
        webkit: /webkit/i.test(navigator.userAgent) && !/edge\/\d+/i.test(navigator.userAgent)
    };
    n.scrolls.add = function (e) {
        this.remove(e).push(e)
    }, n.scrolls.remove = function (t) {
        while (e.inArray(t, this) >= 0) this.splice(e.inArray(t, this), 1);
        return this
    };
    var r = {
        autoScrollSize: !0,
        autoUpdate: !0,
        debug: !1,
        disableBodyScroll: !1,
        duration: 200,
        ignoreMobile: !1,
        ignoreOverlay: !1,
        scrollStep: 30,
        showArrows: !1,
        stepScrolling: !0,
        scrollx: null,
        scrolly: null,
        onDestroy: null,
        onInit: null,
        onScroll: null,
        onUpdate: null
    }, i = function (t) {
        n.scroll || (n.overlay = a(), n.scroll = u(), o(), e(window).resize(function () {
            var e = !1;
            if (n.scroll && (n.scroll.height || n.scroll.width)) {
                var t = u();
                if (t.height !== n.scroll.height || t.width !== n.scroll.width) n.scroll = t, e = !0
            }
            o(e)
        })), this.container = t, this.namespace = ".scrollbar_" + n.data.index++, this.options = e.extend({}, r, window.jQueryScrollbarOptions || {}), this.scrollTo = null, this.scrollx = {}, this.scrolly = {}, t.data(n.data.name, this), n.scrolls.add(this)
    };
    i.prototype = {
        destroy: function () {
            if (!this.wrapper) return;
            this.container.removeData(n.data.name), n.scrolls.remove(this);
            var t = this.container.scrollLeft(), r = this.container.scrollTop();
            this.container.insertBefore(this.wrapper).css({
                height: "",
                margin: "",
                "max-height": ""
            }).removeClass("scroll-content scroll-scrollx_visible scroll-scrolly_visible").off(this.namespace).scrollLeft(t).scrollTop(r), this.scrollx.scroll.removeClass("scroll-scrollx_visible").find("div").andSelf().off(this.namespace), this.scrolly.scroll.removeClass("scroll-scrolly_visible").find("div").andSelf().off(this.namespace), this.wrapper.remove(), e(document).add("body").off(this.namespace), e.isFunction(this.options.onDestroy) && this.options.onDestroy.apply(this, [this.container])
        }, init: function (t) {
            var r = this, i = this.container, s = this.containerWrapper || i, o = this.namespace,
                u = e.extend(this.options, t || {}), a = {x: this.scrollx, y: this.scrolly}, l = this.wrapper,
                c = {scrollLeft: i.scrollLeft(), scrollTop: i.scrollTop()};
            if (n.mobile && u.ignoreMobile || n.overlay && u.ignoreOverlay || n.macosx && !n.webkit) return !1;
            if (!l) {
                this.wrapper = l = e("<div>").addClass("scroll-wrapper").addClass(i.attr("class")).css("position", i.css("position") == "absolute" ? "absolute" : "relative").insertBefore(i).append(i), i.is("textarea") && (this.containerWrapper = s = e("<div>").insertBefore(i).append(i), l.addClass("scroll-textarea")), s.addClass("scroll-content").css({
                    height: "auto",
                    "margin-bottom": n.scroll.height * -1 + "px",
                    "margin-right": n.scroll.width * -1 + "px",
                    "max-height": ""
                }), i.on("scroll" + o, function (t) {
                    e.isFunction(u.onScroll) && u.onScroll.call(r, {
                        maxScroll: a.y.maxScrollOffset,
                        scroll: i.scrollTop(),
                        size: a.y.size,
                        visible: a.y.visible
                    }, {
                        maxScroll: a.x.maxScrollOffset,
                        scroll: i.scrollLeft(),
                        size: a.x.size,
                        visible: a.x.visible
                    }), a.x.isVisible && a.x.scroll.bar.css("left", i.scrollLeft() * a.x.kx + "px"), a.y.isVisible && a.y.scroll.bar.css("top", i.scrollTop() * a.y.kx + "px")
                }), l.on("scroll" + o, function () {
                    l.scrollTop(0).scrollLeft(0)
                });
                if (u.disableBodyScroll) {
                    var h = function (e) {
                        f(e) ? a.y.isVisible && a.y.mousewheel(e) : a.x.isVisible && a.x.mousewheel(e)
                    };
                    l.on("MozMousePixelScroll" + o, h), l.on("mousewheel" + o, h), n.mobile && l.on("touchstart" + o, function (t) {
                        var n = t.originalEvent.touches && t.originalEvent.touches[0] || t,
                            r = {pageX: n.pageX, pageY: n.pageY}, s = {left: i.scrollLeft(), top: i.scrollTop()};
                        e(document).on("touchmove" + o, function (e) {
                            var t = e.originalEvent.targetTouches && e.originalEvent.targetTouches[0] || e;
                            i.scrollLeft(s.left + r.pageX - t.pageX), i.scrollTop(s.top + r.pageY - t.pageY), e.preventDefault()
                        }), e(document).on("touchend" + o, function () {
                            e(document).off(o)
                        })
                    })
                }
                e.isFunction(u.onInit) && u.onInit.apply(this, [i])
            } else s.css({
                height: "auto",
                "margin-bottom": n.scroll.height * -1 + "px",
                "margin-right": n.scroll.width * -1 + "px",
                "max-height": ""
            });
            e.each(a, function (t, n) {
                var s = null, l = 1, c = t === "x" ? "scrollLeft" : "scrollTop", h = u.scrollStep, p = function () {
                    var e = i[c]();
                    i[c](e + h), l == 1 && e + h >= d && (e = i[c]()), l == -1 && e + h <= d && (e = i[c]()), i[c]() == e && s && s()
                }, d = 0;
                n.scroll || (n.scroll = r._getScroll(u["scroll" + t]).addClass("scroll-" + t), u.showArrows && n.scroll.addClass("scroll-element_arrows_visible"), n.mousewheel = function (e) {
                    if (!n.isVisible || t === "x" && f(e)) return !0;
                    if (t === "y" && !f(e)) return a.x.mousewheel(e), !0;
                    var s = e.originalEvent.wheelDelta * -1 || e.originalEvent.detail,
                        o = n.size - n.visible - n.offset;
                    if (s > 0 && d < o || s < 0 && d > 0) d += s, d < 0 && (d = 0), d > o && (d = o), r.scrollTo = r.scrollTo || {}, r.scrollTo[c] = d, setTimeout(function () {
                        r.scrollTo && (i.stop().animate(r.scrollTo, 240, "linear", function () {
                            d = i[c]()
                        }), r.scrollTo = null)
                    }, 1);
                    return e.preventDefault(), !1
                }, n.scroll.on("MozMousePixelScroll" + o, n.mousewheel).on("mousewheel" + o, n.mousewheel).on("mouseenter" + o, function () {
                    d = i[c]()
                }), n.scroll.find(".scroll-arrow, .scroll-element_track").on("mousedown" + o, function (o) {
                    if (o.which != 1) return !0;
                    l = 1;
                    var a = {
                        eventOffset: o[t === "x" ? "pageX" : "pageY"],
                        maxScrollValue: n.size - n.visible - n.offset,
                        scrollbarOffset: n.scroll.bar.offset()[t === "x" ? "left" : "top"],
                        scrollbarSize: n.scroll.bar[t === "x" ? "outerWidth" : "outerHeight"]()
                    }, f = 0, v = 0;
                    return e(this).hasClass("scroll-arrow") ? (l = e(this).hasClass("scroll-arrow_more") ? 1 : -1, h = u.scrollStep * l, d = l > 0 ? a.maxScrollValue : 0) : (l = a.eventOffset > a.scrollbarOffset + a.scrollbarSize ? 1 : a.eventOffset < a.scrollbarOffset ? -1 : 0, h = Math.round(n.visible * .75) * l, d = a.eventOffset - a.scrollbarOffset - (u.stepScrolling ? l == 1 ? a.scrollbarSize : 0 : Math.round(a.scrollbarSize / 2)), d = i[c]() + d / n.kx), r.scrollTo = r.scrollTo || {}, r.scrollTo[c] = u.stepScrolling ? i[c]() + h : d, u.stepScrolling && (s = function () {
                        d = i[c](), clearInterval(v), clearTimeout(f), f = 0, v = 0
                    }, f = setTimeout(function () {
                        v = setInterval(p, 40)
                    }, u.duration + 100)), setTimeout(function () {
                        r.scrollTo && (i.animate(r.scrollTo, u.duration), r.scrollTo = null)
                    }, 1), r._handleMouseDown(s, o)
                }), n.scroll.bar.on("mousedown" + o, function (s) {
                    if (s.which != 1) return !0;
                    var u = s[t === "x" ? "pageX" : "pageY"], a = i[c]();
                    return n.scroll.addClass("scroll-draggable"), e(document).on("mousemove" + o, function (e) {
                        var r = parseInt((e[t === "x" ? "pageX" : "pageY"] - u) / n.kx, 10);
                        i[c](a + r)
                    }), r._handleMouseDown(function () {
                        n.scroll.removeClass("scroll-draggable"), d = i[c]()
                    }, s)
                }))
            }), e.each(a, function (e, t) {
                var n = "scroll-scroll" + e + "_visible", r = e == "x" ? a.y : a.x;
                t.scroll.removeClass(n), r.scroll.removeClass(n), s.removeClass(n)
            }), e.each(a, function (t, n) {
                e.extend(n, t == "x" ? {
                    offset: parseInt(i.css("left"), 10) || 0,
                    size: i.prop("scrollWidth"),
                    visible: l.width()
                } : {offset: parseInt(i.css("top"), 10) || 0, size: i.prop("scrollHeight"), visible: l.height()})
            }), this._updateScroll("x", this.scrollx), this._updateScroll("y", this.scrolly), e.isFunction(u.onUpdate) && u.onUpdate.apply(this, [i]), e.each(a, function (e, t) {
                var n = e === "x" ? "left" : "top", r = e === "x" ? "outerWidth" : "outerHeight",
                    s = e === "x" ? "width" : "height", o = parseInt(i.css(n), 10) || 0, a = t.size, f = t.visible + o,
                    l = t.scroll.size[r]() + (parseInt(t.scroll.size.css(n), 10) || 0);
                u.autoScrollSize && (t.scrollbarSize = parseInt(l * f / a, 10), t.scroll.bar.css(s, t.scrollbarSize + "px")), t.scrollbarSize = t.scroll.bar[r](), t.kx = (l - t.scrollbarSize) / (a - f) || 1, t.maxScrollOffset = a - f
            }), i.scrollLeft(c.scrollLeft).scrollTop(c.scrollTop).trigger("scroll")
        }, _getScroll: function (t) {
            var n = {
                advanced: ['<div class="scroll-element">', '<div class="scroll-element_corner"></div>', '<div class="scroll-arrow scroll-arrow_less"></div>', '<div class="scroll-arrow scroll-arrow_more"></div>', '<div class="scroll-element_outer">', '<div class="scroll-element_size"></div>', '<div class="scroll-element_inner-wrapper">', '<div class="scroll-element_inner scroll-element_track">', '<div class="scroll-element_inner-bottom"></div>', "</div>", "</div>", '<div class="scroll-bar">', '<div class="scroll-bar_body">', '<div class="scroll-bar_body-inner"></div>', "</div>", '<div class="scroll-bar_bottom"></div>', '<div class="scroll-bar_center"></div>', "</div>", "</div>", "</div>"].join(""),
                simple: ['<div class="scroll-element">', '<div class="scroll-element_outer">', '<div class="scroll-element_size"></div>', '<div class="scroll-element_track"></div>', '<div class="scroll-bar"></div>', "</div>", "</div>"].join("")
            };
            return n[t] && (t = n[t]), t || (t = n.simple), typeof t == "string" ? t = e(t).appendTo(this.wrapper) : t = e(t), e.extend(t, {
                bar: t.find(".scroll-bar"),
                size: t.find(".scroll-element_size"),
                track: t.find(".scroll-element_track")
            }), t
        }, _handleMouseDown: function (t, n) {
            var r = this.namespace;
            return e(document).on("blur" + r, function () {
                e(document).add("body").off(r), t && t()
            }), e(document).on("dragstart" + r, function (e) {
                return e.preventDefault(), !1
            }), e(document).on("mouseup" + r, function () {
                e(document).add("body").off(r), t && t()
            }), e("body").on("selectstart" + r, function (e) {
                return e.preventDefault(), !1
            }), n && n.preventDefault(), !1
        }, _updateScroll: function (t, r) {
            var i = this.container, s = this.containerWrapper || i, o = "scroll-scroll" + t + "_visible",
                u = t === "x" ? this.scrolly : this.scrollx,
                a = parseInt(this.container.css(t === "x" ? "left" : "top"), 10) || 0, f = this.wrapper, l = r.size,
                c = r.visible + a;
            r.isVisible = l - c > 1, r.isVisible ? (r.scroll.addClass(o), u.scroll.addClass(o), s.addClass(o)) : (r.scroll.removeClass(o), u.scroll.removeClass(o), s.removeClass(o)), t === "y" && (i.is("textarea") || l < c ? s.css({
                height: c + n.scroll.height + "px",
                "max-height": "none"
            }) : s.css({"max-height": c + n.scroll.height + "px"}));
            if (r.size != i.prop("scrollWidth") || u.size != i.prop("scrollHeight") || r.visible != f.width() || u.visible != f.height() || r.offset != (parseInt(i.css("left"), 10) || 0) || u.offset != (parseInt(i.css("top"), 10) || 0)) e.extend(this.scrollx, {
                offset: parseInt(i.css("left"), 10) || 0,
                size: i.prop("scrollWidth"),
                visible: f.width()
            }), e.extend(this.scrolly, {
                offset: parseInt(i.css("top"), 10) || 0,
                size: this.container.prop("scrollHeight"),
                visible: f.height()
            }), this._updateScroll(t === "x" ? "y" : "x", u)
        }
    };
    var s = i;
    e.fn.scrollbar = function (t, r) {
        return typeof t != "string" && (r = t, t = "init"), typeof r == "undefined" && (r = []), e.isArray(r) || (r = [r]), this.not("body, .scroll-wrapper").each(function () {
            var i = e(this), o = i.data(n.data.name);
            if (o || t === "init") o || (o = new s(i)), o[t] && o[t].apply(o, r)
        }), this
    }, e.fn.scrollbar.options = r;
    var o = function () {
        var e = 0, r = 0;
        return function (i) {
            var s, u, a, f, l, c, h;
            for (s = 0; s < n.scrolls.length; s++) {
                f = n.scrolls[s], u = f.container, a = f.options, l = f.wrapper, c = f.scrollx, h = f.scrolly;
                if (i || a.autoUpdate && l && l.is(":visible") && (u.prop("scrollWidth") != c.size || u.prop("scrollHeight") != h.size || l.width() != c.visible || l.height() != h.visible)) f.init(), a.debug && (window.console && console.log({
                    scrollHeight: u.prop("scrollHeight") + ":" + f.scrolly.size,
                    scrollWidth: u.prop("scrollWidth") + ":" + f.scrollx.size,
                    visibleHeight: l.height() + ":" + f.scrolly.visible,
                    visibleWidth: l.width() + ":" + f.scrollx.visible
                }, !0), r++)
            }
            t && r > 10 ? (window.console && console.log("Scroll updates exceed 10"), o = function () {
            }) : (clearTimeout(e), e = setTimeout(o, 300))
        }
    }();
    window.angular && function (e) {
        e.module("jQueryScrollbar", []).provider("jQueryScrollbar", function () {
            var t = r;
            return {
                setOptions: function (n) {
                    e.extend(t, n)
                }, $get: function () {
                    return {options: e.copy(t)}
                }
            }
        }).directive("jqueryScrollbar", ["jQueryScrollbar", "$parse", function (e, t) {
            return {
                restrict: "AC", link: function (n, r, i) {
                    var s = t(i.jqueryScrollbar), o = s(n);
                    r.scrollbar(o || e.options).on("$destroy", function () {
                        r.scrollbar("destroy")
                    })
                }
            }
        }])
    }(window.angular)
}), function () {
    if (So.lib.parseQuery(location.href).from != "pmp" && So.lib.cookie.get("homeopenad") || So.comm.src == "home_360se_xhj") return;
    var e = document.createElement("script");
    e.src = "//static.mediav.com/js/mvf_pmp_lawn.js", e.type = "text/javascript", e.async = "async", e.charset = "utf-8";
    try {
        var t = document.getElementsByTagName("script")[0];
        t.parentElement.insertBefore(e, t);
        var n = function () {
            NEW_LAWN({
                showid: "6BfTrF",
                closeType: "countdown",
                timer: 10,
                position: "leftdown",
                onSuccess: function () {
                    var e = new Date;
                    e.setDate(e.getDate() + 1), e.setHours(0, 0, 0), So.lib.cookie.set("homeopenad", 1, {expires: e})
                },
                onFail: function () {
                }
            })
        };
        e.readyState ? e.onreadystatechange = function () {
            if (e.readyState == "loaded" || e.readyState == "complete") e.onreadystatechange = null, n()
        } : e.onload = function () {
            n()
        }
    } catch (r) {
    }
}(), function () {
    function a(t) {
        var n = new Date;
        n.setFullYear(n.getFullYear() + 10), So.lib.cookie.set(e, t, {
            expires: n,
            path: "/",
            domain: u,
            raw: !0
        }), localStorage && localStorage.setItem(e, +(new Date))
    }

    function f(e) {
        var n = new Date, r = new Date(n.getTime() + 6048e5);
        So.lib.cookie.set(t, e, {expires: r, path: "/", domain: u, raw: !0})
    }

    function l() {
        $.ajax({
            url: o,
            type: "get",
            dataType: "jsonp",
            timeout: 5e3,
            data: {m: i, app: "so", u: s},
            success: function (t) {
                t.errno === 1e3 && (t.data.recls ? a(t.data.recls) : s && n && So.lib.cookie.remove(e, {
                    path: "/",
                    domain: u,
                    raw: !0
                }), t.data.recext && i && f(t.data.recext))
            }
        })
    }

    function c(e) {
        if (!e) return !0;
        var t = e.split(".");
        if (t.length !== 3) return !1;
        var n = t[0], r = t[2], i = t[1];
        if (i.length !== 4) return !1;
        if (!So.lib.Base64.isValid(n)) return !1;
        var s = parseInt(r), o = [];
        try {
            o = So.lib.Base64.toUint8Array(n)
        } catch (u) {
            return !1
        }
        for (var a = 0, f = o.length; a < f; a++) s += parseInt(o[a]);
        var l = (s % 16).toString(16);
        return l === i.split("")[2]
    }

    var e = "recls", t = "recext", n = So.lib.cookie.get(e), r = So.lib.cookie.get(t),
        i = So.lib.getUnMid(So.comm.md) || So.lib.getUnMid(So.lib.cookie.get("__md")), s = So.comm.user.qid,
        o = "https://api.ssl.so.com/v3/srec/get", u = "so.com";
    i && !r && (So.lib.checkAbv(2198, "b") || So.lib.checkAbv(2198, "a")) && l(), r && !c(r) && l(), So.lib.cookie.get("loginrec") && (s && l(), So.lib.cookie.remove("loginrec"))
}();