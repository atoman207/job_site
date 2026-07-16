// ============================================================================
//  サンプルデータ投入スクリプト（本番さながらの大量データ）
//  Supabase の service_role キー（REST）経由で投入するため、DBパスワード不要。
//  実行:  node db/seed.mjs   (または  npm run db:seed)
//  ※ 事前に db/migrate.mjs でテーブルを作成しておくこと。
// ============================================================================
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY が未設定です。');
  process.exit(1);
}
const sb = createClient(url, serviceKey, { auth: { persistSession: false } });

// ---- 決定論的乱数（再実行しても同じ結果） ----
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260716);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const pickN = (arr, n) => {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length; i++) out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
  return out;
};
const chance = (p) => rand() < p;
const int = (min, max) => Math.floor(rand() * (max - min + 1)) + min;

// ---- エリア（areas.ts のターゲット地域と同一の市区町村名） ----
const AREAS = {
  '08': ['水戸市', 'つくば市', '日立市', 'ひたちなか市', '土浦市', '取手市', '守谷市'],
  '09': ['宇都宮市', '小山市', '栃木市', '足利市', '佐野市', '那須塩原市'],
  '10': ['前橋市', '高崎市', '太田市', '伊勢崎市', '桐生市'],
  '11': ['さいたま市', '川口市', '川越市', '所沢市', '越谷市', '草加市', '春日部市', '上尾市', '熊谷市', '朝霞市', '新座市', '狭山市', '入間市', '三郷市', '戸田市'],
  '12': ['千葉市', '船橋市', '松戸市', '市川市', '柏市', '市原市', '八千代市', '流山市', '習志野市', '浦安市', '木更津市', '成田市', '佐倉市'],
  '13': ['千代田区', '中央区', '港区', '新宿区', '文京区', '台東区', '墨田区', '江東区', '品川区', '目黒区', '大田区', '世田谷区', '渋谷区', '中野区', '杉並区', '豊島区', '北区', '荒川区', '板橋区', '練馬区', '足立区', '葛飾区', '江戸川区', '八王子市', '町田市', '府中市', '調布市', '立川市', '武蔵野市', '三鷹市'],
  '14': ['横浜市', '川崎市', '相模原市', '藤沢市', '横須賀市', '平塚市', '茅ヶ崎市', '大和市', '厚木市', '小田原市', '海老名市', '座間市', '秦野市', '鎌倉市'],
  '15': ['新潟市', '長岡市', '上越市', '三条市'],
  '19': ['甲府市', '甲斐市', '笛吹市', '富士吉田市'],
  '20': ['長野市', '松本市', '上田市', '飯田市', '佐久市', '安曇野市'],
  '21': ['岐阜市', '大垣市', '各務原市', '多治見市', '可児市'],
  '22': ['静岡市', '浜松市', '沼津市', '富士市', '磐田市', '藤枝市', '焼津市', '掛川市', '三島市'],
  '23': ['名古屋市', '豊田市', '岡崎市', '一宮市', '豊橋市', '春日井市', '安城市', '豊川市', '西尾市', '刈谷市', '小牧市', '稲沢市', '瀬戸市'],
  '24': ['津市', '四日市市', '鈴鹿市', '松阪市', '桑名市'],
  '25': ['大津市', '草津市', '長浜市', '東近江市', '彦根市'],
  '26': ['京都市', '宇治市', '亀岡市', '長岡京市', '城陽市'],
  '27': ['大阪市', '堺市', '東大阪市', '枚方市', '豊中市', '吹田市', '高槻市', '茨木市', '八尾市', '寝屋川市', '岸和田市', '和泉市', '守口市', '門真市', '松原市'],
  '28': ['神戸市', '姫路市', '西宮市', '尼崎市', '明石市', '加古川市', '宝塚市', '伊丹市', '川西市', '三田市'],
  '29': ['奈良市', '橿原市', '生駒市', '大和郡山市', '香芝市'],
  '30': ['和歌山市', '田辺市', '橋本市', '海南市', '岩出市'],
  '40': ['福岡市', '北九州市', '久留米市', '飯塚市', '春日市', '筑紫野市', '大野城市'],
};
// ターゲット県を厚めに出す重み付き抽選プール
const PREF_WEIGHTS = {
  '13': 22, '14': 16, '11': 12, '12': 11, '27': 14, '23': 12, '28': 8, '26': 7,
  '22': 6, '08': 4, '09': 3, '10': 3, '25': 3, '24': 2, '29': 3, '30': 2,
  '15': 2, '19': 2, '20': 3, '21': 3, '40': 6,
};
const PREF_POOL = [];
for (const [code, w] of Object.entries(PREF_WEIGHTS)) for (let i = 0; i < w; i++) PREF_POOL.push(code);

