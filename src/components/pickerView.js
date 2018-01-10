import React, { Component } from 'react';
import PickerColumn from './pickerColumn';

class PickerView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onChange(value) {
    this.props.onChange(value);
  }

  getCascadeData(data, depthIndex, result) {
    const { value } = this.props;
    const column = [];
    let selectData;

    for (let i = 0, l = data.length; i < l; i++) {
      column.push({ label: data[i].label, value: data[i].value });

      if (data[i].value === value[depthIndex]) {
        selectData = data[i];
      }
    }

    if (!selectData) {
      selectData = data[0];
    }

    result.push(column);

    if (selectData.children) {
      return this.getCascadeData(selectData.children, depthIndex + 1, result);
    }

    return result;
  }

  getColumns() {
    const { data, value, depth, cascade } = this.props;
    const columnArray = [];
    let columnData = [];

    if (depth === 1) {
      columnData = [data];
    } else if (cascade) {
      columnData = this.getCascadeData(data, 0, columnData);
    } else {
      columnData = data;
    }

    for (let i = 0; i < depth; i++) {
      columnArray.push(
        <PickerColumn
          key={i}
          data={columnData[i]}
          value={value}
          index={i}
          onChange={(value) => { this.onChange(value); }}
          />
      );
    }

    return columnArray;
  }

  render() {
    const columns = this.getColumns();

    return (
      <div className="picker-view">
        {columns}
      </div>
    );
  }
}

export default PickerView;