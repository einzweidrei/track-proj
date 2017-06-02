var Message = (function () {
    Message.SUCCESS = "SUCCESS";
    Message.FAILED = "FAILED";
    Message.DUPLICATED = "DUPLICATED";
    Message.NOT_EXIST = "NOT_EXIST";
    Message.REQUIRED = "REQUIRED";
    Message.UNAUTHORIZED = "Unauthorized";

    function Message() { }

    Message.prototype.msgData = (status, msg, data) => {
        return JSON.stringify({
            status: status,
            message: msg,
            data: data
        });
    }

    Message.prototype.msgReturn = (res, status, data) => {
        if (!data) data = [];
        switch (status) {
            case 0:
                return res.status(200).send(Message.prototype.msgData(true, Message.SUCCESS, data));
            case 1:
                return res.status(200).send(Message.prototype.msgData(false, Message.FAILED, data));
            case 2:
                return res.status(200).send(Message.prototype.msgData(false, Message.DUPLICATED, data));
            case 3:
                return res.status(500).send(Message.prototype.msgData(false, Message.FAILED, data));
            case 4:
                return res.status(200).send(Message.prototype.msgData(false, Message.NOT_EXIST, data));
            default:
                break;
        }
    }

    return Message;
}());

exports.Message = Message;
