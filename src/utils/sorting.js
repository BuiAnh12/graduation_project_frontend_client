// A map to assign a numerical weight to each suitability status
const suitabilityWeight = {
    suitable: 1,
    warning: 2,
    prohibit: 3,
  };
  
  /**
   * Sorts an array of dishes based on suitability and relevance.
   * - Sorts by suitability: suitable > warning > prohibit
   * - Inside 'suitable', sorts by most 'like' tags first.
   * - Inside 'warning', sorts by fewest 'warning' tags first.
   */
  export const sortDishesBySuitability = (dishes) => {
    if (!dishes || !Array.isArray(dishes)) {
      return [];
    }
    
    const sorted = [...dishes].sort((a, b) => {
      // 1. Primary Sort: By Suitability Weight
      const weightA = suitabilityWeight[a.suitability] || 4;
      const weightB = suitabilityWeight[b.suitability] || 4;
  
      if (weightA !== weightB) {
        return weightA - weightB; // (1-2 = -1, so A comes first)
      }
  
      // 2. Secondary Sort: Based on relevance within the group
      const matchesA = a.preferenceMatches;
      const matchesB = b.preferenceMatches;
  
      if (a.suitability === 'suitable') {
        // Sort by most 'like' tags
        return (matchesB.like?.length || 0) - (matchesA.like?.length || 0);
      }
  
      if (a.suitability === 'warning') {
        // Sort by fewest 'warning' tags
        return (matchesA.warning?.length || 0) - (matchesB.warning?.length || 0);
      }
  
      // For 'prohibit' or any other case, just use default (e.g., alphabetical)
      return a.name.localeCompare(b.name);
    });
  
    return sorted;
  };