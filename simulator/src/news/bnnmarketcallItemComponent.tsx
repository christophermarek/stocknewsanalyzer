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
        <ul>
          {bnnmarketcallItem.picks.map((pick: any) => (
            <li>{pick.name + " (Ticker:" + pick.ticker + ")"}</li>
          ))}
        </ul>
      </div>
      {bnnmarketcallItem.text !== undefined ? (
        <button className="bnnmarketcallitemArticleButton"onClick={onClick}>View Article</button>
      ) : (
        true
      )}
      
    </div>
  )
}


export default BnnMarketCallItemComponent;
