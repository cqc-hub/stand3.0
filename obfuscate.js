const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

// 查找编译输出目录
function findDistDir() {
    const candidates = [
        'dist/build/mp-weixin',
        'dist/dev/mp-weixin',
        'dist/mp-weixin',
        'unpackage/dist/build/mp-weixin',
        'unpackage/dist/dev/mp-weixin'
    ];
    
    for (const candidate of candidates) {
        const fullPath = path.join(__dirname, candidate);
        if (fs.existsSync(fullPath)) {
            console.log(`✅ 找到输出目录: ${fullPath}`);
            return fullPath;
        }
    }
    return null;
}

// 安全混淆配置 - 不破坏 console 和全局对象
const obfuscatorConfig = {
    compact: true,
    controlFlowFlattening: false,
    deadCodeInjection: false,
    debugProtection: false,
    disableConsoleOutput: false,        // ← 关键：不要禁用 console
    identifierNamesGenerator: 'hexadecimal',
    renameGlobals: false,
    renameProperties: false,
    rotateStringArray: false,
    selfDefending: false,
    stringArray: false,
    stringArrayEncoding: [],
    stringArrayThreshold: 0,
    transformObjectKeys: false,
    unicodeEscapeSequence: false
};

function obfuscateFile(filePath) {
    const code = fs.readFileSync(filePath, 'utf8');
    try {
        const result = JavaScriptObfuscator.obfuscate(code, obfuscatorConfig);
        fs.writeFileSync(filePath, result.getObfuscatedCode());
        console.log(`  ✅ 混淆: ${path.basename(filePath)}`);
        return true;
    } catch (err) {
        console.error(`  ❌ 失败: ${path.basename(filePath)}`, err.message);
        return false;
    }
}

// 递归查找页面 JS 文件
function findPageJsFiles(dir, distDir) {
    const results = [];
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            const dirName = path.basename(filePath);
            const skipDirs = [
                'components', 'uni_modules', 'node_modules',
                'utils', 'api', 'service', 'common', 'libs', 
                'static', 'config', 'wxcomponents', 'mixins'
            ];
            
            if (!skipDirs.includes(dirName)) {
                results.push(...findPageJsFiles(filePath, distDir));
            }
        } else if (file.endsWith('.js')) {
            const excludeFiles = ['vendor.js', 'runtime.js', 'manifest.js', 'app.js', 'main.js'];
            if (!excludeFiles.includes(file)) {
                results.push(filePath);
            }
        }
    });
    
    return results;
}

// 主流程
console.log('🚀 开始混淆小程序代码...\n');

const distDir = findDistDir();
if (!distDir) {
    console.error('❌ 错误：找不到编译输出目录！');
    console.error('请先运行: npm run build:mp-weixin');
    process.exit(1);
}

// 获取所有页面目录
const pageDirs = ['pages'];
const allDirs = fs.readdirSync(distDir);
const subpackages = allDirs.filter(dir => {
    const dirPath = path.join(distDir, dir);
    return fs.statSync(dirPath).isDirectory() && 
           dir.startsWith('pages') && 
           dir !== 'pages';
});
pageDirs.push(...subpackages);

console.log(`📁 目标目录: ${pageDirs.join(', ')}\n`);

let allJsFiles = [];
pageDirs.forEach(pageDir => {
    const pagePath = path.join(distDir, pageDir);
    if (fs.existsSync(pagePath)) {
        console.log(`📂 扫描: ${pageDir}`);
        const jsFiles = findPageJsFiles(pagePath, distDir);
        if (jsFiles.length > 0) {
            console.log(`   找到 ${jsFiles.length} 个文件`);
            allJsFiles.push(...jsFiles);
        }
        console.log('');
    }
});

if (allJsFiles.length === 0) {
    console.error('❌ 没有找到需要混淆的文件！');
    process.exit(1);
}

console.log('='.repeat(50));
console.log(`🔒 开始混淆 ${allJsFiles.length} 个文件...\n`);

let successCount = 0;
allJsFiles.forEach(filePath => {
    if (obfuscateFile(filePath)) successCount++;
});

console.log('\n' + '='.repeat(50));
console.log(`🎉 混淆完成！成功: ${successCount}/${allJsFiles.length}`);
console.log('💡 提示: console.log 保留，不会影响小程序运行');
console.log('='.repeat(50));