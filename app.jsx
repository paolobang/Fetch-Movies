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
      // console.log(`currentPage: ${currentPage}`);
    }
    return (
      <Fragment>
        <form
          className="frm-main"
          onSubmit={(event) => {
            doFetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
            event.preventDefault();
          }}
        >
          <div className="frm-input">
                {" "}
                <input
                  className="form-control me-sm-2"
                  placeholder="Write your movie title"
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
            </div>
          <div className="frm-btn">
            <button className="btn btn-outline-primary" type="submit">
              Search
            </button>
          </div>
        </form>

  
        {isError && <div>Something went wrong ...</div>}
  
        {isLoading ? (
          <div>Loading ...</div>
        ) : (
          <div className="card-columns container">
            {page.map((item, index) => (
              <a key={item.imdbID}  href={`https://www.imdb.com/title/${item.imdbID}`} target="_blank">
                <div key={index} className="card-deck">
                  <div className="card-pic shadow-sm" > 
                        <div className="card-body" style={{ backgroundImage: `url(${item.Poster})` }}>
                        </div>
                  </div>
                  <div className="">
                        <h2 className="card-title">{item.Title}</h2>     
                  </div>
                </div>
              </a>  
            ))}
          </div>
        )}
        <div className="frm-pag">
          <Pagination
            items={data}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          ></Pagination>
        </div>
        <div className="footer-author">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="white" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
            <span> Powered by </span>
            <a href="https://github.com/paolobang" target="_blank"> 
            <span>@paolobang</span></a>
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