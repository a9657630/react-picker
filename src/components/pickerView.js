import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PickerColumn from './pickerColumn';

class PickerView extends Component {
  // static propTypes = {
  //   data: PropTypes.object.isRequired,
  //   value: PropTypes.object.isRequired,
  //   depth: PropTypes.number.isRequired,
  //   cascade: PropTypes.bool.isRequired,
  //   onChange: PropTypes.object.isRequired,
  // };

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
    let selectData = data[0];

    for (let i = 0, l = data.length; i < l; i += 1) {
      column.push({ label: data[i].label, value: data[i].value });

      if (data[i].value === value[depthIndex]) {
        selectData = data[i];
      }
    }

    result.push(column);

    if (selectData.children) {
      return this.getCascadeData(selectData.children, depthIndex + 1, result);
    }

    return result;
  }

  getColumns() {
    const {
      data,
      value,
      depth,
      cascade,
    } = this.props;
    const columnArray = [];
    let columnData = [];

    if (depth === 1) {
      columnData = [data];
    } else if (cascade) {
      columnData = this.getCascadeData(data, 0, columnData);
    } else {
      columnData = data;
    }

    for (let i = 0; i < depth; i += 1) {
      columnArray.push(<PickerColumn
        key={i}
        data={columnData[i]}
        value={value}
        index={i}
        onChange={(result) => { this.onChange(result); }}
      />);
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

PickerView.propTypes = {
  data: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
  depth: PropTypes.number.isRequired,
  cascade: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PickerView;
