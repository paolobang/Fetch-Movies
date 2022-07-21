


const Pagination = ({ items, pageSize, onPageChange, currentPage }) => {
    const { Button } = ReactBootstrap;
    if (items.length <= 1) return null;
  
    let num = Math.ceil(items.length / pageSize);
    let pages = range(1, num);
    const list = pages.map((page) => {
      return (
        <li
          key={page}
          onClick={onPageChange}
          className={currentPage == page ? "page-item active" : "page-item"}
        >
          <a className="page-link" href="#">
            {page}
          </a>
        </li>
      );
    });
    return (
      <nav>
        <ul className="pagination">{list}</ul>
      </nav>
    );
  };
  const range = (start, end) => {
    return Array(end - start + 1)
      .fill(0)
      .map((item, i) => start + i);
  };
  function paginate(items, pageNumber, pageSize) {
    const start = (pageNumber - 1) * pageSize;
    let page = items.slice(start, start + pageSize);
    return page;
  }
  const useDataApi = (initialUrl, initialData) => {
    const { useState, useEffect, useReducer } = React;
    const [url, setUrl] = useState(initialUrl);
  
    const [state, dispatch] = useReducer(dataFetchReducer, {
      isLoading: false,
      isError: false,
      data: initialData,
    });
  
    useEffect(() => {
      let didCancel = false;
      const fetchData = async () => {
        dispatch({ type: "FETCH_INIT" });
        try {
          const result = await axios(url);
          if (!didCancel) {
            dispatch({ type: "FETCH_SUCCESS", payload: result.data.Search });
          }
        } catch (error) {
          if (!didCancel) {
            dispatch({ type: "FETCH_FAILURE" });
          }
        }
      };
      fetchData();
      return () => {
        didCancel = true;
      };
    }, [url]);
    return [state, setUrl];
  };
  const dataFetchReducer = (state, action) => {
    switch (action.type) {
      case "FETCH_INIT":
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      case "FETCH_SUCCESS":
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        };
      case "FETCH_FAILURE":
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      default:
        throw new Error();
    }
  };
  // App that gets universities from country
  function App() {
    const { Fragment, useState, useEffect, useReducer } = React;
    const [query, setQuery] = useState("batman");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 50;
    const apiKey = '4760a06';
    const [{ data, isLoading, isError }, doFetch] = useDataApi(
      `https://www.omdbapi.com/?s=batman&apikey=${apiKey}`,
      []
    );
    const handlePageChange = (e) => {
      setCurrentPage(Number(e.target.textContent));
    };
    let page = data;
    if (page.length >= 1) {
      page = paginate(page, currentPage, pageSize);
      console.log(`currentPage: ${currentPage}`);
    }
    return (
      <Fragment>
        <form
          className="d-flex"
          onSubmit={(event) => {
            doFetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
            event.preventDefault();
          }}
        >
          <div id="searchsection">
            <div className="form-group row">
              <div>
                {" "}
                <input
                  className="form-control me-sm-2"
                  placeholder="Write your country"
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>
            <button className="btn btn-outline-primary" type="submit">
              Search
            </button>
          </div>
        </form>
        <h5>
          <small className="text-muted">Write country name in english</small>
        </h5>
  
        {isError && <div>Something went wrong ...</div>}
  
        {isLoading ? (
          <div>Loading ...</div>
        ) : (
          <div id="univList" className="card-columns container">
            {page.map((item, index) => (
              <div key={index} className="card-deck">
          
                <div className="card shadow-sm" > 
                    <div className="card-body">
                    <img src={item.Poster}/>
                        <div className="card-text">
                            
                            <h5 className="card-title">{item.Title}</h5>
                            <p className="card-text">Year: {item.Year}</p>
                            <a href={`https://www.imdb.com/title/${item.imdbID}`} className="btn btn-primary" target="_blank">More</a>        
                        </div>
                    </div>

                </div>
          
              </div>
            ))}
          </div>
        )}
        <div id="pagin">
          <Pagination
            items={data}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          ></Pagination>
        </div>
      </Fragment>
    );
  }
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
//   // ========================================
//   ReactDOM.render(<App />, document.getElementById("root"));