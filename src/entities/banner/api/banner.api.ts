import { BannerItemType } from "../model/banner.types";

/**
 * 서버 사이드 전용 A1 배너 데이터 fetcher
 * useA1BannerDatas 훅과 동일한 로직이지만 SSR 환경에서 실행됩니다.
 * revalidate로 캐싱을 적용해 광고 서버 부하를 줄입니다.
 */
export async function fetchA1BannerData(
  links: string[],
): Promise<BannerItemType[]> {
  if (!Array.isArray(links) || links.length === 0) return [];

  const results: BannerItemType[] = [];

  for (const link of links) {
    try {
      const res = await fetch(link, {
        next: { revalidate: 300 }, // 5분 캐시
      });
      if (!res.ok) continue;

      const text = await res.text();
      if (!text || text.trim().startsWith('<')) continue;

      const json = JSON.parse(text);
      // if (json?.content) results.push(json.content);
            const content = json?.content;

      if (content && typeof content === "object") {
        results.push({
          ...content,
          a1_banner: content.a1_banner ?? link, // 핵심: 원본 요청 URL fallback
        });
      }

    } catch {
      // 광고 서버 장애 시 무시 - 클라이언트 fallback이 처리
    }
  }

  return results;
}
