// 在翻译网页上，会触发本js
// 由本js向网页写入按钮，实现相应的功能。

function identifyReady(pageContainer) {
    return typeof pageContainer !== "undefined" && pageContainer !== null;
}

$(document).ready(function () {
    // 来自 functions.js
    var loopTry = function (wait) {
        // 某些网页的页面可能是动态生成的，导致第一时间获取网页上的元素失败。
        // 因此设计了如下逻辑，在一定间隔之后进行重试。
        // 第一次立即识别，失败则等1000ms进行第二次识别，
        // 如果继续失败，则等待时间再加1000ms。
        // 如果等待时间超过了5000ms，则不再重试。
        var pageContainer = matchTranslatePage(window.location.href);
        if (identifyReady(pageContainer)) {
            activateTranslateHelper(pageContainer);
            return;
        }
        inactiveTranslateHelper(); // 去除掉页面上的按钮，以防止若有BUG导致页面上存放很多按钮。
        if (typeof wait === "undefined" || isNaN(wait) || wait < 0 || wait >= 5000) {
            console.log("翻译助手：抱歉，重试失败，可能是页面改版等原因。建议通过Github或邮件联系开发者。谢谢。")
            return;
        }
        var nextWait = wait + 1000
        console.log("翻译助手：页面元素识别失败。等待" + nextWait + "ms后重试")
        setTimeout(loopTry, nextWait, nextWait)
    };
    loopTry(0)
});
