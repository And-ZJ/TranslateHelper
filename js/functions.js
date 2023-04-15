// 在翻译网页上，实现各功能

//延时响应
function DelayResponse(delayFun, parameter, timeDelay) {
    /**
     * 延时响应。并且只响应一次。
     * 若某次还未响应，则多次调用并不会多次触发，仍只触发最早的那次。
     * delayFun：需要延时响应的函数
     * parameter：给delayFun传递的参数
     * timeDelay：延时时长
     */
    var oneTimeout = null;
    var timeoutFun = function () {
        if (oneTimeout !== null) {
            oneTimeout = null;
        }
        if (delayFun !== null) {
            delayFun(parameter);
        }
    };

    this.run = function () {
        if (oneTimeout === null) {
            oneTimeout = setTimeout(timeoutFun, timeDelay);
        }
    }
}

// 发音，获取页面上发音元素的焦点
function listenSound(selector) {
    debugLog("listenSound", selector);
    if (selector === null) {
        return;
    }
    var sound = $(selector).first();
    if (sound.css("display") !== "none") {
        debugLog("listenSound focus");
        sound.focus();
    }
}

function isGoogleTranslateCNPage(href) {
    return href.search("translate.google.cn") > -1
}

function isGoogleTranslateCNHkPage(href) {
    return href.search("translate.google.com.hk") > -1;
}

function isGoogleTranslatePage(href) {
    return href.search("translate.google") > -1;
}

function isBaiduTranslatePage(href) {
    return href.search("fanyi.baidu.com") > -1;
}

function isYouDaoTranslatePage(href) {
    return href.search("fanyi.youdao.com") > -1;
}

function isBingTranslatePage(href) {
    return href.search("cn.bing.com/translator") > -1 || href.search("bing.com/translator") > -1;
}

function isSogouTranslatePage(href) {
    return href.search("translate.sogou.com") > -1 || href.search("fanyi.sogou.com") > -1;
}

function isDeepLTranslatePage(href) {
    return href.search("deepl.com/translator") > -1;
}

function isPopupPage(href) {
    return href.search("chrome-extension") > -1
        && href.search("popup.html") > -1;
}

// 用于容纳与翻译页面相关的元素
function PageContainer() {
    this.currentPage = null;
}

PageContainer.prototype.isTranslateWebPage = function () {
    if (this.currentPage === null || this.currentPage === "popup") {
        return false;
    }
    return true;
};

PageContainer.prototype.isPopupPage = function () {
    if (this.currentPage !== null && this.currentPage === "popup") {
        return true;
    }
    return false;
};

function clickPerformanceAtEle(ele, text) {
    // 实现点击之后，显示提示字符
    var top = $(ele).offset().top;
    var left = $(ele).offset().left;
    var performanceEle = '<div class="performance" style="top:' + (top - 20) + 'px;left:' + left + 'px">' + text + '</div>';
    $('body').append(performanceEle);
    $('div.performance').animate({'top': top - 60}, 'slow', function () {
        $(this).remove();
    })
}

