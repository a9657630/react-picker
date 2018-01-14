import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
// import Touchable from 'rc-touchable';

import PickerView from './pickerView';

import cityData from '../data/city';

/*
// 单列
const test1 = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
];

// 多列
const test2 = [
  [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
  ],
  [
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'C', value: 'C' },
  ]
];

// 级联
const test3 = [
  {
    label: '1',
    value: '1',
    children: [
      { label: 'A', value: 'A' },
      { label: 'B', value: 'B' },
    ],
  },
  {
    label: '2',
    value: '2',
    children: [
      { label: 'AA', value: 'AA' },
      { label: 'BB', value: 'BB' },
    ],
  },
];
*/
class Picker extends Component {
  // static propTypes() {
  //   return {
  //     data: PropTypes.object,
  //     value: PropTypes.object,
  //     options: PropTypes.object,
  //     onChange: PropTypes.object.isRequired,
  //     children: PropTypes.object.isRequired,
  //   };
  // }

  // static defaultProps() {
  //   return {
  //     data: [],
  //     value: [],
  //     options: {},
  //   };
  // }

  constructor(props) {
    super(props);
    this.state = {
      close: false,
      show: false,
      value: [],
    };
    this.data = [];
    this.options = {};
  }

  componentWillMount() {
    const { data, options } = this.props;

    this.data = data;

    if (options.type && options.type === 'cityPicker' && this.data.length === 0) {
      this.data = cityData;
    }

    if (!Array.isArray(this.data)) {
      return;
    }

    const defaultOptions = {
      title: '',
      cancelText: '取消',
      confirmText: '确定',
      depth: Array.isArray(this.data[0]) ? this.data.length : this.getDepth(this.data[0]), // 列数
      cascade: Object.prototype.hasOwnProperty.call(this.data[0], 'children'), // 是否级联
    };

    // options
    if (options) {
      this.options = Object.assign({}, defaultOptions, options);
    }
  }

  componentDidMount() {
    const { value } = this.props;

    setTimeout(() => {
      // 如果props中没有默认值, 取第一个值
      if (value && value.length === this.options.depth) {
        this.setState({ value: this.props.value });
      } else {
        this.setState({ value: this.initValue() });
      }
    }, 1);
  }

  onChange(value) {
    let result = [];

    // 如果是级联 需要重置value
    if (this.options.cascade) {
      result = this.getCascadeValue(this.data, value, 0, result);
    } else {
      result = value;
    }

    this.setState({ value: result });
  }

  getPickerViewDOM() {
    return (
      <PickerView
        data={this.data}
        value={this.state.value}
        depth={this.options.depth}
        cascade={this.options.cascade}
        onChange={(value) => { this.onChange(value); }}
      />
    );
  }

  getPickerDOM() {
    if (!this.state.show) {
      return null;
    }

    const { title, cancelText, confirmText } = this.options;
    const pickerViewDOM = this.getPickerViewDOM();

    return (
      <div>

        {/* Mask */}
        <div
          className={classnames('picker-mask', { 'animate-fade-in': !this.state.close }, { 'animate-fade-out': this.state.close })}
          onClick={() => { this.handleCancel(); }}
          onKeyPress={() => {}}
          role="button"
          tabIndex="-1"
        />

        <div className={classnames('picker-popup', { 'animate-slide-up': !this.state.close }, { 'animate-slide-down': this.state.close })}>

          {/* Header */}
          <div className="picker-popup-header">
            <span
              className="picker-button-cancel"
              onClick={() => { this.handleCancel(); }}
              onKeyPress={() => {}}
              role="button"
              tabIndex="-1"
            >
              {cancelText}
            </span>
            <span>{title}</span>
            <span
              className="picker-button-confirm"
              onClick={() => { this.handleConfirm(); }}
              onKeyPress={() => {}}
              role="button"
              tabIndex="-1"
            >
              {confirmText}
            </span>
          </div>

          {/* Content */}
          <div className="picker-popup-content">
            {pickerViewDOM}
          </div>

        </div>

      </div>
    );
  }

  // 重置级联value
  getCascadeValue(data, value, index, result) {
    for (let i = 0, l = data.length; i < l; i += 1) {
      if (data[i].value === value[index]) {
        result.push(data[i].value);

        if (data[i].children && this.options.depth > index) {
          return this.getCascadeValue(data[i].children, value, index + 1, result);
        }

        break;
      }
    }

    result.push(data[0].value);

    if (data[0].children && this.options.depth > index) {
      return this.getCascadeValue(data[0].children, value, index + 1, result);
    }

    return result;
  }

  getCascadeResult(data, value, index, result) {
    for (let i = 0, l = data.length; i < l; i += 1) {
      if (data[i].value === value) {
        result.push({ label: data[i].label, value: data[i].value });

        if (data[i].children && this.options.depth > index) {
          const nextIndex = index + 1;
          const nextValue = this.state.value[nextIndex];
          return this.getCascadeResult(data[i].children, nextValue, nextIndex, result);
        }

        break;
      }
    }

    return result;
  }

  getResult() {
    let result = [];
    const { data } = this;

    if (this.options.depth === 1) { // 单列
      for (let i = 0, l = data.length; i < l; i += 1) {
        if (data[i].value === this.state.value[0]) {
          result.push(data[i]);
        }
      }
    } else if (!this.options.cascade) { // 多列
      for (let i = 0, l = data.length; i < l; i += 1) {
        const item = data[i];

        for (let j = 0, n = item.length; j < n; j += 1) {
          if (item[j].value === this.state.value[i]) {
            result.push(item[j]);
            break;
          }
        }
      }
    } else { // 级联
      result = this.getCascadeResult(data, this.state.value[0], 0, result);
    }

    return result;
  }

  getDepth(data) {
    let depth = 1;

    if (data && data.children) {
      depth = this.getDepth(data.children[0]) + 1;
    }

    return depth;
  }

  // 初始化级联value
  initCascadeValue(data, result) {
    result.push(data.value);

    if (data.children) {
      return this.initCascadeValue(data.children[0], result);
    }

    return result;
  }

  // 初始化
  initValue() {
    const { data } = this;
    let result = [];

    if (this.options.depth === 1) { // 单列
      result.push(data[0].value);
    } else if (!this.options.cascade) { // 多列
      for (let i = 0, l = data.length; i < l; i += 1) {
        result.push(data[i][0].value);
      }
    } else { // 级联
      result = this.initCascadeValue(data[0], result);
    }

    // this.setState({ value: result });
    return result;
  }

  handleCancel() {
    this.setState({ close: true }, () => setTimeout(() => {
      this.setState({ show: false, close: false });
    }, 300));
  }

  handleConfirm() {
    this.setState({ close: true }, () => setTimeout(() => {
      this.props.onChange(this.getResult());
      this.setState({ show: false, close: false });
    }, 300));
  }

  showPicker() {
    this.setState({ show: true, close: false });
  }

  render() {
    const pickerDOM = this.getPickerDOM();

    return (
      <div className="picker">

        <div onClick={() => { this.showPicker(); }} onKeyPress={() => {}} role="button" tabIndex="-1">
          {this.props.children}
        </div>

        {pickerDOM}

      </div>
    );
  }
}

Picker.propTypes = {
  data: PropTypes.array,
  value: PropTypes.array,
  options: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
};

Picker.defaultProps = {
  data: [],
  value: [],
  options: {},
};

export default Picker;
