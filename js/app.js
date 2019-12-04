var KEY_BACKSPACE = 8;
var KEY_TAB = 9;
var KEY_SHIFT = 16;

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

// 发音，获取页面上发音元素的焦点
function listenSound(selector) {
    if (selector == null) {
        return;
    }
    var sound = $(selector).first();
    // if (sound.css("display") == "block") {
    //     sound.focus();
    // }
    if (sound.css("display") != "none") {
        sound.focus();
    }
}

function clickPerformance(ele,text){
    // 实现点击之后，显示提示字符
    var top = $(ele).offset().top;
    var left = $(ele).offset().left;
    var performanceEle = '<div class="performance" style="top:' + (top - 20) + 'px;left:' + left + 'px">' + text + '</div>';
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

function isBingTranslatePage(href){
    return href.search("cn.bing.com/translator") > -1;
}

// 标识当前是哪个翻译界面
var currentPage = null;

// 使用何种版本识别页面元素
var version = null;

// 按钮嵌入页面的方式
var mode = null;

// 插入页面的按钮放在该框内（解决在谷歌翻译页面不方便排版的问题）
var helperBtnGroupEle = null;

// 除换行按钮
var replaceLineEle = null;

// 复制按钮
var copyTransEle = null;

// 插入“除换行”和“复制”按钮的地方
var insertEle = null;

// 翻译界面的文字输入框
var inputEdit = null;

// 页面上的发音按钮
var listenEleSelector = null;

// 识别当前是哪个翻译界面，用于匹配相应的输入框
function matchElement(href, config) {
    if (isGoogleTranslatePage(href)) {
        // 谷歌翻译界面
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
            helperBtnGroupEle = '<div id="helper_btn_group" class="googleNew1"></div>';
            replaceLineEle = "<div id='replace_line' class='googleNew1'>除换行</div>";
            copyTransEle = "<div id='copy_trans' class='googleNew1' data-clipboard-action='copy'" +
                " data-clipboard-target='.result-shield-container.tlid-copy-target'>复制</div>";
        }
        else if (version == 'old') {
            insertEle = $("#gt-lang-right");
            inputEdit = $("textarea#source");
            listenEleSelector = "div#gt-src-listen";
            helperBtnGroupEle = '<div id="helper_btn_group" class="google"></div>';
            replaceLineEle = "<div id='replace_line' class='google'>除换行</div>";
            copyTransEle = "<div id='copy_trans' class='google' data-clipboard-action='copy'" +
                " data-clipboard-target='.result-shield-container.tlid-copy-target'>复制</div>";
        }
    }
    else if (isBaiduTranslatePage(href)) {
        // 百度翻译
        currentPage = 'baidu';
        // console.log("翻译助手：百度翻译页面");
        insertEle = $(".trans-operation").last();
        inputEdit = $("textarea#baidu_translate_input");
        listenEleSelector = "div.input-operate a";
        helperBtnGroupEle = '<div id="helper_btn_group" class="baidu"></div>';
        replaceLineEle = "<div id='replace_line' class='baidu'>除换行</div>";
        copyTransEle = "<div id='copy_trans' class='baidu' data-clipboard-action='copy'" +
            " data-clipboard-target='.output-bd'>复制</div>";
    }
    else if (isYouDaoTranslatePage(href)) {
        // 有道翻译
        currentPage = 'youdao';
        // console.log("翻译助手：有道翻译页面");
        insertEle = $(".fanyi__operations--left");
        inputEdit = $("textarea#inputOriginal");
        listenEleSelector = null;
        helperBtnGroupEle = '<div id="helper_btn_group" class="youdao"></div>';
        replaceLineEle = "<div id='replace_line' class='youdao'>除换行</div>";
        copyTransEle = "<div id='copy_trans' class='youdao' data-clipboard-action='copy'" +
            " data-clipboard-target='#transTarget'>复制</div>";
        // 有道翻译页面未找到发音按钮
        console.log("翻译助手：有道翻译页面未找到发音按钮");
    }
    else if (isBingTranslatePage(href)){
        // 必应翻译
        currentPage = 'bing';
        // console.log("翻译助手：必应翻译页面");
        insertEle = $(".t_select");
        inputEdit = $("textarea#t_sv");
        listenEleSelector = "#t_srcplayc #t_srcplaycIcon";
        helperBtnGroupEle = '<div id="helper_btn_group" class="bing"></div>';
        replaceLineEle = "<div id='replace_line' class='bing'>除换行</div>";
        copyTransEle = "<div id='copy_trans' class='bing' data-clipboard-action='copy'" +
            " data-clipboard-target='#t_tv'>复制</div>";
    }
    if (!currentPage)
    {
        // console.log("翻译助手：页面元素匹配失败。")
        return false;
    }
    return true;
}

