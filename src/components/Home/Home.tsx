import React from 'react';

import './Home.scss'

export default class Home extends React.Component {
  render() {    
    return (
      <div  className="home">
        <div className="home__content">
          <h1 className="home__content_header">
            WELCOME TO THE STORE!
          </h1>
        </div>
      </div>
    )
  }
}
