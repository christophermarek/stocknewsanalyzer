import React, { useState } from "react";
import Article from "./Article";
import BnnMarketCallItemComponent from "./bnnmarketcallItemComponent";

function News( bnnmarketcallObject: bnnmarketcallObject ) {

  const [currentArticleViewing, setCurrentArticleViewing] = useState<string>("none")

  let monthArray: Array<string> = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

  //there is no year property for these articles we only have the scrapeby date, could be a future issue to be honest.
  function sortArticles(a:bnnmarketcall, b:bnnmarketcall) {
    return  (monthArray.indexOf(a.month.toLowerCase()) - monthArray.indexOf(b.month.toLowerCase())) || (Number(a.day) - Number(b.day));
  }

  return (
    <div className="News">
      {currentArticleViewing === "none" ? (
        bnnmarketcallObject.bnnmarketcallObject.sort(sortArticles).map((bnnmarketcallItem: bnnmarketcall) => (
          <>
            <BnnMarketCallItemComponent 
              bnnmarketcallItem={bnnmarketcallItem}
              setCurrentArticleViewing={setCurrentArticleViewing}
            />
            <hr className="articleDivider"></hr>
          </>
        ))
      ) : (
        <Article
          articleText={currentArticleViewing}
          setCurrentArticleViewing={setCurrentArticleViewing}
        />
      )}
      
    </div>
  );
}

export default News;
