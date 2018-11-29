// 提示框
var hintTimeout = null;
function clearHint() {
    hintTimeout = null;
    $("#hint").text("");
}
function setHint(msg, time) {
    $("#hint").text(msg);
    if (time == undefined || time == null) {
        time = 5000;
    }
    if (hintTimeout)
    {
        clearTimeout(hintTimeout)
    }
    if (time > 0) {
        hintTimeout = setTimeout(clearHint, time);
    }
}
// 保存配置
function saveConfig(config) {
    chrome.storage.sync.set(config, function () {
    });
}
// 加载配置
function loadConfig() {
    chrome.storage.sync.get(defaultConfig, function (items) {
        setConfigToWeb(items);
    });
}
// 恢复默认
function restoreConfig() {
    setConfigToWeb(defaultConfig);
    chrome.storage.sync.set(defaultConfig, function () {
    });
}
// 从页面读取配置
function getConfigFromWeb() {
    var config = {
        'replaceFunction': {
            'check': $('#replaceFunction').prop('checked'),
            'pageSetting': {
                'google': {
                    'check': $('.translatePageSetting.google .check').prop('checked'),
                    'mode': $('.translatePageSetting.google .mode').val(),
                    'version': $('.translatePageSetting.google .version').val()
                },
                'googleCN': {
                    'check': $('.translatePageSetting.googleCN .check').prop('checked'),
                    'mode': $('.translatePageSetting.googleCN .mode').val(),
                    'version': $('.translatePageSetting.googleCN .version').val()
                },
                'googleCNHK': {
                    'check': $('.translatePageSetting.googleCNHK .check').prop('checked'),
                    'mode': $('.translatePageSetting.googleCNHK .mode').val(),
                    'version': $('.translatePageSetting.googleCNHK .version').val()
                },
                'baidu': {
                    'check': $('.translatePageSetting.baidu .check').prop('checked'),
                    'mode': $('.translatePageSetting.baidu .mode').val(),
                    'version': 'new1'
                },
                'youdao': {
                    'check': $('.translatePageSetting.youdao .check').prop('checked'),
                    'mode': $('.translatePageSetting.youdao .mode').val(),
                    'version': 'new1'
                }
            }
        },
        'replaceKeyFunction': {
            'check': $('#replaceKeyFunction').prop('checked'),
            'keyValue': $('#keyValue').val()
        },
        'forceFunction': {
            'check': $('#forceFunction').prop('checked')
        },
        'speechFunction': {
            'check': $('#speechFunction').prop('checked')
        },
        'clearFunction': {
            'check': $('#clearFunction').prop('checked')
        }
    };
    return config;
}
// 将配置应用到页面
function setConfigToWeb(config) {
    $('#replaceFunction').prop("checked", config.replaceFunction.check);

    $('.translatePageSetting.google .check').prop("checked", config.replaceFunction.pageSetting.google.check);
    $(".translatePageSetting.google .mode").find("option[value='" + config.replaceFunction.pageSetting.google.mode + "']").prop("selected", true);
    $('.translatePageSetting.google .version').find("option[value='" + config.replaceFunction.pageSetting.google.version + "']").prop("selected", true);

    $('.translatePageSetting.googleCN .check').prop("checked", config.replaceFunction.pageSetting.googleCN.check);
    $(".translatePageSetting.googleCN .mode").find("option[value='" + config.replaceFunction.pageSetting.googleCN.mode + "']").prop("selected", true);
    $('.translatePageSetting.googleCN .version').find("option[value='" + config.replaceFunction.pageSetting.googleCN.version + "']").prop("selected", true);

    $('.translatePageSetting.googleCNHK .check').prop("checked", config.replaceFunction.pageSetting.googleCNHK.check);
    $(".translatePageSetting.googleCNHK .mode").find("option[value='" + config.replaceFunction.pageSetting.googleCNHK.mode + "']").prop("selected", true);
    $('.translatePageSetting.googleCNHK .version').find("option[value='" + config.replaceFunction.pageSetting.googleCNHK.version + "']").prop("selected", true);

    $('.translatePageSetting.baidu .check').prop("checked", config.replaceFunction.pageSetting.baidu.check);
    $(".translatePageSetting.baidu .mode").find("option[value='" + config.replaceFunction.pageSetting.baidu.mode + "']").prop("selected", true);
    $('.translatePageSetting.baidu .version').find("option[value='" + config.replaceFunction.pageSetting.baidu.version + "']").prop("selected", true);

    $('.translatePageSetting.youdao .check').prop("checked", config.replaceFunction.pageSetting.youdao.check);
    $(".translatePageSetting.youdao .mode").find("option[value='" + config.replaceFunction.pageSetting.youdao.mode + "']").prop("selected", true);
    $('.translatePageSetting.youdao .version').find("option[value='" + config.replaceFunction.pageSetting.youdao.version + "']").prop("selected", true);


    $('#replaceKeyFunction').prop("checked", config.replaceKeyFunction.check);
    $('#keyValue').val(config.replaceKeyFunction.keyValue);
    $('#forceFunction').prop("checked", config.forceFunction.check);
    $('#speechFunction').prop("checked", config.speechFunction.check);
    $('#clearFunction').prop("checked", config.clearFunction.check);
}


$(document).ready(function () {
    // 载入配置
    loadConfig();
    // 保存配置按钮
    $('#saveConfig').click(function () {
        var config = getConfigFromWeb();
        saveConfig(config);
        setHint("配置已保存，已打开页面需刷新");
    });
    // 恢复默认配置按钮
    var restoreClickTimes = 0;
    $('#restoreConfig').click(function () {
        restoreClickTimes += 1;
        if (restoreClickTimes <= 1) {
            setHint("再点击一次，将恢复成默认配置");
        }
        else {
            restoreConfig();
            restoreClickTimes = 0;
            setHint("已恢复成默认配置");
        }
    });


    // 快捷键测试
    var keyValue = null;

    function handleKey(event) {
        setHint("检测到快捷键:"+event.data.keys);
        $(document).unbind('keydown');
        return false;
    }

    $('#keyTest').click(function () {
        setHint("请按快捷键");
        keyValue = $('#keyValue').val();
        $(document).bind('keydown', keyValue,handleKey);
    })
});