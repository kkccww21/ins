import React, { Component } from 'react';
import { Tabs,Badge,NavBar,Icon } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';
import './index.less';
import List from './list';

import {emitter} from '../../common';

function renderTabBar(props) {
  return (<Sticky>
    {({ style }) => <div style={{ ...style, zIndex: 1 }}><Tabs.DefaultTabBar {...props} /></div>}
  </Sticky>);
}

const tabs = [
  { title: <Badge text={'3'}>First Tab</Badge> },
  { title: <Badge text={'今日(20)'}>Second Tab</Badge> },
  { title: <Badge dot>Third Tab</Badge> },
];
class BizComp extends Component {
  constructor(props) {
    super(props);
   
    this.state = {
      page:-1
    };
  }

  componentDidMount() {
    this.setState({page:0});
  }

  render() {
    return (<div style={{display:this.props.page==='list'?'block':'none'}}>
      <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={() => {
              
            }}
            rightContent={[<div key="myInsureOrder">我的保单</div>
            ]}
          >保险商城</NavBar>
      <StickyContainer>
        <Tabs tabs={tabs}
          page={this.state.page}
          onChange={(tab, index) => { this.setState({page:index});}}
          renderTabBar={renderTabBar}>
          <div>
            <List init={this.state.page===0}/>
          </div>
          <div>
            <List init={this.state.page===1}/>
          </div>
          <div>
            <List init={this.state.page===2}/>
          </div>
        </Tabs>
      </StickyContainer>
    </div>);
  }
}

export default BizComp;