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
    if (selector == null)
    {
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

function isGoogleTranslateCNPage(href)
{
    return href.search("translate.google.cn") > -1
}

function isGoogleTranslatePage(href) {
    return href.search("translate.google.com") > -1;
}

function isBaiduTranslatePage(href) {
    return href.search("fanyi.baidu.com") > -1;
}

function isYouDaoTranslatePage(href){
    return href.search("fanyi.youdao.com") > -1;
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
        // 百度翻译
        // https://fanyi.baidu.com/
        replaceLineEle = "<div id='replace_line' class='baidu'>除换行</div>";
        insertEle = $(".trans-operation").last();
        inputEdit = $("textarea#baidu_translate_input");
        listenEleSelector = "div.input-operate a";
    }
    else if (isGoogleTranslatePage(href)) {
        // 谷歌翻译
        // https://translate.google.com 以及 https://translate.google.com.hk 等
        replaceLineEle = "<div id='replace_line' class='google'>除换行</div>";
        insertEle = $("#gt-lang-right");
        inputEdit = $("textarea#source");
        listenEleSelector = "div#gt-src-listen";
    }
    else if (isGoogleTranslateCNPage(href)) {
        // 谷歌翻译中国区
        // https://translate.google.cn/
        replaceLineEle = "<div id='replace_line' class='google'>除换行</div>";
        insertEle = $("#gt-lang-right"); //$(".sl-wrap"); 
        inputEdit = $("textarea#source");
        listenEleSelector = "div#gt-src-listen"; //"div.src-tts";
    }
    else if (isYouDaoTranslatePage(href)){
        // 有道翻译
        replaceLineEle = "<div id='replace_line' class='youdao'>除换行</div>";
        insertEle = $(".fanyi__operations--left");
        inputEdit = $("textarea#inputOriginal");
        // 有道翻译页面未找到发音按钮
        listenEleSelector = null;
        console.log("有道翻译页面未找到发音按钮");
    }
    else {
        console.log("翻译助手插件无法起作用：网址不匹配。");
        return;
    }
    if (replaceLineEle == null || insertEle == null || inputEdit == null) {
        console.log("翻译助手插件无法起作用：页面元素匹配失败。");
        return;
    }

    // 谷歌翻译界面有时候存在无法出现“除换行”按钮的情况，若页面并未改版，并且多次刷新界面还是没有用，可考虑以下解决方案：
    // 第一步：将第127行前面的双斜杠‘//’去除
    // 第二步：将第128行前面添加双斜杠‘//’
    // 第三步：打开浏览器的拓展插件管理界面，重新加载本插件。
    // 第四步：打开相关翻译界面，查看是否解决问题。
    // 注意：勿改动本代码文件的其他代码。
    // 若页面改版，或此法不生效，可联系作者。
    //insertEle.html(insertEle.html()+replaceLineEle) // 去除本行最前面的双斜杠‘//’
    insertEle.append(replaceLineEle);               // 本行最前面添加双斜杠‘//’

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
    console.log("若未出现‘除换行’按钮，请查看附带的'README.rst'文件");
    hasHelper = true;
}

setTimeout(addHelper, 10000);

$(document).ready(function () {
    addHelper();
});
