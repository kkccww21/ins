import React, { Component } from 'react';
import Am,{List,Toast} from 'antd-mobile';
import {form2js,js2form} from '../../common';
import './index.less';

function validateForm() {// this指向form
	let {refs} = this;
	let hasError = false;
	for(let k in refs){
		let ref = refs[k];
		if(ref instanceof InputItem || ref instanceof Picker || ref instanceof DatePicker){
			let validResult = onChange.call(ref,ref.state.value);
			if(validResult.hasError){
				if(!hasError){
					hasError=true;
					Toast.fail(validResult.msg,1);
				}
			}
		}
	}
	if (hasError) {
		return false;
	}
	return getFormValues.call(this);
}
function getFormValues() {// this指向form
	let {refs} = this;
	let formValues = {};
	for(let k in refs){
		let ref = refs[k];
		initKeyName.call(ref);
		formValues[ref.keyName] = convertFieldValue.call(ref,ref.state[ref.valueName?ref.valueName:'value']);//从state里取值
	}
	return form2js(formValues);
}
function setFormValues(obj) {// this指向form
	let nameValues = js2form(obj);
	let {refs} = this;
	for(let i=0;i<nameValues.length;i++){
		let compIns = refs[nameValues[i].name];
		if(compIns){
			let formValue = nameValues[i].value;
			if(formValue&&compIns.props.cols===1){
				formValue = [formValue];
			}
			compIns.setState({[compIns.valueName?compIns.valueName:'value']:formValue});
		}
	}
}

function convertFieldValue(val){// this指向field
	if(!val){
		return val;
	}
	let formValue = val;
	if(this.props.cols===1 && typeof val === 'object' && val.length === 1){
		formValue = val[0];
	}
	return formValue;
}

function initKeyName(){// this指向field
	if(!this.keyName){
		if(!this.props.parent){
			throw Error('引用form组件时，必须指定parent={this}');
		}
		let refs = this.props.parent.refs;
	    for(let k in refs){
	    	if(refs[k] === this){
	    		this.keyName = k;
	    		break;
	    	}
	    }
	}
	if(!this.keyName){
		throw Error('引用form组件时，必须指定ref，且全局唯一');
	}
}

let requiredMsg = '必填';

function onChange(val){// this指向field
	initKeyName.call(this);
	// 校验，目前只支持同步校验，异步业务代码自行处理
	let {hasError,msg} = this.state;
	if(this.props.required){
		if(val === null || val === "" || val === undefined || (typeof val === 'object' && val.length === 0)){
			hasError = true;
			let fieldName = this.props.label;
			msg = fieldName + requiredMsg;
		}else{
			hasError = false;
		}
	}
	
	if(val&&this.props.validators){
		for (let i = 0; i < this.props.validators.length; i++) {
			let validator = this.props.validators[i];
			if(!validator.rule(val)){
				hasError = true;
				msg=validator.msg;
			}else{
				hasError = false;
				msg = undefined;
			}
		}
	}
	let state = {[this.valueName?this.valueName:'value']:val,hasError,msg};
	this.setState(state);
	return state;
}

function getProps(){// this指向field
	let props = Object.assign({onErrorClick:onErrorClick.bind(this),onChange:onChange.bind(this)},this.props);
	delete props.required;
	delete props.label;
	delete props.parent;
	delete props.validators;
	return props;
}

function onErrorClick(e){// this指向field
	if (this.state.hasError) {
      Toast.fail(this.state.msg, 1);
    }
}


class InputItem extends Component {
	constructor(...args) {
	    super(...args);
	    this.state={
	    	hasError:false
	    };
	}

	render() {
		let props = getProps.call(this);
    	return (<Am.InputItem {...props} value={this.state.value} error={this.state.hasError}>{this.props.label}{this.props.required?<span className="required-tag-51">*</span>:undefined}</Am.InputItem>);
	}
}

class Picker extends Component {
	constructor(...args) {
	    super(...args);
	    this.state={
	    	hasError:false
	    };
	}

	render() {
		let props = getProps.call(this);
    	return (<Am.Picker {...props} value={this.state.value}><List.Item arrow="horizontal" error={this.state.hasError}>{this.props.label}{this.props.required?<span className="required-tag-51">*</span>:undefined}</List.Item></Am.Picker>);
	}
}

class DatePicker extends Component {
	constructor(...args) {
	    super(...args);
	    this.state={
	    	hasError:false
	    };
	}

	render() {
		let props = getProps.call(this);
    	return (<Am.DatePicker {...props} value={this.state.value}><List.Item arrow="horizontal" error={this.state.hasError}>{this.props.label}{this.props.required?<span className="required-tag-51">*</span>:undefined}</List.Item></Am.DatePicker>);
	}
}

class Switch extends Component {
	constructor(...args) {
	    super(...args);
	    this.valueName = 'checked';
	    this.state={
	    	checked:false,
	    	hasError:false
	    };
	}
	render() {
		let props = getProps.call(this);
		return <Am.List.Item extra={<Am.Switch {...props} checked={this.state.checked}/>} error={this.state.hasError}>{this.props.label}</Am.List.Item>;
	}
}

class Stepper extends Component {
	constructor(...args) {
	    super(...args);
	    this.state={
	    	value:1,
	    	hasError:false
	    };
	}
	render() {
		let props = getProps.call(this);
		return <Am.List.Item extra={<Am.Stepper {...props} value={this.state.value}/>} error={this.state.hasError}>{this.props.label}</Am.List.Item>;
	}
}


export {InputItem,Picker,DatePicker, Switch,Stepper,validateForm,getFormValues,setFormValues};