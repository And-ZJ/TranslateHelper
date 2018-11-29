var KEY_BACKSPACE = 8;
var KEY_TAB = 9;
var KEY_SHIFT = 16;

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

// 发音获取焦点
function listenSound(selector) {
    if (selector == null) {
        return;
    }
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

var currentPage = null;
var version = null;
var mode = null;
var replaceLineEle = null;
var insertEle = null;
var inputEdit = null;
var listenEleSelector = null;

function matchElement(href, config) {
    if (isGoogleTranslatePage(href)) {
        if (isGoogleTranslateCNPage(href)) {
            currentPage = 'googleCN';
        }
        else if (isGoogleTranslateCNHkPage(href)) {
            currentPage = 'googleCNHK';
        }
        else if (isGoogleTranslatePage(href)) {
            currentPage = 'google';
        }
        // console.log("翻译助手：谷歌翻译页面");
        version = config.replaceFunction.pageSetting[currentPage].version;
        if (version == "new1") {
            insertEle = $("div.sl-wrap");
            inputEdit = $("textarea#source");
            listenEleSelector = "div.src-tts";
            replaceLineEle = "<div id='replace_line' class='googleNew1'>除换行</div>";
        }
        else if (version == 'old') {
            insertEle = $("#gt-lang-right");
            inputEdit = $("textarea#source");
            listenEleSelector = "div#gt-src-listen";
            replaceLineEle = "<div id='replace_line' class='google'>除换行</div>";
        }
    }
    else if (isBaiduTranslatePage(href)) {
        // 百度翻译
        currentPage = 'baidu';
        // console.log("翻译助手：百度翻译页面");
        replaceLineEle = "<div id='replace_line' class='baidu'>除换行</div>";
        insertEle = $(".trans-operation").last();
        inputEdit = $("textarea#baidu_translate_input");
        listenEleSelector = "div.input-operate a";
    }
    else if (isYouDaoTranslatePage(href)) {
        // 有道翻译
        currentPage = 'youdao';
        // console.log("翻译助手：有道翻译页面");
        replaceLineEle = "<div id='replace_line' class='youdao'>除换行</div>";
        insertEle = $(".fanyi__operations--left");
        inputEdit = $("textarea#inputOriginal");
        // 有道翻译页面未找到发音按钮
        listenEleSelector = null;
        console.log("翻译助手：有道翻译页面未找到发音按钮");
    }
    if (!currentPage)
    {
        // console.log("翻译助手：页面元素匹配失败。")
        return false;
    }
    return true;
}


// “除换行”功能
function activateReplaceFunction(config) {
    if (!config.replaceFunction.check) {
        return;
    }
    if (!config.replaceFunction.pageSetting[currentPage].check)
    {
        return;
    }
    // console.log("activateReplaceFunction");
    mode = config.replaceFunction.pageSetting[currentPage].mode;
    if (mode == "append") {
        insertEle.append(replaceLineEle);
    }
    else if (mode == "html") {
        insertEle.html(insertEle.html() + replaceLineEle)
    }

    $("#replace_line").click(function () {
        // 点击“除换行”按钮，可自动去除待翻译文本中的大量换行符和空格（两个变成一个）。
        var text = inputEdit.val();
        var after_replace_text = text.replace(/\n/g, " ").replace(/  /g, " ");
        inputEdit.val(after_replace_text);
        replaceLineClickPerformance();
    });
    console.log("翻译助手：若未出现‘除换行’按钮，请右键点击本插件图标，在“选项”中尝试使用其他方式。");
}
// “除换行”功能的快捷键
function activateReplaceKeyFunction(config) {
    if (!config.replaceKeyFunction.check) {
        return;
    }
    // console.log("activateReplaceKeyFunction");
    $(document).bind('keydown', config.replaceKeyFunction.keyValue, function () {
        // 使用“除换行”的快捷键，可自动去除待翻译文本中的大量换行符和空格（两个变成一个）。
        var text = inputEdit.val();
        var after_replace_text = text.replace(/\n/g, " ").replace(/  /g, " ");
        inputEdit.val(after_replace_text);
    });
}
// 按下backspace键（删除键）可将焦点回到输入框。
function activateForceFunction(config) {
    if (!config.forceFunction.check) {
        return;
    }
    // console.log("activateForceFunction");
    $(document).bind('keydown', "backspace", function () {
        // 按下backspace键（删除键）可将焦点回到输入框。
        if (!inputEdit.is(":focus")) {
            var text = inputEdit.val();
            inputEdit.focus();
            setTimeout(function(){inputEdit.val(text)},100);
        }
    });
}

// 按下tab键，输入框的发音按钮自动获取焦点，此时再按下enter键，即可发音
function activateSpeechFunction(config) {
    if (!config.speechFunction.check) {
        return;
    }
    // console.log("activateSpeechFunction");
    var tabDownResponse = new DelayResponse(listenSound, listenEleSelector, 100);
    $(document).bind('keydown', "tab", function () {
        // 按下tab键，输入框的发音按钮自动获取焦点，此时再按下enter键，即可发音
        tabDownResponse.run();
    });
}
// 同时按下shift和backspace键可清空输入框中的内容
function activateClearFunction(config) {
    if (!config.clearFunction.check) {
        return;
    }
    // console.log("activateClearFunction");
    $(document).bind('keydown', "shift+backspace", function () {
        // 同时按下shift和backspace键可清空输入框中的内容
        inputEdit.val("");
        if (!inputEdit.is(":focus")) {
            inputEdit.focus();
        }
    });
}

var hasHelper = false;
function addTranslateHelper()
{
    if (hasHelper)
    {
        return;
    }
    var href = window.location.href;
    // 加载配置
    chrome.storage.sync.get(defaultConfig, function (items) {
        var config = items;
        // 添加功能
        if (matchElement(href, config))
        {
            activateReplaceFunction(config);
            activateReplaceKeyFunction(config);
            activateForceFunction(config);
            activateSpeechFunction(config);
            activateClearFunction(config);
        }
    });
    hasHelper = true;
}

setTimeout(addTranslateHelper, 10000);

$(document).ready(function () {
    addTranslateHelper();
});