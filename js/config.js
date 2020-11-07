// 默认配置
// 当前最新版本的配置
var defaultHelperConfig_2020_11_07 = {
    'version': '2020-11-07',
    'formatFunction': {
        'check': true,
        'formatConfig': {
            'formatTabToSpace': true,
            'formatLineStartChar': false,
            'lineStartCharList': '%#/',
            'formatLineEndChar': false,
            'lineEndCharList': '',
            'formatCRLFToSpace': true,
            'formatRemainEmptyCRLF': true,
            'formatSpaceTo1': true,
            'formatChineseCustomSpace': true,
            'formatAddCRLFAtEnd': true,
            "formatRemainTwoCRLFAtEnd": true
        },
        'pageSetting': {
            'google': {
                'check': true,
                'mode': 'append',
                'version': 'new1'
            },
            'googleCN': {
                'check': true,
                'mode': 'append',
                'version': 'new1'
            },
            'googleCNHK': {
                'check': true,
                'mode': 'append',
                'version': 'new1'
            },
            'baidu': {
                'check': true,
                'mode': 'append',
                'version': 'new1'
            },
            'youdao': {
                'check': true,
                'mode': 'append',
                'version': 'new1'
            },
            'bing': {
                'check': true,
                'mode': 'append',
                'version': 'new1'
            },
            'sogou': {
                'check': true,
                'mode': 'append',
                'version': 'new1'
            }
        }
    },
    'formatShortcutKeyFunction': {
        'check': true,
        'keyValue': "ctrl+/"
    },
    'copyTransFunction': {
        'check': true
    },
    'forceFunction': {
        'check': false
    },
    'speechFunction': {
        'check': false
    },
    'clearFunction': {
        'check': false
    }
};

var defaultHelperConfig_Newest = defaultHelperConfig_2020_11_07;

/**
 * 深拷贝
 * https://github.com/vuejs/vuex/blob/dev/src/util.js#L22
 * https://www.jianshu.com/p/6b0260d599a0
 * @param {*} obj 拷贝对象(object or array)
 * @param {*} cache 缓存数组
 */
function deepCopy(obj, cache) {
    // typeof [] => 'object'
    // typeof {} => 'object'
    if (obj === null || typeof obj !== 'object') {
        return obj
    }
    if (typeof cache === "undefined" || cache === null) {
        cache = [];
    }
    const hit = cache.filter(function (c) {
            return c.original === obj
        }
    )[0];

    if (hit) {
        return hit.copy;
    }

    const copy = Array.isArray(obj) ? [] : {};
    cache.push({
        'original': obj,
        'copy': copy
    });
    Object.keys(obj).forEach(function (key) {
        copy[key] = deepCopy(obj[key], cache)
    });
    return copy;
}

// 由于通过Chrome保存的是可能是旧版配置，因此，需要转成新版配置
function convertToNewestHelperConfig(helperConfig) {
    if (typeof helperConfig.version !== "undefined" && helperConfig.version === defaultHelperConfig_Newest.version) {
        debugLog('version newest');
        // 当前的版本2020-11-07
        return helperConfig;
    }

    if (typeof helperConfig.version === "undefined" || helperConfig.version === null) {
        // 如果读到的config是 old 版本，则转换到版本2020-04-20
        debugLog('version old');
        console.log("翻译助手：您正在使用旧版配置，请通过保存按钮，保存新版配置");
        var newHelperConfig = deepCopy(helperConfig);
        newHelperConfig.version = defaultHelperConfig_2020_04_20.version;
        newHelperConfig.formatFunction = helperConfig.replaceFunction;
        delete newHelperConfig.replaceFunction;
        newHelperConfig.formatShortcutKeyFunction = helperConfig.replaceKeyFunction;
        delete newHelperConfig.replaceKeyFunction;
        newHelperConfig.formatFunction.formatConfig = defaultHelperConfig_2020_04_20.formatFunction.formatConfig;
        helperConfig = newHelperConfig;
    }
    if (typeof helperConfig.version !== "undefined" && helperConfig.version === defaultHelperConfig_2020_04_20.version) {
        // 如果读到的config是 2020-04-20 版本，则转换到版本2020-11-07
        debugLog('version ' + defaultHelperConfig_2020_04_20.version);
        console.log("翻译助手：您正在使用旧版配置，请通过保存按钮，保存新版配置");
        var newHelperConfig = deepCopy(helperConfig);
        newHelperConfig.formatFunction.formatConfig.formatRemainTwoCRLFAtEnd =
            defaultHelperConfig_2020_11_07.formatFunction.formatConfig.formatRemainTwoCRLFAtEnd;
        newHelperConfig.formatFunction.pageSetting.sogou = defaultHelperConfig_2020_11_07.formatFunction.pageSetting.sogou;
        helperConfig = newHelperConfig;
    }
    return helperConfig;
}

