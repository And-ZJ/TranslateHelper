var DEBUG_LOG = false;
var DEBUG_OLD_HELPER_CONFIG = false;
var DEBUG_FORMAT = false;

function debugLog() {
    if (DEBUG_LOG) {
        console.log(Array.prototype.slice.call(arguments));
    }
}

$(document).ready(function () {
    if (DEBUG_OLD_HELPER_CONFIG) {
        // 测试旧版配置
        var ele = $("#test_transform_old_helper_config_btn");
        if (ele) {
            ele.click(function () {
                var helperConfig = convertToNewestHelperConfig(defaultConfig_old);
                setHelperConfigToOptionsPage(helperConfig);
                setHint("测试旧版配置转换");
            });
            ele.show();
        }
        ele = $("#test_save_old_helper_config_btn");
        if (ele) {
            ele.click(function () {
                saveHelperConfigToChrome(defaultConfig_old);
                console.log(defaultConfig_old);
                setHint("测试保存旧版配置");
            });
            ele.show();
        }
        ele = $("#test_load_helper_config_btn");
        if (ele) {
            ele.click(function () {
                chrome.storage.sync.get(defaultHelperConfig_Newest, function (items) {
                    console.log(items.version, items);
                });
                setHint("测试读取配置");
            });
            ele.show();
        }

    }
    if (DEBUG_FORMAT) {
        var ele = $("#test_format_btn");
        if (ele) {
            ele.click(function () {
                testFormatFunction();
            });
            ele.show();
        }
    }
});
