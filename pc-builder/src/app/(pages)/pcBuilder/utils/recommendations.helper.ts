import { PURPOSE_RECOMMENDATIONS } from "../contants/purposeRecemmendations";
import { PCBuild } from "../types/builds";
import { PCComponent } from "../types/components";

// First, add this helper function near your other utility functions
export const getRecommendationMatch = (component: PCComponent, build: PCBuild): number | null => {
    const recommendation = PURPOSE_RECOMMENDATIONS[build.purpose]?.find(
      rec => rec.type === component.type
    );
    
    if (!recommendation) return null;
  
    const targetPrice = (build.budget * recommendation.percentage) / 100;
    const priceDiff = Math.abs(component.price - targetPrice);
    const matchPercentage = Math.max(0, 100 - (priceDiff / targetPrice * 100));
    
    return Math.round(matchPercentage);
  };
  