const STATIONS_SUFFIX = ['駅 徒歩5分', '駅 徒歩8分', '駅 徒歩3分', '駅よりバス10分', '駅 徒歩12分', '駅直結'];
const stationName = (city) => city.replace(/(市|区|町|村)$/, '') + pick(['', '中央', '本', '東', '北']) + pick(STATIONS_SUFFIX);

// ---- カテゴリ ----
const CATEGORIES = [
  { slug: 'sales', name: '販売・接客', emoji: '🛍️', sort: 1 },
  { slug: 'logistics', name: '軽作業・製造', emoji: '📦', sort: 2 },
  { slug: 'driver', name: '配送・ドライバー', emoji: '🚚', sort: 3 },
  { slug: 'food', name: '飲食・フード', emoji: '🍜', sort: 4 },
  { slug: 'office', name: 'オフィス・事務', emoji: '🗂️', sort: 5 },
  { slug: 'care', name: '介護・福祉', emoji: '🤝', sort: 6 },
  { slug: 'it', name: 'IT・エンジニア', emoji: '💻', sort: 7 },
  { slug: 'construction', name: '建築・土木', emoji: '🏗️', sort: 8 },
  { slug: 'beauty', name: '美容・サービス', emoji: '💇', sort: 9 },
  { slug: 'callcenter', name: 'コールセンター', emoji: '☎️', sort: 10 },
  { slug: 'cleaning', name: '警備・清掃', emoji: '🧹', sort: 11 },
  { slug: 'childcare', name: '保育・教育', emoji: '🧒', sort: 12 },
];

