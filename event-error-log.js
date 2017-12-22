/**
 * Created by yhy on 2017/11/25.
 */

import iflux, { msg as Messages } from "iflux"

Messages.on("error", err => {
    console.log("出现event异常")
})

export default () => {}
