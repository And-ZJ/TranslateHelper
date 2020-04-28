// 本文件是对字符串实现格式化的具体实现函数

// 从行首删除字符
function handleTextFormat_lineStartChar(text, lineStartCharList) {
    var buffer = '';
    var lines = text.split('\n');
    lines.forEach(function (line, lineNum) {
        var i = 0;
        var flag = false;
        for (; i < line.length; ++i) {
            var c = line[i];
            if (lineStartCharList.indexOf(c) >= 0) {
                // 在跳过可能的空格和tab之后，如果发现了待删除字符，则标记应删除。
                flag = true;
                break;
            }
            else if (c !== '\t' && c !== ' ') {
                // 在跳过可能的空格和tab之后，并没有先遇见待删除字符，则不从行首删除字符
                flag = false;
                break;
            }
            // 跳过空格和tab
        }
        if (!flag) {
            buffer += line;
        }
        else {
            // 先加上跳过的空格和tab
            var lineBuffer = line.slice(0, i);
            for (; i < line.length; ++i) {
                var c = line[i];
                if (lineStartCharList.indexOf(c) < 0) {
                    // 检测可删除字符到哪里，遇到不应删除字符后，跳出
                    break;
                }
            }
            // 从 i 之后是不应删除字符，所以加上
            lineBuffer += line.slice(i);
            buffer += lineBuffer;
        }
        if (lineNum !== lines.length - 1) {
            // 呃，也可以采用join实现
            buffer += '\n';
        }
    });
    return buffer;
}

// 从行尾删除字符
function handleTextFormat_lineEndChar(text, lineEndCharList) {
    var buffer = '';
    var lines = text.split('\n');
    lines.forEach(function (line, lineNum) {
        var i = line.length - 1;
        var flag = false;
        for (; i >= 0; --i) {
            var c = line[i];
            if (lineEndCharList.indexOf(c) >= 0) {
                flag = true;
                break;
            }
            else if (c !== '\t' && c !== ' ') {
                flag = false;
                break;
            }
        }
        if (!flag) {
            buffer += line;
        }
        else {
            var lineBuffer = line.slice(i + 1);
            for (; i >= 0; --i) {
                var c = line[i];
                if (lineEndCharList.indexOf(c) < 0) {
                    break;
                }
            }
            lineBuffer = line.slice(0, i + 1) + lineBuffer;
            buffer += lineBuffer;
        }
        if (lineNum !== lines.length - 1) {
            buffer += '\n';
        }
    });

    return buffer;
}

// 将换行符转换空格
function handleTextFormat_CRLFToSpace(text, formatRemainEmptyCRLF) {
    var buffer = '';
    var lines = text.split('\n');
    lines.forEach(function (line, lineNum) {
        buffer += line;
        if (lineNum !== lines.length - 1) {
            // 上述判断是防止在最后一行添加了空格，因为最后一行的最后并没有换行符，所以不能加空格
            if (formatRemainEmptyCRLF && line.trim().length === 0) {
                // 保留空行，在该行非空字串长度为0的情况下。
                buffer += '\n';
                if (lineNum >= 1 && lines[lineNum - 1].trim().length > 0) {
                    // 如果该行的前一行非空，应该再添加一个换行符，否则实现不了保留空行的效果。
                    buffer += '\n';
                }
            }
            else {
                // 呃，在不保留空行的情况下，可以直接用正则实现。这里可能做得麻烦点了。
                buffer += ' ';
            }
        }
    });
    return buffer;
}

// 按中文习惯处理空格
function handleTextFormat_ChineseCustomSpace(text) {
    // 正则表达式检测如“中 文”，则处理成“中文”
    // 检测中文字符的表达式来自：https://tool.oschina.net/regex/#
    text = text.replace(/([\u4e00-\u9fa5])[ ]([\u4e00-\u9fa5])/g, '$1$2');
    return text;
}

