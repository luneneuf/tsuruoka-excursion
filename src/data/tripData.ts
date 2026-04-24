export interface TripMeta {
  appTitle: string
  travelers: string[]
  startDate: string
  endDate: string
  region: string
}

export interface Flight {
  id: string
  flightNumber: string
  departure: { airport: string; code: string; datetime: string }
  arrival: { airport: string; code: string; datetime: string }
  seats: string[]
}

export interface Accommodation {
  name: string
  nameJa: string
  address: string
  phone: string
  bookingRef: string
  bookingService: string
  checkIn: string
  checkOut: string
  nights: number
  mapQuery: string
}

export interface EventGuide {
  summary: string
  description: string
  tips?: string
}

export interface Event {
  id: string
  time: string
  title: string
  titleJa: string
  type: 'transport' | 'sightseeing' | 'meal' | 'activity' | 'accommodation'
  description: string
  mapQuery?: string
  cost?: string
  duration?: string
  alert?: string
  guide?: EventGuide
}

export interface Day {
  day: number
  date: string
  dayOfWeek: string
  theme: string
  events: Event[]
}

export interface TransportLeg {
  id: string
  from: string
  to: string
  mode: 'bus' | 'train' | 'taxi' | 'flight' | 'walk'
  modeLabel: string
  duration: string
  cost: string
  note?: string
}

export interface Tips {
  weather: string
  payment: string
  misc: string[]
}

export interface JapaneseRequest {
  id: string
  label: string
  text: string
}

export interface TripData {
  meta: TripMeta
  flights: Flight[]
  accommodation: Accommodation
  days: Day[]
  transport: TransportLeg[]
  tips: Tips
  japaneseRequests: JapaneseRequest[]
}