// カテゴリ別 求人タイトル・説明・魅力
const CAT_DATA = {
  sales: {
    titles: ['未経験OK！アパレルの販売スタッフ', '携帯ショップの受付・案内スタッフ', '雑貨店の販売・接客', '家電量販店の販売サポート', 'コスメ・ドラッグストアの接客', 'スーパーのレジ・品出しスタッフ'],
    feat: ['社割あり', 'シフト自由', '髪型・ネイル自由', 'ノルマなし', '20代活躍中', '研修充実', '私服OK'],
    base: [21, 27],
  },
  logistics: {
    titles: ['かんたん軽作業（ピッキング・梱包）', '倉庫内の仕分けスタッフ', '工場での組立・検査スタッフ', '食品工場の製造スタッフ', 'コツコツ作業のライン工', '検品・シール貼りスタッフ'],
    feat: ['冷暖房完備', '週払いOK', '未経験9割', '寮完備', 'もくもく作業', '土日休み', '送迎あり'],
    base: [22, 30],
  },
  driver: {
    titles: ['ルート配送ドライバー（普通免許OK）', '宅配便のドライバー', '軽貨物ドライバー', '2tトラックドライバー', '送迎ドライバー', 'フードデリバリー配達スタッフ'],
    feat: ['普通免許でOK', '固定ルート', '直行直帰OK', '手当充実', 'AT限定可', '残業少なめ'],
    base: [25, 35],
  },
  food: {
    titles: ['ホールスタッフ（居酒屋）', 'カフェのキッチン・ホール', 'ラーメン店のスタッフ', 'ファストフードのクルー', 'ベーカリーの製造・販売', '定食屋のキッチン補助'],
    feat: ['まかない付き', 'シフト自由', '髪型自由', '深夜手当あり', '独立支援あり', '駅チカ'],
    base: [20, 28],
  },
  office: {
    titles: ['一般事務・データ入力', '営業事務アシスタント', '受付・庶務スタッフ', '経理サポート事務', '人事・総務アシスタント', 'カンタン入力の一般事務'],
    feat: ['土日祝休み', '残業ほぼなし', 'PC入力できればOK', '服装自由', '産休・育休実績あり', '駅チカ'],
    base: [21, 28],
  },
  care: {
    titles: ['介護スタッフ（無資格・未経験OK）', 'デイサービスの生活サポート', '有料老人ホームの介護職', '訪問介護ヘルパー', '介護施設の夜勤スタッフ', '福祉施設の支援員'],
    feat: ['資格取得支援', '未経験歓迎', '夜勤手当あり', '週休2日', '賞与あり', '車通勤OK'],
    base: [22, 30],
  },
  it: {
    titles: ['未経験から始めるITサポート', '初級プログラマー（研修あり）', 'ヘルプデスク・PCサポート', 'テスト・検証エンジニア', 'Web運用アシスタント', 'ネットワーク監視オペレーター'],
    feat: ['研修3ヶ月', 'リモートあり', '資格支援', '土日祝休み', '文系歓迎', '私服OK'],
    base: [24, 36],
  },
  construction: {
    titles: ['建築現場のサポートスタッフ', '内装工事の施工補助', '電気工事のアシスタント', '土木作業スタッフ', '設備メンテナンススタッフ', '未経験から手に職！施工管理補助'],
    feat: ['日給保証', '資格取得支援', '寮あり', '手に職がつく', '週払い可', '直行直帰'],
    base: [25, 38],
  },
  beauty: {
    titles: ['アイラッシュ・ネイルの受付', 'リラクゼーションセラピスト', '美容室のアシスタント', 'エステティシャン（研修あり）', 'クリーニング受付スタッフ', 'ホテルのフロントスタッフ'],
    feat: ['研修充実', '髪型自由', '社割あり', 'シフト融通', '未経験OK', '駅チカ'],
    base: [21, 29],
  },
  callcenter: {
    titles: ['受信のみコールセンター', 'かんたん問い合わせ対応', 'テレフォンオペレーター', '事務局スタッフ（電話・メール）', 'カスタマーサポート', '発信なし！受付センター'],
    feat: ['服装髪型自由', '研修充実', '土日休み選べる', '高時給', 'マニュアル完備', '駅チカ'],
    base: [22, 30],
  },
  cleaning: {
    titles: ['施設の清掃スタッフ', 'マンションの管理・清掃', '交通誘導警備スタッフ', '施設警備スタッフ', 'ビルメンテナンス', 'ホテルの客室清掃'],
    feat: ['シニア活躍', '直行直帰', '週2〜OK', 'もくもく作業', '未経験歓迎', '日払い可'],
    base: [20, 27],
  },
  childcare: {
    titles: ['保育補助スタッフ（無資格OK）', '学童保育のスタッフ', '児童館のサポート', '塾の受付・事務', '子ども教室のアシスタント', '幼児教室のスタッフ'],
    feat: ['資格支援あり', '土日休み', '未経験歓迎', 'ブランクOK', 'やりがい重視', '駅チカ'],
    base: [20, 27],
  },
};

const CATCH = [
  '「自分にもできるかも」がきっと見つかる！',
  '先輩の8割が未経験スタート。やさしく教えます😊',
  'まずは話を聞くだけでもOK！応援します🌱',
  'フリーター・派遣経験だけでも大かんげい！',
  'むずかしいことナシ。ゆっくり覚えていこう🍀',
  '正社員デビューを全力でサポートします🚀',
  'あなたのペースで大丈夫。あせらず一歩ずつ✨',
  'ブランクがあっても心配いりません！',
];

