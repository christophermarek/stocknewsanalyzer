import React, { useEffect, useState } from "react";
import Article from "./Article";
import bnnmarketcallItem from "./bnnmarketcallItemComponent";
import BnnMarketCallItemComponent from "./bnnmarketcallItemComponent";

function News( bnnmarketcallObject: bnnmarketcallObject ) {

  const [currentArticleViewing, setCurrentArticleViewing] = useState<string>("none")

  return (
    <div className="News">
      {currentArticleViewing == "none" ? (
        bnnmarketcallObject.bnnmarketcallObject.map((bnnmarketcallItem: bnnmarketcall) => (
          <BnnMarketCallItemComponent 
            bnnmarketcallItem={bnnmarketcallItem}
            setCurrentArticleViewing={setCurrentArticleViewing}
          />
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
