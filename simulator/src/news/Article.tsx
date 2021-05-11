import React, { useEffect, useState } from "react";

type Props = articleProps

const Article: React.FC<Props> = ( {articleText, setCurrentArticleViewing} ) => {

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

    function onClick(){
        setCurrentArticleViewing("none");
    }

    return (
        <div className="Article">
            <button className="bnnmarketcallitemArticleButton" onClick={onClick}>Back</button>

            <div className="ArticleText" dangerouslySetInnerHTML={ { __html: articleText } }></div>
        </div>
    )
}


export default Article;
