import * as React from "react";
import bnnmarketcallItem from "./bnnmarketcallItemComponent";
import BnnMarketCallItemComponent from "./bnnmarketcallItemComponent";

function News( bnnmarketcallObject: bnnmarketcallObject ) {

  return (
    <div className="News">
      {bnnmarketcallObject.bnnmarketcallObject.map((bnnmarketcallItem: bnnmarketcall) => (
        <BnnMarketCallItemComponent 
          bnnmarketcallItem={bnnmarketcallItem}
        />
      ))}
    </div>
  );
}

export default News;
