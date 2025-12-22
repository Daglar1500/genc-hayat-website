import { FloatingNavbar } from "./Components";
import { SiteHeader } from "../SiteHeader";
import { BreakoutGame } from "../BreakoutGame";
import { FeedSection } from "./sections/FeedSection/index";
import { ArticleLine } from "./sections/ArticleLine";
import { FeaturedArticle } from "./sections/FeaturedArticle";
import { CategorySection } from "./sections/CategorySection";
import { MainSection } from "./sections/MainSection";

export const MainContent = () => {
  return (
    <div className="relative box-border caret-transparent tracking-[0.108px] z-[1] md:tracking-[0.09px]">
      <div className="box-border caret-transparent tracking-[0.108px] md:tracking-[0.09px]">
        <FloatingNavbar />
        <SiteHeader />
        <div className="pt-[100px]">
          <FeedSection /> 
          <MainSection />
          <ArticleLine />
          <CategorySection/>
          <FeaturedArticle />
          <BreakoutGame />
        </div>
      </div>
    </div>
  );
};