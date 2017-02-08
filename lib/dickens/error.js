var DickensError = {
    WrongType: 1000,
    NullInput: 1001,
    properties: {
        1000: { msg: "Wrong type" },
        1001: { msg: "Null input" }
    }
}

if (Object.freeze) {
    Object.freeze(DickensError)
}

module.exports = DickensError;