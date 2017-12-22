/**
 * Created by yhy on 2017/11/24.
 * 此类用于记录页面生命周期。
 */

import React, { Component } from "react"
import LogUtil from "./log-util"
export default WrapComponents => {
    class WrappedComponent extends Component {

        componentDidMount() {
            LogUtil.saveActLog(this.props.location.pathname, "进入页面", 1)
        }

        componentWillUnmount() {
            LogUtil.saveActLog(this.props.location.pathname, "出页面", 2)
        }

        render() {
            return <WrapComponents {...this.props} />
        }
    }

    return WrappedComponent
}
