const MAP: [RegExp, string][] = [
  [/(^|\.)(x|twitter)\.com$/, "X"], [/news\.ycombinator\.com$/, "Hacker News"], [/producthunt\.com$/, "Product Hunt"],
  [/reddit\.com$/, "Reddit"], [/indiehackers\.com$/, "Indie Hackers"], [/techcrunch\.com$/, "TechCrunch"],
  [/theinformation\.com$/, "The Information"], [/36kr\.com$/, "36氪"], [/huxiu\.com$/, "虎嗅"], [/qbitai\.com$/, "量子位"],
  [/jiqizhixin\.com$/, "机器之心"], [/okjike\.com$/, "即刻"], [/sspai\.com$/, "少数派"], [/xiaohongshu\.com$/, "小红书"],
  [/github\.com$/, "GitHub"], [/medium\.com$/, "Medium"], [/bloomberg\.com$/, "Bloomberg"], [/reuters\.com$/, "Reuters"],
  [/venturebeat\.com$/, "VentureBeat"], [/theverge\.com$/, "The Verge"], [/businesswire\.com$/, "Business Wire"], [/prnewswire\.com$/, "PR Newswire"],
];
export function sourceLabel(url: string): string | null {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    for (const [re, name] of MAP) if (re.test(host)) return name;
    return host;
  } catch { return null; }
}
export function sourcePlatforms(sources: string[]): string[] {
  return [...new Set(sources.map(sourceLabel).filter((s): s is string => !!s))];
}
export function initials(name: string): string {
  const clean = name.replace(/[【】\[\]()（）]/g, "").trim();
  const words = clean.split(/[\s\-_.]+/).filter(Boolean);
  if (/^[A-Za-z0-9]/.test(clean)) return (words.length > 1 ? words[0][0] + words[1][0] : clean.slice(0, 2)).toUpperCase();
  return clean.slice(0, 2);
}