// 末尾添加换行符
function handleTextFormat_addCRLFAtEnd(text) {

    var group = text.split('\n');
    var lastLine = group[group.length - 1];
    if (group.length < 3) {
        if (lastLine.trim().length !== 0 && lastLine[lastLine.length - 1] !== ' ') {
            // 如果最后一行，不为空，也不是以空格结尾，就添加空格
            text += ' ';
        }
        text += '\n';
    }
    else {
        if (lastLine.trim().length !== 0 ||
            group[group.length - 2].trim().length !== 0) {
            // 如果最后两行中任一行非空，则添加换行符，避免多次点击按钮，添加了大量换行符。
            if (lastLine.trim().length !== 0 && lastLine[lastLine.length - 1] !== ' ') {
                // 如果最后一行，不为空，也不是以空格结尾，就添加空格
                text += ' ';
            }
            text += '\n';
        }
    }

    return text;
}

/**
 * “格式化”功能，对文本的处理函数。
 * @param {*} text 待处理的字符串
 * @param {*} formatConfig 格式化功能的配置
 *         具体可参考config.js中：defaultHelperConfig_2020_04_20.formatFunction.formatConfig
 * @return {*} text “格式化”处理后的字符串
 */
function handleTextFormat(text, formatConfig) {
    debugLog(formatConfig);
    debugLog('original', text);
    // 默认处理换行符为'\n'
    text = text.replace(/\r\n/g, '\n');
    text = text.replace(/\r/g, '\n');
    if (formatConfig.formatTabToSpace) {
        text = text.replace(/\t/g, '    ');
        debugLog('formatTabToSpace', text);
    }
    if (formatConfig.formatLineStartChar && formatConfig.lineStartCharList.length > 0) {
        text = handleTextFormat_lineStartChar(text, formatConfig.lineStartCharList);
        debugLog('formatLineStartChar', text);
    }
    if (formatConfig.formatLineEndChar && formatConfig.lineEndCharList.length > 0) {
        text = handleTextFormat_lineEndChar(text, formatConfig.lineEndCharList);
        debugLog('formatLineEndChar', text);
    }
    if (formatConfig.formatCRLFToSpace) {
        text = handleTextFormat_CRLFToSpace(text, formatConfig.formatRemainEmptyCRLF);
        debugLog('formatCRLFToSpace', text);
    }
    if (formatConfig.formatSpaceTo1) {
        text = text.replace(/[ ]+/g, ' ');
        debugLog('formatSpaceTo1', text);
    }
    if (formatConfig.formatChineseCustomSpace){
        text = handleTextFormat_ChineseCustomSpace(text);
        debugLog('formatChineseCustomSpace', text);
    }
    if (formatConfig.formatAddCRLFAtEnd) {
        text = handleTextFormat_addCRLFAtEnd(text);
        debugLog('formatAddCRLFAtEnd', text);
    }
    return text;
}

// 下面是测试“格式化”功能的函数，没什么用
function testFormatFunction() {
    testFormatLineStartChar();
    testFormatLineEndChar();
    testFormatAddCRLFAtEnd();
}

function testFormatLineStartChar() {
    console.log("--------------");
    console.log("testFormatLineStartChar");
    var text = "%#/123\n" +
        "  %#%%   #%123\n" +
        "%2% 124";
    var result = handleTextFormat_lineStartChar(text, "%#/");
    console.log('原来:\n', text);
    console.log('结果:\n', result);
    console.log('预期:\n', "123\n     #%123\n2% 124");
}

function testFormatLineEndChar() {
    console.log("--------------");
    console.log("testFormatLineEndChar");
    var text = "%#/123%#  \n" +
        "  %#%%   #%123 12 %# %#\n" +
        "%2% 124 ()#";
    var result = handleTextFormat_lineEndChar(text, "%#/");
    console.log('原来:\n', text);
    console.log('结果:\n', result);
    console.log('预期:\n', "%#/123  \n  %#%%   #%123 12 %# \n%2% 124 ()");
}

function testFormatAddCRLFAtEnd() {
    console.log("--------------");
    console.log("testFormatAddCRLFAtEnd");
    var text = "\n\n  \n";
    var result = handleTextFormat_addCRLFAtEnd(text);
    console.log('原来:\n', text);
    console.log('结果:\n', result);
    console.log('预期:\n', "\n\n  \n");
}