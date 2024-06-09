import { useEffect, useState, useCallback } from 'react';
import './App.css';
import axios from 'axios';
import { debounce } from 'lodash';

//////////// State
// 1. มี 2 states : searchText กับ bookList
// 2. มี 1 event : onChange ที่ input มี callback คือ handleChange
// 3. ประกาศ functions :  handleChange, handleSubmit กับ handleDelete

//////////// Data Search Fetching
// 1.API : GET: https://www.googleapis.com/books/v1/volumes?q=<query-param-value>
// 2.axios : ติดตั้ง, import and execute
//    2.1 สร้าง request ใน function แล้วอัพเดท state
//    2.2 execute ใน useEffect เมื่อ searchText มีการเปลี่ยนแปลง
// 3.นำข้อมูลจาก Response มา Render

////////////Challenge-Optional
// * เพิ่ม render ข้อความ "Please enter a book name to search." กับ
//   "No books found. Please try a different book name !!"
// * เพิ่ม state notFound
/////// 1. Implementing from scratch
// The logic behind this function will be that only when the time between two keypress events is greater than 500 milliseconds, only then will the data be fetched from the API.
//   1.1 ประกาศ debounce function
//   1.2 excute function ใน component
/////// 2. Using lodash
// 2.1 npm i lodash
// 2.2 import {debounce} from 'lodash'
// 2.3 อัพเดท debounce ใน request function = debounce(() => {}, 500)
/////// 3. Using react-debounce-input
// 3.1 npm i react-debounce-input
// 3.2 import {DebounceInput} from 'react-debounce-input'
// 3.3 อัพเดท input เป็น <DebounceInput minLength={2} debounceTimeout={500} ...>

// 1. Implementing from scratch
// const debounce = (func, delay) => {
//   let timer;
//   return function (...args) {
//     const context = this;
//     if (timer) clearTimeout(timer);
//     timer = setTimeout(() => {
//       timer = null;
//       func.apply(context, args);
//     }, delay);
//   };
// };

function App() {
  const [searchText, setSearchText] = useState('');
  const [bookList, setBookList] = useState([]);
  const [notFound, setNotFound] = useState(false);

  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

  const getBookList = async (text) => {
    try {
      if (text.trim()) {
        const result = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=${text}`
        );
        // console.log(result);
        // console.log(result.data.items);
        // if (result.data.items && result.data.items.length > 0) {
        if (result?.data?.items?.length > 0) {
          setBookList(result.data.items);
          setNotFound(false);
        }
        // กรณีที่ fetch มาแล้วเป็น undefined คือ search ไม่เจอ
        else {
          setBookList([]);
          setNotFound(true);
        }
      }
    } catch (error) {
      alert(error);
    }
  };

  // 1. Implementing from scratch
  // Our debounce will be returning us a new function on every rendering. That we do not want so that we will use the useCallBack hook. It will provide us the memoized callback.
  // const debouncedHandleChange = useCallback(debounce(handleChange, 500), []);
  // const debouncedGetBookList = useCallback(debounce(getBookList, 500), []);

  // 2. Using lodash อัพเดท debounce
  const debouncedGetBookList = useCallback(
    debounce((text) => getBookList(text), 500),
    []
  );

  useEffect(() => {
    if (searchText.trim()) {
      // getBookList(searchText);
      debouncedGetBookList(searchText);
      // }, [searchText]);
    }
  }, [searchText, debouncedGetBookList]);

  // console.log(bookList[0].volumeInfo.title);

  //////////////เคลีย bookList หลังจากลบ searchText
  let content;
  if (searchText.trim()) {
    if (notFound) {
      content = (
        <h2 className="notFoundText">
          No books found. <br /> Please try a different book name !!
        </h2>
      );
    } else {
      content = (
        <ul>
          {bookList.map((item, index) => {
            return <li key={index}>{item.volumeInfo.title}</li>;
          })}
        </ul>
      );
    }
  } else {
    content = (
      <h2 className="pleaseEnterText">Please enter a book name to search.</h2>
    );
  }

  return (
    <div className="App">
      {/* start coding here */}
      <h1>Find a Book</h1>
      {/* <div> */}
      <label>
        <input
          id="message-text"
          name="message-text"
          type="text"
          placeholder="Enter book name here first!"
          onChange={handleChange}
          value={searchText}
        />
      </label>
      {content}
      {/* </div> */}
      {/* {searchText.trim() ? (
        <ul>
          {bookList.map((item, index) => {
            return <li key={index}>{item.volumeInfo.title}</li>;
          })}
        </ul>
      ) : (
        <h2>Please enter a book name to search.</h2>
      )} */}
    </div>
  );
}

export default App;
