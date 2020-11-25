// 本文件是测试时用的

// 启用 debugLog 函数的开关
var DEBUG_LOG = true;

// 测试旧版配置的开关（会在“选项”界面生成新的按钮）
// 并没有实现向浏览器写入旧版配置的功能，导致测试不完全
var DEBUG_OLD_HELPER_CONFIG = false;

// 测试格式化功能的开关（会在“格式化”配置中生成新的按钮）
// 依赖于function-format.js中“testFormatFunction”函数的完整度，但目前没写好。
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
