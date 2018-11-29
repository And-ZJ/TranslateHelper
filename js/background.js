chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    // 实现在翻译界面上插件按钮高亮
                    new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlContains: 'fanyi.baidu.com'}}),
                    new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlContains: 'translate.google'}}),
                    new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlContains: 'http://fanyi.youdao.com/'}})
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }
        ]);
    });
});