// 保存配置
function saveHelperConfigToChrome(helperConfig, callback) {
    chrome.storage.sync.set(helperConfig, callback);
}

// 加载配置
function loadHelperConfigFromChrome(callback) {
    chrome.storage.sync.get(defaultHelperConfig_Newest, function (items) {
        var helperConfig = convertToNewestHelperConfig(items);
        if (typeof callback !== "undefined" || callback !== null) {
            callback(helperConfig);
        }

    });
}

// 下面是旧配置，仅在版本转换时用到
var defaultConfig_old = {
    // 2020-04-20 修改前的旧版
    'replaceFunction': {
        'check': true,
        'pageSetting': {
            'google': {
                'check': true,
                'mode': 'append',
                'version': 'new1'
            },
            'googleCN': {
                'check': true,
                'mode': 'append',
                'version': 'new1'
            },
            'googleCNHK': {
                'check': true,
                'mode': 'append',
                'version': 'new1'
            },
            'baidu': {
                'check': true,
                'mode': 'append',
                'version': 'new1'
            },
            'youdao': {
                'check': true,
                'mode': 'append',
                'version': 'new1'
            },
            'bing': {
                'check': true,
                'mode': 'append',
                'version': 'new1'
            }
        }
    },
    'replaceKeyFunction': {
        'check': true,
        'keyValue': "ctrl+/"
    },
    'copyTransFunction': {
        'check': true
    },
    'forceFunction': {
        'check': false
    },
    'speechFunction': {
        'check': false
    },
    'clearFunction': {
        'check': false
    }
};

var defaultHelperConfig_2020_04_20 = {
    'version': '2020-04-20',
    'formatFunction': {
        'check': true,
        'formatConfig': {
            'formatTabToSpace': true,
            'formatLineStartChar': false,
            'lineStartCharList': '%#/',
            'formatLineEndChar': false,
            'lineEndCharList': '',
            'formatCRLFToSpace': true,
            'formatRemainEmptyCRLF': true,
            'formatSpaceTo1': true,
            'formatChineseCustomSpace': true,
            'formatAddCRLFAtEnd': true
        },
        'pageSetting': {
            'google': {
                'check': true,
                'mode': 'append',
                'version': 'new1'
            },
            'googleCN': {
                'check': true,
                'mode': 'append',
                'version': 'new1'
            },
            'googleCNHK': {
                'check': true,
                'mode': 'append',
                'version': 'new1'
            },
            'baidu': {
                'check': true,
                'mode': 'append',
                'version': 'new1'
            },
            'youdao': {
                'check': true,
                'mode': 'append',
                'version': 'new1'
            },
            'bing': {
                'check': true,
                'mode': 'append',
                'version': 'new1'
            }
        }
    },
    'formatShortcutKeyFunction': {
        'check': true,
        'keyValue': "ctrl+/"
    },
    'copyTransFunction': {
        'check': true
    },
    'forceFunction': {
        'check': false
    },
    'speechFunction': {
        'check': false
    },
    'clearFunction': {
        'check': false
    }
};