// 识别当前是哪个翻译界面，用于匹配相应的输入框、和按钮等
function matchTranslatePage(href) {
    var pageContainer = new PageContainer();
    if (isGoogleTranslatePage(href)) {
        // 谷歌翻译界面
        if (isGoogleTranslateCNPage(href)) {
            pageContainer.currentPage = 'googleCN';
        }
        else if (isGoogleTranslateCNHkPage(href)) {
            pageContainer.currentPage = 'googleCNHK';
        }
        else if (isGoogleTranslatePage(href)) {
            pageContainer.currentPage = 'google';
        }
        if ($("div.akczyd") !== null && $("div.akczyd").length !== 0 && $("span.HwtZe") !== null) {
            // 谷歌翻译的新版页面，从2022-11-27开始（我发现的时间，不代表谷歌那边上线的时间）
            pageContainer.insertEle = $("div.akczyd");
            pageContainer.inputEdit = $("textarea.er8xn");
            pageContainer.listenEleSelector = "button.VfPpkd-Bz112c-LgbsSe[aria-label='听取原文']";
            pageContainer.helperBtnGroupEleText = '<div id="helper_btn_group" class="googleNew2"></div>';
            pageContainer.formatBtnEleText = "<div id='format_function_btn' class='btn-base googleNew2'>格式化</div>";
            pageContainer.copyTransBtnEleText = "<div id='copy_trans_function_btn' class='btn-base googleNew2' data-clipboard-action='copy'" +
                " data-clipboard-target='span.HwtZe'>复制</div>";

        } else if ($("div.akczyd") !== null && $("div.akczyd").length !== 0) {
            // 谷歌翻译的新版页面，从2020-11-07开始
            pageContainer.insertEle = $("div.akczyd");
            pageContainer.inputEdit = $("textarea.er8xn");
            pageContainer.listenEleSelector = "button.VfPpkd-Bz112c-LgbsSe[aria-label='听取原文']";
            pageContainer.helperBtnGroupEleText = '<div id="helper_btn_group" class="googleNew2"></div>';
            pageContainer.formatBtnEleText = "<div id='format_function_btn' class='btn-base googleNew2'>格式化</div>";
            pageContainer.copyTransBtnEleText = "<div id='copy_trans_function_btn' class='btn-base googleNew2' data-clipboard-action='copy'" +
                " data-clipboard-target='span.VIiyi'>复制</div>";

        } else if ($("div.sl-wrap") !== null && $("div.sl-wrap").length !== 0) {
            // 谷歌翻译的新版页面，从2018-11-29开始
            pageContainer.insertEle = $("div.sl-wrap");
            pageContainer.inputEdit = $("textarea#source");
            pageContainer.listenEleSelector = "div.src-tts";
            pageContainer.helperBtnGroupEleText = '<div id="helper_btn_group" class="googleNew1"></div>';
            pageContainer.formatBtnEleText = "<div id='format_function_btn' class='btn-base googleNew1'>格式化</div>";
            pageContainer.copyTransBtnEleText = "<div id='copy_trans_function_btn' class='btn-base googleNew1' data-clipboard-action='copy'" +
                " data-clipboard-target='.result-shield-container.tlid-copy-target'>复制</div>";
        } else if ($("#gt-lang-right") != null) {
            // 谷歌网页翻译的旧版页面
            pageContainer.insertEle = $("#gt-lang-right");
            pageContainer.inputEdit = $("textarea#source");
            pageContainer.listenEleSelector = "div#gt-src-listen";
            pageContainer.helperBtnGroupEleText = '<div id="helper_btn_group" class="google"></div>';
            pageContainer.formatBtnEleText = "<div id='format_function_btn' class='btn-base google'>格式化</div>";
            pageContainer.copyTransBtnEleText = "<div id='copy_trans_function_btn' class='btn-base google' data-clipboard-action='copy'" +
                " data-clipboard-target='.result-shield-container.tlid-copy-target'>复制</div>";
        } else {
            pageContainer.currentPage = null;
        }

    }
    else if (isBaiduTranslatePage(href)) {
        // 百度翻译
        pageContainer.currentPage = 'baidu';
        // console.log("翻译助手：百度翻译页面");
        pageContainer.insertEle = $(".trans-operation").last();
        pageContainer.inputEdit = $("textarea#baidu_translate_input");
        pageContainer.listenEleSelector = "div.input-operate a";
        pageContainer.helperBtnGroupEleText = '<div id="helper_btn_group" class="baidu"></div>';
        pageContainer.formatBtnEleText = "<div id='format_function_btn' class='btn-base baidu'>格式化</div>";
        pageContainer.copyTransBtnEleText = "<div id='copy_trans_function_btn' class='btn-base baidu' data-clipboard-action='copy'" +
            " data-clipboard-target='.output-bd'>复制</div>";
    }
    else if (isYouDaoTranslatePage(href)) {
        // 有道翻译
        pageContainer.currentPage = 'youdao';
        // console.log("翻译助手：有道翻译页面");
        pageContainer.insertEle = $(".fanyi__operations--left");
        pageContainer.inputEdit = $("textarea#inputOriginal");
        pageContainer.listenEleSelector = null;
        pageContainer.helperBtnGroupEleText = '<div id="helper_btn_group" class="youdao"></div>';
        pageContainer.formatBtnEleText = "<div id='format_function_btn' class='btn-base youdao'>格式化</div>";
        pageContainer.copyTransBtnEleText = "<div id='copy_trans_function_btn' class='btn-base youdao' data-clipboard-action='copy'" +
            " data-clipboard-target='#transTarget'>复制</div>";
        // 有道翻译页面未找到发音按钮
        console.log("翻译助手：有道翻译页面未找到发音按钮");
    }
    else if (isBingTranslatePage(href)) {
        // 必应翻译
        pageContainer.currentPage = 'bing';
        // console.log("翻译助手：必应翻译页面");
        if ($(".t_secOptions.b_clearfix") !== null) {
            // 2023-4-5 发现的新版（不代表必应那边上线时间）
            pageContainer.insertEle = $(".t_secOptions.b_clearfix");
            pageContainer.inputEdit = $("textarea#tta_input_ta");
            pageContainer.listenEleSelector = ".t_secOptions #tta_playiconsrc";
            pageContainer.helperBtnGroupEleText = '<div id="helper_btn_group" class="bingNew1"></div>';
            pageContainer.formatBtnEleText = "<div id='format_function_btn' class='btn-base bingNew1'>格式化</div>";
            pageContainer.copyTransBtnEleText = "<div id='copy_trans_function_btn' class='btn-base bingNew1' data-clipboard-action='copy'" +
                " data-clipboard-target='#tta_output_ta'>复制</div>";
        } else if ($(".t_inputoptions") !== null) {
            // 2020-04-21 发现的新版
            pageContainer.insertEle = $(".t_inputoptions");
            pageContainer.inputEdit = $("textarea#tta_input_ta");
            pageContainer.listenEleSelector = ".t_secOptions #tta_playiconsrc";
            pageContainer.helperBtnGroupEleText = '<div id="helper_btn_group" class="bingNew1"></div>';
            pageContainer.formatBtnEleText = "<div id='format_function_btn' class='btn-base bingNew1'>格式化</div>";
            pageContainer.copyTransBtnEleText = "<div id='copy_trans_function_btn' class='btn-base bingNew1' data-clipboard-action='copy'" +
                " data-clipboard-target='#tta_output_ta'>复制</div>";
        }
        else if ($(".t_select") !== null) {
            pageContainer.insertEle = $(".t_select");
            pageContainer.inputEdit = $("textarea#t_sv");
            pageContainer.listenEleSelector = "#t_srcplayc #t_srcplaycIcon";
            pageContainer.helperBtnGroupEleText = '<div id="helper_btn_group" class="bing"></div>';
            pageContainer.formatBtnEleText = "<div id='format_function_btn' class='btn-base bing'>格式化</div>";
            pageContainer.copyTransBtnEleText = "<div id='copy_trans_function_btn' class='btn-base bing' data-clipboard-action='copy'" +
                " data-clipboard-target='#t_tv'>复制</div>";
        }
        else {
            pageContainer.currentPage = null;
        }
    }
    else if (isSogouTranslatePage(href)) {
        pageContainer.currentPage = 'sogou';
        pageContainer.insertEle = $("div.lang-select-box");
        pageContainer.inputEdit = $("textarea#trans-input");
        pageContainer.listenEleSelector = $("div#item");
        pageContainer.helperBtnGroupEleText = '<div id="helper_btn_group" class="sogou"></div>';
        pageContainer.formatBtnEleText = "<div id='format_function_btn' class='btn-base sogou'>格式化</div>";
        pageContainer.copyTransBtnEleText = "<div id='copy_trans_function_btn' class='btn-base sogou' data-clipboard-action='copy'" +
            " data-clipboard-target='p#output-placeholder'>复制</div>";
    }
    else if (isDeepLTranslatePage(href)) {
        if ($(".lmt__language_container #source_language_label") !== null && $(".lmt__language_container #source_language_label").length !== 0) {
            // DeepL
            pageContainer.currentPage = 'DeepL';
            pageContainer.insertEle = $(".lmt__language_container #source_language_label").parent();
            pageContainer.inputEdit = $(".lmt__inner_textarea_container d-textarea.lmt__source_textarea div");
            pageContainer.listenEleSelector = null;
            pageContainer.helperBtnGroupEleText = '<div id="helper_btn_group" class="DeepL"></div>';
            pageContainer.formatBtnEleText = "<div id='format_function_btn' class='btn-base DeepL'>格式化</div>";
            pageContainer.copyTransBtnEleText = "<div id='copy_trans_function_btn' class='btn-base DeepL' data-clipboard-action='copy'" +
                " data-clipboard-target='#target-dummydiv'>复制</div>";
            console.log("翻译助手：DeepL翻译页面未找到原文发音按钮");
        } else {
            pageContainer.currentPage = null;
        }
    } else if (isPopupPage(href)) {
        pageContainer.currentPage = 'popup';
        pageContainer.insertEle = null;
        pageContainer.inputEdit = $("textarea#input_text_area");
        pageContainer.listenEleSelector = null;
        pageContainer.helperBtnGroupEleText = null;
        pageContainer.formatBtnEle = $("#format_function_btn");
        pageContainer.copyTransBtnEle = new ClipboardJS('#copy_trans_function_btn');
        pageContainer.clearBtnEle = $("#clear_function_btn");
    }
    if (pageContainer.currentPage === null) {
        return null;
    }
    return pageContainer;
}


