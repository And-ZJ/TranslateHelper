// 在翻译网页上，会触发本js
// 由本js向网页写入按钮，实现相应的功能。
$(document).ready(function () {
    // 来自 functions.js
    var pageContainer = matchTranslatePage(window.location.href);
    activateTranslateHelper(pageContainer);
});
