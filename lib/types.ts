export const CATEGORIES = ["营销内容","编程开发","设计创意","教育","医疗健康","法律金融","电商零售","客服销售","生产力办公","硬件与端侧","游戏娱乐","企业服务","其他"] as const;
export const REGIONS = ["海外","中国","全球"] as const;
export const TEAM_TYPES = ["独立开发者","初创公司","大公司"] as const;

export interface Metric { label: string; value: string; source_type: string; source_url: string }
export interface CaseRecord {
  id: string; date_collected: string; status: "new" | "update"; type: "profitable" | "innovative" | "both";
  name: string; one_liner: string; category: string; region: string; team_type: string; business_model: string;
  metrics: Metric[]; why_it_works: string; takeaway: string; innovation_score: number; business_score: number;
  tags: string[]; website: string; sources: string[]; uncertain_points: string;
}
/** 聚合后的案例：取最新一条记录作为当前状态，history 为按日期升序的全部记录 */
export interface AggregatedCase extends CaseRecord { first_seen: string; history: CaseRecord[] }
export interface LoadIssue { file: string; message: string }

export const TYPE_LABEL: Record<CaseRecord["type"], string> = { profitable: "盈利", innovative: "创新", both: "盈利 + 创新" };