const DESC_INTRO = [
  'むずかしい経験はいりません。まずは先輩といっしょに、ゆっくり覚えていきましょう。',
  'はじめての方がほとんどの職場です。わからないことは何でも聞いてくださいね。',
  'アルバイトや派遣の経験しかない方も大歓迎。ていねいな研修があるので安心です。',
  '「正社員は不安…」という方こそ来てほしい。あなたの挑戦を全力で応援します。',
];
const DESC_BODY = [
  '具体的なお仕事は、はじめはかんたんな作業から。慣れてきたら少しずつステップアップできます。',
  'チームで助け合いながら進めるので、ひとりで抱え込むことはありません。',
  '20代・30代のスタッフが中心で、みんな和気あいあいと働いています。',
  '職場の雰囲気を大切にしています。人間関係の良さには自信あり！',
];
const DESC_OUTRO = [
  'まずは気軽にご応募・ご相談ください。あなたに会えるのを楽しみにしています！',
  '少しでも気になったら、ぜひ一歩ふみ出してみてくださいね。',
  '見学だけでも大歓迎です。お気軽にどうぞ😊',
];

// 会社名生成
const CO_TYPE = ['株式会社', '株式会社', '株式会社', '有限会社', '合同会社'];
const CO_WORD = ['サンライズ', 'みらい', 'つばさ', 'ほほえみ', 'グッドライフ', 'アクロス', 'ひまわり', 'こもれび', 'ステップ', 'ハーモニー', 'フロンティア', 'あおぞら', 'スマイル', 'ネクスト', 'リンク', 'クローバー', 'めぐみ', 'たいよう', 'ウィズ', 'プラス', 'にじいろ', 'さくら', 'ライフサポート', 'トラスト', 'エール'];
const CO_SUFFIX = ['', '', 'サービス', '商事', 'ワークス', 'ホールディングス', '物流', 'スタッフ', 'キャリア', 'コーポレーション'];
const CO_CATCH = [
  '「はたらく」をもっと楽しく、あたたかく。',
  '未経験からの成長を全力で応援する会社です。',
  '人を大切にする、アットホームな職場です。',
  'あなたらしい働き方を一緒に見つけましょう。',
  '地域に根ざして、まっすぐ仕事をしています。',
];
const EMP_COUNT = ['10〜30名', '30〜50名', '50〜100名', '100〜300名', '300名以上'];

function makeCompanyName() {
  return pick(CO_TYPE) + pick(CO_WORD) + pick(CO_SUFFIX);
}

async function clearAll() {
  console.log('🧹 既存データをクリアしています…');
  await sb.from('applications').delete().not('id', 'is', null);
  await sb.from('jobs').delete().not('id', 'is', null);
  await sb.from('seekers').delete().not('id', 'is', null);
  await sb.from('companies').delete().not('id', 'is', null);
}

async function seedCategories() {
  console.log('🏷️  カテゴリを投入…');
  const { error } = await sb.from('categories').upsert(CATEGORIES, { onConflict: 'slug' });
  if (error) throw error;
  const { data } = await sb.from('categories').select('id, slug');
  const map = {};
  for (const c of data) map[c.slug] = c.id;
  return map;
}

async function seedCompanies(count) {
  console.log(`🏢 会社を ${count} 件投入…`);
  const rows = [];
  const usedNames = new Set();
  while (rows.length < count) {
    const name = makeCompanyName();
    if (usedNames.has(name)) continue;
    usedNames.add(name);
    const pref = pick(PREF_POOL);
    const city = pick(AREAS[pref]);
    rows.push({
      name,
      catch_copy: pick(CO_CATCH),
      description: `私たち${name}は、${pick(['地域', '首都圏', '関西', '東海'])}を中心に事業を展開しています。${pick(['未経験からの育成', 'スタッフの働きやすさ', '長く働ける環境づくり'])}に力を入れており、はじめての方でも安心してスタートできる職場です。`,
      logo_url: null,
      website_url: null,
      founded_year: int(1985, 2021),
      employee_count: pick(EMP_COUNT),
      pref_code: pref,
      city,
    });
  }
  const { data, error } = await sb.from('companies').insert(rows).select('id, pref_code, city');
  if (error) throw error;
  return data;
}

