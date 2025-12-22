import { ArticleCardElement, Labelo } from "../ArticleCard";
import img1 from '../../../../public/nato.jpg';


export const ArticleLine = () => {
  return (
    <article className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[140px] py-10 md:py-[60px]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          <ArticleCardElement
            href="/articles/james-barnett-arthouse-unlimited-60th-anniversary-merch-film-illustration-180925"
            title="TikTok's most-loved parents celebrate their 60th anniversary with an illustrated merch drop"
            author="James Barnett"
            publishedDate="2 days ago"
            mediaType="image"
            content={[
              { 
                content: "Exploring digital artistry and the psychology of nostalgic imagery", 
                type: "text"
              }
            ]}
            mediaSrc="https://admin.itsnicethat.com/images/gIR2ZEvrMf0lMwyOyuKCDfeFW-A=/270657/format-webp|width-720/Portrait_of_Michael_by_Jack_Churchyard.jpg"
            mediaAlt="TikTok's most-loved parents celebrate their 60th anniversary with an illustrated merch drop"
            mediaVariant="aspect-[4/5]"
            twoLabelShown={[
              new Labelo("category", "Work", [0, 0, 0]),
              new Labelo("category", "Film", [0, 0, 0])
            ]}
            tags={[
              new Labelo("category", "Work", [0, 0, 0]),
              new Labelo("category", "Film", [0, 0, 0]),
              new Labelo("category", "Illustration", [0, 0, 0]),
              new Labelo("category", "Social Media", [0, 0, 0]),
              new Labelo("category", "Creative", [0, 0, 0])
            ]}
            categories={[
              new Labelo("category", "Featured", [0, 0, 0]),
              new Labelo("category", "Trending", [0, 0, 0])
            ]}
          />
          
          <ArticleCardElement
            href="/articles/yutong-hu-graphic-design-discover-180925"
            title="Design always needs a contrarian: Yutong Hu opts for contradiction over consensus"
            author="Editorial Team"
            content={[
              { 
                content: "Exploring digital artistry and the psychology of nostalgic imagery", 
                type: "text"
              }
            ]}            
            publishedDate="2 days ago"
            mediaType="video"
            mediaSrc="https://media.itsnicethat.com/documents/yutong-hu-gd-itsnicethat1_AdRnqeq.mp4"
            mediaAlt="Yutong Hu graphic design work"
            mediaVariant="aspect-video"
            twoLabelShown={[
              new Labelo("category", "Work", [0, 0, 0]),
              new Labelo("category", "Graphic Design", [0, 0, 0])
            ]}
            tags={[
              new Labelo("category", "Work", [0, 0, 0]),
              new Labelo("category", "Graphic Design", [0, 0, 0]),
              new Labelo("category", "Interview", [0, 0, 0]),
              new Labelo("category", "Philosophy", [0, 0, 0])
            ]}
            categories={[
              new Labelo("category", "Design", [0, 0, 0]),
              new Labelo("category", "Profile", [0, 0, 0])
            ]}
          />
          
          <ArticleCardElement
            href="/articles/burton-booz-animation-digitial-discover-180925"
            title="Burton Booz's CGI worlds are haunted manifestations of childhood"
            author="Creative Team"
            content={[
              { 
                content: "Exploring digital artistry and the psychology of nostalgic imagery", 
                type: "text"
              }
            ]}
            publishedDate="2 days ago"
            mediaType="image"
            mediaSrc={img1}
            mediaAlt="Burton Booz's CGI worlds are haunted manifestations of childhood"
            mediaVariant="aspect-[16/9]"
            twoLabelShown={[
              new Labelo("category", "Work", [0, 0, 0]),
              new Labelo("category", "Animation", [0, 0, 0])
            ]}
            tags={[
              new Labelo("category", "Work", [0, 0, 0]),
              new Labelo("category", "Animation", [0, 0, 0]),
              new Labelo("category", "Digital Art", [0, 0, 0]),
              new Labelo("category", "CGI", [0, 0, 0]),
              new Labelo("category", "Psychology", [0, 0, 0])
            ]}
            categories={[
              new Labelo("category", "Art", [0, 0, 0]),
              new Labelo("category", "Technology", [0, 0, 0])
            ]}
          />
          
          <ArticleCardElement
            href="/articles/nicer-tuesdays-june-2025-an-chen-180925"
            title="Your art is special: An Chen on how to stay true to your unconventional art style"
            author="Interview Team"
            content={[
              { 
                content: "Artist insights on maintaining authenticity in a commercial creative world",
                type: "text"
              }
            ]}
            publishedDate="2 days ago"
            mediaType="image"
            mediaSrc="https://admin.itsnicethat.com/images/P5MPmSUS3TB8rMRgpf6XQ0QCd50=/270741/format-webp|width-720/An_Chen_Thumbnail_Youtube.png"
            mediaAlt="Your art is special: An Chen on how to stay true to your unconventional art style"
            mediaVariant="aspect-[16/10]"
            twoLabelShown={[
              new Labelo("category", "Nicer Tuesdays", [0, 0, 0]),
              new Labelo("category", "Work", [0, 0, 0])
            ]}
            tags={[
              new Labelo("category", "Nicer Tuesdays", [0, 0, 0]),
              new Labelo("category", "Work", [0, 0, 0]),
              new Labelo("category", "Art", [0, 0, 0]),
              new Labelo("category", "Interview", [0, 0, 0]),
              new Labelo("category", "Authenticity", [0, 0, 0])
            ]}
            categories={[
              new Labelo("category", "Video", [0, 0, 0]),
              new Labelo("category", "Tutorial", [0, 0, 0])
            ]}
          />
        </div>
      </div>
    </article>
  );
};