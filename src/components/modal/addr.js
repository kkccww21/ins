import React, { Component } from 'react';
import {Modal} from 'antd-mobile';
import {emitter} from '../../common';
function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}
class Addr extends Component {
	constructor(...args) {
	    super(...args);
	    emitter.on('showAddrModal',()=>{
	    	this.setState({visible:true});
	    });
	    this.state={
	    	visible:false
	    };
	}

	onWrapTouchStart = (e) => {
	    // fix touch to scroll background page on iOS
	    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
	      return;
	    }
	    const pNode = closest(e.target, '.am-modal-content');
	    if (!pNode) {
	      e.preventDefault();
	    }
	 }

	render() {
		
		return <Modal
          visible={this.state.visible}
          popup
          animationType="slide"
          maskClosable={false}
          title="Title"
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        >
        	<div style={{ height: '80vh', overflow: 'scroll' }}>
	            scoll content...<br />
	            scoll content...<br />
	            scoll content...<br />
	            scoll content...<br />
	            scoll content...<br />
	            scoll content...<br />
	          </div>
	          <a onClick={()=>{
	          	this.setState({visible:false});
	          }}>OK</a>
        </Modal>;
	}
}
export default Addr;
