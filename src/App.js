// @Author Abhishek Chakraborty
// @Date 12 Aug 2023
// @Function This React App is the front end component for the news search Microservice

import logo from './logo.svg';
import './App.css';
import { useState } from "react";
import LoadingBar from 'react-top-loading-bar';
import { MDBTable, MDBTableBody } from 'mdb-react-ui-kit';




function App() {

  //set states
  const [data, setData] = useState('');
  const [text, setText] = useState('');
  const [timeDuration, setTimeDuration] = useState('hours');
  const [timeValue, setTimeValue] = useState('');
  const [progress, setProgress] = useState(0)
  const [isDataFound, setDataFound] = useState(true)

  // fucntion to call newssearch API to get all the data for react to display
  const searchNews = async (keyword, interval, timespan) => {
    try {
      setProgress(30);
      console.log("keyword is " + keyword)
      console.log("interval is " + interval)
      console.log("timespan is " + timespan)
      //const response = await fetch('http://localhost:8080/newssearch', {
      const response = await fetch('/newssearch', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: keyword,
          interval: interval,
          timespan: timespan,
        }),
      });
      setProgress(60);
      const json = await response.json();
      setData(json.articles);
      if (json.articles && json.articles.length > 0)
      {
        setDataFound(true)
      }
      else
      {
        setDataFound(false)
      }
      console.log("message is " + json.articles)
      console.log("data is " + data)
    } catch (error) {
      console.error(error);
    } finally {
      setProgress(100);
    }
  };

  return (
    <div className="App">
      <div className="App-header">
        <p>
          <b>Search for news</b>
        </p>
        <p>
          <LoadingBar
            color='#f11946'
            progress={progress}
            onLoaderFinished={() => setProgress(0)}
          />
        </p>
      </div>

      <div className="App-body">
        <MDBTable width="100%">
          <MDBTableBody class="align-middle">
            <tr height='30%'>
              <td valign="bottom" width="100%" colSpan='3'>
                <textarea className='Text-Input'
                  type="text"
                  placeholder="Type here..."
                  onChange={event => setText(event.target.value)}
                  value={text}
                  autofocus="autofocus"
                />
              </td>
            </tr>
            <tr height='10%'>
              <td valign="top" width="33%">
                <input className='Text-Input'
                  type="number"
                  placeholder="Enter Time Value here..."
                  onChange={event => setTimeValue(event.target.value)}
                  value={timeValue}
                  autofocus="autofocus"
                />
              </td>
              <td valign="top" width="33%">
                <select
                  onChange={event => setTimeDuration(event.target.value)}
                  value={timeDuration}
                  className='dropdown'>

                  <option timeDuration="seconds">seconds</option>
                  <option timeDuration="minutes">minutes</option>
                  <option timeDuration="hours">hours</option>
                  <option timeDuration="days">days</option>
                  <option timeDuration="weeks">weeks</option>
                  <option timeDuration="months">months</option>
                  <option timeDuration="years">years</option>

                </select>
              </td>
              <td valign="top" width="33%">
                <button className="Submit-Button"
                  onClick={() => searchNews(text, timeValue, timeDuration)}
                > Submit </button>
              </td>
            </tr>
            <tr height='60%'>
              <td valign="top" width="100%" colSpan='3'>
                {!isDataFound ? (
                  <div className='News-Answer'>
                    <p>No Data Found</p>
                  </div>
                ) : (
                    <div className='News-Answer'>
                      {
                        data &&
                        data.length > 0 &&
                        data.map(article =>
                          <div>
                            <p>
                              Article Title: {article.title}
                              <br></br>
                              Written By: {article.author}
                              <br></br>
                              Published On: {article.publishedAt}
                              <br></br>
                              Url: <a href={article.url}>{article.url}</a>
                              <br></br>
                            </p>
                          </div>
                        )
                      }
                    </div>
                  )}
              </td>
            </tr>
          </MDBTableBody>
        </MDBTable>

      </div>
    </div>
  );
}

export default App;