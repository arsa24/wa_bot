enum LogType {
    INFO, ERROR
}

function printLog(msg: string, type: LogType){
    const date = new Date()
    console.log(`[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] [${LogType[type]}] ${msg}`);
}

export {LogType, printLog};