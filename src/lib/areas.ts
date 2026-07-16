// ============================================================================
// 日本の地方・都道府県・市区町村データ
// 実在の名称のみを使用しています。ターゲット地域（関東甲信越・関西圏・
// 太平洋ベルト）は市区町村まで手厚く、その他は主要市を収録しています。
// ============================================================================

export interface Region {
  id: string;
  name: string; // 地方名
  emoji: string;
  target: boolean; // 主要ターゲット地域かどうか
}

export interface Prefecture {
  code: string; // JIS 都道府県コード (2桁)
  name: string; // 例: 東京都
  kana: string; // 例: とうきょうと
  regionId: string;
}

// 8地方区分（総務省の一般的な区分）
export const REGIONS: Region[] = [
  { id: 'hokkaido', name: '北海道', emoji: '🐻', target: false },
  { id: 'tohoku', name: '東北', emoji: '🍎', target: false },
  { id: 'kanto', name: '関東', emoji: '🗼', target: true },
  { id: 'koshinetsu', name: '甲信越', emoji: '🗻', target: true },
  { id: 'tokai', name: '東海', emoji: '🏭', target: true },
  { id: 'hokuriku', name: '北陸', emoji: '🦀', target: false },
  { id: 'kinki', name: '近畿', emoji: '🦌', target: true },
  { id: 'chugoku', name: '中国', emoji: '⛩️', target: false },
  { id: 'shikoku', name: '四国', emoji: '🍊', target: false },
  { id: 'kyushu', name: '九州・沖縄', emoji: '🌋', target: false },
];

export const PREFECTURES: Prefecture[] = [
  { code: '01', name: '北海道', kana: 'ほっかいどう', regionId: 'hokkaido' },
  { code: '02', name: '青森県', kana: 'あおもりけん', regionId: 'tohoku' },
  { code: '03', name: '岩手県', kana: 'いわてけん', regionId: 'tohoku' },
  { code: '04', name: '宮城県', kana: 'みやぎけん', regionId: 'tohoku' },
  { code: '05', name: '秋田県', kana: 'あきたけん', regionId: 'tohoku' },
  { code: '06', name: '山形県', kana: 'やまがたけん', regionId: 'tohoku' },
  { code: '07', name: '福島県', kana: 'ふくしまけん', regionId: 'tohoku' },
  { code: '08', name: '茨城県', kana: 'いばらきけん', regionId: 'kanto' },
  { code: '09', name: '栃木県', kana: 'とちぎけん', regionId: 'kanto' },
  { code: '10', name: '群馬県', kana: 'ぐんまけん', regionId: 'kanto' },
  { code: '11', name: '埼玉県', kana: 'さいたまけん', regionId: 'kanto' },
  { code: '12', name: '千葉県', kana: 'ちばけん', regionId: 'kanto' },
  { code: '13', name: '東京都', kana: 'とうきょうと', regionId: 'kanto' },
  { code: '14', name: '神奈川県', kana: 'かながわけん', regionId: 'kanto' },
  { code: '15', name: '新潟県', kana: 'にいがたけん', regionId: 'koshinetsu' },
  { code: '16', name: '富山県', kana: 'とやまけん', regionId: 'hokuriku' },
  { code: '17', name: '石川県', kana: 'いしかわけん', regionId: 'hokuriku' },
  { code: '18', name: '福井県', kana: 'ふくいけん', regionId: 'hokuriku' },
  { code: '19', name: '山梨県', kana: 'やまなしけん', regionId: 'koshinetsu' },
  { code: '20', name: '長野県', kana: 'ながのけん', regionId: 'koshinetsu' },
  { code: '21', name: '岐阜県', kana: 'ぎふけん', regionId: 'tokai' },
  { code: '22', name: '静岡県', kana: 'しずおかけん', regionId: 'tokai' },
  { code: '23', name: '愛知県', kana: 'あいちけん', regionId: 'tokai' },
  { code: '24', name: '三重県', kana: 'みえけん', regionId: 'kinki' },
  { code: '25', name: '滋賀県', kana: 'しがけん', regionId: 'kinki' },
  { code: '26', name: '京都府', kana: 'きょうとふ', regionId: 'kinki' },
  { code: '27', name: '大阪府', kana: 'おおさかふ', regionId: 'kinki' },
  { code: '28', name: '兵庫県', kana: 'ひょうごけん', regionId: 'kinki' },
  { code: '29', name: '奈良県', kana: 'ならけん', regionId: 'kinki' },
  { code: '30', name: '和歌山県', kana: 'わかやまけん', regionId: 'kinki' },
  { code: '31', name: '鳥取県', kana: 'とっとりけん', regionId: 'chugoku' },
  { code: '32', name: '島根県', kana: 'しまねけん', regionId: 'chugoku' },
  { code: '33', name: '岡山県', kana: 'おかやまけん', regionId: 'chugoku' },
  { code: '34', name: '広島県', kana: 'ひろしまけん', regionId: 'chugoku' },
  { code: '35', name: '山口県', kana: 'やまぐちけん', regionId: 'chugoku' },
  { code: '36', name: '徳島県', kana: 'とくしまけん', regionId: 'shikoku' },
  { code: '37', name: '香川県', kana: 'かがわけん', regionId: 'shikoku' },
  { code: '38', name: '愛媛県', kana: 'えひめけん', regionId: 'shikoku' },
  { code: '39', name: '高知県', kana: 'こうちけん', regionId: 'shikoku' },
  { code: '40', name: '福岡県', kana: 'ふくおかけん', regionId: 'kyushu' },
  { code: '41', name: '佐賀県', kana: 'さがけん', regionId: 'kyushu' },
  { code: '42', name: '長崎県', kana: 'ながさきけん', regionId: 'kyushu' },
  { code: '43', name: '熊本県', kana: 'くまもとけん', regionId: 'kyushu' },
  { code: '44', name: '大分県', kana: 'おおいたけん', regionId: 'kyushu' },
  { code: '45', name: '宮崎県', kana: 'みやざきけん', regionId: 'kyushu' },
  { code: '46', name: '鹿児島県', kana: 'かごしまけん', regionId: 'kyushu' },
  { code: '47', name: '沖縄県', kana: 'おきなわけん', regionId: 'kyushu' },
];