// 在页面插入存放“格式化”“复制”按钮的框框
function insertHelperBtnGroup(pageContainer, helperConfig) {
    if (pageContainer.isTranslateWebPage()) {
        debugLog("insertHelperBtnGroup");
        var mode = helperConfig.formatFunction.pageSetting[pageContainer.currentPage].mode;
        if (mode === "append") {
            pageContainer.insertEle.append(pageContainer.helperBtnGroupEleText);
        }
        else if (mode === "html") {
            pageContainer.insertEle.html(pageContainer.insertEle.html() + pageContainer.helperBtnGroupEleText)
        }
        pageContainer.helperBtnGroupEle = $('#helper_btn_group');
    }

}


// “格式化”功能
function activateFormatFunction(pageContainer, helperConfig) {
    if (pageContainer.isTranslateWebPage()) {
        if (!helperConfig.formatFunction.check) {
            return;
        }
        if (!helperConfig.formatFunction.pageSetting[pageContainer.currentPage].check) {
            return;
        }
        debugLog("activateFormatFunction");
        var mode = helperConfig.formatFunction.pageSetting[pageContainer.currentPage].mode;
        if (mode === "append") {
            pageContainer.helperBtnGroupEle.append(pageContainer.formatBtnEleText);
        }
        else if (mode === "html") {
            pageContainer.helperBtnGroupEle.html(pageContainer.helperBtnGroupEle.html() + pageContainer.formatBtnEleText)
        }
        pageContainer.formatBtnEle = $("#format_function_btn");
        console.log("翻译助手：若未出现‘格式化’按钮，请右键点击本插件图标，在“选项”中尝试使用其他方式。");
        pageContainer.formatBtnEle.click(function () {
            // 点击“格式化”按钮
            var originalText = pageContainer.inputEdit.val();
            var formattedText = handleTextFormat(originalText, helperConfig.formatFunction.formatConfig);
            pageContainer.inputEdit.val(formattedText);
            clickPerformanceAtEle(this, "格式化");
            pageContainer.inputEdit.focus();
            // 尝试自动触发改变，好像并没有什么用。
            pageContainer.inputEdit.change();
            pageContainer.inputEdit[0].dispatchEvent(new Event('input'));
        });
    }


}

