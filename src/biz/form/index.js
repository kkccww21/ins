import React, { Component } from 'react';
import { Button, List, NavBar, Icon} from 'antd-mobile';
import {emitter} from '../../common';
import {InputItem,Picker,DatePicker,Switch,Stepper,validateForm,getFormValues,setFormValues} from '../../components/form';
import './index.less';

class BizComp extends Component {
  constructor(props) {
    super(props);
    this.state={
      records:[{}]
    };
  }
  componentDidMount(){
    if(window.insureForm){
      this.setState({records:window.insureForm.insurants},()=>{
        setFormValues.call(this,window.insureForm);
      });
    }
  }
  render() {
    return (
      <div className="form">
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            window.insureForm = getFormValues.call(this);
            emitter.emit('showPage',{page:'detail',justHide:true});
            
          }}
          rightContent={[<div key="myInsureOrder">我的保单</div>
          ]}
        >投保详情</NavBar>
        <div>
          <div>
            <div className="head-bar">投保人</div>
            <List>
              <InputItem ref="name" label="姓名" parent={this} validators={[{
                rule:(val)=>{
                  if(val.length > 5)
                    return false;
                  return true;
                },msg:'长度不能大于5'
              }]} required>
              </InputItem>
              <InputItem ref="idNo" parent={this} label="身份证号" clear>    
              </InputItem>
              <InputItem ref="phone" parent={this} label="手机号" type="phone">
              </InputItem>
            </List>
          </div>
          <div>
            <div className="head-bar">被保人</div>
            <List>
              <Switch ref="isSelf" parent={this} label="为投保人本人"/>
              <InputItem ref="insurantName" parent={this} label="姓名" placeholder="被保人真实姓名">
              </InputItem>
              <InputItem ref="insurantIdNo" parent={this} label="身份证号">
              </InputItem>
              <InputItem  ref="insurantPhone" parent={this} label="手机号" type="phone">
              </InputItem>
              <Picker ref="relation" parent={this} label="与被投人关系" data={[{value:'1',label:'父亲'},{value:'2',label:'母亲'}]} cols={1} required>
              </Picker>
              <Stepper ref="count" parent={this} label="投保份数" showNumber min={1}>
              </Stepper>
              <DatePicker ref="validDate" parent={this} label="生效日期" mode="date" required>
              </DatePicker>
            </List>
          </div>
          {this.state.records.map((r,i)=>{return (<div key={'rec'+i}>
            <div className="head-bar">测试<a onClick={()=>{
              let {records} = this.state;
              records.push({});
              this.setState({records});
            }}>添加</a></div>
            <List>
              <InputItem ref={`insurants[${i}].name`} parent={this} label="姓名" placeholder="被保人真实姓名">
              </InputItem>
              <DatePicker ref={`insurants[${i}].validDate`} parent={this} label="生效日期" mode="date" required>
              </DatePicker>
            </List>
          </div>)})
          }
        </div>
        <div className="foot-bar">
          <div className="amount">10.00元</div>
          <Button type="primary" onClick={()=>{
            //setFormValues.call(this,{insurantIdNo:'143455',name:'hehe',relation:'2',validDate:new Date()});
            let formValues = validateForm.call(this);
            if(formValues){
              console.log(formValues);
            }
          }}>确认投保</Button>
        </div>

      </div>
    );
  }
}
export default BizComp;