const tripData: TripData = {
  meta: {
    appTitle: 'Tsuruoka Excursion',
    travelers: ['CHUN SUNGBUHM', 'CHUN JIYONG'],
    startDate: '2026-08-06',
    endDate: '2026-08-09',
    region: '쓰루오카·사카타',
  },

  flights: [
    {
      id: 'outbound',
      flightNumber: 'KE2197',
      departure: { airport: '인천국제공항', code: 'ICN', datetime: '2026-08-06T09:40' },
      arrival: { airport: '니가타 공항', code: 'KIJ', datetime: '2026-08-06T11:45' },
      seats: ['33A', '33B'],
    },
    {
      id: 'return',
      flightNumber: 'KE2198',
      departure: { airport: '니가타 공항', code: 'KIJ', datetime: '2026-08-09T20:20' },
      arrival: { airport: '인천국제공항', code: 'ICN', datetime: '2026-08-09T22:40' },
      seats: ['33F', '33E'],
    },
  ],

  accommodation: {
    name: '쇼나이 호텔 스이덴 테라스',
    nameJa: '庄内ホテル スイデンテラス',
    address: 'Kitakyoden Shimotorinosu 23-1, Tsuruoka, Yamagata 997-0053',
    phone: '+81 235-25-7424',
    bookingRef: '73429589556696',
    bookingService: 'Hotels.com',
    checkIn: '2026-08-06',
    checkOut: '2026-08-09',
    nights: 3,
    mapQuery: 'Shonai Hotel Suiden Terrasse',
  },

  days: [
    {
      day: 1,
      date: '2026-08-06',
      dayOfWeek: '목',
      theme: '이동 + 쓰루오카 문화 클러스터',
      events: [
        {
          id: 'd1-flight',
          time: '09:40',
          title: '인천 출발 — KE2197',
          titleJa: '仁川出発 — KE2197',
          type: 'transport',
          description: 'KE2197 ICN 09:40 → KIJ 11:45. 좌석: SUNGBUHM 33A · JIYONG 33B.',
          cost: '항공권 포함',
          duration: '약 2시간 5분',
        },
        {
          id: 'd1-niigata-bus',
          time: '12:15',
          title: '니가타 공항 → 니가타역 (공항버스)',
          titleJa: '新潟空港→新潟駅 空港バス',
          type: 'transport',
          description: '도착 후 공항 1층 버스 승강장에서 탑승. 니가타역 방향.',
          cost: '¥570',
          duration: '25분',
        },
        {
          id: 'd1-inaho',
          time: '13:00',
          title: '니가타역 → 쓰루오카역 (이나호 특급)',
          titleJa: '新潟駅→鶴岡駅 特急いなほ',
          type: 'transport',
          description: 'JR 이나호 특급. 니가타역 → 쓰루오카역. 1시간 20분 소요.',
          cost: '¥2,640',
          duration: '1시간 20분',
          mapQuery: 'Tsuruoka Station Yamagata',
        },
        {
          id: 'd1-checkin',
          time: '15:00',
          title: '스이덴 테라스 체크인',
          titleJa: 'スイデンテラス チェックイン',
          type: 'accommodation',
          description: '쓰루오카역 → 스이덴 테라스 택시 (약 15분, ¥2,000 분담). 3박 체크인. 예약번호 73429589556696.',
          cost: '택시 약 ¥1,000/인',
          mapQuery: 'Shonai Hotel Suiden Terrasse',
          guide: {
            summary: '논 위에 떠 있는 수상 호텔, 건축가 반 시게루 설계',
            description: '쇼나이 호텔 스이덴 테라스(庄内ホテル スイデンテラス)는 프리츠커상 수상 건축가 반 시게루(坂 茂)가 설계한 리조트 호텔입니다. 수면에 반영되는 논 위에 지어진 독특한 구조로, "논 위의 호텔"이라는 별명을 갖고 있습니다.\n\n야마가타현 쓰루오카시 교외의 광활한 논 한가운데 위치해, 사계절 다른 표정을 보여줍니다. 여름에는 초록 논이 수면에 비쳐 그림 같은 풍경을 만들어냅니다. 건물 외관은 나무와 유리로 구성되어 있어 자연과 조화를 이룹니다.',
            tips: '체크인은 15:00부터. 호텔 레스토랑은 저녁 예약 권장. 쓰루오카역에서 택시 약 15분.',
          },
        },
        {
          id: 'd1-chido-museum',
          time: '16:00',
          title: '치도 박물관',
          titleJa: '致道博物館',
          type: 'sightseeing',
          description: '쓰루오카 번주 사카이 가문의 역사 박물관. 국가 중요 문화재 건물 포함.',
          cost: '¥1,000',
          mapQuery: 'Chido Museum Tsuruoka',
          guide: {
            summary: '사카이 가문 14대의 역사와 쇼나이 문화를 담은 야외 박물관',
            description: '치도 박물관(致道博物館)은 쓰루오카 번을 다스린 사카이 가문과 쇼나이 지역의 역사·문화를 보존하는 박물관입니다. 메이지 시대 이후 이전된 전통 건축물들이 넓은 부지 내에 그대로 보존되어 있으며, 봄에는 등나무, 여름에는 연꽃이 피는 정원으로도 유명합니다.\n\n쇼나이 번 무기고, 쓰루오카 신사, 구 니시다 가문 주택 등 국가 중요 문화재 건물이 여럿 포함되어 있습니다.',
            tips: '입장료: 성인 ¥1,000. 관람 소요 시간 약 1시간. 치도칸이 도보 5분 거리로 연속 관람 가능.',
          },
        },
        {
          id: 'd1-chidokan',
          time: '17:00',
          title: '치도칸',
          titleJa: '致道館',
          type: 'sightseeing',
          description: '1805년 설립된 쇼나이 번의 번교(藩校). 국가 史跡 지정.',
          cost: '¥100',
          mapQuery: '致道館 鶴岡',
          guide: {
            summary: '1805년 창설, 일본 현존 번교 중 보존 상태 최고급',
            description: '치도칸(致道館)은 1805년(文化2年) 쇼나이 번 10대 번주 사카이 다다타카(酒井忠順)가 설립한 번교입니다. "치도(致道)"는 맹자(孟子)의 "인재를 먼저 구하라"는 구절에서 딴 이름입니다.\n\n당시 번사 자제들이 유학·무예·의술 등을 배웠던 곳으로, 메이지 유신 후에도 학교로 기능했습니다. 현재 남아 있는 강당·학습소 건물은 국가 史跡으로 지정되어 있습니다.',
            tips: '입장료: ¥100. 관람 소요 시간 20~30분. 치도 박물관과 묶어서 둘러보는 것을 권장.',
          },
        },
        {
          id: 'd1-fujisawa',
          time: '17:30',
          title: '후지사와 슈헤이 기념관',
          titleJa: '藤沢周平記念館',
          type: 'sightseeing',
          description: '쓰루오카 출신 시대소설가 후지사와 슈헤이의 생애와 작품을 소개하는 기념관.',
          cost: '¥320',
          mapQuery: 'Fujisawa Shuhei Memorial Museum Tsuruoka',
          guide: {
            summary: '일본 시대소설의 거장 후지사와 슈헤이의 삶과 문학',
            description: '후지사와 슈헤이(藤沢周平, 1927~1997)는 쓰루오카 출신의 시대소설가로, 《용마검》《영겁의 소리》등 수많은 명작을 남겼습니다. NHK 대하드라마 원작 및 영화화도 다수입니다.\n\n기념관은 치도 박물관 부지 내에 위치하며, 그의 자필 원고·유품·집필 공간 재현 등을 통해 작가의 삶을 소개합니다. 쇼나이 지역 풍토와 사람들에 대한 애정이 문학으로 어떻게 승화되었는지를 볼 수 있습니다.',
            tips: '입장료: ¥320. 치도 박물관 입장권 포함 여부 현장 확인 권장. 소요 시간 약 30분.',
          },
        },
        {
          id: 'd1-dinner',
          time: '19:00',
          title: '저녁 — 야키토리 쿠라자와야',
          titleJa: '焼き鳥 倉沢屋',
          type: 'meal',
          description: '쓰루오카 시내 야키토리 전문점. 현지인이 즐겨 찾는 인기 가게.',
          mapQuery: '焼き鳥 倉沢屋 鶴岡',
        },
      ],
    },

    {
      day: 2,
      date: '2026-08-07',
      dayOfWeek: '금',
      theme: '하구로산 순례',
      events: [
        {
          id: 'd2-bus',
          time: '08:30',
          title: '쓰루오카역 → 하구로산 (041계통 버스)',
          titleJa: '鶴岡駅→羽黒山 庄内交通041系統',
          type: 'transport',
          description: '쇼나이 교통 041계통. 쓰루오카역 앞 버스 정류장 출발. 하구로산 센닌자와(羽黒山随神門入口) 하차.',
          cost: '¥1,250',
          duration: '54분',
          alert: '버스 시간표는 여행일 기준 사전 확인 필수 (계절별 운행 편수 변동).',
        },
        {
          id: 'd2-zuishinmon',
          time: '09:30',
          title: '수이진몬 (하구로산 입구)',
          titleJa: '羽黒山随神門',
          type: 'activity',
          description: '하구로산 석단 입구. 국보 오중탑이 근처에 있음. 이곳에서 2,446단 등반 시작.',
          mapQuery: 'Hagurosan Zuishinmon Tsuruoka',
          guide: {
            summary: '데와산잔의 입구, 국보 오중탑이 바로 앞에',
            description: '수이진몬(随神門)은 하구로산(羽黒山) 참도의 시작점이자 이정표입니다. 이 문을 통과하면 울창한 삼나무 숲 사이로 2,446단의 돌계단이 시작됩니다.\n\n문 근처에는 국보로 지정된 오중탑(五重塔)이 있습니다. 939년에 처음 세워지고 현재 탑은 약 600년 전 재건된 것으로, 높이 29m의 목조 탑이 삼나무 숲 속에 고고하게 서 있습니다.\n\n데와산잔(出羽三山)은 하구로산·가스산·유도노산 세 산의 총칭으로, 예로부터 산악 수행자(山伏)들의 성지였습니다. 지금도 다수의 야마부시가 수행을 위해 방문합니다.',
            tips: '오중탑 입장료: ¥300. 등반 전 스트레칭 권장. 편한 운동화 필수.',
          },
        },
        {
          id: 'd2-climb',
          time: '09:45',
          title: '2,446단 석단 등반',
          titleJa: '石段 2,446段 登拝',
          type: 'activity',
          description: '수이진몬에서 삼신합제전까지 2,446단 등반. 수령 수백 년의 삼나무 숲 사이를 걷는 산악 순례.',
          duration: '약 40~60분',
          alert: '석단 등반 약 40~60분 소요. 운동화 필수. 습도 높은 여름 산악이므로 충분한 수분 지참.',
          guide: {
            summary: '삼나무 거목 숲 속 2,446단, 하구로산 순례의 핵심',
            description: '하구로산 석단(石段)은 수이진몬에서 산정까지 2,446단에 달하는 돌계단 참도입니다. 표고 414m의 정상까지 삼나무(杉) 거목들이 빽빽이 늘어선 숲 속을 걷게 됩니다. 일부 삼나무는 수령 500~1,000년을 넘는 거목으로, 국가 특별 천연기념물로 지정되어 있습니다.\n\n도중에 쉬어 가는 지점(茶屋)이 있으며, 이데하 문화기념관 앞 지점에서 잠시 쉬어 가도 좋습니다. 오르막은 가파르지 않지만 지속적으로 이어지므로 페이스 조절이 중요합니다.\n\n계단 양옆의 삼나무 숲은 여름에도 서늘하고 신비로운 분위기를 자아냅니다.',
            tips: '전 구간 편도 약 40~60분. 하산도 무릎에 부담이 가므로 천천히. 버스로 내려가는 옵션도 있음.',
          },
        },
        {
          id: 'd2-sanjin',
          time: '10:45',
          title: '삼신합제전 참배',
          titleJa: '三神合祭殿 参拝',
          type: 'activity',
          description: '하구로산 정상의 삼신합제전. 데와산잔 세 산의 신을 모시는 본전. 입장료 포함.',
          cost: '¥500',
          mapQuery: 'Hagurosan Zuishinmon Tsuruoka',
          guide: {
            summary: '데와산잔 세 신을 한 곳에 모신 광대한 본전',
            description: '삼신합제전(三神合祭殿)은 하구로산 정상에 위치한 데와산잔(出羽三山)의 중심 사당입니다. 하구로산·가스산·유도노산 세 산의 신을 한 건물에 함께 모시는 독특한 신사로, 가스산과 유도노산은 겨울에 입산 금지이기 때문에 3개 산의 신을 정상 하나에서 모두 참배할 수 있도록 한 것입니다.\n\n건물은 초가(茅葺き) 지붕으로, 두께 2.1m에 달하는 두꺼운 지붕이 인상적입니다. 일본 최대급 초가 건축물 중 하나로, 국가 중요 문화재로 지정되어 있습니다.',
            tips: '경내 참배 후 정상 광장에서 휴식. 인근에 식당가(산나이 지구)가 있어 점심 식사 가능.',
          },
        },
        {
          id: 'd2-lunch',
          time: '12:00',
          title: '점심 — 산나이 소바',
          titleJa: '山内 そば',
          type: 'meal',
          description: '하구로산 정상 산나이 지구의 소바 식당가. 산나이 소바는 쇼나이 지역 명물.',
          mapQuery: 'Hagurosan Zuishinmon Tsuruoka',
          guide: {
            summary: '하구로산 정상 참도 주변의 현지 소바',
            description: '하구로산 정상 인근 산나이(山内) 지구에는 소바 식당이 여럿 모여 있습니다. 이 지역의 소바는 쇼나이 지방의 명물로, 등반 후 허기를 달래기에 더없이 좋습니다.\n\n식당가는 삼신합제전 근처에 위치해 있어 참배 후 바로 들르기 편합니다. 각 식당마다 분위기와 메뉴가 조금씩 다르며, 대부분 소바와 간단한 산나이 요리를 함께 제공합니다.',
            tips: '현금 지참 권장. 점심 시간대 혼잡할 수 있으므로 11:30~12:00 사이에 방문 권장.',
          },
        },
        {
          id: 'd2-return',
          time: '14:00',
          title: '하구로산 → 쓰루오카역 (버스 귀환)',
          titleJa: '羽黒山→鶴岡駅 バス',
          type: 'transport',
          description: '산정 버스 정류장에서 쓰루오카역 방향 041계통 탑승. 스이덴 테라스로 귀환.',
          cost: '¥1,250',
          duration: '54분',
        },
      ],
    },

    {
      day: 3,
      date: '2026-08-08',
      dayOfWeek: '토',
      theme: '사카타 당일치기',
      events: [
        {
          id: 'd3-to-sakata',
          time: '09:00',
          title: '쓰루오카역 → 사카타역 (JR 우에쓰선)',
          titleJa: '鶴岡駅→酒田駅 JR羽越本線',
          type: 'transport',
          description: 'JR 우에쓰선 보통열차. 쓰루오카역 → 사카타역. 약 30분 소요.',
          cost: '¥330',
          duration: '약 30분',
        },
        {
          id: 'd3-sankyo',
          time: '10:00',
          title: '산쿄 창고',
          titleJa: '山居倉庫',
          type: 'sightseeing',
          description: '1893년 축조된 쌀 저장 창고군. 느티나무 방풍림과 함께 사카타의 상징적 풍경.',
          mapQuery: 'Sankyo Soko Sakata',
          guide: {
            summary: '1893년 창고, 느티나무 숲과 어우러진 사카타의 아이콘',
            description: '산쿄 창고(山居倉庫)는 1893년(明治26年) 쇼나이 번의 쌀 거래소로 건립된 쌀 저장 창고군입니다. 현재 9동의 창고가 남아 있으며, 일부는 내부를 개방해 쇼나이 쌀의 역사를 소개하는 전시관으로 운영 중입니다.\n\n창고 뒤편을 빽빽이 채운 느티나무(欅) 방풍림은 여름 직사광선과 겨울 북서풍을 막기 위해 조성된 것으로, 지금은 산쿄 창고와 함께 사카타를 상징하는 아름다운 풍경을 만들어냅니다.\n\n영화 《오싱(おしん)》 촬영지이기도 하며, 강가의 풍경과 함께 사카타 관광의 필수 코스로 자리잡고 있습니다.',
            tips: '창고 내부 전시 입장 무료. 느티나무 가로수 길은 이른 아침이나 늦은 오후가 빛이 아름답습니다.',
          },
        },
        {
          id: 'd3-homma',
          time: '11:00',
          title: '혼마 가문 구 본저',
          titleJa: '本間家旧本邸',
          type: 'sightseeing',
          description: '에도 시대 사카타 최대 상인 혼마 가문의 구 본저. 무가 양식과 상인 양식을 절충한 건축.',
          cost: '¥900',
          mapQuery: 'Homma Residence Sakata',
          guide: {
            summary: '에도 시대 최대 호상 혼마 가문의 저택',
            description: '혼마 가문(本間家)은 에도 시대 사카타에서 번성한 대상인 가문으로, "혼마 같은 부자는 없다(本間様には及びもないが)"라는 속담이 생길 정도로 막대한 재력을 자랑했습니다.\n\n구 본저(旧本邸)는 1768년(明和5年)에 지어진 건물로, 당시 번주를 숙박시키기 위한 무가 양식(武家造)과 상가 양식(商家造)을 절충한 독특한 구조입니다. 국가 중요 문화재로 지정되어 있으며, 넓고 아름다운 정원도 함께 공개되어 있습니다.',
            tips: '입장료: ¥900 (정원 포함). 관람 소요 시간 약 40~60분. 영어 설명 자료 있음.',
          },
        },
        {
          id: 'd3-lunch',
          time: '12:30',
          title: '점심 — 고마쓰 마구로',
          titleJa: 'こまつまぐろ',
          type: 'meal',
          description: '사카타 항구의 참치 전문 식당. 사카타에서 하역되는 신선한 참치를 저렴하게 즐길 수 있음.',
          mapQuery: 'Komatsu Maguro Sakata',
          guide: {
            summary: '사카타 항구에서 직송, 참치 덮밥 전문점',
            description: '사카타(酒田)는 일본해(日本海)에서 잡은 참치의 주요 집산지로, 신선한 참치를 저렴하게 즐길 수 있는 곳으로 유명합니다. 고마쓰 마구로(こまつまぐろ)는 사카타 시내의 참치 덮밥 전문점으로, 두꺼운 참치 회를 듬뿍 올린 덮밥이 인기 메뉴입니다.\n\n사카타산 참치는 "쇼나이 마구로"라고도 불리며, 도쿄·도요스 시장에도 출하되는 고급 참치입니다.',
            tips: '점심 시간대 혼잡. 12:00 이전 방문 권장. 현금 지참 권장.',
          },
        },
        {
          id: 'd3-somaro',
          time: '14:00',
          title: '소마로',
          titleJa: '相馬楼',
          type: 'activity',
          description: '에도 시대 사카타의 고급 요정(料亭)을 복원한 문화 복합시설. 기생 무용 공연 및 예술 전시.',
          cost: '¥1,000',
          mapQuery: 'Somaro Sakata',
          alert: '화·금 휴관. 개관 시간 10:00~15:30. 토요일 방문이므로 정상 영업.',
          guide: {
            summary: '에도 시대 요정을 복원한 사카타 문화의 정수',
            description: '소마로(相馬楼)는 에도 시대 쇼나이 지방의 번창한 항구 도시 사카타에서 번성했던 고급 요정(料亭)을 복원한 문화 복합시설입니다. 당시 쇼나이의 상인 문화와 유흥 문화를 생생하게 전합니다.\n\n시설 내에는 기생(芸妓) 무용 공연을 볼 수 있는 공연장, 다케히사 유메지(竹久夢二)의 작품을 소장한 미술관, 전통 도예 전시 등이 있습니다. 붉은 카펫이 깔린 계단과 화려한 실내 장식이 인상적입니다.',
            tips: '화·금 휴관. 10:00~15:30 (최종 입장 15:00). 무용 공연 시간 확인 후 방문 권장.',
          },
        },
        {
          id: 'd3-bakery',
          time: '15:30',
          title: '히요리 베이커리 & 카페',
          titleJa: 'ひよりベーカリー&カフェ',
          type: 'meal',
          description: '히요리야마 공원 근처의 인기 베이커리 카페. 사카타 산책 중 티타임.',
          mapQuery: 'Hiyori Bakery Cafe Sakata',
        },
        {
          id: 'd3-domon',
          time: '16:00',
          title: '도몬 켄 기념관',
          titleJa: '土門拳記念館',
          type: 'sightseeing',
          description: '사카타 출신 사진작가 도몬 켄의 기념관. 일본 리얼리즘 사진의 거장.',
          cost: '¥750',
          mapQuery: 'Domon Ken Museum Sakata',
          guide: {
            summary: '일본 리얼리즘 사진의 거장 도몬 켄을 기리는 미술관',
            description: '도몬 켄(土門拳, 1909~1990)은 사카타 출신의 사진작가로, 일본 리얼리즘 사진을 대표하는 거장입니다. 특히 불상 사진 시리즈와 탄광 노동자·피폭자를 담은 사회 다큐멘터리 사진으로 유명합니다.\n\n기념관은 히요리야마 공원(日和山公園) 호수 옆에 위치하며, 건축가 야나기자와 다케후미(谷口吉生)가 설계한 건물 자체도 훌륭한 예술 작품입니다. 관내에는 도몬 켄의 생애와 작품 6만 점이 소장되어 있으며, 주요 작품들이 상설 전시됩니다.',
            tips: '입장료: ¥750. 관람 소요 시간 약 1시간. 히요리야마 공원과 우치카와 산책로가 도보권.',
          },
        },
        {
          id: 'd3-dinner',
          time: '19:00',
          title: '저녁 — 알 켓차노 (예약 미확정)',
          titleJa: 'アル・ケッチャーノ (予約未確定)',
          type: 'meal',
          description: '쓰루오카의 오쿠다 마사유키 셰프가 이끄는 쇼나이 식재료 이탈리안. 6월 예약 오픈 예정. 저녁 식사 후 사카타역 → 쓰루오카역 JR 귀환 (¥330).',
          mapQuery: 'Al che-cciano Tsuruoka',
          alert: '예약 미확정 (6월 오픈 예정). 예약 실패 시 대안 필요: 소마로 내 식사 / 쿠라자와야 재방문.',
        },
      ],
    },

    {
      day: 4,
      date: '2026-08-09',
      dayOfWeek: '일',
      theme: '가모 수족관 + 귀국',
      events: [
        {
          id: 'd4-aquarium',
          time: '10:00',
          title: '가모 수족관',
          titleJa: '加茂水族館',
          type: 'activity',
          description: '세계 최대 수준의 해파리 특화 수족관. 약 60종의 해파리를 전시. 스이덴 테라스에서 택시 이동.',
          cost: '¥1,500',
          mapQuery: 'Kamo Aquarium Tsuruoka',
          guide: {
            summary: '세계 최대급 해파리 전시 수족관',
            description: '가모 수족관(加茂水族館)은 쓰루오카시 가모 해안(加茂海岸)에 위치한 수족관으로, 세계 최대 규모의 해파리(クラゲ) 전시를 자랑합니다. 현재 약 60종의 해파리를 전시하며, 2012년 기네스 세계 기록에 등재된 바 있습니다.\n\n직경 5m의 대형 원형 수조에서 수천 마리의 해파리가 떠다니는 광경은 환상적입니다. 해파리 외에도 일본해 어류, 돌고래, 물개 쇼 등 다양한 볼거리가 있습니다.\n\n기념품점에서는 해파리를 모티프로 한 과자와 굿즈를 구매할 수 있습니다.',
            tips: '입장료: ¥1,500. 돌고래·물개 쇼 시간 사전 확인 권장. 주말 혼잡 예상. 스이덴 테라스에서 택시 약 30분.',
          },
        },
        {
          id: 'd4-beach',
          time: '12:00',
          title: '유라 해안 · 하쿠산지마',
          titleJa: '由良海岸 · 白山島',
          type: 'activity',
          description: '가모 수족관 옆 유라 해안과 하쿠산지마. 일본해 해안 산책. 붉은 다리로 섬에 건너갈 수 있음.',
          mapQuery: 'Hakusan Island Tsuruoka',
          guide: {
            summary: '일본해와 붉은 다리, 하쿠산지마 산책',
            description: '가모 수족관 바로 옆에 위치한 유라 해안(由良海岸)은 일본해를 바라보는 모래사장입니다. 해안에서 작은 붉은 다리를 건너면 하쿠산지마(白山島)에 닿을 수 있습니다.\n\n하쿠산지마는 작은 섬으로, 섬 위에 하쿠산 신사(白山神社)가 있습니다. 수분 높은 여름 해풍을 맞으며 산책하기 좋으며, 일본해 특유의 경치를 즐길 수 있습니다.',
            tips: '가모 수족관과 도보 이동 가능. 여름에 바람이 강할 수 있음. 귀국 일정을 고려해 여유 있게 일정 배분.',
          },
        },
        {
          id: 'd4-checkout',
          time: '14:00',
          title: '스이덴 테라스 체크아웃 → 쓰루오카역',
          titleJa: 'チェックアウト → 鶴岡駅',
          type: 'transport',
          description: '체크아웃(11:00까지. 짐 맡기기 가능). 쓰루오카역 택시 이동 후 이나호 특급으로 니가타 향발.',
          cost: '택시 약 ¥1,000/인',
          duration: '택시 15분',
        },
        {
          id: 'd4-inaho',
          time: '16:00',
          title: '쓰루오카역 → 니가타역 (이나호 특급)',
          titleJa: '鶴岡駅→新潟駅 特急いなほ',
          type: 'transport',
          description: 'JR 이나호 특급. 쓰루오카역 → 니가타역. 1시간 20분 소요.',
          cost: '¥2,640',
          duration: '1시간 20분',
          alert: '출발 시각은 여행 전 실제 시간표 확인 필수. 공항 도착은 출발 2시간 전 목표.',
        },
        {
          id: 'd4-flight',
          time: '20:20',
          title: '니가타 공항 출발 — KE2198',
          titleJa: '新潟空港出発 — KE2198',
          type: 'transport',
          description: '니가타역 → 공항버스 (¥570, 25분) → 니가타 공항. KE2198 KIJ 20:20 → ICN 22:40. 좌석: SUNGBUHM 33F · JIYONG 33E.',
          cost: '공항버스 ¥570 + 항공권 포함',
          duration: '공항버스 25분 + 비행 2시간 20분',
        },
      ],
    },
  ],

  transport: [
    {
      id: 'tr1',
      from: '니가타 공항',
      to: '니가타역',
      mode: 'bus',
      modeLabel: '공항버스',
      duration: '25분',
      cost: '¥570',
    },
    {
      id: 'tr2',
      from: '니가타역',
      to: '쓰루오카역',
      mode: 'train',
      modeLabel: '이나호 특급',
      duration: '1시간 20분',
      cost: '¥2,640',
    },
    {
      id: 'tr3',
      from: '쓰루오카역',
      to: '스이덴 테라스',
      mode: 'taxi',
      modeLabel: '택시',
      duration: '15분',
      cost: '약 ¥2,000 (2인 분담)',
      note: '1인 약 ¥1,000',
    },
    {
      id: 'tr4',
      from: '쓰루오카',
      to: '사카타',
      mode: 'train',
      modeLabel: 'JR 우에쓰선',
      duration: '약 30분',
      cost: '¥330',
      note: '왕복 각 ¥330',
    },
    {
      id: 'tr5',
      from: '쓰루오카역',
      to: '하구로산정',
      mode: 'bus',
      modeLabel: '쇼나이 교통 041계통',
      duration: '54분',
      cost: '¥1,250',
    },
    {
      id: 'tr6',
      from: '쓰루오카역',
      to: '니가타역',
      mode: 'train',
      modeLabel: '이나호 특급',
      duration: '1시간 20분',
      cost: '¥2,640',
    },
    {
      id: 'tr7',
      from: '니가타역',
      to: '니가타 공항',
      mode: 'bus',
      modeLabel: '공항버스',
      duration: '25분',
      cost: '¥570',
    },
  ],

  tips: {
    weather:
      '8월 쓰루오카·사카타: 최고 29°C 전후, 다습. 소나기 가능. 우산 및 땀 흡수 의류 권장.',
    payment:
      '현금 필수 구간: 쇼나이 교통 버스, 소규모 식당·상점. IC카드(Suica 등) 사용 가능: JR 노선, 편의점. 세븐일레븐 ATM 이용 가능.',
    misc: [
      '하구로산 석단 등반 약 40~60분, 운동화 필수.',
      '소마로: 화·금 휴관, 10:00~15:30.',
      '알 켓차노 예약 미확정 (6월 오픈 예정).',
      '이나호 특급은 좌석 지정 사전 구매 권장.',
    ],
  },

  japaneseRequests: [
    {
      id: 'jr1',
      label: '숙소 체크인 문의',
      text: 'チェックインをお願いします。予約番号は73429589556696です。Hotels.comでの予約です。',
    },
    {
      id: 'jr2',
      label: '알 켓차노 예약 문의 (전화용)',
      text: '予約をお願いしたいのですが。8月8日の夜、2名です。',
    },
    {
      id: 'jr3',
      label: '택시 — 스이덴 테라스로',
      text: 'スイデンテラスホテルまでお願いします。',
    },
    {
      id: 'jr4',
      label: '택시 — 가모 수족관으로',
      text: '加茂水族館までお願いします。',
    },
  ],
}

export default tripData
