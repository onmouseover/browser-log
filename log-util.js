/**
 * Created by yhy on 2017/12/9.
 */
import Cookies from "./browser-cookies"
import LocalStorage from './local-storage'
import ajax from "./ajax"
const Log_Server = "http://172.19.72.135:8080/userbehavior/data"
const IN_PAGE = 1 //进入页面
const OUT_PAGE = 2 //出页面
const CLICK = 3 //点击
const LOG_KEY = "logList" //定义日志内容key
const CLIENT_TYPE = 4
export default class LogUtil {
    static sendTime = new Date().getTime()
    static logItemDef = {
        curPage: "",
        actContent: "",
        actType: "",
        actTime: ""
    }

    static saveActLog(curPage, actContent, actType) {
        this.setLogItem(this.getLogItem(curPage, actContent, actType))
    }

    static getLogItem(curPage, actContent, actType) {
        let item = {}
        Object.assign(item, this.logItemDef)

        item.curPage = curPage
        item.actContent = actContent
        item.actType = actType
        item.actTime = new Date().getTime()
        return item
    }
    static getAnonymityId() {
        return Cookies.get("anonymityId")
    }

    //获取用户编号
    static getUserCode() {
        let userCode = Cookies.get("userCode")
        if (userCode) return userCode

        let hostName = window.location.hostname
        let userInfo = Cookies.get(hostName + "userInfo")

        if (!userInfo) {
            return null
        }

        try {
            userInfo = eval(userInfo)
            userInfo = JSON.parse(userInfo)
        } catch (e) {
            userInfo = JSON.parse(userInfo)
        }

        return userInfo.userCode
    }

    static getToken() {
        let hostName = window.location.hostname
        return Cookies.get(hostName + "token")
    }

    static setLogItem(item) {
        let itemList = LocalStorage.get(LOG_KEY) || []

        itemList.push(item)
        LocalStorage.set(LOG_KEY, itemList)

        //发送日志的条件：出页面、条数大于30、时间超过10分钟
        if (item.actType == OUT_PAGE || itemList.size > 30) {
            //发送数据且清除已发送数据
            this.sendLogData()
            LocalStorage.remove(LOG_KEY)
        }
    }

    static _autoSend() {
        let _this = this
        setInterval(() => {
            if (new Date().getTime() - _this.sendTime > 1000 * 60 * 5) {
                //如果5分钟没有发送过数据就发一次
                _this.sendLogData()
                LocalStorage.remove(LOG_KEY)
            }
        }, 1000 * 60)
    }
    static sendLogData() {
        let itemList = LocalStorage.get(LOG_KEY)
        if (!itemList || itemList.length == 0) return
        let data = {}
        Object.assign(data, this.getBrowserInfo())
        data.clientType = CLIENT_TYPE
        data.anonymityId = this.getAnonymityId()
        data.userCode = this.getUserCode()
        data.activityList = itemList

        ajax.post(Log_Server, JSON.stringify(data), {
            headers: {
              Authorization: this.getToken()
            }
        })
        this.sendTime = new Date().getTime()
    }

    static getBrowserInfo() {
        let userAgent = window.navigator.userAgent
        let browerInfo = {}
        if (userAgent.indexOf("Firefox") != -1) {
            /*broName = 'FireFox浏览器';*/
            let strStart = userAgent.indexOf("Firefox")
            let temp = userAgent.substring(strStart).split("/")
            browerInfo.browser = "FireFox"
            browerInfo.browserVersion = temp[1]
        }
        //Edge
        if (userAgent.indexOf("Edge") != -1) {
            /*broName = 'Edge浏览器';*/
            let strStart = userAgent.indexOf("Edge")
            let temp = userAgent.substring(strStart).split("/")
            browerInfo.browser = "Edge"
            browerInfo.browserVersion = temp[1]
        }

        //IE浏览器
        if (userAgent.indexOf("NET") != -1 && userAgent.indexOf("rv") != -1) {
            browerInfo.browser = "IE"
        }

        //360极速模式可以区分360安全浏览器和360极速浏览器
        if (userAgent.indexOf("WOW") != -1 && userAgent.indexOf("NET") < 0 && userAgent.indexOf("Firefox") < 0) {
            if (navigator.javaEnabled()) {
                //'360安全浏览器-极速模式';
                browerInfo.browser = "360-safe-fast"
            } else {
                //'360极速浏览器-极速模式';
                browerInfo.browser = "360-fast-fast"
            }
        }
        //360兼容
        if (
            userAgent.indexOf("WOW") != -1 &&
            userAgent.indexOf("NET") != -1 &&
            userAgent.indexOf("MSIE") != -1 &&
            userAgent.indexOf("rv") < 0
        ) {
            browerInfo.browser = "360-JR"
        }

        //Chrome浏览器
        if (userAgent.indexOf("WOW") < 0 && userAgent.indexOf("Edge") < 0) {
            let strStart = userAgent.indexOf("Chrome")
            let strStop = userAgent.indexOf(" Safari")
            let temp = userAgent.substring(strStart, strStop).split("/")
            browerInfo.browser = "Chrome"
            browerInfo.browserVersion = temp[1]
        }

        browerInfo.os = navigator.platform

        browerInfo.screenHeight = window.screen.height

        browerInfo.screenWidth = window.screen.width
    }
}


LogUtil._autoSend()
