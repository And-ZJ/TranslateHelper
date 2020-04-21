// 从页面读取配置
function getFormatConfigFromPopupPage() {
    var formatConfig = {
        'formatTabToSpace': $('#format_tab_to_space').prop('checked'),
        'formatLineStartChar': $('#format_line_start_char').prop('checked'),
        'lineStartCharList': $('#line_start_char_list').val(),
        'formatLineEndChar': $('#format_line_end_char').prop('checked'),
        'lineEndCharList': $('#line_end_char_list').val(),
        'formatCRLFToSpace': $('#format_CRLF_to_space').prop('checked'),
        'formatRemainEmptyCRLF': $('#format_remain_empty_CRLF').prop('checked'),
        'formatSpaceTo1': $('#format_space_to_1').prop('checked'),
        'formatChineseCustomSpace': $('#format_chinese_custom_space').prop('checked'),
        'formatAddCRLFAtEnd': $('#format_add_CRLF_at_end').prop('checked')

    };
    return formatConfig;
}

// 将配置应用到页面
function setFormatConfigToPopupPage(formatConfig) {

    $('#format_tab_to_space').prop('checked', formatConfig.formatTabToSpace);
    $('#format_line_start_char').prop('checked', formatConfig.formatLineStartChar);
    $('#line_start_char_list').val(formatConfig.lineStartCharList);
    $('#format_line_end_char').prop('checked', formatConfig.formatLineEndChar);
    $('#line_end_char_list').val(formatConfig.lineEndCharList);
    $('#format_CRLF_to_space').prop('checked', formatConfig.formatCRLFToSpace);
    $('#format_remain_empty_CRLF').prop('checked', formatConfig.formatRemainEmptyCRLF);
    $('#format_space_to_1').prop('checked', formatConfig.formatSpaceTo1);
    $('#format_chinese_custom_space').prop('checked', formatConfig.formatChineseCustomSpace);
    $('#format_add_CRLF_at_end').prop('checked', formatConfig.formatAddCRLFAtEnd);

}

function loadFormatConfigFromChrome(callback) {
    loadHelperConfigFromChrome(function (helperConfig) {
        callback(helperConfig.formatFunction.formatConfig)
    });
}

function saveFormatConfigToChrome(newFormatConfig, callback) {
    loadHelperConfigFromChrome(function (helperConfig) {
        helperConfig.formatFunction.formatConfig = newFormatConfig;
        saveHelperConfigToChrome(helperConfig, callback);
    });
}


function registerFormatBtn(pageContainer) {
    pageContainer.formatBtnEle.click(function () {
        // 点击“格式化”按钮
        var originalText = pageContainer.inputEdit.val();
        var formatConfig = getFormatConfigFromPopupPage();
        var formattedText = handleTextFormat(originalText, formatConfig);
        pageContainer.inputEdit.val(formattedText);
        clickPerformanceAtEle(this, "格式化");
    });
}

function registerFormatShortcutKey(pageContainer, helperConfig) {
    $(document).bind('keydown', helperConfig.formatShortcutKeyFunction.keyValue, function () {
        var originalText = pageContainer.inputEdit.val();
        var formatConfig = getFormatConfigFromPopupPage();
        var formattedText = handleTextFormat(originalText, formatConfig);
        pageContainer.inputEdit.val(formattedText);
    });
}

function registerCopyFunctionBtn(pageContainer) {
    pageContainer.copyTransBtnEle.on('success', function (e) {
        clickPerformanceAtEle("#copy_trans_function_btn", '复制');
        e.clearSelection();
    });
    pageContainer.copyTransBtnEle.on('error', function (e) {
        clickPerformanceAtEle("#copy_trans_function_btn", '出错');
        e.clearSelection();
    });
}

function registerClearFunctionBtn(pageContainer) {
    if (pageContainer.isPopupPage()) {
        pageContainer.clearBtnEle.click(function () {
            pageContainer.inputEdit.val("");
            clickPerformanceAtEle(this, '已清空');
        });
    }
}

function registerSaveFormatConfigBtn() {
    $("#save_format_config_btn").click(function () {
        var newFormatConfig = getFormatConfigFromPopupPage();
        saveFormatConfigToChrome(newFormatConfig);
        clickPerformanceAtEle(this, '已保存');
    });
}


$(document).ready(function () {
    var pageContainer = matchTranslatePage(window.location.href);
    // activateTranslateHelper(pageContainer);
    registerClearFunctionBtn(pageContainer);
    loadHelperConfigFromChrome(function (helperConfig) {
        setFormatConfigToPopupPage(helperConfig.formatFunction.formatConfig);
        registerFormatShortcutKey(pageContainer,helperConfig);
    });
    registerFormatBtn(pageContainer);
    registerCopyFunctionBtn(pageContainer);
    registerSaveFormatConfigBtn();
});


// $('')