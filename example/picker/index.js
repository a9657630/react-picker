import React, { Component } from 'react';

import Picker from '../../build/components/picker';

const testData = {
  // 单列
  data1: [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
  ],

  // 多列
  data2: [
    [
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
    ],
    [
      { label: 'A', value: 'A' },
      { label: 'B', value: 'B' },
      { label: 'C', value: 'C' },
    ],
  ],

  // 级联
  data3: [
    {
      label: '北京市',
      value: '北京市',
      children: [
        { label: '北京市', value: '北京市', children: [{ label: '东城区', value: '东城区' }, { label: '西城区', value: '西城区' }, { label: '朝阳区', value: '朝阳区' }] },
      ],
    },
    {
      label: '山西省',
      value: '山西省',
      children: [
        { label: '太原市', value: '太原市', children: [{ label: '迎泽区', value: '迎泽区' }, { label: '小店区', value: '小店区' }] },
        { label: '运城市', value: '运城市', children: [{ label: '市辖区', value: '市辖区' }, { label: '盐湖区', value: '盐湖区' }] },
      ],
    },
  ],
};

class PickerDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: testData.data1,
      pickerOptions: {
        // depth: 1,
        // type: 'cityPicker',
      },
      value: ['2'],
      label: [],
    };
  }

  /* eslint-disable no-console */
  onChange(data) {
    console.log(data);
    const value = [];
    const label = [];

    for (let i = 0, l = data.length; i < l; i += 1) {
      value.push(data[i].value);
      label.push(data[i].label);
    }

    this.setState({
      value,
      label,
    });
  }
  /* eslint-enable no-console */

  render() {
    return (
      <div>
        <Picker
          data={this.state.data}
          value={this.state.value}
          options={this.state.pickerOptions}
          onChange={(data) => { this.onChange(data); }}
        >
          <div className="list-item">
            <span className="list-item-label">{this.state.label.join(' ') || '选择种类'}</span>
            <span className="list-item-value icon-select" />
          </div>
        </Picker>
      </div>
    );
  }
}

export default PickerDemo;
