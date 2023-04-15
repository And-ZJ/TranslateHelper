// 提示框
var hintTimeout = null;

function clearHint() {
    hintTimeout = null;
    $("#hint").text("");
}

function setHint(msg, time) {
    $("#hint").text(msg);
    if (typeof time === "undefined" || time === null) {
        time = 5000;
    }
    if (hintTimeout) {
        clearTimeout(hintTimeout)
    }
    if (time > 0) {
        hintTimeout = setTimeout(clearHint, time);
    }
}

// 快捷键的提示框
var shortcutKeyHintTimeout = null;

function clearShortcutKeyHint() {
    shortcutKeyHintTimeout = null;
    $("#format_shortcut_key_hint").text("");
}

function setShortcutKeyHint(msg, time) {
    $("#format_shortcut_key_hint").text(msg);
    if (typeof time === "undefined" || time === null) {
        time = 5000;
    }
    if (shortcutKeyHintTimeout) {
        clearTimeout(shortcutKeyHintTimeout)
    }
    if (time > 0) {
        shortcutKeyHintTimeout = setTimeout(clearShortcutKeyHint, time);
    }
}

// 从页面读取配置
function getHelperConfigFromOptionsPage() {
    var helperConfig = {
        'formatFunction': {
            'check': $('#format_function').prop('checked'),
            'formatConfig': {
                'formatTabToSpace': $('#format_tab_to_space').prop('checked'),
                'formatLineStartChar': $('#format_line_start_char').prop('checked'),
                'lineStartCharList': $('#line_start_char_list').val(),
                'formatLineEndChar': $('#format_line_end_char').prop('checked'),
                'lineEndCharList': $('#line_end_char_list').val(),
                'formatCRLFToSpace': $('#format_CRLF_to_space').prop('checked'),
                'formatRemainEmptyCRLF': $('#format_remain_empty_CRLF').prop('checked'),
                'formatSpaceTo1': $('#format_space_to_1').prop('checked'),
                'formatChineseCustomSpace': $('#format_chinese_custom_space').prop('checked'),
                'formatAddCRLFAtEnd': $('#format_add_CRLF_at_end').prop('checked'),
                'formatRemainTwoCRLFAtEnd': $("#format_remain_two_CRLF_at_end").prop('checked')
            },

            'pageSetting': {
                'google': {
                    'check': $('.translate_page_setting.google .check').prop('checked'),
                    'mode': $('.translate_page_setting.google .mode').val(),
                    // 'version': $('.translate_page_setting.google .version').val()
                },
                'googleCN': {
                    'check': $('.translate_page_setting.googleCN .check').prop('checked'),
                    'mode': $('.translate_page_setting.googleCN .mode').val(),
                    // 'version': $('.translate_page_setting.googleCN .version').val()
                },
                'googleCNHK': {
                    'check': $('.translate_page_setting.googleCNHK .check').prop('checked'),
                    'mode': $('.translate_page_setting.googleCNHK .mode').val(),
                    // 'version': $('.translate_page_setting.googleCNHK .version').val()
                },
                'baidu': {
                    'check': $('.translate_page_setting.baidu .check').prop('checked'),
                    'mode': $('.translate_page_setting.baidu .mode').val(),
                    'version': 'new1'
                },
                'youdao': {
                    'check': $('.translate_page_setting.youdao .check').prop('checked'),
                    'mode': $('.translate_page_setting.youdao .mode').val(),
                    'version': 'new1'
                },
                'bing': {
                    'check': $('.translate_page_setting.bing .check').prop('checked'),
                    'mode': $('.translate_page_setting.bing .mode').val(),
                    'version': 'new1'
                },
                'sogou': {
                    'check': $('.translate_page_setting.sogou .check').prop('checked'),
                    'mode': $('.translate_page_setting.sogou .mode').val(),
                    'version': 'new1'
                },
                'DeepL': {
                    'check': $('.translate_page_setting.DeepL .check').prop('checked'),
                    'mode': $('.translate_page_setting.DeepL .mode').val(),
                    'version': 'new1'
                }
            }
        },
        'formatShortcutKeyFunction': {
            'check': $('#format_shortcut_key_function').prop('checked'),
            'keyValue': $('#format_shortcut_key_value').val()
        },
        'copyTransFunction': {
            'check': $('#copy_trans_function').prop('checked')
        },
        'forceFunction': {
            'check': $('#force_function').prop('checked')
        },
        'speechFunction': {
            'check': $('#speech_function').prop('checked')
        },
        'clearFunction': {
            'check': $('#clear_function').prop('checked')
        }
    };
    return helperConfig;
}

