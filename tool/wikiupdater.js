import { existsSync, fstat, mkdirSync, writeFileSync, readFileSync } from "fs";
import { launch } from "puppeteer";

const _path = process.cwd();

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
    const browser = await launch({
      headless: true,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
    );
    await page.setViewport({
      width: 1280,
      height: 960,
      isMobile: false,
    });

    await page.goto(this.urls.homepage, { waitUntil: "networkidle0" });

    let _info = await page.evaluate(() => {
      let divChangeLog = document.getElementById("postcontent0").children[0];
      for (let m of divChangeLog.children) {
        if (
          m.className === "collapse_btn" &&
          !m.nextElementSibling.checkVisibility()
        ) {
          m.children[0].click();
        }
      }
      let _timestamp = document
        .getElementById("alertc0")
        .children[0].innerText.replace(/在(.*?)修改/g, "$1")
        .replace(/[:\s]/g, "-");
      let _changeLog = divChangeLog.innerText
        .replace(/\n\n^− (更新|修订)部分 .*?$/gm, "")
        .replace(/^([0-9\.]+)\s+更新日志.*?\n\n/g, "");
      return { ts: _timestamp, changelog: _changeLog };
    });

    await browser.close();

    return _info;
  }
  wait(ms) {
    while (ms) {
      ms--;
    }
  }
  async cleanOldImgs() {
    let bashcmd = `rm ${path.join(yunzaiWikiPath, "0/")}*.jpg `;
    exec(bashcmd);
  }

  async _getwikis(url) {
    const browser = await launch({
      headless: true,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
    );
    await page.setViewport({
      width: 1280,
      height: 960,
      isMobile: false,
    });

    await page.goto(url, { waitUntil: "networkidle0" });

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

    eles.forEach(async (element) => {
      writeFileSync(`${this.mdPath}${element.name}.md`, element.md);
    });

    await browser.close();
  }

  async update() {
    this.info = await this.getinfo(this.urls.homepage);
    if (!(this.last_ts == this.info.ts)) {
      console.log(`${this.last_ts}=>${this.info.ts}`);
      console.log(this.info.changelog);
      this.urls.wikis.forEach((url) => {
        this._getwikis(url);
        this.wait(1500);
        console.log(`${url} done!`);
      });

      writeFileSync(this.changeLogFile, this.info.changelog, "utf8");
    } else {
      console.log("no update");
    }
  }
}

let ngawikiupdater = new ngaWikiUpdater();

await ngawikiupdater.update();
