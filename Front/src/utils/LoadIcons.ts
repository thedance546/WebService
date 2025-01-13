// src/utils/LoadIcons.ts

// require.context를 사용하여 아이콘 로드
const importAllIcons = (requireContext: ReturnType<typeof require.context>) => {
    const icons: Record<string, string> = {};
    requireContext.keys().forEach((key) => {
      const fileName = key.replace("./", "").split(".")[0];
      icons[fileName.toLowerCase()] = requireContext(key); // 소문자로 통일
    });
    return icons;
  };
  
  // IngredientIcons 폴더의 이미지 로드
  const ingredientIcons = importAllIcons(
    require.context("../assets/IngredientIcons", false, /\.(png|jpg|svg)$/)
  );
  
  // Category 폴더의 이미지 로드
  const categoryIcons = importAllIcons(
    require.context("../assets/IngredientIcons/Category", false, /\.(png|jpg|svg)$/)
  );
  
  /**
   * 이름 또는 카테고리를 기준으로 아이콘 경로를 반환
   * @param ingredientName - 식재료 이름
   * @param categoryName - 카테고리 이름
   */
  export const getIconForIngredient = (
    ingredientName: string,
    categoryName?: string
  ): string | null => {
    // 1. 이름과 일치하는 아이콘 검색
    const nameKey = ingredientName.toLowerCase();
    if (ingredientIcons[nameKey]) return ingredientIcons[nameKey];
  
    // 2. 카테고리와 일치하는 아이콘 검색
    const categoryKey = categoryName?.toLowerCase();
    if (categoryKey && categoryIcons[categoryKey]) return categoryIcons[categoryKey];
  
    // 3. 기본값 반환 (없을 경우 null)
    return null;
  };
  