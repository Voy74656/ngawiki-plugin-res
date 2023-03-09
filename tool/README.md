# 文档半自动化更新工具

## 使用方法

环境依赖：nodejs

```bash
cd <path to wikiupdater.js>
npm init -y
npm install fs puppeteer -m
node wikiupdater.js
```

默认下载地址为`./md/{{@roleName}}.md`
下载结束后，手动粘贴至`../markdown/`，进行人工检查并合入
