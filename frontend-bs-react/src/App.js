import React from 'react';
import Header from "./components/header/header";
import SearchBar from "./components/search-bar/search-bar";
import PostingForm from "./components/posting-form/posting-form";
import './App.scss';
import './globals.scss';

function App() {
  return (
    <div className="App">
      <Header />
      <SearchBar />
      <PostingForm />
    </div>
  );
}

export default App;
