import * as React from "react";

type Props = articleProps

const Article: React.FC<Props> = ( {articleText, setCurrentArticleViewing} ) => {

    console.log(articleText);

    function onClick(){
        setCurrentArticleViewing("none");
    }

    return (
        <div className="Article">
            <button onClick={onClick}>Back</button>
        </div>
    )
}


export default Article;
