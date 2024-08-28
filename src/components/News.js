import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
    const [articles, setarticles] = useState([]);
    const [page, setpage] = useState(1);
    const [loading, setloading] = useState(false);
    const [totalResults, settotalResults] = useState(0);

    const updateNews = async() => {
        props.setProgress(0);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=8176641fad4b4176a02e244136a2cbf9&page=${page}&pageSize=${props.pageSize}`;
        setloading(true);
        let data = await fetch(url);
        props.setProgress(30);
        let parsedData = await data.json();
        props.setProgress(70);
        setarticles(parsedData.articles);
        setloading(false);
        settotalResults(parsedData.totalResults)
        props.setProgress(100);
    }

    useEffect(() => {
        updateNews();
        // eslint-disable-next-line
    }, []);
    

    const fetchMoreData = async () => {
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=8176641fad4b4176a02e244136a2cbf9&page=${page+1}&pageSize=${props.pageSize}`;
        setpage(page+1)
        let data = await fetch(url);
        let parsedData = await data.json();
        setarticles(articles.concat(parsedData.articles));
        settotalResults(parsedData.totalResults);
      };

  
    return (
      <div className='container my-4'>
        <h2 className='text-center' style={{marginTop:'90px'}}>News Headline</h2>
        {loading && <Spinner/>}
        <InfiniteScroll dataLength={articles.length} next={fetchMoreData} hasMore={articles.length !== totalResults} loader={<Spinner/>}>
            <div className="container">
                <div className="row">
                    {articles.map((element)=>{
                        return <div className="col-md-4" key={element.url}>
                            <NewsItem  title={element.title?element.title:""} description={element.description?element.description:""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source}/>
                         </div>
                    })}
                </div>
            </div>
        </InfiniteScroll>
      </div>
    );
  
}

News.dafaultProps = {
    country : 'in',
    pageSize : 8,
    category : "general"
}

News.propTypes = {
    country : PropTypes.string,
    pageSize : PropTypes.number,
    category : PropTypes.string,
}

export default News;