// 将配置应用到页面
function setHelperConfigToOptionsPage(helperConfig) {
    $('#format_function').prop("checked", helperConfig.formatFunction.check);

    $('#format_tab_to_space').prop('checked', helperConfig.formatFunction.formatConfig.formatTabToSpace);
    $('#format_line_start_char').prop('checked', helperConfig.formatFunction.formatConfig.formatLineStartChar);
    $('#line_start_char_list').val(helperConfig.formatFunction.formatConfig.lineStartCharList);
    $('#format_line_end_char').prop('checked', helperConfig.formatFunction.formatConfig.formatLineEndChar);
    $('#line_end_char_list').val(helperConfig.formatFunction.formatConfig.lineEndCharList);
    $('#format_CRLF_to_space').prop('checked', helperConfig.formatFunction.formatConfig.formatCRLFToSpace);
    $('#format_remain_empty_CRLF').prop('checked', helperConfig.formatFunction.formatConfig.formatRemainEmptyCRLF);
    $('#format_space_to_1').prop('checked', helperConfig.formatFunction.formatConfig.formatSpaceTo1);
    $('#format_chinese_custom_space').prop('checked', helperConfig.formatFunction.formatConfig.formatChineseCustomSpace);
    $('#format_add_CRLF_at_end').prop('checked', helperConfig.formatFunction.formatConfig.formatAddCRLFAtEnd);
    $('#format_remain_two_CRLF_at_end').prop('checked', helperConfig.formatFunction.formatConfig.formatRemainTwoCRLFAtEnd);

    $('.translate_page_setting.google .check').prop("checked", helperConfig.formatFunction.pageSetting.google.check);
    $(".translate_page_setting.google .mode").find("option[value='" + helperConfig.formatFunction.pageSetting.google.mode + "']").prop("selected", true);
    // $('.translate_page_setting.google .version').find("option[value='" + helperConfig.formatFunction.pageSetting.google.version + "']").prop("selected", true);

    $('.translate_page_setting.googleCN .check').prop("checked", helperConfig.formatFunction.pageSetting.googleCN.check);
    $(".translate_page_setting.googleCN .mode").find("option[value='" + helperConfig.formatFunction.pageSetting.googleCN.mode + "']").prop("selected", true);
    // $('.translate_page_setting.googleCN .version').find("option[value='" + helperConfig.formatFunction.pageSetting.googleCN.version + "']").prop("selected", true);

    $('.translate_page_setting.googleCNHK .check').prop("checked", helperConfig.formatFunction.pageSetting.googleCNHK.check);
    $(".translate_page_setting.googleCNHK .mode").find("option[value='" + helperConfig.formatFunction.pageSetting.googleCNHK.mode + "']").prop("selected", true);
    // $('.translate_page_setting.googleCNHK .version').find("option[value='" + helperConfig.formatFunction.pageSetting.googleCNHK.version + "']").prop("selected", true);

    $('.translate_page_setting.baidu .check').prop("checked", helperConfig.formatFunction.pageSetting.baidu.check);
    $(".translate_page_setting.baidu .mode").find("option[value='" + helperConfig.formatFunction.pageSetting.baidu.mode + "']").prop("selected", true);
    // $('.translate_page_setting.baidu .version').find("option[value='" + helperConfig.formatFunction.pageSetting.baidu.version + "']").prop("selected", true);

    $('.translate_page_setting.youdao .check').prop("checked", helperConfig.formatFunction.pageSetting.youdao.check);
    $(".translate_page_setting.youdao .mode").find("option[value='" + helperConfig.formatFunction.pageSetting.youdao.mode + "']").prop("selected", true);
    // $('.translate_page_setting.youdao .version').find("option[value='" + helperConfig.formatFunction.pageSetting.youdao.version + "']").prop("selected", true);

    $('.translate_page_setting.bing .check').prop("checked", helperConfig.formatFunction.pageSetting.bing.check);
    $(".translate_page_setting.bing .mode").find("option[value='" + helperConfig.formatFunction.pageSetting.bing.mode + "']").prop("selected", true);
    // $('.translate_page_setting.bing .version').find("option[value='" + helperConfig.formatFunction.pageSetting.bing.version + "']").prop("selected", true);

    $('.translate_page_setting.sogou .check').prop("checked", helperConfig.formatFunction.pageSetting.sogou.check);
    $(".translate_page_setting.sogou .mode").find("option[value='" + helperConfig.formatFunction.pageSetting.sogou.mode + "']").prop("selected", true);
    // $('.translate_page_setting.sogou .version').find("option[value='" + helperConfig.formatFunction.pageSetting.sogou.version + "']").prop("selected", true);

    $('.translate_page_setting.DeepL .check').prop("checked", helperConfig.formatFunction.pageSetting.DeepL.check);
    $(".translate_page_setting.DeepL .mode").find("option[value='" + helperConfig.formatFunction.pageSetting.DeepL.mode + "']").prop("selected", true);

    $('#format_shortcut_key_function').prop("checked", helperConfig.formatShortcutKeyFunction.check);
    $('#key_value').val(helperConfig.formatShortcutKeyFunction.keyValue);
    $('#copy_trans_function').prop("checked", helperConfig.copyTransFunction.check);
    $('#force_function').prop("checked", helperConfig.forceFunction.check);
    $('#speech_function').prop("checked", helperConfig.speechFunction.check);
    $('#clear_function').prop("checked", helperConfig.clearFunction.check);

    $('#speech_function').prop("checked", false);
}


$(document).ready(function () {
    // 载入配置
    loadHelperConfigFromChrome(function (helperConfig) {
        setHelperConfigToOptionsPage(helperConfig)
    });

    // 保存配置按钮
    $('#save_helper_config_btn').click(function () {
        var helperConfig = getHelperConfigFromOptionsPage();
        debugLog(helperConfig);
        saveHelperConfigToChrome(helperConfig);
        setHint("配置已保存，已打开页面需刷新");
    });

    // 恢复默认配置按钮
    var restoreClickTimes = 0;
    $('#restore_helper_config_btn').click(function () {
        restoreClickTimes += 1;
        if (restoreClickTimes <= 1) {
            setHint("再点击一次，将恢复成默认配置");
        }
        else {
            saveHelperConfigToChrome(defaultHelperConfig_Newest);
            setHelperConfigToOptionsPage(defaultHelperConfig_Newest);
            restoreClickTimes = 0;
            setHint("已恢复成默认配置");
        }
    });

    // 快捷键测试
    var keyValue = null;

    function handleKey(event) {
        setShortcutKeyHint("检测到快捷键:" + event.data.keys);
        $(document).unbind('keydown');
        return false;
    }

    $('#format_shortcut_key_test_btn').click(function () {
        setShortcutKeyHint("请按快捷键");
        keyValue = $('#format_shortcut_key_value').val();
        $(document).bind('keydown', keyValue, handleKey);
    })
});