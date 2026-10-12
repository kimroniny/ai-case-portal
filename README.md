# AI 案例观察站

展示 AI 盈利案例与创新案例的中文门户。Next.js 16（App Router）+ TypeScript + Tailwind CSS v4 + shadcn/ui，数据全部来自 `data/` 目录下的文件，构建时读取，无需数据库，所有页面静态生成。

> 仓库自带的 5 条案例（分布在 2026-10-11 ~ 2026-10-13，名称带「【示例】」、链接为 example.com）**均为示例数据**，仅用于预览效果。正式使用前请删除。

## 页面

| 路径 | 说明 |
| --- | --- |
| `/` | 今日速览、今日精选大卡片、最新案例卡片流（全部 / 盈利 / 创新，`both` 两边都显示） |
| `/cases` | 案例库：分类、地区、团队类型、标签、评分筛选 + 关键词搜索 + 排序，筛选条件同步到 URL 参数，可直接分享 |
| `/cases/[id]` | 案例详情：全部字段、指标表格、来源、存疑说明；多天出现的案例显示更新时间线 |
| `/archive`、`/archive/[date]` | 每日归档：当天摘要（Markdown 渲染）+ 当天案例 |
| `/trends` | 各分类、各地区、盈利/创新每日案例数堆叠柱状图 |

## 本地预览

```bash
npm install
npm run dev        # http://localhost:3000，修改 data/ 后刷新即可
npm run build && npm start   # 按生产模式预览
npm run lint
```

## 每日更新流程

1. 把当天的案例数组保存为 `data/cases/YYYY-MM-DD.json`（例：`data/cases/2026-10-14.json`）。
2. 把当天的摘要保存为 `data/digests/YYYY-MM-DD.md`。
3. 本地 `npm run build` 确认无报错（可选但推荐）。
4. 提交并推送：
   ```bash
   git add data/
   git commit -m "data: 2026-10-14"
   git push
   ```
5. 在 Vercel 上导入该 Git 仓库（Framework 选 Next.js，其余默认）后，每次 push 到主分支都会自动重新构建部署，新数据随之上线。

首页的「今日」= 日期最新的那一天。

## 数据格式

### `data/cases/YYYY-MM-DD.json`

文件内容是一个数组，每个元素：

```json
{
  "id": "photoai-levelsio",
  "date_collected": "2026-10-14",
  "status": "new",
  "type": "profitable",
  "name": "产品或公司名",
  "one_liner": "一句话说清楚它做什么（30 字以内）",
  "category": "设计创意",
  "region": "海外",
  "team_type": "独立开发者",
  "business_model": "订阅",
  "metrics": [
    { "label": "MRR", "value": "$50k", "source_type": "创始人自述", "source_url": "https://..." }
  ],
  "why_it_works": "80–150 字",
  "takeaway": "1–2 句",
  "innovation_score": 3,
  "business_score": 5,
  "tags": ["出海", "图像生成"],
  "website": "https://...",
  "sources": ["https://...", "https://..."],
  "uncertain_points": ""
}
```

字段取值：

- `status`：`new` | `update`
- `type`：`profitable` | `innovative` | `both`
- `category`：营销内容 / 编程开发 / 设计创意 / 教育 / 医疗健康 / 法律金融 / 电商零售 / 客服销售 / 生产力办公 / 硬件与端侧 / 游戏娱乐 / 企业服务 / 其他
- `region`：海外 | 中国 | 全球
- `team_type`：独立开发者 | 初创公司 | 大公司
- `business_model`：订阅 / 按量付费 / 一次性买断 / 广告 / 企业定制 / 暂无
- `metrics[].source_type`：官方公布 / 创始人自述 / 媒体估算
- `innovation_score`、`business_score`：1–5 的整数

**老案例更新**：用**相同的 `id`** 在新日期的文件里再写一条，`status` 设为 `update`。站点会把同一 id 的所有记录按日期聚合：列表和详情显示最新一条，详情页底部显示完整更新时间线。

### `data/digests/YYYY-MM-DD.md`

普通 Markdown。首页会提取以下二级标题下的内容：

```markdown
## 今日速览
3–5 句总结……

## 今日精选
**产品名**：200 字点评……   ← 若正文里出现当天某个案例的 name，大卡片就展示该案例；否则展示当天评分最高的案例

## 待跟进线索
- [线索名](https://...)
```

归档页 `/archive/[date]` 会渲染整篇 Markdown（支持 GFM 表格、链接等）。

## 容错

- JSON 解析失败、内容不是数组、某条缺少 `id`/`name` 时：该文件/该条会被**跳过**，构建不会中断，构建日志打印 `[data] 加载问题`，页面顶部显示黄色提示条，指出是哪个文件出错。
- 缺失的可选字段会用默认值填充（如分类缺失记为「其他」）。
- 不存在的案例或日期返回 404 页面；运行时错误显示带「重试」按钮的错误页；路由切换时显示骨架屏。

## 目录结构

```
app/                 页面（App Router）、loading / error / not-found
components/          业务组件（卡片、筛选库、图表、Markdown 等）
components/ui/       shadcn/ui 组件
lib/data.ts          读取并聚合 data/ 下的文件（仅服务端）
lib/types.ts         数据类型与枚举
data/cases/          每日案例 JSON
data/digests/        每日摘要 Markdown
```
