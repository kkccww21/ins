import React, { Component } from 'react';
// import { Icon,NavBar } from 'antd-mobile';
import {emitter} from './common';
import List from './biz/list';
import Detail from './biz/detail';
import Form from './biz/form';
import Addr from './components/modal/addr';
import './App.less';



class App extends Component {
  constructor(...args) {
    super(...args);
    emitter.on('showPage',({page,props})=>{
      this.setState({page,props});
    });
    this.state={
      page:'list'
    };
  }

  render() {
    let {page,props} = this.state;
    return (
      <div className="App">
        {(page==='detail'||page==='lipei'||page==='fanwei')&&<Detail page={page} {...props}/>}
        <List {...props} page={page}/>
        {page==='form'&&<Form {...props}/>}
        <Addr />
      </div>
    );
  }
}

export default App;