function makeJob(companies, catMap) {
  const slug = pick(Object.keys(CAT_DATA));
  const cat = CAT_DATA[slug];
  const company = pick(companies);
  // 勤務地は会社所在地の県を基本に、たまに別の市
  const pref = chance(0.75) ? company.pref_code : pick(PREF_POOL);
  const city = pick(AREAS[pref]);

  // 雇用形態（正社員を厚めに）
  const emp = pick(['正社員', '正社員', '正社員', '契約社員', 'アルバイト・パート', '派遣社員']);
  const hourly = emp === 'アルバイト・パート' || emp === '派遣社員';
  let salary_type, salary_min, salary_max;
  if (hourly) {
    salary_type = 'hourly';
    salary_min = emp === '派遣社員' ? int(1300, 1600) : int(1050, 1300);
    salary_max = salary_min + int(100, 350);
  } else {
    salary_type = chance(0.15) ? 'annual' : 'monthly';
    if (salary_type === 'annual') {
      salary_min = int(cat.base[0], cat.base[1]) * 12 + int(0, 30);
      salary_max = salary_min + int(60, 180);
    } else {
      salary_min = int(cat.base[0], cat.base[1]);
      salary_max = salary_min + int(4, 12);
    }
  }

  const isWeekendOff = chance(0.4);
  const hasDorm = ['logistics', 'construction', 'driver', 'care'].includes(slug) ? chance(0.35) : chance(0.1);

  const description = `${pick(DESC_INTRO)}\n\n${pick(DESC_BODY)}${pick(DESC_BODY)}\n\n${pick(DESC_OUTRO)}`;

  return {
    company_id: company.id,
    category_id: catMap[slug],
    title: pick(cat.titles),
    catch_copy: pick(CATCH),
    description,
    pref_code: pref,
    city,
    address_detail: `${city}${pick(['中央', '本町', '栄町', '駅前', '緑町'])}${int(1, 5)}-${int(1, 30)}-${int(1, 20)}`,
    station: stationName(city),
    employment_type: emp,
    salary_type,
    salary_min,
    salary_max,
    work_hours: hourly
      ? pick(['9:00〜17:00の間でシフト制', '週2日〜・1日4h〜OK', '10:00〜19:00（休憩60分）'])
      : pick(['9:00〜18:00（休憩60分）', '8:30〜17:30（休憩60分）', '10:00〜19:00（休憩60分）', 'シフト制（実働8時間）']),
    holidays: isWeekendOff
      ? pick(['土日祝休み・年間休日120日', '完全週休2日（土日）', '土日祝休み・GW/夏季/年末年始'])
      : pick(['週休2日制（シフト制）', '月8〜9日休み', 'シフト制・希望休OK']),
    is_inexperienced_ok: chance(0.92),
    is_no_academic_req: chance(0.9),
    is_first_job_ok: chance(0.45),
    has_dormitory: hasDorm,
    is_weekend_off: isWeekendOff,
    features: pickN(cat.feat, int(3, 5)),
    benefits: pick([
      '社会保険完備・交通費支給・昇給あり',
      '各種社会保険・交通費全額支給・賞与年2回',
      '社保完備・交通費支給・制服貸与・研修あり',
      '交通費支給・社割・resort施設利用可・退職金制度',
    ]).replace('resort', 'リゾート'),
    image_url: null, // 画像は空欄（サイト側でPOPなアイコンを自動表示）
    status: chance(0.94) ? 'published' : pick(['draft', 'closed']),
    is_featured: chance(0.08),
    published_at: new Date(Date.now() - int(0, 60) * 86400000).toISOString(),
  };
}

