import { existsSync, fstat, mkdirSync, writeFileSync, readFileSync } from "fs";
import { launch } from "puppeteer";

const _path = process.cwd();
// console.log(_path)

const mdPath = "./md/";
const homepage_url = "https://nga.178.com/read.php?tid=27859119"; //主页

const verFile = "./version";
const changeLogFile = "./changelog";

if (!existsSync(mdPath)) {
  mkdirSync(mdPath);
}

class ngaWikiUpdater {
  constructor() {
    this.mdPath = `${_path}/md/`;
    this.verFile = `${_path}/version`;
    this.changeLogFile = `${_path}/changelog`;
    if (!existsSync(this.mdPath)) {
      mkdirSync(this.mdPath);
    }
    this.last_ts = existsSync(this.verFile)
      ? readFileSync(this.verFile, "utf8")
      : "";
    this.urls = {
      homepage: "https://nga.178.com/read.php?tid=27859119", //主页
      wikis: [
        "https://nga.178.com/read.php?pid=635739983", //岩
        "https://nga.178.com/read.php?pid=635740877", //火
        "https://nga.178.com/read.php?pid=635741997", //水
        "https://nga.178.com/read.php?pid=635742419", //冰
        "https://nga.178.com/read.php?pid=635742911", //风
        "https://nga.178.com/read.php?pid=635743435", //雷
        "https://nga.178.com/read.php?pid=635744974", //草
        "https://nga.178.com/read.php?pid=635745349", //旅行者
      ],
    };
  }
  async getinfo() {
    //创建一个Browser（浏览器）实例
    const browser = await launch({
      //设置有头模式（默认为true，无头模式）
      headless: true,
      ignoreHTTPSErrors: true,
    });

    //在浏览器中创建一个新的页面
    const page = await browser.newPage();

    // await page.emulate(devices)
    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
    );
    await page.setViewport({
      width: 1280,
      height: 960,
      isMobile: false,
    });
    //打开指定页面
    await page.goto(this.urls.homepage, { waitUntil: "networkidle0" });

    let _info = await page.evaluate(() => {
      // let _version = document.title.replace(/(.*?)萌新请进！全角色圣遗物及武器搭配简述。\((.*)\)(.*)/g, '$2')
      let divChangeLog = document.getElementById("postcontent0").children[0];
      for (let m of divChangeLog.children) {
        if (
          m.className === "collapse_btn" &&
          !m.nextElementSibling.checkVisibility()
        ) {
          m.children[0].click();
        }
      }
      let _changeLog = divChangeLog.innerText.replace(
        /\n\n^− (更新|修订)部分 .*?$/gm,
        ""
      );
      let _timestamp = _changeLog
        .replace(/^([0-9\.]+)\s+更新日志.*/g, "$1")
        .split("\n")[0];
      _changeLog = _changeLog.replace(/^([0-9\.]+)\s+更新日志.*?\n\n/g, "");
      return { ts: _timestamp, changelog: _changeLog };
    });

    //关闭浏览器实例
    await browser.close();

    return _info;
  }

  async _getwikis(url) {
    //使用async/await处理异步
    //创建一个Browser（浏览器）实例
    const browser = await launch({
      //设置有头模式（默认为true，无头模式）
      headless: true,
      ignoreHTTPSErrors: true,
    });

    //在浏览器中创建一个新的页面
    const page = await browser.newPage();

    // await page.emulate(devices)
    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
    );
    await page.setViewport({
      width: 1280,
      height: 960,
      isMobile: false,
    });

    //打开指定页面
    await page.goto(url, { waitUntil: "networkidle0" });

    // await page.content()

    let eles = await page.evaluate(() => {
      function regex_text(innerText) {
        if (!innerText.includes("\n")) {
          return "";
        }
        let md = innerText;
        var rolename = /^[一二三四五六七八九十]+、(.*)/gm.exec(md)[1];
        if (rolename.includes("旅行者")) {
          rolename = rolename.replace(/^旅行者\((.*?)\)/, "$1主");
        }
        md = md.replace(/\/\* bbscode(.*?)\*\//gm, "");
        md = md.replace(/^[一二三四五六七八九十]+、(.*)/gm, "# $1");
        md = md.replace(
          /^(圣遗物有效词条|圣遗物对应属性|圣遗物套装|推荐武器)：?(.*?)$/gm,
          "## $1  \n- $2  "
        );
        md = md.replace(/^-[ ]{2,}$/gm, "");
        // md = md.replace(/(圣遗物套装|推荐武器)：/gm, '## $1  \n')
        md = md.replace(/([三四五])星武器(：{0,})$/gm, "### $1星武器  \n");
        md = md.replace(/^[\d]+.(.*)$/gm, "- $1  \n");
        md = md.replace(/^\*/gm, "\\* ");
        md = md.replace(/^([^-#\n])(.*?)$/gm, "> $1$2  ");
        md = md.replace(/([>#].*?\n)(^[-#])/gm, "$1\n$2");
        md = md + "\n\n- #####";
        md = md.replace(
          /(-.*?)\n{1,2}(>.*?)\n{1,2}([-#])/gm,
          "$1\n\n  $2\n\n$3"
        );
        md = md.replace(
          /(-.*?)\n{1,2}(>.*?)\n{1,2}([-#])/gm,
          "$1\n\n  $2\n\n$3"
        );
        md = md.replace(/(\s*\n)+^- #####$/gm, "\n");
        md = md.replace(/\n\n\n/gm, "\n\n");
        return { name: rolename, md: md };
      }

      let nga_wikis = [];

      for (let btn of document.querySelectorAll("button")) {
        if (!btn.parentElement.nextElementSibling.checkVisibility()) {
          btn.click();
        }
        cw = btn.parentElement.nextElementSibling;
        if (cw.className === "collapse_content ubbcode") {
          md_obj = regex_text(cw.innerText);
          if (md_obj === "") {
            continue;
          }
          nga_wikis.push(md_obj);
        }
      }
      return nga_wikis;
    });
    //关闭浏览器实例
    eles.forEach((element) => {
      writeFileSync(`${mdPath}${element.name}.md`, element.md);
    });

    await browser.close();
  }

  async update() {
    this.info = await this.getinfo(homepage_url);
    if (!(this.last_ts == this.info.ts)) {
      console.log(`${this.last_ts}=>${this.info.ts}`);
      console.log(this.info.changelog);
      this.urls.wikis.forEach(async (url) => {
        try {
          let wikis = await this._getwikis(url);
          console.log(`${url} done!`);
        } catch {
          console.log(`${url} error!`);
        }
      });
      writeFileSync(verFile, this.info.ts, "utf8");
      writeFileSync(changeLogFile, this.info.changelog, "utf8");
    } else {
      console.log("no update");
    }
  }
}

let ngawikiupdater = new ngaWikiUpdater();

await ngawikiupdater.update();