// “复制到剪贴板”功能
function activateCopyTransFunction(pageContainer, helperConfig) {
    if (pageContainer.isTranslateWebPage()) {
        if (!helperConfig.copyTransFunction.check) {
            return;
        }
        if (!ClipboardJS.isSupported()) {
            console.log("当前浏览器不支持复制到剪贴板功能");
            return;
        }

        var mode = helperConfig.formatFunction.pageSetting[pageContainer.currentPage].mode;
        if (mode === "append") {
            pageContainer.helperBtnGroupEle.append(pageContainer.copyTransBtnEleText);
        }
        else if (mode === "html") {
            pageContainer.helperBtnGroupEle.html(pageContainer.helperBtnGroupEle.html() + pageContainer.copyTransBtnEleText)
        }
        pageContainer.copyTransBtnEle = new ClipboardJS('#copy_trans_function_btn');
        debugLog("activateCopyTransFunction");
        pageContainer.copyTransBtnEle.on('success', function (e) {
            clickPerformanceAtEle("#copy_trans_function_btn", '复制');
            e.clearSelection();
        });
        pageContainer.copyTransBtnEle.on('error', function (e) {
            clickPerformanceAtEle("#copy_trans_function_btn", '出错');
            e.clearSelection();
        });
    }

}

// “格式化”功能的快捷键
function activateFormatShortcutKeyFunction(pageContainer, helperConfig) {
    if (!helperConfig.formatShortcutKeyFunction.check) {
        return;
    }
    debugLog("activateFormatShortcutKeyFunction");
    $(document).bind('keydown', helperConfig.formatShortcutKeyFunction.keyValue, function () {
        var originalText = pageContainer.inputEdit.val();
        var formattedText = handleTextFormat(originalText, helperConfig.formatFunction.formatConfig);
        pageContainer.inputEdit.val(formattedText);
        pageContainer.inputEdit.focus();
        pageContainer.inputEdit.change();
        pageContainer.inputEdit[0].dispatchEvent(new Event('input'));
    });
}

