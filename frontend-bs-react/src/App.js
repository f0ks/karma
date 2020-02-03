import React from 'react';
import Header from "./components/header/header";
import SearchBar from "./components/search-bar/search-bar";
import PostingForm from "./components/posting-form/posting-form";
import Comment from "./components/comment/comment";
import './App.scss';
import './globals.scss';

function App() {
  return (
    <div className="App">
      <Header />
      <SearchBar />
      <PostingForm />
      <Comment />
    </div>
  );
}

export default App;
