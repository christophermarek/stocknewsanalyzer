import * as React from "react";

type Props = bnnmarketcallProps

const BnnMarketCallItemComponent: React.FC<Props> = ({ bnnmarketcallItem }) => {

  console.log(bnnmarketcallItem);

  return (
    <div className="bnnmarketcallitem">
      <p>{bnnmarketcallItem.date}</p>
      <p>{bnnmarketcallItem.guest}</p>
      <p>{bnnmarketcallItem.focus}</p>
      <p>{bnnmarketcallItem.month + " " + bnnmarketcallItem.day}</p>

    </div>
  )
}


export default BnnMarketCallItemComponent;