async function seedJobs(companies, catMap, count) {
  console.log(`💼 求人を ${count} 件生成・投入…`);
  const rows = Array.from({ length: count }, () => makeJob(companies, catMap));
  for (let i = 0; i < rows.length; i += 200) {
    const chunk = rows.slice(i, i + 200);
    const { data, error } = await sb.from('jobs').insert(chunk).select('id');
    if (error) throw error;
    process.stdout.write(`   ...${Math.min(i + 200, rows.length)}/${rows.length}\r`);
  }
  console.log('');
  const { data } = await sb.from('jobs').select('id').eq('status', 'published');
  return data.map((r) => r.id);
}

async function seedSeekersAndApplications(jobIds, catMap) {
  console.log('🙋 会員登録・応募のサンプルを投入…');
  const catIds = Object.values(catMap);
  const NAMES = ['たろう', 'はなこ', 'ゆうき', 'あかり', 'けんた', 'みさき', 'そうた', 'ゆい', 'りく', 'なな', 'だいき', 'さくら', 'こうた', 'あおい', 'しょう'];
  const AGES = ['20代前半', '20代後半', '30代前半', '30代後半'];
  const seekers = [];
  for (let i = 0; i < 45; i++) {
    const pref = pick(PREF_POOL);
    seekers.push({
      nickname: pick(NAMES),
      email: `sample.seeker${i + 1}@example.com`,
      phone: chance(0.5) ? `090-${int(1000, 9999)}-${int(1000, 9999)}` : null,
      age_range: pick(AGES),
      pref_code: pref,
      desired_city: chance(0.6) ? pick(AREAS[pref]) : null,
      desired_category_id: pick(catIds),
      desired_employment: pick(['正社員', '正社員', 'まだ決めていない', 'アルバイト・パート']),
      experience_note: pick(['コンビニのバイトを2年', '派遣で軽作業を経験', '飲食店で3年アルバイト', 'ほぼ未経験です', 'アパレル販売の経験あり']),
      message: pick(['正社員になれるか不安です', '土日休みがいいです', '未経験でも大丈夫でしょうか？', '早めに働きたいです', '']),
      source: 'web',
    });
  }
  const { data: seekerRows, error } = await sb.from('seekers').insert(seekers).select('id');
  if (error) throw error;

  const apps = [];
  const NAME_FULL = ['山田 太郎', '佐藤 花子', '鈴木 一郎', '田中 美咲', '高橋 健太', '伊藤 さくら', '渡辺 大輝', '中村 葵'];
  for (let i = 0; i < 130; i++) {
    apps.push({
      job_id: pick(jobIds),
      seeker_id: chance(0.6) ? pick(seekerRows).id : null,
      name: pick(NAME_FULL),
      email: `applicant${i + 1}@example.com`,
      phone: chance(0.7) ? `080-${int(1000, 9999)}-${int(1000, 9999)}` : null,
      message: pick(['ぜひお話を聞きたいです！', 'よろしくお願いします', '未経験ですが頑張ります', '', '見学は可能でしょうか？']),
      status: pick(['new', 'new', 'reviewing', 'contacted', 'hired']),
    });
  }
  const { error: appErr } = await sb.from('applications').insert(apps);
  if (appErr) throw appErr;
}

async function main() {
  console.log('🌱 シードを開始します\n');
  await clearAll();
  const catMap = await seedCategories();
  const companies = await seedCompanies(85);
  const publishedJobIds = await seedJobs(companies, catMap, 600);
  await seedSeekersAndApplications(publishedJobIds, catMap);

  const { count } = await sb.from('jobs').select('*', { count: 'exact', head: true });
  console.log(`\n✅ シード完了！  会社85社 / 求人${count}件 / 会員45名 / 応募130件`);
  console.log('   サイトを開いて確認してください： npm run dev → http://localhost:3000');
}

main().catch((e) => {
  console.error('\n❌ シード失敗:', e.message ?? e);
  process.exit(1);
});
