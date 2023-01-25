import { existsSync, fstat, mkdirSync, writeFileSync } from "fs";

const path = './md/';


if (!existsSync(path)) {
    mkdirSync(path);
}

//引入puppeteer
import { launch } from "puppeteer";
// const fs = require("fs")


function getDecode(str) {
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function getwikis(url) {
    //使用async/await处理异步
    
    (async () => {
        //创建一个Browser（浏览器）实例
        const browser = await launch({
            //设置有头模式（默认为true，无头模式）
            headless: true,
            ignoreHTTPSErrors: true
        });

        //在浏览器中创建一个新的页面
        const page = await browser.newPage();

        // await page.emulate(devices)
        await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');
        await page.setViewport({
            width: 1280,
            height: 960,
            isMobile: false
        });



        //打开指定页面
        await page.goto(url, { 'waitUntil': 'networkidle0' });

        // await page.content()

        let eles = await page.evaluate(() => {
            //字符串转base64
            function getEncode64(str) {
                return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
                    function toSolidBytes(match, p1) {
                        return String.fromCharCode('0x' + p1);
                    }));

            }

            let nga_wikis = []

            for (let btn of document.querySelectorAll("Button")) { btn.click() }

            var chara_wikis = document.getElementsByClassName('collapse_content ubbcode');
            for (let cw of chara_wikis) {
                var md = cw.innerText
                if(!md.includes('\n')){
                    // return ''
                    continue
                }
            
                var rolename = /^[一二三四五六七八九十]+、(.*)/gm.exec(md)[1]
                if (rolename.includes('旅行者')){
                    rolename = rolename.replace(/^旅行者\((.*?)\)/, '$1主')
                }
                md = md.replace(/\/\* bbscode(.*?)\*\//gm, '')
                md = md.replace(/^[一二三四五六七八九十]+、(.*)/mg, '# $1')
                md = md.replace(/^(圣遗物有效词条|圣遗物对应属性|圣遗物套装|推荐武器)：?(.*?)$/gm, '## $1  \n- $2  ')
                md = md.replace(/^-[ ]{2,}$/mg,'')
                // md = md.replace(/(圣遗物套装|推荐武器)：/gm, '## $1  \n')
                md = md.replace(/([三四五])星武器(：{0,})$/gm, '### $1星武器  \n')
                md = md.replace(/^[\d]+.(.*)$/gm, '- $1  \n')
                md = md.replace(/^\*/gm, '\\*')
                md = md.replace(/^([^-#\n])(.*?)$/gm, '> $1$2  ')
                md = md.replace(/([>#].*?\n)(^[-#])/gm, '$1\n$2')
                md = md + '\n\n- #####'
                md = md.replace(/(-.*?)\n{1,2}(>.*?)\n{1,2}([-#])/gm, '$1\n\n  $2\n\n$3')
                md = md.replace(/(-.*?)\n{1,2}(>.*?)\n{1,2}([-#])/gm, '$1\n\n  $2\n\n$3')
                md = md.replace(/(\s*\n)+^- #####$/mg,'\n')
                md = md.replace(/\n\n\n/gm, '\n\n')
                
                nga_wikis.push({ name: rolename, md: md })
            }

            return nga_wikis
        })
        //关闭浏览器实例
        eles.forEach(element => {
            writeFileSync(`${path}${element.name}.md`, element.md)
        });

        await browser.close();
    })();
}
let url_list=[
    'https://nga.178.com/read.php?pid=635739983', //岩
    'https://nga.178.com/read.php?pid=635740877', //火
    'https://nga.178.com/read.php?pid=635741997', //水
    'https://nga.178.com/read.php?pid=635742419', //冰
    'https://nga.178.com/read.php?pid=635742911', //风
    'https://nga.178.com/read.php?pid=635743435', //雷
    'https://nga.178.com/read.php?pid=635744974', //草
    'https://nga.178.com/read.php?pid=635745349' //旅行者
]
let cnt=0
url_list.forEach(url=>{
    cnt+=1
    try{
        let wikis =getwikis(url) 
        console.log(`${cnt}/${url_list.length} done!`)
    }catch{
        console.log(`${cnt}/${url_list.length} ${url} error!`)
        
    }
}

)

