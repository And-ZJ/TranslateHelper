var KEY_BACKSPACE = 8;
var KEY_TAB = 9;
var KEY_SHIFT = 16;


var hasHelper = false;

//延时响应
function DelayResponse(delayFun, parameter, timeDelay) {
    var oneTimeout = null;
    var timeoutFun = function () {
        if (oneTimeout != null) {
            oneTimeout = null;
        }
        if (delayFun != null) {
            delayFun(parameter);
        }
    };

    this.run = function () {
        if (oneTimeout == null) {
            oneTimeout = setTimeout(timeoutFun, timeDelay);
        }
    }
}

function listenSound(selector) {
    var sound = $(selector).first();
    if (sound.css("display") == "block") {
        sound.focus();
        // sound.trigger();
    }
}

function replaceLineClickPerformance() {
    // 实现点击之后，显示并删除“已去除”字样
    var top = $("#replace_line").offset().top;
    var left = $("#replace_line").offset().left;
    var performanceEle = '<div class="performance" style="top:' + (top - 20) + 'px;left:' + left + 'px">已去除</div>';
    $('body').append(performanceEle);
    $('div.performance').animate({'top': top - 60}, 'slow', function () {
        $(this).remove();
    })
}

function isGoogleTranslatePage(href) {
    return href.search("translate.google.cn") > -1 || href.search("translate.google.com") > -1;
}

function isBaiduTranslatePage(href) {
    return href.search("fanyi.baidu.com") > -1;
}

function isBaiduSearchResultPage(href) {
    return href.search("www.baidu.com") > -1;
}

function isBaiduZhidaoPage(href) {
    return href.search("zhidao.baidu.com") > -1;
}


function addHelper() {
    if (hasHelper == true) {
        return;
    }
    var href = window.location.href;
    var replaceLineEle = null;
    var insertEle = null;
    var inputEdit = null;
    var listenEleSelector = null;

    if (isBaiduTranslatePage(href)) {
        replaceLineEle = "<div id='replace_line' class='baidu'>除换行</div>";
        insertEle = $(".trans-operation").last();
        inputEdit = $("textarea#baidu_translate_input");
        listenEleSelector = "div.input-operate a";
    }
    else if (isGoogleTranslatePage(href)) {
        replaceLineEle = "<div id='replace_line' class='google'>除换行</div>";
        insertEle = $("#gt-lang-src");
        inputEdit = $("textarea#source");
        listenEleSelector = "div#gt-src-listen";
    }
    else {
        if (isBaiduSearchResultPage(href)) {
            return;
        }
        console.log("翻译助手插件无法起作用：网址不匹配。");
        return;
    }
    if (replaceLineEle == null || insertEle == null || inputEdit == null || listenEleSelector == null) {
        console.log("翻译助手插件无法起作用：页面元素匹配失败。");
        return;
    }

    insertEle.append(replaceLineEle);

    var tabDownResponse = new DelayResponse(listenSound, listenEleSelector, 100);

    $("#replace_line").click(function () {
        // 点击“除换行”按钮，可自动去除待翻译文本中的大量换行符。
        var text = inputEdit.val();
        var after_replace_text = text.replace(/\n/g, " ");
        inputEdit.val(after_replace_text);
        replaceLineClickPerformance();
    });

    $(document).keydown(function (event) {

        if (event.shiftKey && event.keyCode == KEY_BACKSPACE) {
            // 同时按下shift和backspace键可清空输入框中的内容
            inputEdit.val("");
            if (!inputEdit.is(":focus")) {
                inputEdit.focus();
            }
        }
        else if (event.keyCode == KEY_BACKSPACE) {
            // 按下backspace键（删除键）可将焦点回到输入框。
            if (!inputEdit.is(":focus")) {
                inputEdit.focus();
            }
        }
        else if (event.keyCode == KEY_TAB) {
            // 按下tab键，输入框的发音按钮自动获取焦点，此时再按下enter键，即可发音
            tabDownResponse.run();
        }


    });
    console.log("翻译助手插件已启用");
    hasHelper = true;
}

var num;

function baiduSearchBtnClickFun() {
    $("input#su").click(function () {
        num = $("div#content_left div").length;
        console.log(num);
        setTimeout(removeBaiduSearchAd, 500);
    });
}

function removeBaiduSearchAd() {
    console.log($("div#content_left").children().length);
    $("div#content_left").children().each(function () {
        var th = $(this);
        if (th.find('span[data-tuiguang]').length > 0) {
            //console.log("mark");
            th.remove();
        }
        else {
            console.log(th.find("span.m").length);
            th.find("span.m").css({
                "background": "yellow",
                "z-index": "99"
            });
        }
    });
    console.log($('span[data-tuiguang]').length);
    $('span[data-tuiguang]').css({
        "background": "yellow",
        "z-index": "99"
    });
    num = $("div#content_left div").length;
    console.log(num);
}

setTimeout(addHelper, 10000);

$(document).ready(function () {
    addHelper();
    // if (isBaiduSearchResultPage(window.location.href)) {
    //     baiduSearchBtnClickFun();
    //     removeBaiduSearchAd();
    // }
});
