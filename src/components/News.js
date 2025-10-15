import React, { Component } from "react";
import Spinner from "./Spinner";
import NewsItem from "./NewsItem"
export class News extends Component {
  static defaultProps = {
    country: "us",
    category: "general",
    pageSize: 6,
  };

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      totalResults: 0,
      page: 1,
    };
  }

  async fetchNews(page) {
    this.setState({ loading: true });

    try {
      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&page=${page}&pageSize=${this.props.pageSize}&apiKey=382b10f924034aeda0e6c44aa73c4b09`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const text = await response.text();
      if (!text) throw new Error("Empty response from server");

      const parsedData = JSON.parse(text);

      this.setState({
        articles: parsedData.articles || [],
        totalResults: parsedData.totalResults || 0,
        loading: false,
        page: page,
      });
    } catch (error) {
      console.error("Error fetching news:", error);
      this.setState({ loading: false });
    }
  }

  componentDidMount() {
    this.fetchNews(this.state.page);
  }

  handlePrevClick = () => {
    if (this.state.page > 1) this.fetchNews(this.state.page - 1);
  };

  handleNextClick = () => {
    const maxPage = Math.ceil(this.state.totalResults / this.props.pageSize);
    if (this.state.page < maxPage) this.fetchNews(this.state.page + 1);
  };

  render() {
    const { articles, loading, page, totalResults } = this.state;
    const maxPage = Math.ceil(totalResults / this.props.pageSize);

    return (
      <div className="container my-3">
        <h2 className="text-center">NewsMonkey - Top Headlines</h2>

        {/* ✅ Spinner দেখাও */}
        {loading && <Spinner />}

        <div className="row">
          {!loading &&
            articles.map((element) => (
              // <div className="col-md-4" key={element.url}>
              //   <div className="card my-3">
              //     <img
              //       src={
              //         element.urlToImage
              //           ? element.urlToImage
              //           : "https://via.placeholder.com/150"
              //       }
              //       className="card-img-top"
              //       alt="news"
              //     />
              //     <div className="card-body">
              //       <h5 className="card-title">{element.title}</h5>
              //       <p className="card-text">
              //         {element.description
              //           ? element.description.slice(0, 100)
              //           : ""}
              //       </p>
              //       <a
              //         href={element.url}
              //         target="_blank"
              //         rel="noreferrer"
              //         className="btn btn-sm btn-primary"
              //       >
              //         Read More
              //       </a>
              //     </div>
              //   </div>
              // </div>
               <div className="col-md-4 my-5" key={element.url}>
              <NewsItem title={element.title?element.title:""} description={element.description?element.description:""}
              imageurl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}
              />

              </div>
            ))}
        </div>

        {/* ✅ Pagination Buttons */}
        <div className="d-flex justify-content-between my-3">
          <button
            className="btn btn-dark"
            onClick={this.handlePrevClick}
            disabled={page <= 1}
          >
            &larr; Previous
          </button>

          <button
            className="btn btn-dark"
            onClick={this.handleNextClick}
            disabled={page >= maxPage}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }
}

export default News;
