import React, { Component } from 'react';
import ZScroller from 'zscroller';
import classnames from 'classnames';

class PickerColumn extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.itemHeight = document.getElementsByClassName('picker-column-item')[0].getBoundingClientRect().height;
    // this.itemHeight = document.getElementById('picker-column-indicator').getBoundingClientRect().height;
    
    this.initScroll();
    this.setPosition();
  }

  componentDidUpdate() {
    this.zscroller.reflow();
    this.setPosition();
  }

  componentWillUnmount() {
    this.zscroller.destroy();
  }

  scrollingComplete() {
    const { top } = this.zscroller.scroller.getValues();
    const { data, value, index, onChange } = this.props;

    let selectIndex = top < 0 ? 0 : Math.round(top / this.itemHeight);
    
    if (selectIndex >= data.length) {
      selectIndex = data.length - 1;
    }

    const selectValue = data[selectIndex].value;

    if (selectValue !== value[index]) {
      const result = value;
      result[index] = selectValue;
      onChange(result);
    }
  }

  initScroll() {
    const that = this;
    const { index } = this.props;

    this.zscroller = new ZScroller(document.getElementsByClassName('picker-column-content-' + index)[0], {
      scrollbars: true,
      scrollingX: false,
      scrollingY: true,
      snapping: true, // 滚动结束之后 滑动对应的位置
      penetrationDeceleration: .1,
      minVelocityToKeepDecelerating: 0.5,
      scrollingComplete() {
        that.scrollingComplete();
      }
    });

    // 设置每个格子的高度 这样滚动结束 自动滚到对应格子上
    // 单位必须是px 所以要动态取一下
    this.zscroller.scroller.setSnapSize(0, this.itemHeight);
  }

  setPosition() {
    const { data, value, index } = this.props;

    for (let i = 0, l = data.length; i < l; i += 1) {
      if (data[i].value === value[index]) {
        this.zscroller.scroller.scrollTo(0, this.itemHeight * i);
        return;
      }
    }

    this.zscroller.scroller.scrollTo(0, 0);
  }

  render() {
    const { data, value, index } = this.props;

    return (
      <div className="picker-column">
        <div className="picker-column-list">
          
          {/* 阴影 */}
          <div className="picker-column-window" />
          
          <div className="picker-column-indicator" />

          <div className={classnames('picker-column-content', 'picker-column-content-' + index)}>
            {
              data.map((item, i) => {
                return (
                  <div className={classnames('picker-column-item', { 'select': item.value === value[index] })} key={i}>{item.label}</div>
                )
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

export default PickerColumn;
