/***
 * 操作浏览器cookie*/
export default class Cookies {
    static set(name, value, options) {
        // Retrieve options and defaults
        let opts = options || {}
        let defaults = this

        // Apply default value for unspecified options
        let expires = opts.expires || defaults.expires
        let domain = opts.domain || defaults.domain
        let path = opts.path !== undefined ? opts.path : defaults.path !== undefined ? defaults.path : "/"
        let secure = opts.secure !== undefined ? opts.secure : defaults.secure
        let httponly = opts.httponly !== undefined ? opts.httponly : defaults.httponly

        // Determine cookie expiration date
        // If succesful the result will be a valid Date, otherwise it will be an invalid Date or false(ish)
        let expDate = expires
            ? new Date(
                  // in case expires is an integer, it should specify the number of days till the cookie expires
                  typeof expires === "number"
                      ? new Date().getTime() + expires * 864e5
                      : // else expires should be either a Date object or in a format recognized by Date.parse()
                        expires
              )
            : ""

        // Set cookie
        document.cookie =
            name
                .replace(/[^+#$&^`|]/g, encodeURIComponent) // Encode cookie name
                .replace("(", "%28")
                .replace(")", "%29") +
            "=" +
            value.replace(/[^+#$&/:<-\[\]-}]/g, encodeURIComponent) + // Encode cookie value (RFC6265)
            (expDate && expDate.getTime() >= 0 ? ";expires=" + expDate.toUTCString() : "") + // Add expiration date
            (domain ? ";domain=" + domain : "") + // Add domain
            (path ? ";path=" + path : "") + // Add path
            (secure ? ";secure" : "") + // Add secure option
            (httponly ? ";httponly" : "") // Add httponly option
    }

    static get(name) {
        let cookies = document.cookie.split(";")

        // Iterate all cookies
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i]
            let cookieLength = cookie.length

            // Determine separator index ("name=value")
            let separatorIndex = cookie.indexOf("=")

            // IE<11 emits the equal sign when the cookie value is empty
            separatorIndex = separatorIndex < 0 ? cookieLength : separatorIndex

            let cookie_name = decodeURIComponent(cookie.substring(0, separatorIndex).replace(/^\s+/, ""))

            // Return cookie value if the name matches
            if (cookie_name === name) {
                return decodeURIComponent(cookie.substring(separatorIndex + 1, cookieLength))
            }
        }

        // Return `null` as the cookie was not found
        return null
    }

    static erase(name, options) {
        this.set(name, "", {
            expires: -1,
            domain: options && options.domain,
            path: options && options.path,
            secure: 0,
            httponly: 0
        })
    }

    static all() {
        let all = {}
        let cookies = document.cookie.split(";")

        // Iterate all cookies
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i]
            let cookieLength = cookie.length

            // Determine separator index ("name=value")
            let separatorIndex = cookie.indexOf("=")

            // IE<11 emits the equal sign when the cookie value is empty
            separatorIndex = separatorIndex < 0 ? cookieLength : separatorIndex

            // add the cookie name and value to the `all` object
            let cookie_name = decodeURIComponent(cookie.substring(0, separatorIndex).replace(/^\s+/, ""))
            all[cookie_name] = decodeURIComponent(cookie.substring(separatorIndex + 1, cookieLength))
        }

        return all
    }
}
