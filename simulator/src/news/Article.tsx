import * as React from "react";

type Props = articleProps

const Article: React.FC<Props> = ( {articleText, setCurrentArticleViewing} ) => {


    function onClick(){
        setCurrentArticleViewing("none");
    }

    return (
        <div className="Article">
            <button onClick={onClick}>Back</button>

            <div dangerouslySetInnerHTML={ { __html: articleText } }></div>

        </div>
    )
}


export default Article;
