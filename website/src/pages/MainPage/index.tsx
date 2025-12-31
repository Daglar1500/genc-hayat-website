import { FloatingNavbar } from "../../sections/Components/Components";
import { SiteHeader } from "../../sections/Components/SiteHeader";
import { BreakoutGame } from "./MainContent/BreakoutGame";
import { FeedSection } from "./MainContent/FeedSection/index";
import { ArticleLine } from "./MainContent/ArticleLine";
import { FeaturedArticle } from "./MainContent/FeaturedArticle";
import { CategorySection } from "./MainContent/CategorySection";
import { MainSection } from "./MainContent/MainSection";
import { ShareFloatingButton } from "../../sections/Components/Components"; 

export const MainContent = () => {
  return (
    
    <div className="pt-[100px]">
      <FeedSection /> 
      <MainSection />
      <ArticleLine />
      <CategorySection/>
      <BreakoutGame />
    </div>
      
  );
};