// 按下backspace键（删除键）可将焦点回到输入框。
function activateForceFunction(pageContainer, helperConfig) {
    if (!helperConfig.forceFunction.check) {
        return;
    }
    debugLog("activateForceFunction");
    $(document).bind('keydown', "backspace", function () {
        // 按下backspace键（删除键）可将焦点回到输入框。
        if (!pageContainer.inputEdit.is(":focus")) {
            var text = pageContainer.inputEdit.val();
            pageContainer.inputEdit.focus();
            setTimeout(function () {
                pageContainer.inputEdit.val(text)
            }, 100);
        }
    });
}


// 按下tab键，输入框的发音按钮自动获取焦点，此时再按下enter键，即可发音
function activateSpeechFunction(pageContainer, helperConfig) {
    if (pageContainer.isTranslateWebPage()) {
        if (!helperConfig.speechFunction.check) {
            return;
        }
        debugLog("activateSpeechFunction");
        var tabDownResponse = new DelayResponse(listenSound, pageContainer.listenEleSelector, 100);
        $(document).bind('keydown', "tab", function () {
            // 按下tab键，输入框的发音按钮自动获取焦点，此时再按下enter键，即可发音
            tabDownResponse.run();
        });
    }
}

// 同时按下shift和backspace键可清空输入框中的内容
function activateClearFunction(pageContainer, helperConfig) {

    if (!helperConfig.clearFunction.check) {
        return;
    }
    debugLog("activateClearFunction");
    $(document).bind('keydown', "shift+backspace", function () {
        // 同时按下shift和backspace键可清空输入框中的内容
        pageContainer.inputEdit.val("");
        if (!pageContainer.inputEdit.is(":focus")) {
            pageContainer.inputEdit.focus();
        }
    });

}

// 向翻译页面启动翻译助手
function activateTranslateHelper(pageContainer) {
    debugLog(pageContainer);
    if (typeof pageContainer !== "undefined" && pageContainer !== null) {
        // 加载配置
        loadHelperConfigFromChrome(function (helperConfig) {
            debugLog(helperConfig);
            insertHelperBtnGroup(pageContainer, helperConfig);
            activateFormatFunction(pageContainer, helperConfig);
            activateCopyTransFunction(pageContainer, helperConfig);
            activateFormatShortcutKeyFunction(pageContainer, helperConfig);
            activateForceFunction(pageContainer, helperConfig);
            activateSpeechFunction(pageContainer, helperConfig);
            activateClearFunction(pageContainer, helperConfig);
        });
    }
    else {
        console.log("翻译助手：未能识别的页面。")
    }
}