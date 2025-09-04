export /**
 * 코드 추출
 * @template C
 * @template K
 * @param {C} codeKey 코드키(ex: REGION_CODES)
 * @param {K} code 코드(ex: ALL)
 * @return {*}  {typeof CommonCodes[C]['CODE_DETAIL'][K]['CODE']}
 */
const code = <C extends Category, K extends CodeDetailKey<C>>(
  codeKey: C,
  code: K
): (typeof CommonCodes)[C]['CODE_DETAIL'][K]['CODE'] => {
  const codeDetail = CommonCodes[codeKey].CODE_DETAIL;
  return codeDetail[code]?.['CODE'];
};

export /**
 * 코드 속성명으로 코드명 추출
 * @template C
 * @template K
 * @param {C} codeKey 코드키(ex: REGION_CODES)
 * @param {K} codePropertyName 코드 속성명(ex: ALL, SEOUL)
 * @return {*}  {typeof CommonCodes[C]['CODE_DETAIL'][K]['CODE']}
 */
const codeName = <C extends Category, K extends CodeDetailKey<C>>(
  codeKey: C,
  codePropertyName: K
): (typeof CommonCodes)[C]['CODE_DETAIL'][K]['CODE'] => {
  const codeDetail = CommonCodes[codeKey].CODE_DETAIL;
  return codeDetail[codePropertyName]?.['CODE_NAME'];
};

/**
 * 코드로 코드명 추출
 * @template C
 * @template K
 * @param {C} codeKey 코드 키 (ex: REGION_CODES)
 * @param {string} code 코드 (ex: 0, 1)
 * @return {*}  {string | undefined} 코드명 반환 (해당 코드가 없을 경우 undefined)
 */
export const codeNameByCode = <C extends keyof typeof CommonCodes>(
  codeKey: C,
  code: string
): string | undefined => {
  const codeDetails = CommonCodes[codeKey]?.CODE_DETAIL;
  if (!codeDetails) return undefined;
  // 코드가 일치하는 항목을 찾고 해당 CODE_NAME 반환
  const matchedEntry = Object.values(codeDetails).find(
    (entry) => entry.CODE === code
  );
  return matchedEntry?.CODE_NAME;
};

/**
 * 특정 코드 키 내에 전달한 실제 코드값(CODE)이 존재하는지 여부 반환
 * @example hasDetailCode('REGULAR_PERIOD_CODES', 'J1') -> true
 */
export const hasCode = <C extends keyof typeof CommonCodes>(
  codeKey: C,
  code: string | undefined | null
): boolean => {
  if (!code) return false;
  const codeDetails = CommonCodes[codeKey]?.CODE_DETAIL;
  if (!codeDetails) return false;
  return Object.values(codeDetails).some((detail) => detail.CODE === code);
};

