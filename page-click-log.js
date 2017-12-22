/**
 * Created by yhy on 2017/11/24.
 */
import LogUtil from './log-util'
export default class PageClickLog {
  static bindWindowEvent() {
    window.onbeforeunload = () => {
      LogUtil.saveActLog(window.location.hash,"离开当前页",2)
    }
  }
    static bindDivEvent() {
        let lastTime = null
        document.body.onclick = e => {
            let nodeName = e.target.nodeName.toLowerCase();
            if(nodeName == 'a' || nodeName == 'button'){
                if(lastTime && new Date().getTime() - lastTime < 500){
                  console.log("重复的点击")
                  return
                }
                lastTime = new Date().getTime()
                let nodeVal = e.target.innerText;
                if(nodeVal){
                    nodeVal = nodeVal.replace(/\s/g, '')
                }else{
                    //如果没有值暂时不记录
                    return;
                }
                LogUtil.saveActLog(window.location.hash,nodeVal,3)
            }
        }
    }
}

PageClickLog.bindDivEvent();
PageClickLog.bindWindowEvent();