// 市区町村（実在の名称）。ターゲット県は手厚く、それ以外は主要市を収録。
export const CITIES: Record<string, string[]> = {
  // 北海道
  '01': ['札幌市', '函館市', '旭川市', '釧路市', '帯広市', '北見市', '苫小牧市', '江別市', '千歳市', '小樽市'],
  // 東北
  '02': ['青森市', '弘前市', '八戸市', '十和田市', 'むつ市'],
  '03': ['盛岡市', '一関市', '奥州市', '花巻市', '北上市'],
  '04': ['仙台市', '石巻市', '大崎市', '名取市', '登米市', '多賀城市'],
  '05': ['秋田市', '横手市', '大仙市', '由利本荘市'],
  '06': ['山形市', '鶴岡市', '酒田市', '米沢市', '天童市'],
  '07': ['福島市', '郡山市', 'いわき市', '会津若松市', '須賀川市'],
  // 関東（ターゲット・手厚め）
  '08': ['水戸市', 'つくば市', '日立市', 'ひたちなか市', '土浦市', '古河市', '取手市', '筑西市', '牛久市', '守谷市'],
  '09': ['宇都宮市', '小山市', '栃木市', '足利市', '佐野市', '那須塩原市', '鹿沼市', '真岡市'],
  '10': ['前橋市', '高崎市', '太田市', '伊勢崎市', '桐生市', '館林市', '渋川市'],
  '11': [
    'さいたま市', '川口市', '川越市', '所沢市', '越谷市', '草加市', '春日部市',
    '上尾市', '熊谷市', '朝霞市', '新座市', '狭山市', '入間市', '深谷市',
    '三郷市', 'ふじみ野市', '戸田市', '和光市', '志木市', '富士見市', '八潮市',
  ],
  '12': [
    '千葉市', '船橋市', '松戸市', '市川市', '柏市', '市原市', '八千代市',
    '流山市', '習志野市', '浦安市', '野田市', '木更津市', '成田市', '佐倉市',
    '我孫子市', '鎌ケ谷市', '茂原市', '印西市', '君津市', '四街道市',
  ],
  '13': [
    // 特別区（23区）
    '千代田区', '中央区', '港区', '新宿区', '文京区', '台東区', '墨田区',
    '江東区', '品川区', '目黒区', '大田区', '世田谷区', '渋谷区', '中野区',
    '杉並区', '豊島区', '北区', '荒川区', '板橋区', '練馬区', '足立区',
    '葛飾区', '江戸川区',
    // 多摩地域（市部）
    '八王子市', '町田市', '府中市', '調布市', '立川市', '武蔵野市', '三鷹市',
    '西東京市', '小平市', '日野市', '国分寺市', '東村山市', '多摩市',
  ],
  '14': [
    '横浜市', '川崎市', '相模原市', '藤沢市', '横須賀市', '平塚市', '茅ヶ崎市',
    '大和市', '厚木市', '小田原市', '海老名市', '座間市', '秦野市', '鎌倉市',
    '綾瀬市', '逗子市', '伊勢原市', '三浦市', '南足柄市',
  ],
  // 甲信越（ターゲット）
  '15': ['新潟市', '長岡市', '上越市', '三条市', '柏崎市', '新発田市', '燕市'],
  '19': ['甲府市', '甲斐市', '南アルプス市', '笛吹市', '富士吉田市', '都留市'],
  '20': ['長野市', '松本市', '上田市', '飯田市', '佐久市', '安曇野市', '諏訪市', '伊那市'],
  // 北陸
  '16': ['富山市', '高岡市', '射水市', '砺波市', '氷見市'],
  '17': ['金沢市', '白山市', '小松市', '加賀市', '野々市市', 'かほく市'],
  '18': ['福井市', '坂井市', '越前市', '鯖江市', '敦賀市'],
  // 東海（太平洋ベルト・ターゲット）
  '21': ['岐阜市', '大垣市', '各務原市', '多治見市', '可児市', '関市', '中津川市'],
  '22': [
    '静岡市', '浜松市', '沼津市', '富士市', '磐田市', '藤枝市', '焼津市',
    '掛川市', '富士宮市', '三島市', '島田市', '袋井市',
  ],
  '23': [
    '名古屋市', '豊田市', '岡崎市', '一宮市', '豊橋市', '春日井市', '安城市',
    '豊川市', '西尾市', '刈谷市', '小牧市', '稲沢市', '瀬戸市', '半田市',
    '東海市', '江南市', '大府市', '尾張旭市', '知多市', '日進市',
  ],
  // 近畿（ターゲット）
  '24': ['津市', '四日市市', '鈴鹿市', '松阪市', '桑名市', '伊勢市'],
  '25': ['大津市', '草津市', '長浜市', '東近江市', '彦根市', '守山市'],
  '26': ['京都市', '宇治市', '亀岡市', '長岡京市', '城陽市', '木津川市', '京田辺市'],
  '27': [
    '大阪市', '堺市', '東大阪市', '枚方市', '豊中市', '吹田市', '高槻市',
    '茨木市', '八尾市', '寝屋川市', '岸和田市', '和泉市', '守口市', '門真市',
    '大東市', '箕面市', '松原市', '摂津市', '富田林市', '河内長野市',
  ],
  '28': [
    '神戸市', '姫路市', '西宮市', '尼崎市', '明石市', '加古川市', '宝塚市',
    '伊丹市', '川西市', '三田市', '芦屋市', '高砂市', 'たつの市',
  ],
  '29': ['奈良市', '橿原市', '生駒市', '大和郡山市', '香芝市', '大和高田市'],
  '30': ['和歌山市', '田辺市', '橋本市', '海南市', '岩出市', '紀の川市'],
  // 中国
  '31': ['鳥取市', '米子市', '倉吉市', '境港市'],
  '32': ['松江市', '出雲市', '浜田市', '益田市'],
  '33': ['岡山市', '倉敷市', '津山市', '玉野市', '総社市'],
  '34': ['広島市', '福山市', '呉市', '東広島市', '尾道市', '廿日市市', '三原市'],
  '35': ['下関市', '山口市', '宇部市', '周南市', '岩国市', '防府市'],
  // 四国
  '36': ['徳島市', '阿南市', '鳴門市', '吉野川市'],
  '37': ['高松市', '丸亀市', '坂出市', '善通寺市', '観音寺市'],
  '38': ['松山市', '今治市', '新居浜市', '西条市', '四国中央市'],
  '39': ['高知市', '南国市', '四万十市', '香南市'],
  // 九州・沖縄
  '40': [
    '福岡市', '北九州市', '久留米市', '飯塚市', '大牟田市', '春日市', '筑紫野市',
    '大野城市', '糸島市', '宗像市', '太宰府市',
  ],
  '41': ['佐賀市', '唐津市', '鳥栖市', '伊万里市'],
  '42': ['長崎市', '佐世保市', '諫早市', '大村市', '島原市'],
  '43': ['熊本市', '八代市', '天草市', '玉名市', '合志市'],
  '44': ['大分市', '別府市', '中津市', '佐伯市', '日田市'],
  '45': ['宮崎市', '都城市', '延岡市', '日向市'],
  '46': ['鹿児島市', '霧島市', '鹿屋市', '薩摩川内市', '姶良市'],
  '47': ['那覇市', '沖縄市', 'うるま市', '浦添市', '宜野湾市', '名護市', '豊見城市'],
};

// ---- ヘルパー ----

export function prefByCode(code: string): Prefecture | undefined {
  return PREFECTURES.find((p) => p.code === code);
}

export function prefByName(name: string): Prefecture | undefined {
  return PREFECTURES.find((p) => p.name === name);
}

export function regionById(id: string): Region | undefined {
  return REGIONS.find((r) => r.id === id);
}

export function prefecturesByRegion(regionId: string): Prefecture[] {
  return PREFECTURES.filter((p) => p.regionId === regionId);
}

export function citiesOf(code: string): string[] {
  return CITIES[code] ?? [];
}

// 求人が多いターゲット都道府県コード（トップ導線・サンプル生成に使用）
export const POPULAR_PREF_CODES = [
  '13', '14', '11', '12', '27', '23', '28', '26', '40', '22', '08', '25',
];
