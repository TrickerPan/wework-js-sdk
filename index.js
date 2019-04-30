import wx from './static/jweixin-1.2.0';

class Wx {
    /**
     * Wx 初始化方法
     *
     * @param {string} url 服务器根目录
     * @param {Array} jsApiList 请求初始化的方法接口数组
     * @param {boolean} debug 是否开启 debug 模式
     * @returns {boolean}
     */
    constructor(url, jsApiList, debug) {
        console.log(wx);
        this.wx = wx;
        console.log(this.wx);
        if (!jsApiList || !(jsApiList instanceof Array) || !jsApiList.length > 0) {
            console.error("jsApiList 必须为数组");
            return false;
        }

        this.debug = debug || false;
        this.jsApiList = jsApiList;

        let request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    let result = JSON.parse(request.response);
                    configApp(this.debug, result.appId, result.timestamp, result.nonceStr, result.signature, jsApiList);
                }
            }
        };

        request.open("POST", url + "/ticker/corp");
        request.setRequestHeader("Content-Type", "application/json");
        request.send("url=http://" + window.location.host);

        wx.ready(function () {
            let request = new XMLHttpRequest();

            request.onreadystatechange = function () {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status === 200) {
                        let result = JSON.parse(request.response);
                        configAgent(result.corpId, result.agentId, result.nonceStr, result.timestamp, result.signature)
                    }
                }
            };

            request.open("POST", url + "/ticket/agent");
            request.setRequestHeader("Content-Type", "application/json");
            request.send("url=http://" + window.location.host)
        })
    }

    /**
     * 通讯录选人
     *
     * @param {number} id -1:成员所在部门 | 0:整体部门 | ...
     * @param {boolean} mode true:多选模式 | false:单选模式
     * @param {Array} type ["department", "user"]
     * @param {Array} selectedDepartmentIds
     * @param {Array} selectedUserIds
     * @return {Object|boolean}
     */
    selectEnterpriseContact(id, mode, type, selectedDepartmentIds, selectedUserIds) {
        if (this.jsApiList.indexOf("selectEnterpriseContact") === -1) {
            console.error("初始化的接口方法数组中不包含此接口");
            return false
        }

        if (typeof id !== "number" || (id % 1) !== 0 || id < -1) {
            console.error("id 必须为整数 且 大于等于 -1. -1:成员所在部门 | 0:整体部门 | ...");
            return false
        }

        if (typeof mode !== "boolean") {
            console.error("mode 为 Boolean 类型");
            return false
        }

        if (!(type instanceof Array) || (type.length === 1 || type.length === 2)) {
            console.error("type 必须为不为空数组. 成员只能包含 \"department\" 和 \"user\"");
            return false
        }
        for (let t in type) {
            if (t !== "department" && t !== "user") {
                console.error("type 必须为不为空数组. 成员只能包含 \"department\" 和 \"user\"");
                return false
            }
        }

        if (selectedDepartmentIds) {
            if (!(selectedDepartmentIds instanceof Array)) {
                console.error("selectedDepartmentIds 必须为数组. 成员只能包含 \"department\" 和 \"user\"");
                return false
            }
        }

        if (selectedUserIds) {
            if (!(selectedUserIds instanceof Array)) {
                console.error("selectedUserIds 必须为数组. 成员只能包含 \"department\" 和 \"user\"");
                return false
            }
        }

        let departmentId = id || 0;

        wx.invoke("selectEnterpriseContact", {
            "fromDepartmentId": departmentId,
            "mode": mode === true ? "multi" : "single",
            "type": type,
            "selectedDepartmentIds": selectedDepartmentIds,
            "selectedUserIds": selectedUserIds
        }, function (res) {
            if (res.errMsg.indexOf("ok")) {
                let result = res.result;
                if (typeof result === "string") {
                    result = JSON.parse(result)
                }

                return {
                    departmentList: result.departmentList,
                    userList: result.userList
                }
            } else {
                console.error(res.err_msg);
                return false
            }
        })
    }

    /**
     * 发起审批
     *
     * @param {string} templateId
     * @param {string} uuid
     * @param {Array} fieldList
     * @returns {boolean}
     */
    initiateApproval(templateId, uuid, fieldList) {
        if (this.jsApiList.indexOf("thirdPartyOpenPage") === -1) {
            console.error("初始化的接口方法数组中不包含此接口");
            return false
        }

        if (!(fieldList instanceof Array) || fieldList.length <= 0) {
            console.error("fieldList 必须为不为空数组");
            return false
        }
        for (let field in fieldList) {
            if (!(field instanceof Object)) {
                console.error("fieldList 内的元素必须为对象");
                return false
            }
            let keys = Object.keys(field);
            if (keys.length !== 3) {
                console.error("fieldList 内的元素的键有且仅有三个, 分别为: \"title\", \"type\", \"value\"");
                return false
            }
            for (let key in keys) {
                if (key !== "title" && key !== "type" && key !== "value") {
                    console.error("fieldList 内的元素的键有且仅有三个, 分别为: \"title\", \"type\", \"value\"");
                    return false
                }
            }
        }

        wx.invoke("thirdPartyOpenPage", {
            "oaType": "10001",
            "templateId": templateId,
            "thirdNo": uuid,
            "extData": {
                'fieldList': fieldList
            }
        }, function (res) {
            return res.errMsg.indexOf("ok") > -1;
        }, function () {
            console.error("发起审批失败");
            return false
        })
    }

    /**
     * 扫描二维码
     *
     * @return {string|boolean}
     */
    scanQRCode() {
        if (this.jsApiList.indexOf("scanQRCode") === -1) {
            console.error("初始化的接口方法数组中不包含此接口");
            return false
        }

        wx.scanQRCode({
            desc: 'scanQRCode desc',
            needResult: 0,
            scanType: ["qrCode", "barCode"],
            success: function (res) {
                if (res.errMsg.indexOf("ok") > -1) {
                    return res.resultStr
                } else {
                    return false
                }
            },
            error: function (res) {
                if (res.errMsg.indexOf('function_not_exist') > 0) {
                    alert('版本过低请升级')
                }
                return false
            }
        })
    }
}

/**
 * 请勿修改
 */
function configApp(debug, appId, timestamp, nonceStr, signature, jsApiList) {
    wx.config({
        beta: true,
        debug: debug,
        appId: appId,
        timestamp: timestamp,
        noncestr: nonceStr,
        signature: signature,
        jsApiList: jsApiList
    })
}

/**
 * 请勿修改
 */
function configAgent(corpId, agentId, timestamp, nonceStr, signature, jsApiList) {
    wx.agentConfig({
        corpid: corpId,
        agentid: agentId,
        timestamp: timestamp,
        nonceStr: nonceStr,
        signature: signature,
        jsApiList: jsApiList,
    })
}

export default Wx;
