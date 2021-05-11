import * as React from "react";

type Props = bnnmarketcallProps

const BnnMarketCallItemComponent: React.FC<Props> = ({ bnnmarketcallItem, setCurrentArticleViewing }) => {

  function onClick(){
    setCurrentArticleViewing(bnnmarketcallItem.text);
  }

  return (
    <div className="bnnmarketcallitem">
      <div className="bnnmarketcallitemInfo">
        <p>Date Saved: {bnnmarketcallItem.date}</p>
        <p>Guest: {bnnmarketcallItem.guest}</p>
        <p>Focus: {bnnmarketcallItem.focus}</p>
        <p>Date: {bnnmarketcallItem.month + " " + bnnmarketcallItem.day}</p>
      </div>
      {bnnmarketcallItem.text != undefined ? (
        <div className="bnnmarketcallitemArticleButton">
          <button onClick={onClick}>View Article</button>
        </div>
      ) : (
        true
      )}
      
    </div>
  )
}


export default BnnMarketCallItemComponent;