// 在页面插入存放“除换行”“复制”按钮的框框
function insertHelperBtnGroup(config) {
    mode = config.replaceFunction.pageSetting[currentPage].mode;
    if (mode == "append") {
        insertEle.append(helperBtnGroupEle);
    }
    else if (mode == "html") {
        insertEle.html(insertEle.html() + helperBtnGroupEle)
    }
    helperBtnGroupEle = $('#helper_btn_group')
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
    if (mode == "append") {
        helperBtnGroupEle.append(replaceLineEle);
    }
    else if (mode == "html") {
        helperBtnGroupEle.html(helperBtnGroupEle.html() + replaceLineEle)
    }

    $("#replace_line").click(function () {
        // 点击“除换行”按钮，可自动去除待翻译文本中的大量换行符和空格（连续空格会变一个）。
        var replaced_text = inputEdit.val();
        replaced_text.trim()
        if (/.*[\u4e00-\u9fa5]+.*$/.test(replaced_text)){
            // 如果有中文，则将换行删除。
            // TODO: 此处可能误判，以后改进
            replaced_text = replaced_text.replace(/\n/g,''); 
        }
        else{
            // 如果不含中文，则将换行替换成空格
            // 感谢 @liyangorg 的代码和建议
            // 空行输出 && 单行末尾不是 . ，都需要用空格替换换行
            var buffer = '';
            replaced_text.trim().split('\n').forEach(function (line, i) {

                if (line.length == 0) {
                    line += '\n'
                } else if (line.trim().endsWith('.')) {
                    line += '\n'
                } else {
                    line += ' '
                }
                buffer += line;
            });
            replaced_text = buffer;
            // replaced_text = replaced_text.replace(/\n/g,' ');
        }
        // 将连续空格替换成单空格
        replaced_text = replaced_text.replace(/  /g, ' ');
        // 在内容末尾添加换行，方便接着复制下一块内容。
        replaced_text += '\n';
        inputEdit.val(replaced_text);
        clickPerformance(this,"已去除");
    });
    console.log("翻译助手：若未出现‘除换行’按钮，请右键点击本插件图标，在“选项”中尝试使用其他方式。");
}
// “复制到剪贴板”功能
function activateCopyTransFunction(config) {
    if (!config.copyTransFunction.check){
        return;
    }
    if (!ClipboardJS.isSupported()){
        console.log("当前浏览器不支持复制到剪贴板功能");
        return;
    }
    if (mode == "append") {
        helperBtnGroupEle.append(copyTransEle);
    }
    else if (mode == "html") {
        helperBtnGroupEle.html(helperBtnGroupEle.html() + copyTransEle)
    }
    var clipboard = new ClipboardJS('#copy_trans');
    clipboard.on('success', function(e) {
        clickPerformance('#copy_trans','已复制');
        e.clearSelection();
    });
    clipboard.on('error', function(e) {
        clickPerformance('#copy_trans','出错');
    });
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
        // 防止重复添加
        return;
    }
    var href = window.location.href;
    // 加载配置
    chrome.storage.sync.get(defaultConfig, function (items) {
        var config = items;
        // 添加功能
        if (matchElement(href, config))
        {
            insertHelperBtnGroup(config);
            activateReplaceFunction(config);
            activateCopyTransFunction(config);
            activateReplaceKeyFunction(config);
            activateForceFunction(config);
            activateSpeechFunction(config);
            activateClearFunction(config);
        }
    });
    hasHelper = true;
}

// 延时十秒自动添加。防止页面加载过久，下面函数失效？
setTimeout(addTranslateHelper, 10000);

$(document).ready(function () {
    addTranslateHelper();
});