import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

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

function App() {
  const [searchText, setSearchText] = useState('');
  const [bookList, setBookList] = useState([]);

  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

  const getBookList = async (searchText) => {
    try {
      if (searchText.trim()) {
        const result = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=${searchText}`
        );
        // console.log(result);
        // console.log(result.data.items);
        setBookList(result.data.items);
      }
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    getBookList(searchText);
  }, [searchText]);

  // console.log(bookList[0].volumeInfo.title);

  return (
    <div className="App">
      {/* start coding here */}
      <h1>Find a Book</h1>
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
      <ul>
        {/* <li>hello</li> */}
        {bookList.map((item, index) => {
          return <li key={index}>{item.volumeInfo.title}</li>;
        })}
      </ul>
    </div>
  );
}

export default App;