export const CommonCodes: Record<string, CommonCode> = {
  REGION_CODES: {
    CODE_IDX: 1001,
    TABLE: 'MockOpr_Campus',
    COLUMN: 'RegionCode',
    DESCRIPTION: '지역코드',
    CODE_DETAIL: {
      ALL: { CODE: '0', CODE_NAME: '전체' },
      SEOUL: { CODE: '1', CODE_NAME: '서울' },
      INCHEON_GYEONGGI: { CODE: '2', CODE_NAME: '인천경기' },
      GANGWON_JEJU: { CODE: '3', CODE_NAME: '강원제주' },
      CHUNGBUK: { CODE: '4', CODE_NAME: '충북' },
      DAEJEON_CHUNGNAM: { CODE: '5', CODE_NAME: '대전충남' },
      JEONBUK: { CODE: '6', CODE_NAME: '전북' },
      GWANGJU_JEONNAM: { CODE: '7', CODE_NAME: '광주전남' },
      DAEGU_GYEONGBUK: { CODE: '8', CODE_NAME: '대구경북' },
      BUSAN_GYEONGNAM: { CODE: '9', CODE_NAME: '부산경남' },
    },
  },
  SELECTION_METHOD_CODES: {
    CODE_IDX: 1002,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '선발방법코드',
    CODE_DETAIL: {
      ALL: { CODE: 'A', CODE_NAME: '전체' },
      SAT100: { CODE: 'SAT', CODE_NAME: '수능 100%' },
      STUDENT_RECORD: { CODE: 'E', CODE_NAME: '수능+학생부' },
      OTHER: { CODE: 'O', CODE_NAME: '기타' },
      ACADEMIC_RECORD: { CODE: 'E2', CODE_NAME: '학생부 반영' },
      PRACTICAL: { CODE: 'P', CODE_NAME: '실기 반영' },
      INTERVIEW: { CODE: 'I', CODE_NAME: '면접 반영' },
    },
  },
  SAT_REFLECTION_AREA_CODES: {
    CODE_IDX: 1003,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '수능반영영역',
    CODE_DETAIL: {
      KOREAN: { CODE: 'K', CODE_NAME: '국어' },
      MATH: { CODE: 'M', CODE_NAME: '수학' },
      ENGLISH: { CODE: 'E', CODE_NAME: '영어' },
      INQUIRY1: { CODE: 'I1', CODE_NAME: '탐구(1과목 반영)' },
      INQUIRY2: { CODE: 'I2', CODE_NAME: '탐구(2과목 반영)' },
    },
  },
  GUN_GROUP_CODES: {
    CODE_IDX: 1004,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '가나다군코드',
    CODE_DETAIL: {
      A_GROUP: { CODE: '1', CODE_NAME: '가' },
      B_GROUP: { CODE: '2', CODE_NAME: '나' },
      C_GROUP: { CODE: '3', CODE_NAME: '다' },
      OUTSIDE: { CODE: '4', CODE_NAME: '군외' },
    },
  },
  GRADE_LEVEL_CODES: {
    CODE_IDX: 1005,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '등급 구분 코드',
    CODE_DETAIL: {
      GRADE_LEVEL_ONE: { CODE: 'G1', CODE_NAME: '1등급' },
      GRADE_LEVEL_TWO: { CODE: 'G2', CODE_NAME: '2등급' },
      GRADE_LEVEL_THREE: { CODE: 'G3', CODE_NAME: '3등급' },
      GRADE_LEVEL_FOUR: { CODE: 'G4', CODE_NAME: '4등급' },
      GRADE_LEVEL_FIVE: { CODE: 'G5', CODE_NAME: '5등급' },
      GRADE_LEVEL_SIX: { CODE: 'G6', CODE_NAME: '6등급' },
      GRADE_LEVEL_SEVEN: { CODE: 'G7', CODE_NAME: '7등급' },
      GRADE_LEVEL_EIGHT: { CODE: 'G8', CODE_NAME: '8등급' },
      GRADE_LEVEL_NINE: { CODE: 'G9', CODE_NAME: '9등급' },
    },
  },
  PERIOD_CODES: {
    CODE_IDX: 1006,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '시기코드',
    CODE_DETAIL: {
      FIRST_EXAM: { CODE: 'E3', CODE_NAME: '3.26 학력평가' },
      SECOND_EXAM: { CODE: 'E5', CODE_NAME: '5.8 학력평가' },
      THIRD_EXAM: { CODE: 'E6', CODE_NAME: '6.4 모의평가' },
      FOURTH_EXAM: { CODE: 'E7', CODE_NAME: '7.10 학력평가' },
      FIFTH_EXAM: { CODE: 'E9', CODE_NAME: '9.3 모의평가' },
      SIXTH_EXAM: { CODE: 'E10', CODE_NAME: '10.14 학력평가' },
    },
  },
  UNIVERSITY_TYPE_CODES: {
    CODE_IDX: 1007,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '대학 유형 코드',
    CODE_DETAIL: {
      FIRST_EXAM: { CODE: 'FOUR_YEAR', CODE_NAME: '4년제대학' },
      SECOND_EXAM: { CODE: 'TWO_YEAR', CODE_NAME: '전문대학' },
    },
  },
  GRADE_CUT_SUBJECT_GROUP_CODES: {
    CODE_IDX: 1010,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '등급컷 과목 그룹 코드',
    CODE_DETAIL: {
      KOREAN_MATH_ENGLISH_HISTORY: { CODE: '1', CODE_NAME: '국수영한' },
      SOCIAL: { CODE: '2', CODE_NAME: '사회탐구' },
      SCIENCE: { CODE: '3', CODE_NAME: '과학탐구' },
    },
  },
  SCORE_TYPE: {
    CODE_IDX: 1012,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '점수유형',
    CODE_DETAIL: {
      STANDARD_SCORE: { CODE: 'standardScore', CODE_NAME: '표준점수' },
      RAW_SCORE: { CODE: 'rawScore', CODE_NAME: '원점수' },
      GRADELEVEL: { CODE: 'gradeLevel', CODE_NAME: '등급' },
      PERCENTILE: { CODE: 'percentile', CODE_NAME: '백분위' },
    },
  },
  MAJOR_SORT_CODES: {
    CODE_IDX: 1013,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '모집단위 노출 정렬 코드',
    CODE_DETAIL: {
      UNIVERSITY_NAME: { CODE: '1', CODE_NAME: '대학명순' },
      MAJOR_NAME: { CODE: '2', CODE_NAME: '학과명순' },
      LAST_YEAR_COMPETITION_RATE: { CODE: '3', CODE_NAME: '전년도 경쟁률순' },
    },
  },
  PASS_SCORE_RANGE_CODES: {
    CODE_IDX: 1014,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '합격점수범위',
    CODE_DETAIL: {
      PASS_50: { CODE: 'PASS_50', CODE_NAME: '안정' },
      PASS_80: { CODE: 'PASS_80', CODE_NAME: '적정' },
      PASS_100: { CODE: 'PASS_100', CODE_NAME: '소신' },
      PASS_110: { CODE: 'PASS_110', CODE_NAME: '위험' },
      PASS_150: { CODE: 'PASS_150', CODE_NAME: '매우위험' },
      IN_PROGRESS: { CODE: 'IP', CODE_NAME: '계산중' },
      NOT_AVAILABLE: { CODE: 'NA', CODE_NAME: '계산불가' },
      NOT_LOGGED_IN: { CODE: 'NL', CODE_NAME: '비로그인' },
      NOT_INPUT_GRADE: { CODE: 'NI', CODE_NAME: '성적입력안함' },
    },
  },
  SAT_REFLECTION_METRIC_CODES: {
    CODE_IDX: 1015,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '수능 반영 지표 코드',
    CODE_DETAIL: {
      ALL: { CODE: 'A', CODE_NAME: '표준점수+백분위' },
      STANDARD_SCORE: { CODE: 'S', CODE_NAME: '표준점수만' },
      PERCENTILE: { CODE: 'P', CODE_NAME: '백분위만' },
    },
  },
  SUBJECT_ADD_SCORE_CODES: {
    CODE_IDX: 1016,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '선택과목별 가산점 코드',
    CODE_DETAIL: {
      MATH: { CODE: 'MA', CODE_NAME: '수(미/기) 가산점' },
      SOCIAL_INQUIRY: { CODE: 'SO', CODE_NAME: '사탐 가산점' },
      SCIENCE_INQUIRY: { CODE: 'SC', CODE_NAME: '과탐 가산점' },
    },
  },
  CONSONANTS_CODES: {
    CODE_IDX: 1017,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '한국 자음',
    CODE_DETAIL: {
      G: { CODE: 'ㄱ', CODE_NAME: 'ㄱ' },
      N: { CODE: 'ㄴ', CODE_NAME: 'ㄴ' },
      D: { CODE: 'ㄷ', CODE_NAME: 'ㄷ' },
      R: { CODE: 'ㄹ', CODE_NAME: 'ㄹ' },
      M: { CODE: 'ㅁ', CODE_NAME: 'ㅁ' },
      B: { CODE: 'ㅂ', CODE_NAME: 'ㅂ' },
      S: { CODE: 'ㅅ', CODE_NAME: 'ㅅ' },
      NG: { CODE: 'ㅇ', CODE_NAME: 'ㅇ' },
      J: { CODE: 'ㅈ', CODE_NAME: 'ㅈ' },
      CH: { CODE: 'ㅊ', CODE_NAME: 'ㅊ' },
      K: { CODE: 'ㅋ', CODE_NAME: 'ㅋ' },
      T: { CODE: 'ㅌ', CODE_NAME: 'ㅌ' },
      P: { CODE: 'ㅍ', CODE_NAME: 'ㅍ' },
      H: { CODE: 'ㅎ', CODE_NAME: 'ㅎ' },
    },
  },
  USER_DEVICE_TYPE_CODES: {
    CODE_IDX: 1018,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '사용자 디바이스 타입 코드',
    CODE_DETAIL: {
      MOBILE: { CODE: 'M', CODE_NAME: '모바일' },
      PC: { CODE: 'P', CODE_NAME: 'PC' },
    },
  },
  REQUEST_PAGE_CODES: {
    CODE_IDX: 1019,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '요청 페이지 코드',
    CODE_DETAIL: {
      MOCK_RECOMMEND_UNIVERSITY: {
        CODE: 'ERecomUniv',
        CODE_NAME: '모의평가 추천대학',
      },
      CURATION: { CODE: 'JCurationList', CODE_NAME: '큐레이션' },
    },
  },
  GRADUATION_TYPE_CODES: {
    CODE_IDX: 1020,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '학생 구분 코드',
    CODE_DETAIL: {
      NOT_INPUT: { CODE: '0', CODE_NAME: '출신고교 미입력자' },
      FIRST_YEAR: { CODE: '1', CODE_NAME: '고1' },
      SECOND_YEAR: { CODE: '2', CODE_NAME: '고2' },
      THIRD_YEAR: { CODE: '3', CODE_NAME: '고3' },
      GRADUATES: { CODE: '4', CODE_NAME: 'n수' },
      GED_HOLDER: { CODE: '5', CODE_NAME: '검정고시' },
    },
  },
  INQUIRY_GRADE_TYPE_CODES: {
    CODE_IDX: 1021,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '탐구 과목 입력 유형 코드',
    CODE_DETAIL: {
      NOT_INPUT: { CODE: 'NI', CODE_NAME: '미응시' },
      SOCIAL: { CODE: 'SO', CODE_NAME: '사탐 응시' },
      SCIENCE: { CODE: 'SC', CODE_NAME: '과탐 응시' },
      SOCIAL_SCIENCE: { CODE: 'SS', CODE_NAME: '사과탐 응시' },
      VOCATIONAL: { CODE: 'VO', CODE_NAME: '직탐 응시' },
    },
  },
  SAT_PASS_POSSIBILITY_CODES: {
    CODE_IDX: 1022,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '합격가능성 코드',
    CODE_DETAIL: {
      FIRST_PASS: { CODE: 'FIRST', CODE_NAME: '최초합격' },
      SUPPLEMENT_PASS: { CODE: 'SUPPLEMENT', CODE_NAME: '추가합격' },
      PASS_BOUNDARY: { CODE: 'BOUNDARY', CODE_NAME: '추합 or 불합' },
      FAIL: { CODE: 'FAIL', CODE_NAME: '불합격' },
      ALL_PASS: { CODE: 'ALL_PASS', CODE_NAME: '합격' },
      CALC_UNAVAILABLE: { CODE: 'NA', CODE_NAME: '계산불가' },
      ANALYZING: { CODE: 'AL', CODE_NAME: '분석중' },
      IN_CALCULATION: { CODE: 'IP', CODE_NAME: '계산중' },
      ETC: { CODE: 'ETC', CODE_NAME: '합격예측결과' },
    },
  },
  EXAM_ANNOUNCEMENT_STATUS_CODES: {
    CODE_IDX: 1050,
    TABLE: 'MockDev_Exam',
    COLUMN: 'AnnouncementStatusCode',
    DESCRIPTION: '모의평가 성적 발표 상태 코드',
    CODE_DETAIL: {
      BEFORE_SERVICE: { CODE: 'A', CODE_NAME: '서비스전', ORDER: 1 },
      ESTIMATED_TEMPORARY_SCORING: {
        CODE: 'B',
        CODE_NAME: '가채점 집계중',
        ORDER: 2,
      },
      CONFIRMED_TEMPORARY_SCORE: {
        CODE: 'C',
        CODE_NAME: '가채점 확정',
        ORDER: 3,
      },
      CONFIRMED_FINAL_SCORE: { CODE: 'D', CODE_NAME: '실채점 확정', ORDER: 4 },
    },
  },
  CUT_ANNOUNCEMENT_STATUS_CODES: {
    CODE_IDX: 1101,
    TABLE: 'MockOpr_GradeLevelCutOff',
    COLUMN: 'AnnouncementStatusCode',
    DESCRIPTION: '등급컷 성적 발표 상태 코드',
    CODE_DETAIL: {
      AGGREGATED_TEMPORARY_SCORING: {
        CODE: 'AT',
        CODE_NAME: '가채점 집계중',
        ORDER: 1,
      },
      ESTIMATED_TEMPORARY_SCORING: {
        CODE: 'ET',
        CODE_NAME: '가채점 추정',
        ORDER: 2,
      },
      CONFIRMED_TEMPORARY_SCORE: {
        CODE: 'CT',
        CODE_NAME: '가채점 확정',
        ORDER: 3,
      },
      CONFIRMED_FINAL_SCORE: { CODE: 'CF', CODE_NAME: '실채점 확정', ORDER: 4 },
    },
  },
  REFLECTION_AREA_GROUP_CODES: {
    CODE_IDX: 1120,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '수능 반영 영역 조합',
    CODE_DETAIL: {
      KMEI2: { CODE: 'KMEI2', CODE_NAME: '국+수+영+탐(2)', ORDER: 1 },
      KMEI1: { CODE: 'KMEI1', CODE_NAME: '국+수+영+탐(1)', ORDER: 2 },
      KMI2: { CODE: 'KMI2', CODE_NAME: '국+수+탐(2)', ORDER: 3 },
      KMI1: { CODE: 'KMI1', CODE_NAME: '국+수+탐(1)', ORDER: 4 },
      KEI2: { CODE: 'KEI2', CODE_NAME: '국+영+탐(2)', ORDER: 5 },
      KEI1: { CODE: 'KEI1', CODE_NAME: '국+영+탐(1)', ORDER: 6 },
      MEI2: { CODE: 'MEI2', CODE_NAME: '수+영+탐(2)', ORDER: 7 },
      MEI1: { CODE: 'MEI1', CODE_NAME: '수+영+탐(1)', ORDER: 8 },
      KME: { CODE: 'KME', CODE_NAME: '국+수+영', ORDER: 9 },
    },
  },
  REFLECTION_ADJUSTMENT_CODES: {
    CODE_IDX: 1121,
    TABLE: 'MockOpr_EnglishGradeAdjustment',
    COLUMN: 'AdjustmentText',
    DESCRIPTION: '가감점구분코드',
    CODE_DETAIL: {
      ADD: { CODE: 'A', CODE_NAME: '가산' },
      SUBTRACT: { CODE: 'D', CODE_NAME: '감점' },
    },
  },
  APPLICATION_PATH_CODES: {
    CODE_IDX: 1130,
    TABLE: 'MockDev_Application',
    COLUMN: 'ApplicationPathCode',
    DESCRIPTION: '지원경로코드',
    CODE_DETAIL: {
      HIGHJINHAK: { CODE: '1', CODE_NAME: '일반(하이진학)' },
      JINHAKTONG: { CODE: '2', CODE_NAME: '진학통' },
    },
  },
  MAJOR_TYPE_CODES: {
    CODE_IDX: 1140,
    TABLE: 'MockOpr_MajorCategory',
    COLUMN: 'MajorTypeCode',
    DESCRIPTION: '계열구분',
    CODE_DETAIL: {
      AUTONOMOUS: { CODE: '자율', CODE_NAME: '자율' },
      HUMANITIES: { CODE: '인문', CODE_NAME: '인문' },
      NATURAL_SCIENCE: { CODE: '자연', CODE_NAME: '자연' },
      ARTS_SPORTS: { CODE: '예체능', CODE_NAME: '예체능' },
    },
  },
  MAJOR_PART_CODES: {
    CODE_IDX: 1141,
    TABLE: 'MockOpr_MajorPart',
    COLUMN: 'MajorPartCode',
    DESCRIPTION: '파트 코드',
    CODE_DETAIL: {
      HUMANITIES: { CODE: '1', CODE_NAME: '인문' },
      NATURAL_SCIENCE: { CODE: '2', CODE_NAME: '자연' },
      ARTS_SPORTS: { CODE: '3', CODE_NAME: '예체능' },
      FREE_MAJOR: { CODE: '4', CODE_NAME: '자유전공' },
      HUMANITIES_MEDICINE: { CODE: '10', CODE_NAME: '의치한(인문)' },
      ELEMENTARY_EDUCATION: { CODE: '11', CODE_NAME: '초등교육' },
      NATURAL_SCIENCE_MEDICINE: { CODE: '12', CODE_NAME: '의치한(자연)' },
      HUMANITIES_PHARMACY: { CODE: '13', CODE_NAME: '약학(인문)' },
      NATURAL_SCIENCE_PHARMACY: { CODE: '14', CODE_NAME: '약학(자연)' },
    },
  },
  GRADE_LEVEL_CUT_GRADE_LEVEL_CODES: {
    CODE_IDX: 1160,
    TABLE: 'MockOpr_GradeLevelCutOffSubject',
    COLUMN: 'GradeLevel',
    DESCRIPTION: '등급컷 등급 구분 코드',
    CODE_DETAIL: {
      GRADE_LEVEL_PERFECT: { CODE: '0', CODE_NAME: '만점', ORDER: 1 },
      GRADE_LEVEL_ONE: { CODE: '1', CODE_NAME: '1등급', ORDER: 2 },
      GRADE_LEVEL_TWO: { CODE: '2', CODE_NAME: '2등급', ORDER: 3 },
      GRADE_LEVEL_THREE: { CODE: '3', CODE_NAME: '3등급', ORDER: 4 },
      GRADE_LEVEL_FOUR: { CODE: '4', CODE_NAME: '4등급', ORDER: 5 },
      GRADE_LEVEL_FIVE: { CODE: '5', CODE_NAME: '5등급', ORDER: 6 },
      GRADE_LEVEL_SIX: { CODE: '6', CODE_NAME: '6등급', ORDER: 7 },
      GRADE_LEVEL_SEVEN: { CODE: '7', CODE_NAME: '7등급', ORDER: 8 },
      GRADE_LEVEL_EIGHT: { CODE: '8', CODE_NAME: '8등급', ORDER: 9 },
    },
  },
  QUESTION_TYPE_CODES: {
    CODE_IDX: 1165,
    TABLE: 'MockDev_ScoringSubjectAnswer',
    COLUMN: 'AnswerInformation_questionTypeCode',
    DESCRIPTION: '문제유형코드',
    CODE_DETAIL: {
      MULTIPLE_CHOICE: { CODE: 'multipleChoice', CODE_NAME: '객관식' },
      SHORT_ANSWER: { CODE: 'shortAnswer', CODE_NAME: '주관식' },
    },
  },
  GENDER_CODES: {
    CODE_IDX: 5000,
    TABLE: 'UserBaseInfo',
    COLUMN: 'MemGender',
    DESCRIPTION: '성별 코드',
    CODE_DETAIL: {
      MALE: { CODE: '1', CODE_NAME: '남' },
      FEMALE: { CODE: '2', CODE_NAME: '여' },
    },
  },
  GRADE_VERIFICATION_STATUS_CODES: {
    CODE_IDX: 5001,
    TABLE: 'RegularDev_Grade',
    COLUMN: 'GradeVerificationStatusCode',
    DESCRIPTION: '성적 인증 상태 코드',
    CODE_DETAIL: {
      BEFORE_VERIFICATION: { CODE: 'B1', CODE_NAME: '인증 전' },
      AUTO_VERIFIED: { CODE: 'S1', CODE_NAME: '자동인증' },
      AUTO_VERIFIED_NEED_CONFIRM: {
        CODE: 'S2',
        CODE_NAME: '자동인증 확인필요',
      },
      VERIFIED: { CODE: 'S3', CODE_NAME: '인증완료' },
      FORCE_VERIFIED: { CODE: 'S4', CODE_NAME: '강제인증' },
      NOT_VERIFIED: { CODE: 'N1', CODE_NAME: '인증불가' },
      MANUAL_VERIFIED_IN_PROGRESS: { CODE: 'G1', CODE_NAME: '관리자확인중' },
      RE_VERIFIED: { CODE: 'R1', CODE_NAME: '재인증요청' },
      DOCUMENT_NUMBER_RECOGNITION_FAILED: {
        CODE: 'F1',
        CODE_NAME: '문서확인번호 인식실패',
      },
      YEAR_RECOGNITION_FAILED: { CODE: 'F2', CODE_NAME: '학년도 인식실패' },
      TITLE_RECOGNITION_FAILED: { CODE: 'F3', CODE_NAME: '타이틀 인식실패' },
    },
  },
  REGULAR_PERIOD_CODES: {
    CODE_IDX: 5002,
    TABLE: null,
    COLUMN: 'PeriodCode',
    DESCRIPTION: '시기 코드',
    CODE_DETAIL: {
      REGULAR: { CODE: 'J1', CODE_NAME: '정시' },
    },
  },
  REGULAR_PASS_SCORE_RANGE_CODES: {
    CODE_IDX: 5003,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '합격점수범위',
    CODE_DETAIL: {
      PASS_FIRST: { CODE: 'PASS_FIRST', CODE_NAME: '최초합격' },
      PASS_SUPPLEMENT: { CODE: 'PASS_SUPL', CODE_NAME: '추가합격' },
      PASS_SUPPLEMENT_OR_FAIL: {
        CODE: 'PASS_SUPL_FAIL',
        CODE_NAME: '추합 or 불합',
      },
      PASS_FAIL: { CODE: 'PASS_FAIL', CODE_NAME: '불합격' },
      PASS_UNDER_ENROLLED: { CODE: 'PASS_UNDER', CODE_NAME: '합격' },
      ANALYZING: { CODE: 'AP', CODE_NAME: '분석중' },
      IN_PROGRESS: { CODE: 'IP', CODE_NAME: '계산중' },
      NOT_AVAILABLE: { CODE: 'NA', CODE_NAME: '계산불가' },
      ETC: { CODE: 'ETC', CODE_NAME: '합격예측결과' },
    },
  },
  PARITY_CODES: {
    CODE_IDX: 5004,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '문제지 유형 짝수, 홀수 코드',
    CODE_DETAIL: {
      EVEN: { CODE: 'E', CODE_NAME: '짝수' },
      ODD: { CODE: 'O', CODE_NAME: '홀수' },
    },
  },
  SERVICE_FUNCTION_MAX_COUNT_CODES: {
    CODE_IDX: 5005,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '정시 서비스 최대 횟수 코드',
    CODE_DETAIL: {
      MOCK_GRADE_INPUT_COUNT: {
        CODE: 'MGI',
        CODE_NAME: '가채점 성적 입력 기회',
      },
      FINAL_SCORE_GRADE_INPUT_COUNT: {
        CODE: 'FGI',
        CODE_NAME: '실채점 성적 입력 기회',
      },
      DAILY_FINAL_APPLICATION_INPUT_COUNT: {
        CODE: 'DFAI',
        CODE_NAME: '일일 실제지원 입력 기회',
      },
      TOTAL_FINAL_APPLICATION_INPUT_COUNT: {
        CODE: 'TFAI',
        CODE_NAME: '총 실제지원 입력 기회',
      },
      HIGH_SCHOOL_INPUT_COUNT: { CODE: 'HSI', CODE_NAME: '출신고교 입력 기회' },
      SCHOOL_VIOLENCE_INPUT_COUNT: {
        CODE: 'SVI',
        CODE_NAME: '출신고교 > 학폭 입력 기회',
      },
      PHYSICAL_GRADE_INPUT_COUNT: {
        CODE: 'PGI',
        CODE_NAME: '체대실기 성적 입력 기회',
      },
      PASS_PREDICTION_REPORT_VIEW_COUNT: {
        CODE: 'PPRV',
        CODE_NAME: '합격예측 리포트 조회 횟수',
      },
      ACTUAL_ADMISSION_REPORT_VIEW_COUNT: {
        CODE: 'AARV',
        CODE_NAME: '실제합격자 리포트 조회 횟수',
      },
      PREDICTION_CHANGE_REPORT_VIEW_COUNT: {
        CODE: 'PCRV',
        CODE_NAME: '예측변동 리포트 조회 횟수',
      },
      MOCK_APPLICATION_COUNT: {
        CODE: 'MA',
        CODE_NAME: '모의평가 최대 지원 횟수',
      },
      REGULAR_APPLICATION_COUNT: {
        CODE: 'RA',
        CODE_NAME: '정시 최대지원 횟수',
      },
    },
  },
  ADMISSION_TYPE_CODES: {
    CODE_IDX: 8000,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '핵심 업로드 전형 구분 코드',
    CODE_DETAIL: {
      MOCK: { CODE: 'MOCK', CODE_NAME: '모의평가' },
      EARLY: { CODE: 'EARLY', CODE_NAME: '수시' },
      REGULAR: { CODE: 'REGULAR', CODE_NAME: '정시' },
    },
  },
  ESSENTIAL_FORMULA_FILE_TYPE_CODE: {
    CODE_IDX: 8001,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '핵심 업로드 작업 구분 코드',
    CODE_DETAIL: {
      ALL: { CODE: 'A', CODE_NAME: '전체' },
      ADMISSION_GUIDE: { CODE: '1', CODE_NAME: '1. 모집요강.txt' },
      SAT_CALCULATION: { CODE: '2', CODE_NAME: '2. 수능산출.txt' },
      GRADE_LEVEL_TABLE: { CODE: '3', CODE_NAME: '3. 등급표.txt' },
      SUBJECT_CONVERSION_TABLE: {
        CODE: '4',
        CODE_NAME: '4. 과목별 변환표.txt',
      },
      KOREAN_HISTORY_GRADE_TABLE: {
        CODE: '5',
        CODE_NAME: '5. 한국사 등급표.txt',
      },
      ENGLISH_GRADE_TABLE: { CODE: '6', CODE_NAME: '6. 영어 등급표.txt' },
      ENGLISH_ADDITIONAL_SCORE: { CODE: '7', CODE_NAME: '7. 영어 가산점.txt' },
      SECOND_LANGUAGE_GRADE_TABLE: {
        CODE: '8',
        CODE_NAME: '8. 제2외 등급표.txt',
      },
    },
  },
  ESSENTIAL_FORMULA_FILE_TYPE_CODE_EARLY: {
    CODE_IDX: 8002,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '수시 핵심 업로드 작업 구분 코드',
    CODE_DETAIL: {
      ALL: { CODE: 'A', CODE_NAME: '전체' },
      S2_INVENTORY: { CODE: '2', CODE_NAME: '2. 목록.txt' },
      S2_RECORD: { CODE: '3', CODE_NAME: '3. 학생부.txt' },
      S2_MINIMUM_REQUREMENT: { CODE: '4', CODE_NAME: '4. 최저학력기준.txt' },
    },
  },
  JUNIORCOLLEGE_UPLOAD_TASK_CODES: {
    CODE_IDX: 8003,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '전문대 수시 핵심 업로드 작업 구분 코드',
    CODE_DETAIL: {
      ALL: { CODE: 'ALL', CODE_NAME: '전체' },
      FINAL_TXT: { CODE: '1', CODE_NAME: '1. 최종본.txt' },
    },
  },
  ESSENTIAL_FORMULA_FILE_TYPE_CODE_REGULAR: {
    CODE_IDX: 8004,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '정시 핵심 업로드 작업 구분 코드',
    CODE_DETAIL: {
      ALL: { CODE: 'A', CODE_NAME: '전체' },
      ADMISSION_GUIDE: { CODE: '1', CODE_NAME: '1. 모집요강.txt' },
      SAT_CALCULATION: { CODE: '2', CODE_NAME: '2. 수능산출.txt' },
      GRADE_LEVEL_TABLE: { CODE: '3', CODE_NAME: '3. 등급표.txt' },
      SUBJECT_CONVERSION_TABLE: {
        CODE: '4',
        CODE_NAME: '4. 과목별 변환표.txt',
      },
      KOREAN_HISTORY_GRADE_TABLE: {
        CODE: '5',
        CODE_NAME: '5. 한국사 등급표.txt',
      },
      ENGLISH_GRADE_TABLE: { CODE: '6', CODE_NAME: '6. 영어 등급표.txt' },
      ENGLISH_ADDITIONAL_SCORE: { CODE: '7', CODE_NAME: '7. 영어 가산점.txt' },
      SECOND_LANGUAGE_GRADE_TABLE: {
        CODE: '8',
        CODE_NAME: '8. 제2외 등급표.txt',
      },
      SCHOOL_VIOLENCE_GRADE_TABLE: {
        CODE: '9',
        CODE_NAME: '9. 학폭 등급표.txt',
      },
    },
  },
  ESSENTIAL_FORMULA_FILE_TYPE_CODE_COMPARISON: {
    CODE_IDX: 8005,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '정시 비교내신 업로드 작업 구분 코드',
    CODE_DETAIL: {
      ALL: { CODE: 'A', CODE_NAME: '전체' },
      ESSENTIAL_GUIDE: { CODE: '1', CODE_NAME: '비교내신 핵심_업로드용.txt' },
      GRADE_TABLE_A: { CODE: '2', CODE_NAME: '등급표A_업로드용.txt' },
      GRADE_TABLE_B: { CODE: '3', CODE_NAME: '등급표B_업로드용.txt' },
    },
  },
  ESSENTIAL_FORMULA_FILE_TYPE_CODE_PHYSICAL: {
    CODE_IDX: 8006,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '정시 체대실기 업로드 작업 구분 코드',
    CODE_DETAIL: {
      ALL: { CODE: 'A', CODE_NAME: '전체' },
      J1PP_MAJOR_ID: { CODE: '1', CODE_NAME: '1. J1PPMajorID.txt' },
      J1PP_TYPE_CODE: { CODE: '2', CODE_NAME: '2. J1PPTypeCode.txt' },
      J1PP_EVENT_GRADE_SCORE: {
        CODE: '3',
        CODE_NAME: '3. J1PPEventGradeScore.txt',
      },
      J1PP_TOTAL_SCORE: { CODE: '4', CODE_NAME: '4. J1PPTotalScore.txt' },
    },
  },
  ENGLISH_SELECTION_CODE: {
    CODE_IDX: 8500,
    TABLE: 'MockEssentialFormula',
    COLUMN: 'EnglishSelectionCode',
    DESCRIPTION: '영어 필수/선택 코드',
    CODE_DETAIL: {
      REQUIRED: { CODE: '1', CODE_NAME: '필수' },
      OPTIONAL: { CODE: '2', CODE_NAME: '선택' },
    },
  },
  CALCULATION_PROCESS_STATUS_CODES: {
    CODE_IDX: 9400,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '계산 상태 코드',
    CODE_DETAIL: {
      PENDING: { CODE: 'W', CODE_NAME: '대기' },
      PROCESSING: { CODE: 'P', CODE_NAME: '처리중' },
      ERROR: { CODE: 'E', CODE_NAME: '에러' },
      DONE: { CODE: 'S', CODE_NAME: '완료' },
      PARTIAL_DONE: { CODE: 'PS', CODE_NAME: '부분완료' },
    },
  },
  CALCULATION_TARGET_CODES: {
    CODE_IDX: 9401,
    TABLE: 'MockDev_RecommendCalcRequest',
    COLUMN: 'TargetCode',
    DESCRIPTION: '계산 대상 코드',
    CODE_DETAIL: {
      ALL_ADMISSION_GUIDELINES_OF_APPLICANTS: {
        CODE: 'M',
        CODE_NAME: '한 지원자의 전체 산출식 계산',
      },
      APPLICANT_UNIV_CODES: { CODE: 'U', CODE_NAME: '특정 대학 지원자 계산' },
      APPLICANT_CALC_CODE_PAIRS: {
        CODE: 'P',
        CODE_NAME: '지원자 + 산출식 계산',
      },
    },
  },
  CALCULATION_REQUEST_USER_TYPE_CODES: {
    CODE_IDX: 9402,
    TABLE: 'MockDev_RecommendCalcRequest',
    COLUMN: 'RequestUserTypeCode',
    DESCRIPTION: '계산 요청자 구분 코드',
    CODE_DETAIL: {
      USER: { CODE: 'M', CODE_NAME: '사용자' },
      ADMIN: { CODE: 'A', CODE_NAME: '운영자' },
      DEVELOPER: { CODE: 'D', CODE_NAME: '개발자' },
      SYSTEM: { CODE: 'S', CODE_NAME: '시스템' },
    },
  },
  CALCULATION_SAVE_MODE_CODES: {
    CODE_IDX: 9403,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '계산 저장 방식 코드',
    CODE_DETAIL: {
      USER_RECOMMENDATION: { CODE: 'UR', CODE_NAME: '추천 저장' },
      USER_MOCK_APPLICATION: { CODE: 'UMA', CODE_NAME: '모의지원 저장' },
      SELECTION_ONLY: { CODE: 'S', CODE_NAME: '단순 조회(저장X)' },
      TONG_RECOMMENDATION_RE: { CODE: 'TRR', CODE_NAME: '진학통 추천 재계산' },
      TONG_SELECTION_ONLY: { CODE: 'TS', CODE_NAME: '진학통 단순 조회(저장X)' },
    },
  },
  CALCULATION_TYPE_CODES: {
    CODE_IDX: 9404,
    TABLE: 'MockOpr_RequestRecalculation',
    COLUMN: 'CalcTypeCode',
    DESCRIPTION: '계산 저장 방식 코드',
    CODE_DETAIL: {
      USER_RECOMMENDATION: { CODE: 'R', CODE_NAME: '추천' },
      USER_MOCK_APPLICATION: { CODE: 'MA', CODE_NAME: '모의지원' },
      TONG_RECOMMENDATION: { CODE: 'TR', CODE_NAME: '진학통 추천' },
    },
  },
  ACTION_RESULT_CODES: {
    CODE_IDX: 9502,
    TABLE: 'Log',
    COLUMN: 'LogResultCode',
    DESCRIPTION: '액션결과코드',
    CODE_DETAIL: {
      SUCCESS: { CODE: 'S', CODE_NAME: '성공' },
      IN_PROGRESS: { CODE: 'I', CODE_NAME: '진행중' },
      FAILURE: { CODE: 'F', CODE_NAME: '실패' },
    },
  },
  SERVER_TYPE_CODES: {
    CODE_IDX: 9600,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '서버구분코드',
    CODE_DETAIL: {
      LOCAL: { CODE: 'LOCAL', CODE_NAME: '로컬(LOCAL)' },
      DEV: { CODE: 'DEV', CODE_NAME: '개발(DEV)' },
      CALC: { CODE: 'CALC', CODE_NAME: '산출테스트' },
      ALPHA: { CODE: 'ALPHA', CODE_NAME: '테스트(알파)' },
      PROD: { CODE: 'PROD', CODE_NAME: '운영' },
    },
  },
  UPLOAD_TARGET_CODES: {
    CODE_IDX: 9601,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '업로드 대상 코드',
    CODE_DETAIL: {
      ALL: { CODE: 'A', CODE_NAME: '전체' },
      UNIVERSITY: { CODE: 'U', CODE_NAME: '대학별' },
    },
  },
  GRADE_YEAR_TYPE_CODES: {
    CODE_IDX: 9602,
    TABLE: null,
    COLUMN: null,
    DESCRIPTION: '학년구분코드',
    CODE_DETAIL: {
      GRADE_YEAR_3: { CODE: 'GY3', CODE_NAME: '고3' },
      GRADE_YEAR_12: { CODE: 'GY12', CODE_NAME: '고1/2' },
    },
  },
} as const;

export type CodeDetail = {
  CODE: string;
  CODE_NAME: string;
  ORDER?: number;
};

type CommonCode = {
  CODE_IDX: number;
  TABLE: string | null;
  COLUMN: string | null;
  DESCRIPTION: string;
  CODE_DETAIL: Record<string, CodeDetail>;
};

type ExtractKeys<T> = T extends { [code: string]: { CODE: infer K } }
  ? K
  : never;

export type CommonCodeKeys = {
  [K in keyof typeof CommonCodes]: ExtractKeys<
    (typeof CommonCodes)[K]['CODE_DETAIL']
  >;
};

type Category = keyof typeof CommonCodes;
type CodeDetailKey<C extends Category> =
  keyof (typeof CommonCodes)[C]['CODE_DETAIL'];
