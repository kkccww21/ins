import React, { Component } from 'react';
import { Card,Button,List,NavBar,Icon,Tag,Accordion} from 'antd-mobile';
import {Picker,setFormValues} from '../../components/form';
import {emitter} from '../../common';
import './index.less';

class BizComp extends Component {
  constructor(...args) {
      super(...args);
      this.state={
      };
  }

  componentDidMount(){
    setFormValues.call(this,{insureRange:'1'});
  }
  render() {
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            emitter.emit('showPage',{page:(this.props.page==='lipei'||this.props.page==='fanwei')?'detail':'list'});
          }}
          rightContent={[<div key="myInsureOrder">我的保单</div>
          ]}>51保险</NavBar>
        <div className="detail" style={{display:this.props.page==='detail'?'block':'none'}}>
         <div className="detail-head">
            <Card full>
              <Card.Header
                title={(<div className="detail-title">
                  <h3>家庭综合保障险</h3>
                  <h4>家庭意外损失保险</h4>
                  <div className="tags">
                    <Tag selected small>家庭</Tag>
                    <Tag selected small>意外综合</Tag>
                  </div>
                  <div className="line">
                  </div>
                  <div className="company">本产品由平安保险公司承保
                  </div>
                </div>)}
                thumb="https://cloud.githubusercontent.com/assets/1698185/18039916/f025c090-6dd9-11e6-9d86-a4d48a1bf049.png"
              />
              
            </Card>
          </div>
          <div>
            <div>
              <div className="head-bar">投保方案</div>
              <List>
                <List.Item extra={'4~7天'}>
                  保险期限
                </List.Item>
                <List.Item extra={'0~90岁'}>
                  被保人年龄
                </List.Item>
                <Picker ref="insureRange" label="保障方案" form={this} data={[{value:'1',label:'计划一'},{value:'2',label:'计划二'}]} cols={1}>
                </Picker>
              </List>
            </div>
            <div>
              <div className="head-bar">保障内容</div>
              <List>
                <List.Item extra={'20万'}>
                  意外伤害保险金
                </List.Item>
                <List.Item extra={'5万元'}>
                  高风险运动意外保险金
                </List.Item>
                <List.Item extra={'20万元'}>
                  自驾游意外伤害保险金
                </List.Item>
                <Accordion>
                  <Accordion.Panel header="查看更多">
                    <List className="my-list">
                      <List.Item>content 1</List.Item>
                      <List.Item>content 2</List.Item>
                      <List.Item>content 3</List.Item>
                    </List>
                  </Accordion.Panel>
                </Accordion>
              </List>
            </div>
            <List>
              <List.Item extra={<a onClick={()=>{
                emitter.emit('showPage',{page:'fanwei'});
              }}>></a>}>
                  保障范围
              </List.Item>
              <List.Item extra={<a onClick={()=>{
                emitter.emit('showPage',{page:'lipei'});
              }}>></a>}>
                  理赔流程
              </List.Item>
            </List>
          </div>
          <div className="foot-bar">
            <div className="amount">10.00元</div>
            <Button type="primary" onClick={()=>{
              emitter.emit('showPage',{page:'form'});
            }}>立即投保</Button>
          </div>
        </div>
        {this.props.page==='fanwei' && <div>保障范围</div>}
        {this.props.page==='lipei' && <div>理赔流111程</div>}
      </div>
    );
  }
}

export default BizComp;
