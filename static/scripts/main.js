var Storage = function (e, t, n) {
    var r = this;
    r.fileName = e || "", r.expiresDay = t || 0, r.isIE = navigator.userAgent.indexOf("MSIE") != -1 && !window.opera, r.isInit = !1, r.target = document.documentElement, r.type = n || "json", r.init()
};
Storage.prototype = {
    init: function () {
        var e = this;
        try {
            !window.localStorage && e.isIE && (e.isInit || (document.documentElement.addBehavior("#default#userdata"), e.isInit = !0))
        } catch (t) {
        }
    }, set: function (e, t, n) {
        var r = this;
        n = n || r.type, n == "json" && (t = JSON.stringify(t));
        try {
            if (window.localStorage) localStorage.setItem(e, t); else if (r.isIE) {
                var i = r.target, s = r.fileName;
                i.load(s), i.setAttribute(e, t), i.expires = (new Date((new Date).getTime() + r.expiresDay * 864e5)).toUTCString(), i.save(s)
            }
        } catch (o) {
        }
    }, get: function (e, t) {
        var n = this;
        t = t || n.type;
        try {
            if (window.localStorage) return t == "json" ? JSON.parse(localStorage.getItem(e)) : localStorage.getItem(e);
            if (n.isIE) {
                var r = n.target, i = n.fileName;
                try {
                    return r.load(i), t == "json" ? JSON.parse(n.target.getAttribute(e)) : n.target.getAttribute(e)
                } catch (s) {
                    return null
                }
            }
        } catch (s) {
        }
    }, remove: function (e) {
        var t = this;
        try {
            if (window.localStorage) localStorage.removeItem(e); else if (t.isIE) {
                var n = t.target, r = t.fileName;
                n.load(r), n.removeAttribute(e), n.expires = (new Date((new Date).getTime() - 1)).toUTCString(), n.save(r)
            }
        } catch (i) {
        }
    }
}, typeof So == "object" && So.web && (So.web.storage = Storage), function () {
    if (typeof window.monitor != "undefined") return;
    var e = "V1.2.2(2012.8.7)", t = "360.cn", n = function (r, s) {
        var o = document, u = navigator, f = r.screen, l = document.domain.toLowerCase(), h = u.userAgent.toLowerCase(),
            p = {
                trim: function (e) {
                    return e.replace(/^[\s\xa0\u3000]+|[\u3000\xa0\s]+$/g, "")
                }
            }, d = {
                on: function (e, t, n) {
                    e.addEventListener ? e && e.addEventListener(t, n, !1) : e && e.attachEvent("on" + t, n)
                }, parentNode: function (e, t, n) {
                    n = n || 5, t = t.toUpperCase();
                    while (e && n-- > 0) {
                        if (e.tagName === t) return e;
                        e = e.parentNode
                    }
                    return null
                }
            }, v = {
                fix: function (e) {
                    if (!("target" in e)) {
                        var t = e.srcElement || e.target;
                        t && t.nodeType == 3 && (t = t.parentNode), e.target = t
                    }
                    return e
                }
            }, m = function () {
                function e(e) {
                    return e != null && e.constructor != null ? Object.prototype.toString.call(e).slice(8, -1) : ""
                }

                return {
                    isArray: function (t) {
                        return e(t) == "Array"
                    }, isObject: function (e) {
                        return e !== null && typeof e == "object"
                    }, mix: function (e, t, n) {
                        for (i in t) if (n || !(e[i] || i in e)) e[i] = t[i];
                        return e
                    }, encodeURIJson: function (e) {
                        var t = [];
                        for (var n in e) {
                            var r = e[n];
                            if (typeof r == "undefined") continue;
                            /^(password|pass|username)$/i.test(n) && (n = "__key__", r = "__val__"), /(password|pass|username)=/i.test(e[n]) && (r = "__val__"), t.push(encodeURIComponent(n) + "=" + encodeURIComponent(r))
                        }
                        return t.join("&")
                    }
                }
            }(), g = {
                get: function (e) {
                    var t, n = new RegExp("(^| )" + e + "=([^;]*)(;|$)");
                    return (t = o.cookie.match(n)) ? unescape(t[2]) : ""
                }, set: function (e, t, n) {
                    n = n || {};
                    var r = n.expires;
                    typeof r == "number" && (r = new Date, r.setTime(r.getTime() + n.expires)), o.cookie = e + "=" + escape(t) + (r ? ";expires=" + r.toGMTString() : "") + (n.path ? ";path=" + n.path : "") + (n.domain ? "; domain=" + n.domain : "")
                }
            }, y = {
                getProject: function () {
                    return ""
                }, getReferrer: function () {
                    return o.referrer
                }, getBrowser: function () {
                    var e = {
                        "360se-ua": "360se",
                        TT: "tencenttraveler",
                        Maxthon: "maxthon",
                        GreenBrowser: "greenbrowser",
                        Sogou: "se 1.x / se 2.x",
                        TheWorld: "theworld"
                    };
                    for (i in e) if (h.indexOf(e[i]) > -1) return i;
                    var t = !1;
                    try {
                        +external.twGetVersion(external.twGetSecurityID(r)).replace(/\./g, "") > 1013 && (t = !0)
                    } catch (n) {
                    }
                    if (t) return "360se-noua";
                    var s = h.match(/(msie|chrome|safari|firefox|opera)/);
                    return s = s ? s[0] : "", s == "msie" && (s = h.match(/msie[^;]+/)), s
                }, getLocation: function () {
                    var e = "";
                    try {
                        e = location.href
                    } catch (t) {
                        e = o.createElement("a"), e.href = "", e = e.href
                    }
                    return e = e.replace(/[?#].*$/, ""), e = /\.(s?htm|php)/.test(e) ? e : e.replace(/\/$/, "") + "/", e
                }, getGuid: function () {
                    function e(e) {
                        var t = 0, n = 0, r = e.length - 1;
                        for (r; r >= 0; r--) {
                            var i = parseInt(e.charCodeAt(r), 10);
                            t = (t << 6 & 268435455) + i + (i << 14), (n = t & 266338304) != 0 && (t ^= n >> 21)
                        }
                        return t
                    }

                    function n() {
                        var t = [u.appName, u.version, u.language || u.browserLanguage, u.platform, h, f.width, "x", f.height, f.colorDepth, o.referrer].join(""),
                            n = t.length, i = r.history.length;
                        while (i) t += i-- ^ n++;
                        return (Math.round(Math.random() * 2147483647) ^ e(t)) * 2147483647
                    }

                    var i = "__guid", s = g.get(i);
                    if (!s) {
                        s = [e(o.domain), n(), +(new Date) + Math.random() + Math.random()].join(".");
                        var a = {expires: 2592e7, path: "/", domain: ".so.com"};
                        if (t) {
                            var c = "." + t;
                            if (l.indexOf(c) > 0 && l.lastIndexOf(c) == l.length - c.length || l == c) a.domain = c
                        }
                        g.set(i, s, a)
                    }
                    return function () {
                        return s
                    }
                }(), getCount: function () {
                    var e = "count", t = g.get(e);
                    return t = (parseInt(t) || 0) + 1, g.set(e, t, {expires: 864e5, path: "/"}), function () {
                        return t
                    }
                }(), getFlashVer: function () {
                    var e = -1;
                    if (u.plugins && u.mimeTypes.length) {
                        var t = u.plugins["Shockwave Flash"];
                        t && t.description && (e = t.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s)+r/, ".") + ".0")
                    } else if (r.ActiveXObject && !r.opera) for (var n = 16; n >= 2; n--) try {
                        var i = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + n);
                        if (i) {
                            var s = i.GetVariable("$version");
                            e = s.replace(/WIN/g, "").replace(/,/g, ".")
                        }
                    } catch (o) {
                    }
                    return e = parseInt(e, 10), function () {
                        return e
                    }
                }(), getContainerId: function (e) {
                    var t = E.areaIds;
                    if (t) {
                        var n, r = new RegExp("^(" + t.join("|") + ")$", "ig");
                        while (e) {
                            if (e.id && r.test(e.id)) return (e.getAttribute("data-desc") || e.id).substr(0, 100);
                            e = e.parentNode
                        }
                    }
                    return ""
                }, getText: function (e) {
                    return p.trim((e.getAttribute("text") || e.innerText || e.textContent || e.title || "").substr(0, 100))
                }
            }, w = {
                getBase: function () {
                    return {p: y.getProject(), u: y.getLocation(), id: y.getGuid(), guid: y.getGuid()}
                }, getTrack: function () {
                    return {b: y.getBrowser(), c: y.getCount(), r: y.getReferrer(), fl: y.getFlashVer()}
                }, getClick: function (e) {
                    e = v.fix(e || event);
                    var t = e.target, n = t.tagName, r = y.getContainerId(t);
                    if (t.type != "submit") {
                        if (n == "AREA") return {f: t.href, c: "area:" + t.parentNode.name, cId: r};
                        var i, s;
                        return n == "IMG" && (i = t), t = d.parentNode(t, "A"), t ? (s = y.getText(t), {
                            f: t.href,
                            c: s ? s : i.src.match(/[^\/]+$/),
                            cId: r
                        }) : !1
                    }
                    var o = d.parentNode(t, "FORM");
                    if (o) {
                        var u = o.id || "", a = t.id, f = {f: o.action, c: "form:" + (o.name || u), cId: r};
                        if ((u == "search-form" || u == "searchForm") && (a == "searchBtn" || a == "search-btn")) {
                            var l = S("kw") || S("search-kw") || S("kw1");
                            f.w = l ? l.value : ""
                        }
                        return f
                    }
                }, getKeydown: function (e) {
                    e = v.fix(e || event);
                    if (e.keyCode != 13) return !1;
                    var t = e.target, n = t.tagName, r = y.getContainerId(t);
                    if (n == "INPUT") {
                        var i = d.parentNode(t, "FORM");
                        if (i) {
                            var s = i.id || "", o = t.id, u = {f: i.action, c: "form:" + (i.name || s), cId: r};
                            if (o == "kw" || o == "search-kw" || o == "kw1") u.w = t.value;
                            return u
                        }
                    }
                    return !1
                }
            }, E = {trackUrl: null, clickUrl: null, areaIds: null}, S = function (e) {
                return document.getElementById(e)
            };
        return {
            version: e, util: y, data: w, config: E, sendLog: function () {
                return r.__monitor_imgs = {}, function (e) {
                    var t = "log_" + +(new Date), n = r.__monitor_imgs[t] = new Image;
                    n.onload = n.onerror = function () {
                        r.__monitor_imgs[t] = null, delete r.__monitor_imgs[t]
                    }, n.src = e
                }
            }(), buildLog: function () {
                var e = "";
                return function (t, n) {
                    if (t === !1) return;
                    t = t || {};
                    var r = w.getBase();
                    t = m.mix(r, t, !0);
                    var i = m.encodeURIJson(t);
                    if (i == e) return;
                    e = i, setTimeout(function () {
                        e = ""
                    }, 500), i += "&t=" + +(new Date), n = n.indexOf("?") > -1 ? n + "&" + i : n + "?" + i, this.sendLog(n)
                }
            }(), log: function (e, t) {
                t = t || "click";
                var n = E[t + "Url"];
                n || alert("Error : the " + t + "url does not exist!"), this.buildLog(e, n)
            }, setConf: function (e, t) {
                var n = {};
                return m.isObject(e) ? n = e : n[e] = t, this.config = m.mix(this.config, n, !0), this
            }, setUrl: function (e) {
                return e && (this.util.getLocation = function () {
                    return e
                }), this
            }, setProject: function (e) {
                return e && (this.util.getProject = function () {
                    return e
                }), this
            }, setId: function () {
                var e = [], t = 0, n;
                while (n = arguments[t++]) m.isArray(n) ? e = e.concat(n) : e.push(n);
                return this.setConf("areaIds", e), this
            }, getTrack: function () {
                var e = this.data.getTrack();
                return this.log(e, "track"), this
            }, getClickAndKeydown: function () {
                var e = this;
                return d.on(o, "click", function (t) {
                    var n = e.data.getClick(t);
                    e.log(n, "click")
                }), d.on(o, "keydown", function (t) {
                    var n = e.data.getKeydown(t);
                    e.log(n, "click")
                }), n.getClickAndKeydown = function () {
                    return e
                }, this
            }
        }
    }(window);
    n.setConf({
        trackUrl: "//s.360.cn/w360/s.htm",
        clickUrl: "//s.360.cn/w360/c.htm",
        wpoUrl: "//s.360.cn/w360/p.htm"
    }), window.monitor = n
}(), function () {
    function n(e) {
        this.url = e.url, this.mid = "", this.huid = "", this.suggest = null, this.whichPage = null, this.historyData = null, this.displaying = !1, this.canceled = !1, this.enableShow = !0, this.isPrivacyMode = !1
    }

    function g(e) {
        var t = "";
        return e.length == 0 ? "" : (t = e.replace(/&/g, "&amp;"), t = t.replace(/</g, "&lt;"), t = t.replace(/>/g, "&gt;"), t = t.replace(/\'/g, "&#39;"), t = t.replace(/\"/g, "&quot;"), t)
    }

    function y(e) {
        i(this, e), this.render()
    }

    function b(e) {
        var t = !1;
        for (var n = 0; n < e.length; n++) if (e.charCodeAt(n) > 255) {
            t = !0;
            break
        }
        return t
    }

    function w(e, t) {
        var n = !1;
        for (var r = 0, i = e.length; r < i; r++) if (e[r] == t) {
            n = !0;
            break
        }
        return n
    }

    function E(t) {
        if (!(T.localSave && So.lib.soLocalStorage && !C.isPrivacyMode)) return [];
        var n = So.lib.soLocalStorage.getItem(e);
        if (n) try {
            n = JSON.parse(n)
        } catch (r) {
            n = []
        } else n = [];
        var i = $.trim(t).toLowerCase(), s = [];
        for (var o = 0, u = n.length; o < u; o++) {
            var a = "", f = "";
            try {
                a = decodeURIComponent(n[o].word).toLowerCase(), f = n[o].pinyin && decodeURIComponent(n[o].pinyin.toLowerCase()) || ""
            } catch (r) {
            }
            if (a.indexOf(i) == 0 || f.indexOf(i) == 0) {
                n[o].word = a.replace(/[<>]/g, ""), s.push(n[o]);
                if (s.length == 4) break
            }
        }
        return s
    }

    function A(e) {
        $.ajax({
            url: "//smart.sug.so.com/translate-query",
            method: "POST",
            dataType: "JSONP",
            jsonpCallback: "trans",
            data: {query: $.trim(So.comm.q)}
        }).success(function (t) {
            t && t.data ? e(t.data) : e(null)
        })
    }

    function O() {
        var e = $.trim(So.comm.q);
        b(e) ? A(M) : M(null)
    }

    function M(t) {
        if (T && T.localSave && So.lib.soLocalStorage && typeof JSON != "undefined" && So.web.savesug == 1) {
            var n = $.trim(So.comm.q), r = /[^\x00-\xff]/g;
            if (n.replace(r, "mm").length <= 2 || n.replace(r, "mm").length > 40) return;
            n = encodeURIComponent(n);
            var i = C.getHistoryData(), s = !1, o = 0;
            $.each(i, function (e, t) {
                t.word.toLowerCase() == n.toLowerCase() && (s = !0, o = e)
            }), s && i.splice(o, 1);
            var u = {};
            t && (u = {pinyin: encodeURIComponent(t)}), i.unshift($.extend(u, {word: n})), i.length > 100 && i.pop(), So.lib.soLocalStorage.setItem(e, JSON.stringify(i)), C.addHistoryDataId()
        }
    }

    var e = "sosug", t = [];
    n.prototype = {
        loadData: function (e) {
            var t = this;
            T.localSave && !t.isPrivacyMode && So.lib.cookie.get("sosug") !== "0" && (t.historyData = t.getHistoryData(), t.historyData = t.historyData.splice(0, 10), t.historyData && (t.render(), e && e()))
        }, setOptions: function (e) {
            this.whichPage = e.whichPage || 0, this.mid = e.mid, this.huid = e.huid
        }, setSuggest: function (e) {
            this.suggest = e
        }, addHistoryDataId: function () {
            var t = this;
            if (!So.lib.soLocalStorage) return;
            var n = So.lib.soLocalStorage.getItem(e);
            n ? n = JSON.parse(n) : n = [];
            for (var r = 0, i = n.length; r < i; r++) if (typeof n[r].id == "undefined") {
                var s = +(new Date);
                n[r].id = r + s.toString()
            }
            So.lib.soLocalStorage.setItem(e, JSON.stringify(n))
        }, getHistoryData: function () {
            var t = [];
            if (So.lib.soLocalStorage) {
                t = So.lib.soLocalStorage.getItem(e);
                if (t) try {
                    t = JSON.parse(t)
                } catch (n) {
                    t = []
                } else t = []
            }
            return t
        }, render: function () {
            var e = this, t = this.suggest, n = "", r = e.whichPage == 1 ? So.comm.sid || "" : "";
            data = e.historyData || [], e.displaying = !0;
            for (var i = 0, s = data.length; i < s; i++) {
                var o = data[i], u = o.id || "", a = g(decodeURIComponent(o.word));
                n += '<li class="local" unselectable="on" ac_index="' + i + '" acvalue="' + a + '" ac_psid="' + r + '" ac_ext="" data-delid="' + u + '" data-type="local-sug-store"><a href="javascript:;" unselectable="on" title="\u5728\u53f3\u4e0a\u89d2\u8bbe\u7f6e\u4e2d\u53ef\u5173\u95ed\u641c\u7d22\u5386\u53f2\u8bb0\u5f55\u54e6~" class="del">\u5220\u9664</a>' + a + "</li>"
            }
            n != "" ? (t.oMenu.innerHTML = n, t.oMenu.setAttribute("ac_word", ""), t.oMenu.setAttribute("ver", ""), t.oMenu.setAttribute("ssid", ""), t.selectedIndex = -2, t.show(), e.historyData && t.sugStorageDel(), So.lib.log("suggest-log", {type: "history-show"})) : (t.oMenu.innerHTML = n, t.hide(), t.selectedIndex = -2)
        }, hide: function () {
            this.suggest.hide(), this.displaying = !1
        }, cancel: function (e) {
            this.canceled = e, e && this.displaying && this.hide()
        }
    };
    var r = function (e) {
        var t = document.getElementsByTagName("head")[0] || document.documentElement,
            n = document.createElement("script"), r = !1;
        n.src = e, n.charset = "utf-8", n.onerror = n.onload = n.onreadystatechange = function () {
            !r && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") && (r = !0, t.removeChild(n))
        }, t.insertBefore(n, t.firstChild)
    }, i = function (e, t) {
        for (var n in t) e[n] = t[n];
        return e
    }, s = function (e, t) {
        return i(document.createElement(e), t)
    }, o = function (e) {
        return e = e || window.event, e.target || e.srcElement
    }, u = function (e) {
        return e = e || window.event, e.which || e.keyCode || e.charCode
    }, a = function (e) {
        e = e || window.event, e.preventDefault && e.preventDefault() || (e.returnValue = !1), e.stopPropagation && e.stopPropagation()
    }, f = function (e, t) {
        return (new RegExp("(?:^|\\s)" + t + "(?:\\s|$)", "i")).test(e.className)
    }, l = function (e, t) {
        f(e, t) || (e.className = (e.className + " " + t).replace(/^\s+|\s+$/g, ""))
    }, c = function (e, t) {
        f(e, t) && (e.className = e.className.replace(new RegExp("(?:\\s|^)" + t + "(?:\\s|$)", "i"), " ").replace(/^\s+|\s+$/g, ""))
    }, h = function (e, t, n) {
        do if (e.tagName == t) return e; while (e != n && (e = e.parentNode));
        return null
    }, p = function (e, t, n) {
        e.addEventListener ? e.addEventListener(t, n, !1) : e.attachEvent("on" + t, n)
    }, d = function (e, t, n) {
        var r = e.split("://");
        r.shift();
        var i = parseInt(T.width) - t.length * 15 - 5 - (n ? 16 : 29) - 15, s = r.join("");
        return s.charAt(s.length - 1) == "/" && (s = s.substr(0, s.length - 1)), s.length * 7 > i && (s = s.substr(0, Math.floor(i / 7) - 2) + ".."), s
    }, v = function (e) {
        return e.length > 3 || e.length > 1 && /[\u4e00-\u9fa5]/.test(e) ? !0 : !1
    }, m = /msie/i.test(navigator.userAgent);
    y.prototype = {
        width: 0,
        oText: null,
        itemsData: null,
        oMenu: null,
        oWrap: null,
        selectedIndex: -2,
        filteredValue: "",
        filteringValue: "",
        acValue: "",
        closed: !1,
        showCount: 0,
        isCreateWidth: !0,
        focusByClick: !1,
        show: function () {
            var e = $.trim(this.oText.value);
            (this.options.enableHotword || e) && this.oMenu.childNodes.length && (window.sugIsShow || (this.oWrap.style.display = "", this.closed = !1, l(this.oPos, "sug-border")), window.sugIsShow = undefined)
        },
        hide: function (e) {
            typeof this.beforeHide == "function" && this.beforeHide(), this.oWrap.style.display = "none", this.closed = !0, c(this.oPos, "sug-border"), C.displaying = !1
        },
        refreshItems: function (e) {
            var t = this, n = $.trim(this.oText.value), r = t.itemsData;
            if (n != t.query) return;
            if (r && !r.__isItemsDataRendered || e) {
                var i = [], s = Math.min(t.showCount, r.length);
                for (var o = 0; o < s; o++) {
                    var u = "";
                    C.whichPage == 1 && (u = So.comm.sid || "");
                    var a = "";
                    r[o].id && r[o].id != "0" && r[o].id != "-1" && (a = r[o].id), r[o].type == "history" ? i.push('<li unselectable="on" class="local" ac_index="' + o + '" acValue="' + r[o].sVal + '" ac_psid="' + u + '" ac_source="' + r[o].source + '" ac_eci="' + r[o].eci + '" ac_ext="' + r[o].ext + '" data-delid="' + a + '" data-type="local"><a href="javascript:;" unselectable="on" class="del" title="\u5728\u53f3\u4e0a\u89d2\u8bbe\u7f6e\u4e2d\u53ef\u5173\u95ed\u641c\u7d22\u5386\u53f2\u8bb0\u5f55\u54e6~">\u5220\u9664</a>' + r[o].sTitle + "</li>") : i.push('<li unselectable="on" ac_resrc="' + r[o].resrc + '" ac_psid="' + u + '" ac_source="' + r[o].source + '" ac_eci="' + r[o].eci + '" ac_ext="' + r[o].ext + '" ac_index="' + o + '" acValue="' + r[o].sVal + '"><span unselectable="on">' + r[o].sTitle + "</span></li>")
                }
                t.oMenu.innerHTML = i.join(""), t.oMenu.setAttribute("ac_word", t.query), t.oMenu.setAttribute("ver", t.version), t.oMenu.setAttribute("ssid", t.ssid), r.length ? t.show() : t.hide(), t.filteredValue = t.filteringValue, t.acValue = "", t.selectedIndex = -2, r.__isItemsDataRendered = !0, t.findStorageDel()
            }
        },
        findStorageDel: function () {
            var e = this;
            $(e.oMenu).find(".local a").on("click", function (t) {
                var n = $(this).parent(".local"), r = $.trim(S.value), i = (So.comm.sid || "") + r;
                delete x[i], e.delStorage(n.attr("acvalue"), n.data("delid")), e.refreshData(), a(t), So.lib.log("suggest-log", {type: "typing-sug-dele"})
            }), $(e.oMenu).find(".local a").on("mousedown", function (e) {
                a(e)
            })
        },
        sugStorageDel: function () {
            var e = this;
            $(e.oMenu).find(".local a").on("click", function (t) {
                var n = $(this).parent(".local");
                e.delStorage(n.attr("acvalue"), n.data("delid")), C.loadData(), a(t), So.lib.log("suggest-log", {type: "sug-dele"}), $('.ac_wrap [data-type="local-sug-store"]').length == 0 && $(".ac_wrap .bottom-tool").hide()
            })
        },
        delStorage: function (n, r) {
            if (!n) return;
            w(t, n) || t.push(n);
            var i = C.getHistoryData();
            n = encodeURIComponent(n);
            for (var s = 0, o = i.length; s < o; s++) r && i[s] && i[s].id && r == i[s].id ? i.splice(s, 1) : i[s] && i[s].word.toLowerCase() == n.toLowerCase() && i.splice(s, 1);
            So.lib.soLocalStorage.setItem(e, JSON.stringify(i))
        },
        delRequest: function (e, t) {
            var n = "//sug.so.360.cn/suggest_del", r = {
                src: So.comm.pid == "home" ? "so_home" : "srp_suggst",
                encodein: "utf-8",
                encodeout: "utf-8",
                format: "json",
                mid: this.options.mid,
                huid: this.options.huid,
                del_words: e
            };
            $.ajax({url: n, data: r, dataType: "jsonp"}).success(function (e) {
                console.log(e)
            })
        },
        setSelectedIndex: function (e, t) {
            var n = this, r = n.oMenu.childNodes;
            if (r.length) {
                n.selectedIndex > -1 && c(r[n.selectedIndex], "selected"), e = (e + r.length + 2) % (r.length + 2);
                if (e == r.length) n.acValue = n.oText.value = n.filteringValue, n.acValue = $.trim(n.acValue), e = -2; else {
                    if (e == r.length + 1) return n.setSelectedIndex(-2 - n.selectedIndex, t), !1;
                    n.acValue = n.oText.value = r[e].getAttribute("acValue"), n.acValue = $.trim(n.acValue), l(r[e], "selected")
                }
            } else e = -2;
            n.selectedIndex = e
        },
        render: function () {
            function b() {
                if (E) return !1;
                var t = $.trim(r.value),
                    n = e.options.enableHotword && (!e.options.clickEmptyToTriggerHotword || e.focusByClick);
                n && C.cancel(t && t != e.acValue);
                var i = $(".ac_wrap .bottom-tool");
                t ? (t != e.filteredValue && t != e.filteringValue && t != e.acValue && (e.filteringValue = t, e.refreshData()), e.itemsData && e.refreshItems(), y != 40 && y != 38 && i.hide()) : (e.acValue = e.filteringValue = e.filteredValue = "", n && C.enableShow ? C.displaying || C.loadData(function () {
                    So.lib.cookie.get("sosug") !== "0" && C.getHistoryData().length > 0 && (i.length == 0 ? ($('<div class="bottom-tool"><a unselectable="on" href="javascript:;" id="clear_history">\u5220\u9664\u5386\u53f2</a></div>').appendTo(".ac_wrap_inner"), $("#clear_history").on("click", function () {
                        $(".ac_wrap .bottom-tool").hide(), clearSugStorage(), $(".ac_wrap .ac_menu").html(""), e.hide()
                    })) : i.show())
                }) : e.hide())
            }

            function w(t) {
                e.closed && e.show(), clearInterval(e._refreshTimer), e._refreshTimer = setInterval(b, 100)
            }

            var e = this;
            if (e._rendered) return;
            e._rendered = !0;
            var t = '<div class="ac_wrap_inner"><div class="ac_menu_ctn"><ul class="ac_menu"></ul><div class="so_feedback"><a href="javascript:;" target="_blank" class="so_feedback_link" data-class="ac_menu"><span class="so_feedback_icon"></span><span class="so_feedback_txt">\u53cd\u9988</span></a></div></div></div>';
            /msie[ \/os]*6\./ig.test(navigator.userAgent) && (t = '<iframe class="ac_bgIframe" frameBorder="0"></iframe>' + t);
            var n = s("div", {className: "ac_wrap", innerHTML: t.replace(/(<\w+)/g, '$1 unselectable="on"')}),
                r = e.oText, i = e.oPos || r;
            i.parentNode.insertBefore(n, i);
            var f = e.oMenu = n.getElementsByTagName("ul")[0];
            r.setAttribute("autoComplete", "off");
            var d = 0, v = 0;
            if (So.lib.checkAbv(1112, "UI_2") || So.lib.checkAbv(1112, "UI_3")) d = 2, v = -1;
            if (e.isCreateWidth) {
                var g = d + (e.oText.getAttribute("suggestWidth") || i.offsetWidth) + "px";
                m ? n.style.width = g : n.style.minWidth = g
            }
            n.style.top = i.offsetHeight - 1 + v + "px", n.style.left = i.offsetLeft + "px", e.oWrap = n, e.width = g, e.hide(), p(e.oText, "click", function (t) {
                C.enableShow = !0, e.show()
            });
            var y = "";
            p(e.oText, "keydown", function (t) {
                var r = 0;
                y = u(t), C.enableShow = !0;
                switch (y) {
                    case 40:
                        r = 1;
                        break;
                    case 38:
                        r = -1;
                        break;
                    case 27:
                        C.enableShow = !1, e.closed || (e.hide(), a(t));
                        break;
                    case 13:
                }
                r && (a(t), n.style.display == "none" ? e.show() : e.setSelectedIndex(e.selectedIndex + r))
            }), p(e.oText, "focus", w), p(e.oText, "input", function () {
                e.closed && e.show(), b()
            }), p(e.oText, "click", function () {
                $.trim(e.oText.value) || (e.focusByClick = !0)
            }), p(r.form, "submit", function (t) {
                if (e.onBeforeSubmit && e.selectedIndex >= 0) {
                    var n = e.oMenu.children[e.selectedIndex], i = {
                        inputValue: $.trim(r.value),
                        index: parseInt(n.getAttribute("ac_index"), 10),
                        word: n.getAttribute("acvalue"),
                        type: n.getAttribute("data-type"),
                        resrc: n.getAttribute("ac_resrc"),
                        ext: n.getAttribute("ac_ext"),
                        source: n.getAttribute("ac_source"),
                        psid: n.getAttribute("ac_psid"),
                        eci: n.getAttribute("ac_eci")
                    };
                    e.onBeforeSubmit(i) === !1 && a(t)
                }
                setTimeout(function () {
                    e && (e.oText.blur(), e.acValue = e.filteringValue = e.filteredValue = "", e.oMenu.innerHTML = "", e.selectedIndex = -2, C.displaying = !1)
                }, 20)
            }), p(e.oText, "blur", function (t) {
                e.hide(), clearInterval(e._refreshTimer)
            });
            var E, S;
            n.onmousedown = function (e) {
                var t = o(e), n = h(t, "LI", f);
                a(e), clearTimeout(S), E = !0, S = setTimeout(function () {
                    E = !1
                }, 2e3)
            }, f.onclick = function (t) {
                var n = o(t), i = h(n, "LI", f);
                if (i) {
                    r.blur(), setTimeout(function () {
                        r.focus()
                    }, 10);
                    var s = 0, u = i, a = $.trim(r.value);
                    while (u = u.previousSibling) s++;
                    e.setSelectedIndex(s, !0), e.hide(), clearInterval(e._refreshTimer);
                    var l = {
                        index: parseInt(i.getAttribute("ac_index"), 10),
                        word: i.getAttribute("acvalue"),
                        type: i.getAttribute("data-type"),
                        inputValue: a
                    };
                    e.onselectitem && e.onselectitem(l)
                }
            }, f.onmouseover = function (t) {
                var n = o(t), r = h(n, "LI", f);
                r && (e.enableHoverState ? l(r, "hover") : (e.selectedIndex > -1 && c(e.oMenu.childNodes[e.selectedIndex], "selected"), l(r, "selected"), e.selectedIndex = parseInt(r.getAttribute("ac_index"))))
            }, f.onmouseout = function (t) {
                var n = o(t), r = h(n, "LI", f);
                r && (e.enableHoverState ? c(r, "hover") : c(r, "selected"))
            }, n.onmouseout = function (t) {
                e.enableHoverState || (e.selectedIndex > -1 && c(e.oMenu.childNodes[e.selectedIndex], "selected"), e.selectedIndex = -2)
            }, document.activeElement === e.oText && w()
        }
    };
    var S = null, x = {}, T = null, N, C = new n({url: "//www.so.com/zt/api/hotword.js?t=" + +(new Date)}),
        k = function (e, n) {
            T.dataAdapter && !n && (e = T.dataAdapter(e));
            var r = [], i = e.result || [], s = e.version || "", o = e.ssid || "", u = $.trim(S.value), a = e.ext || "";
            for (var f = 0, l = i.length; f < l; f++) {
                var c = i[f].word, h = c, p = i[f].resrc || "", d = i[f].source || "", v = i[f].type || "", m = a,
                    y = "";
                C.whichPage == 1 && (y = So.comm.sid || "");
                if (v == "history" && w(t, c)) continue;
                u && h.toLowerCase().indexOf(u.toLowerCase()) === 0 ? h = g(h.substr(0, u.length)) + '<b unselectable="on">' + g(h.substr(u.length)) + "</b>" : h = g(h), c && r.push({
                    sVal: c.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"),
                    sTitle: h,
                    type: v,
                    id: g(i[f].id || ""),
                    resrc: g(p || ""),
                    psid: y,
                    ext: g(m),
                    source: d,
                    eci: g(i[f].eci || "")
                })
            }
            T.query = e.query, T.itemsData = r, T.version = s, T.ssid = o;
            if (e.query) {
                var b = (So.comm.sid || "") + e.query;
                x[b] = e
            }
        }, L = function (e) {
            e = i({
                clickEmptyToTriggerHotword: !1,
                enableHotword: !1,
                alignElement: e.inputElement,
                pqElement: "",
                urlPrefix: "http://sug.so.360.cn/suggest/word?callback=suggest_so&encodein=utf-8&encodeout=utf-8&word=",
                enableHoverState: !1,
                localSave: 0,
                showCount: 10,
                isCreateWidth: !0
            }, e);
            var t = e.urlPrefix.match(/callback=(\w+)/)[1];
            window[t] = k, S = e.inputElement, T = window.cb = new y({
                options: e,
                oText: S,
                oPos: e.alignElement,
                enableHoverState: e.enableHoverState,
                dataAdapter: e.dataAdapter,
                beforeHide: e.beforeHide || function () {
                },
                beforeSelectItem: e.beforeSelectItem,
                onBeforeSubmit: e.onBeforeSubmit,
                localSave: e.localSave,
                showCount: e.showCount,
                isCreateWidth: e.isCreateWidth,
                onselectitem: function (e) {
                    if (this.beforeSelectItem && this.beforeSelectItem(e) === !1) return;
                    var t = S.form.elements;
                    for (var n = 0; n < t.length; n++) if (t[n].type == "submit") {
                        t[n].click();
                        return
                    }
                },
                refreshData: function () {
                    var t = $.trim(S.value), n = (So.comm.sid || "") + t, i = x[n];
                    if (i) k(i, !0); else {
                        var s = e.urlPrefix + "&fields=word&word=" + encodeURIComponent(t);
                        e.sid && So.comm.sid && (s += "&sid=" + So.comm.sid), e.pqElement && (s += "&pq=" + encodeURIComponent(So.comm.q)), e.mid && (s += "&mid=" + encodeURIComponent(e.mid)), e.huid && (s += "&huid=" + encodeURIComponent(e.huid)), s += "&llbq=" + encodeURIComponent(So.comm.llbq);
                        var o = E(t), u = [], a = [];
                        for (var f = 0, l = o.length; f < l; f++) u.push(o[f].word), a.push(o[f].id);
                        s += "&cache=" + encodeURIComponent(u.join("")), s += "&id=" + encodeURIComponent(a.join(",")), r(s)
                    }
                }
            }), C.setSuggest(T), C.setOptions(e)
        };
    window.clearSugStorage = function () {
        So.lib.soLocalStorage && So.lib.soLocalStorage.removeItem(e)
    }, window.setStorage = O, setTimeout(function () {
        O()
    }, 300, !0), setTimeout(function () {
        try {
            external.AppCmd(external.GetSID(window), "sesafe", "GetIncognitoStatus", "1", "", function (e, t) {
                100 == e && t == "true" && (C.isPrivacyMode = !0)
            })
        } catch (e) {
        }
    }, 30), window.createSuggest = L
}(), function () {
    function t(e, t) {
        var n = $("#bd_search form"), r = "";
        if (e) {
            var i = e.split("&");
            for (var s = 0, o = i.length; s < o; s++) {
                var u = i[s].split("=");
                u[0] == "nlpv" && (r = u[1])
            }
            var a = n.find('input[name="eci"]'), f = n.find('input[name="nlpv"]'),
                l = '<input type="hidden" name="eci" value="' + t + '">',
                c = '<input type="hidden" name="nlpv" value="' + r + '">';
            a.length == 0 ? n.append(l) : a.val(t), f.length == 0 ? n.append(c) : f.val(r)
        } else $("#nlpv").length || n.find('input[name="eci"],input[name="nlpv"]').remove();
        return {eci: t, nlpv: r}
    }

    var e = document.getElementById("input");
    createSuggest({
        inputElement: e,
        alignElement: document.getElementById("suggest-align"),
        urlPrefix: "//sug.so.360.cn/suggest?callback=suggest_so&encodein=utf-8&encodeout=utf-8&format=json&src=so_home",
        enableHoverState: !1,
        mid: So.lib.getUnMid(So.comm.md) || "",
        huid: So.lib.cookie.get("__huid") || "",
        enableHotword: !0,
        clickEmptyToTriggerHotword: !0,
        localSave: So.lib.cookie.get("sosug") !== "0" ? 1 : 0,
        whichPage: 0,
        onBeforeSubmit: function (e) {
            var n = $(this.oMenu), r = n.attr("ver") || "", i = n.attr("ssid") || "", s = n.attr("ac_word") || "",
                o = "home", u = "";
            e.type == "local" ? u = "sug-local" : e.type == "local-sug-store" ? u = "home-sug-store" : e.type == "nlp_recomm" ? u = "home-nlp-recomm" : u = "home_suggst_" + r, $("#from").val(u), $("input[name=ssid]").val(i);
            var a = t(e.ext, e.eci);
            So.lib.cookie.set("sgtclick", [e.word, e.index, e.inputValue, s, o, r, e.resrc, a.eci, a.nlpv, e.source, e.psid, i].join("|"))
        }
    }), e.focus()
}(), So.lib.md5 = function () {
    function e(e, t) {
        var n = (e & 65535) + (t & 65535), r = (e >> 16) + (t >> 16) + (n >> 16);
        return r << 16 | n & 65535
    }

    function t(e, t) {
        return e << t | e >>> 32 - t
    }

    function n(n, r, i, s, o, u) {
        return e(t(e(e(r, n), e(s, u)), o), i)
    }

    function r(e, t, r, i, s, o, u) {
        return n(t & r | ~t & i, e, t, s, o, u)
    }

    function i(e, t, r, i, s, o, u) {
        return n(t & i | r & ~i, e, t, s, o, u)
    }

    function s(e, t, r, i, s, o, u) {
        return n(t ^ r ^ i, e, t, s, o, u)
    }

    function o(e, t, r, i, s, o, u) {
        return n(r ^ (t | ~i), e, t, s, o, u)
    }

    function u(t, n) {
        t[n >> 5] |= 128 << n % 32, t[(n + 64 >>> 9 << 4) + 14] = n;
        var u, a, f, l, c, h = 1732584193, p = -271733879, d = -1732584194, v = 271733878;
        for (u = 0; u < t.length; u += 16) a = h, f = p, l = d, c = v, h = r(h, p, d, v, t[u], 7, -680876936), v = r(v, h, p, d, t[u + 1], 12, -389564586), d = r(d, v, h, p, t[u + 2], 17, 606105819), p = r(p, d, v, h, t[u + 3], 22, -1044525330), h = r(h, p, d, v, t[u + 4], 7, -176418897), v = r(v, h, p, d, t[u + 5], 12, 1200080426), d = r(d, v, h, p, t[u + 6], 17, -1473231341), p = r(p, d, v, h, t[u + 7], 22, -45705983), h = r(h, p, d, v, t[u + 8], 7, 1770035416), v = r(v, h, p, d, t[u + 9], 12, -1958414417), d = r(d, v, h, p, t[u + 10], 17, -42063), p = r(p, d, v, h, t[u + 11], 22, -1990404162), h = r(h, p, d, v, t[u + 12], 7, 1804603682), v = r(v, h, p, d, t[u + 13], 12, -40341101), d = r(d, v, h, p, t[u + 14], 17, -1502002290), p = r(p, d, v, h, t[u + 15], 22, 1236535329), h = i(h, p, d, v, t[u + 1], 5, -165796510), v = i(v, h, p, d, t[u + 6], 9, -1069501632), d = i(d, v, h, p, t[u + 11], 14, 643717713), p = i(p, d, v, h, t[u], 20, -373897302), h = i(h, p, d, v, t[u + 5], 5, -701558691), v = i(v, h, p, d, t[u + 10], 9, 38016083), d = i(d, v, h, p, t[u + 15], 14, -660478335), p = i(p, d, v, h, t[u + 4], 20, -405537848), h = i(h, p, d, v, t[u + 9], 5, 568446438), v = i(v, h, p, d, t[u + 14], 9, -1019803690), d = i(d, v, h, p, t[u + 3], 14, -187363961), p = i(p, d, v, h, t[u + 8], 20, 1163531501), h = i(h, p, d, v, t[u + 13], 5, -1444681467), v = i(v, h, p, d, t[u + 2], 9, -51403784), d = i(d, v, h, p, t[u + 7], 14, 1735328473), p = i(p, d, v, h, t[u + 12], 20, -1926607734), h = s(h, p, d, v, t[u + 5], 4, -378558), v = s(v, h, p, d, t[u + 8], 11, -2022574463), d = s(d, v, h, p, t[u + 11], 16, 1839030562), p = s(p, d, v, h, t[u + 14], 23, -35309556), h = s(h, p, d, v, t[u + 1], 4, -1530992060), v = s(v, h, p, d, t[u + 4], 11, 1272893353), d = s(d, v, h, p, t[u + 7], 16, -155497632), p = s(p, d, v, h, t[u + 10], 23, -1094730640), h = s(h, p, d, v, t[u + 13], 4, 681279174), v = s(v, h, p, d, t[u], 11, -358537222), d = s(d, v, h, p, t[u + 3], 16, -722521979), p = s(p, d, v, h, t[u + 6], 23, 76029189), h = s(h, p, d, v, t[u + 9], 4, -640364487), v = s(v, h, p, d, t[u + 12], 11, -421815835), d = s(d, v, h, p, t[u + 15], 16, 530742520), p = s(p, d, v, h, t[u + 2], 23, -995338651), h = o(h, p, d, v, t[u], 6, -198630844), v = o(v, h, p, d, t[u + 7], 10, 1126891415), d = o(d, v, h, p, t[u + 14], 15, -1416354905), p = o(p, d, v, h, t[u + 5], 21, -57434055), h = o(h, p, d, v, t[u + 12], 6, 1700485571), v = o(v, h, p, d, t[u + 3], 10, -1894986606), d = o(d, v, h, p, t[u + 10], 15, -1051523), p = o(p, d, v, h, t[u + 1], 21, -2054922799), h = o(h, p, d, v, t[u + 8], 6, 1873313359), v = o(v, h, p, d, t[u + 15], 10, -30611744), d = o(d, v, h, p, t[u + 6], 15, -1560198380), p = o(p, d, v, h, t[u + 13], 21, 1309151649), h = o(h, p, d, v, t[u + 4], 6, -145523070), v = o(v, h, p, d, t[u + 11], 10, -1120210379), d = o(d, v, h, p, t[u + 2], 15, 718787259), p = o(p, d, v, h, t[u + 9], 21, -343485551), h = e(h, a), p = e(p, f), d = e(d, l), v = e(v, c);
        return [h, p, d, v]
    }

    function a(e) {
        var t, n = "";
        for (t = 0; t < e.length * 32; t += 8) n += String.fromCharCode(e[t >> 5] >>> t % 32 & 255);
        return n
    }

    function f(e) {
        var t, n = [];
        n[(e.length >> 2) - 1] = undefined;
        for (t = 0; t < n.length; t += 1) n[t] = 0;
        for (t = 0; t < e.length * 8; t += 8) n[t >> 5] |= (e.charCodeAt(t / 8) & 255) << t % 32;
        return n
    }

    function l(e) {
        return a(u(f(e), e.length * 8))
    }

    function c(e, t) {
        var n, r = f(e), i = [], s = [], o;
        i[15] = s[15] = undefined, r.length > 16 && (r = u(r, e.length * 8));
        for (n = 0; n < 16; n += 1) i[n] = r[n] ^ 909522486, s[n] = r[n] ^ 1549556828;
        return o = u(i.concat(f(t)), 512 + t.length * 8), a(u(s.concat(o), 640))
    }

    function h(e) {
        var t = "0123456789abcdef", n = "", r, i;
        for (i = 0; i < e.length; i += 1) r = e.charCodeAt(i), n += t.charAt(r >>> 4 & 15) + t.charAt(r & 15);
        return n
    }

    function p(e) {
        return unescape(encodeURIComponent(e))
    }

    function d(e) {
        return l(p(e))
    }

    function v(e) {
        return h(d(e))
    }

    function m(e, t) {
        return c(p(e), p(t))
    }

    function g(e, t) {
        return h(m(e, t))
    }

    return function (e, t, n) {
        return t ? n ? m(t, e) : g(t, e) : n ? d(e) : v(e)
    }
}(), function () {
    function m() {
        d.hide(), l.hasClass(v) && l.removeClass(v)
    }

    function g() {
        d.show(), l.hasClass(v) || l.addClass(v)
    }

    function O() {
        if (typeof So.lib.cookie.get("hasUseFollowBtn") == "undefined") {
            var e = parseInt((new Date).getTime() / 1e3);
            $.ajax({
                url: "//user.360kuai.com/following/getIds",
                data: {
                    sign: So.comm.src == "360ws_newtab_xhj" ? "360_806235bc" : "360_fc624efc",
                    uid: So.comm.guid,
                    token: e + "|" + So.lib.md5(So.comm.guid + "fdasof09vni234rk23b498uvo234eo14n123b12v31v23c1y23y1u" + e),
                    f: "jsonp"
                },
                type: "get",
                timeout: 5e3,
                dataType: "jsonp",
                success: function (e) {
                    if (e && e.data && e.data.length > 0) {
                        var t = 1e3, n = new Date;
                        n.setTime(n.getTime() + t * 24 * 60 * 60 * 1e3);
                        var r = {expires: n};
                        So.lib.cookie.set("hasUseFollowBtn", 1, r)
                    }
                }
            })
        }
    }

    monitor.util.getGuid = function () {
        return So.lib.cookie.get("QiHooGUID")
    };
    var e = monitor.data.getBase;
    monitor.data.getBase = function () {
        var t = e();
        return delete t.id, delete t.u, delete t.p, t
    };
    var t = function (e, t, n, r, i) {
        var s = null, o = null, u = n || 200, a = function () {
            clearTimeout(o), s = setTimeout(function () {
                t.fadeIn(300), r && r()
            }, u)
        }, f = function () {
            clearTimeout(s), o = setTimeout(function () {
                t.fadeOut(300), i && i()
            }, u)
        };
        e.hover(a, f), t.hover(a, f)
    };
    $("#bd_logo").addClass("anime"), t($("#so_tabs_more"), $("#so_tabs_menu")), $("#so_tabs_more").mouseenter(function () {
        So.lib.log("", {lk: "tabs_more", datatype: So.comm.nocard ? "nocard" : "card"}, "sou/home_link")
    });
    var n = $("#hd_usernav"), r = $("#hd_nav .uinfo");
    t(r, n, null, function () {
        n.css("left", r.offset().left + r.width() - n.width())
    });
    var i = $("#hd_setting"), s = $("#hd_nav .setting a"), o = function (e) {
        _loader.add("settingPanel", "https://s.ssl.qhimg.com/static/8923feda634ec825/common/setting.js"), _loader.use("settingPanel", function () {
            e()
        })
    };
    $("#search_setting").on("click", function () {
        o(function () {
            So.web.showSearchSetting()
        })
    }), $("#advanced_search").on("click", function () {
        o(function () {
            So.web.showAdvancedSearch()
        })
    }), t(s, i, null, function () {
        i.css("left", s.offset().left + s.outerWidth() / 2 - i.width() / 2)
    });
    var u = {mid: So.comm.md};
    i.on("click", ".add-hot-news-card", function () {
        So.lib.observer.publish("so.homecard.addHotNewsCard")
    }), i.on("click", ".close-hot-news-card", function () {
        So.lib.observer.publish("so.homecard.closeHotNewsCard"), i.hide()
    });
    var a = $("#input-container"), f = $("#suggest-align"), l = $("#input"), c = $("#from");
    l.bind({
        focus: function () {
            a.addClass("focus"), f.addClass("hover")
        }, blur: function () {
            a.removeClass("focus"), f.removeClass("hover")
        }
    });
    var h = $(".ie6"), p = h.length;
    p && $(window).scroll(function () {
        $("#skin_bg").css("top", document.documentElement.scrollTop)
    }), So.comm.src && c.val("home_" + So.comm.src.replace(/^(home_)+/g, "")), $("#bd_tabnav a[data-s]").bind("click", function () {
        var e = $(this), t = $.trim(l.val()), n = e.attr("data-s");
        t && n && (n = n.replace(/%q%/g, encodeURIComponent(t)), e.attr("href", n))
    }), $("#hd_nav .sethome a").click(function () {
        var e = !1, t = function (e, t) {
            var n = e.match(RegExp(t + "\\b[ \\/]?([\\w\\.]*)", "i"));
            return n ? n.slice(1) : ["", ""]
        }(navigator.userAgent, "(maxthon|360se|360ee|theworld|se|greenbrowser|qqbrowser)");
        try {
            e = external.twGetRunPath.toLowerCase().indexOf("360se") > -1
        } catch (n) {
        }
        if (!e && !t[0]) try {
            return this.style.behavior = "url(#default#homepage)", this.setHomePage("http://www.so.com/"), !1
        } catch (r) {
        }
    });
    var d = $("#suggest-align .placeholder-default"), v = "lowie-bg";
    $.trim(l.val()) == "" && g(), $("#bd_search form").on("submit", function () {
        if ($.trim(l.val()) == "") {
            var e = $.trim(d.data("keyword"));
            if (!e) return l.focus(), !1;
            m(), c.val("home_placeholder"), l.val(e)
        }
    }), So.lib.cookie.get("force_www_so") && $("#mobileHolder").show(), $("#mobile").on("click", function () {
        So.lib.cookie.remove("force_www_so")
    }), $("a[data-linkid]").bind("mousedown", function () {
        So.lib.log("", {
            q: $.trim(l.val()),
            lk: $(this).attr("data-linkid"),
            datatype: So.comm.nocard ? "nocard" : "card"
        }, "sou/home_link")
    }), $("#search-button").bind("mousedown", function () {
        So.lib.log("", {q: $.trim(l.val()) || $.trim(d.text()), eng: 0, huiche: 0}, "sou/home_click")
    }), l.bind("keydown", function (e) {
        var t = e.keyCode || e.which;
        if (t === 13) if ($(".ac_wrap .ac_menu .selected").length) {
            var n = $(".ac_wrap .ac_menu .selected");
            So.lib.log("", {input: $.trim(l.val()), click: n.attr("acvalue"), huiche: 1}, "sou/home_suggst")
        } else So.lib.log("", {q: $.trim(l.val()), eng: 0, huiche: 1}, "sou/home_click")
    }), l.on("keydown input propertychange", function () {
        $.trim(l.val()) && m()
    }), l.on("keyup", function () {
        $.trim(l.val()) || g()
    }), $(".ac_wrap").delegate("li", "mousedown", function (e) {
        $(e.target).hasClass("del") || m(), So.lib.log("", {
                input: $.trim(l.val()),
                click: $(this).attr("acvalue"),
                huiche: 0
            }, "sou/home_suggst"
        )
    }), So.lib.log("", {
        ref: document.referrer,
        guid: So.lib.cookie.get("QiHooGUID") || "",
        gid: So.comm.md,
        hid: So.lib.cookie.get("__huid") || "",
        qid: So.comm.user.qid,
        dpi: window.screen.width + "_" + window.screen.height,
        dm: document.domain,
        ls: So.comm.ls || "",
        q: d.data("from") === "recomm" ? $.trim(d.text()) : "",
        p1: So.lib.cookie.get("hot-news-card") || 1,
        llbq: So.comm.llbq,
        _hmid: So.lib.getMid()
    }, "sou/home"), location.protocol != "https:" && setTimeout(function () {
        monitor.setConf("httpsUrl", "https://www.so.com/_.gif"), monitor.log({}, "https")
    }, 500), So.lib.isSupportWebp();
    var y = $('.ad[data-from="cms"]');
    if (y.length > 0) {
        So.lib.log("cms-ad", {type: "show", datatype: y.attr("data-type")}), y.on("mousedown", function () {
            So.lib.log("cms-ad", {type: "click", datatype: $(this).attr("data-type")})
        });
        if (y.data("link")) {
            var b = new Image;
            b.onload = b.onerror = function () {
                b = null
            }, b.src = y.data("link")
        }
    }
    setTimeout(function () {
        $("#bd_tabnav").show()
    }, 500), function () {
        var e = So.lib.cookie.get("__huid");
        if (e) {
            var t = new Image;
            t.onload = t.onerror = function () {
                t = null
            }, t.src = "//cm.mediav.com/lianmeng?maxhuid=" + encodeURIComponent(e)
        }
    }();
    var w = "https://api.ssl.so.com/cloud_config", E = {keys: "footer.html", from: "www.so.com"};
    $.ajax({
        url: w, data: E, method: "get", dataType: "jsonp", crossDomain: !0, success: function (e) {
            e.data && e.data["footer.html"] && $("#footer p").html(e.data["footer.html"])
        }, error: function (e) {
        }
    });
    var S = new Date;
    S.setFullYear(S.getFullYear() + 10), typeof So.lib.cookie.get("so-like-red") == "undefined" && So.lib.cookie.set("so-like-red", 2, {expires: S});
    var x = So.lib.cookie.get("so-like-red") == 2 && So.lib.cookie.get("hasUseFollowBtn") == 1;
    if (x) {
        var T = "//user.360kuai.com/following/reddot", N = {
            sign: "360_e39369d1",
            uid: So.lib.getUnMid(So.comm.md) || So.lib.getUnMid(So.lib.cookie.get("__md")) || So.lib.cookie.get("__guid") || So.comm.guid,
            f: "jsonp",
            u_ctime: 1
        };

        function C(e, t) {
            t = t || Date.now(), e && clearTimeout(e);
            if ($("#card_container")[0] || So.lib.cookie.get("hot-news-card") == 0 || Date.now() - t >= 5e3) {
                $(".follow_reddot").css({visibility: "visible"});
                return
            }
            var n = setTimeout(C, 50, n, t)
        }

        $.ajax({
            url: T, data: N, method: "get", dataType: "jsonp", crossDomain: !0, success: function (e) {
                e.data && ($("#my_kzx_flow_follow").data("redlike", 1), C(), So.lib.log("red_like", {type: "show"}))
            }, error: function (e) {
            }
        })
    }
    var k = $("#hd_follow"), L = $("#hd_nav .follow a");
    t(L, k, null, function () {
        k.css("left", L.offset().left + L.outerWidth() / 2 - k.width() / 2)
    }), k.on("click", ".toggle-red-dot", function () {
        So.lib.cookie.get("so-like-red") == 2 ? (So.lib.cookie.set("so-like-red", 1, {expires: S}), location.reload()) : (So.lib.cookie.set("so-like-red", 2, {expires: S}), location.reload())
    });
    var A = $(".follow");
    A.on("click", function () {
        if (x) {
            var e = "//user.360kuai.com/following/redDotCTime", t = {
                sign: "360_e39369d1",
                uid: So.lib.getUnMid(So.comm.md) || So.lib.getUnMid(So.lib.cookie.get("__md")) || So.lib.cookie.get("__guid") || So.comm.guid,
                f: "jsonp"
            };
            $.ajax({
                url: e, data: t, method: "get", dataType: "jsonp", crossDomain: !0, success: function (e) {
                    $(".follow_reddot").css({visibility: "hidden"})
                }, error: function (e) {
                }
            })
        }
        window.open("https://www.so.com/zt/recommend.html#/follow"), So.lib.log("red-like", {
            type: "click",
            mod: $("#my_kzx_flow_follow").data("redlike") ? "red-mylike" : "mylike"
        })
    }), O()
}(), So.web.skinMain = {
    cookies: {flag: "skin", limit: "skinRecLimit", close: "skinClose", custom: "skinCustom"},
    logMark: "newSkin",
    skinEffectJs: "",
    prefix: "skin",
    $logo: $(".skin-logo"),
    $skinBg: $("#skin_bg"),
    $skinTip: $(".skin-tip"),
    $opacity: null,
    $disable: null,
    cookieMark: "l-status",
    storageObj: new So.web.storage("skinList", 365),
    storageKey: "skinList",
    init: function () {
        var e = this;
        So.web.skin.skinJs && e.loadSkinJs(So.web.skin.skinJs.replace(/http:\/\/s\d+\.(qhimg|qhmsg|qhres|qhres2)\.com\/static/g, "https://s.ssl.qhimg.com/ssl")), e.remind(), e.initEvent()
    },
    remind: function () {
        var e = this,
            t = $('<div class="g-mask logout-mask"><div class="box"><a href="javascript:;" class="close g-close"></a><p>\u4eb2\uff0c\u9000\u51fa\u540e\u65e0\u6cd5\u7ee7\u7eed\u4f7f\u7528\u5f53\u524d\u7f8e\u7f8e\u7684\u58c1\u7eb8\u54e6~<br>\u5c06\u540c\u6b65\u672a\u767b\u5f55\u65f6\u76ae\u80a4\u72b6\u6001</p><a href="javascript:;" class="g-btn g-btn-green exit">\u7ee7\u7eed\u9000\u51fa</a><a href="javascript:;" class="g-btn g-btn-green2 cancel">\u53d6  \u6d88</a></div></div>');
        $("#user-logout").on("click", function () {
            return So.lib.cookie.set(e.cookieMark, "1"), So.web.skin.flag != "" || So.web.skin.limitTime != "" ? ($("body").append(t), So.lib.log(e.logMark, {type: "logout-mask"}), t.on("click", "a", function () {
                var n = $(this);
                n.hasClass("close") || n.hasClass("cancel") ? (t.remove(), So.lib.log(e.logMark, {type: "logout-close"})) : n.hasClass("exit") && (So.lib.log(e.logMark, {type: "logout"}), So.web.login.logout())
            })) : So.web.login.logout(), !1
        }), $("#user-login").on("click", function () {
            So.lib.cookie.set(e.cookieMark, "1")
        }), So.lib.cookie.get(e.cookieMark) && (So.web.skin.flag == "" && So.web.skin.limitTime == "" && $("#hd_nav .changeskin").append('<span class="new1"/>'), So.lib.cookie.remove(e.cookieMark))
    },
    loadSkinJs: function (e) {
        var t = this;
        e && (e = So.lib.sslReplace(e), _loader.use("require.2.1.11", function () {
            require([e], function (e) {
                e && typeof e.start == "function" && (e.start(), t.skinEffectJs = e)
            })
        }))
    },
    removeEffect: function () {
        var e = this;
        e.skinEffectJs && typeof e.skinEffectJs.stop == "function" && e.skinEffectJs.stop()
    },
    loadSkinCss: function (e) {
        if (e) {
            var t = $("head");
            t.find('link[href="' + e + '"]').length || $('<link type="text/css" rel="stylesheet" />').appendTo(t).attr("href", e)
        }
    },
    addBodyClass: function (e, t) {
        $("body").addClass("skin"), e && $("body").addClass(" skin-" + e), t && $("body").addClass(" skin-" + t), So.web.skin.cssStyle == "dark" && $("body").addClass("skin-dark")
    },
    removeBodyClass: function () {
        var e = this, t = $("body"), n = $("body[class*=" + e.prefix + "]").attr("class");
        n && t.attr("class", $.trim(n.replace(new RegExp(e.prefix + "\\S*", "g"), "").replace(/\s+/g, " ")))
    },
    showSkin: function (e, t, n, r, i, s, o) {
        var u = this;
        i ? (u.$logo.attr("href", i), u.$logo.attr("style", "")) : (u.$logo.attr("href", u.$logo.attr("data-href")), u.$logo.attr("style", u.$logo.attr("data-style"))), s ? u.$logo.attr("title", s) : u.$logo.attr("title", u.$logo.attr("data-title")), u.removeEffect(), u.removeBodyClass(), u.addBodyClass(e, o), u.setSkinBg(t), u.loadSkinCss(n), u.loadSkinJs(r), u.saveSkinSetting(1, e)
    },
    clearSkin: function (e) {
        var t = this;
        t.setSkinBg(""), t.removeEffect(), t.removeBodyClass(), t.saveSkinSetting(e), t.$logo.attr("href", t.$logo.attr("data-href")), t.$logo.attr("title", t.$logo.attr("data-title")), t.$logo.attr("style", t.$logo.attr("data-style"))
    },
    setSkinBg: function (e) {
        var t = this;
        e ? t.$skinBg.css("background-image", "url(" + e + ")") : (t.$skinBg.css("background-image", "none"), t.$skinBg.css("background-color", "#fff"))
    },
    setCookie: function (e, t) {
        var n = new Date;
        n.setDate(n.getDate() + 365), So.lib.cookie.set(e, t, {expires: n})
    },
    saveSkinSetting: function (e, t) {
        var n = this;
        if (So.comm.user.qid) $.ajax({
            url: "/index.php?c=skin&a=setmyskin",
            type: "post",
            dataType: "json",
            data: {flag: t || "", type: e, css_style: So.web.skin.cssStyle},
            success: function (e) {
            }
        }); else {
            if (e === 1) {
                So.lib.cookie.remove(n.cookies.close);
                if (t) {
                    n.setCookie(n.cookies.flag, t);
                    var r = n.storageObj.get(n.storageKey) || [];
                    for (var i = 0, s = r.length; i < s; i++) if (r[i] == t) {
                        r.splice(i, 1);
                        break
                    }
                    r.unshift(t), r = r.slice(0, 29), n.storageObj.set(n.storageKey, r)
                }
            } else n.setCookie(n.cookies.close, 1), So.lib.cookie.remove(n.cookies.flag);
            So.web.skin.limitTime && So.lib.cookie.set(n.cookies.limit, So.web.skin.flag_limit || "none", {expires: new Date(parseFloat(So.web.skin.limitTime))})
        }
        e == 1 && t ? So.web.skin.flag = t : So.web.skin.flag = "", n.$skinTip.hide()
    },
    setSetting: function () {
        var e = this, t = /msie (\d+)/i.test(navigator.userAgent) && !window.opera ? parseInt(RegExp.$1) : 0,
            n = $("#so_skin_panel"), r = n.find(".opacity"), i = n.find(".disable");
        $backtosrcSkin = n.find(".skin-tip"), r.hide(), So.web.skin.flag ? i.show() : i.hide(), So.web.skin.tip !== "" && So.web.skin.tip !== 1 && (n.find(".skin-tip").length == 0 && n.find(".r-tools").prepend(So.web.skin.tip).find(".skin-tip").addClass("g-a-dark").show(), n.on("click", ".skin-tip", function () {
            var t = $(this), r, i = t.attr("data-type");
            i == "old" && (So.lib.log(e.logMark, {
                type: "tipOld",
                p1: So.web.skin.flag,
                p2: So.web.skin.type
            }), r = So.web.skin.skinOld, r ? e.showSkin(r.flag, r.src, r.pic_css, r.pic_js, r.logo_link, r.logo_title, r.css_style) : So.lib.cookie.get(e.cookies.close) == 0 ? e.clearSkin(0) : e.clearSkin(1), So.web.skin.tip = "", n.hide())
        }))
    },
    initEvent: function () {
        var e = this;
        $("#hd_nav li.changeskin a").on("click", function () {
            So.lib.log(e.logMark, {type: "showPanel", p1: So.web.skin.flag, p2: So.web.skin.type});
            var t = $("#so_skin_panel");
            return (So.web.skin.tip == "" || So.web.skin.tip == 1) && t.find(".skin-tip").hide(), t.length == 0 ? (_loader.add("skinload", "https://s.ssl.qhimg.com/static/5a1c667e7a25c511/dist/home/skin.js"), _loader.use("require.2.1.11,skinload", function () {
                _loader.remove("skinload")
            })) : (e.setSetting(), t.slideDown()), $("#hd_nav li.changeskin").find(".new").remove(), So.lib.cookie.remove(e.cookieMark), !1
        }), e.$logo.on("click", function (e) {
            $(this).attr("href") == "javascript:;" && e.preventDefault()
        }), So.lib.cookie.get(e.cookies.custom) && setTimeout(function () {
            So.lib.log(e.logMark, {
                type: "showPanel1",
                p1: So.web.skin.flag,
                p2: So.web.skin.type
            }), $("#hd_nav li.changeskin a").click()
        }, 500), So.web.skin.flag && So.lib.log(e.logMark, {
            type: "loadSkin",
            p1: So.web.skin.flag,
            p2: So.web.skin.type
        })
    }
}, So.web.skinMain.init(), function (e) {
    e.fn.hoverDelay = function (t) {
        var n = {
            hoverDuring: 200, outDuring: 200, hoverEvent: function () {
                e.noop()
            }, outEvent: function () {
                e.noop()
            }
        }, r = e.extend(n, t || {});
        return e(this).each(function () {
            var t = e(this), n, i;
            t.hover(function () {
                clearTimeout(i), n = setTimeout(function () {
                    r.hoverEvent(t)
                }, r.hoverDuring)
            }, function () {
                clearTimeout(n), i = setTimeout(function () {
                    r.outEvent(t)
                }, r.outDuring)
            })
        })
    }
}(jQuery);