// promise 三种状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise<T> {
    // 状态
    status: string
    value: T | null
    reason: T | null
    FULFILLED_CALLBACK_LIST = []
    REJECTED_CALLBACK_LIST = []
    // 构造方法
    constructor(execute: Function) {
        this.status = PENDING;
        this.reason = null;
        this.value = null;

        // 报错立马抛出
        try {
            // 入参处理
            // this 改为当前环境
            execute(this.resolve.bind(this), this.reject.bind(this));
        } catch (error) {
            this.reject(error)
        }
    }
    // 成功回调
    resolve(value: T): void {
        if (this.status === PENDING) {
            this.status = FULFILLED;
            this.value = value
            console.log(this.status, this.value)
        }
    }
    // 失败回调
    reject(reason: T): void {
        if (this.status === PENDING) {
            this.status = REJECTED;
            this.reason = reason;
            console.log(this.status, this.reason)
        }
    }

    /* get prop() {
        // 真实的status
        return this.status
    }
    set prop(newStatus) {
        this.status = newStatus
        // 根据status 执行不同逻辑
        switch (newStatus) {
            case FULFILLED:
                this.FULFILLED_CALLBACK_LIST.forEach(callback => {
                    callback(this.value)
                })
                break;

            case REJECTED:
                this.REJECTED_CALLBACK_LIST.forEach(callback => {
                    callback(this.reason)
                })
                break;
        }
    } */

    // then 接受 两个参数 onFulfilled 和 onRejected 
    then(onFulfilled, onRejected) {
        const fulfilledFn = this.isFunction(onFulfilled) ? onFulfilled : (value) => value
        const rejectedFn = this.isFunction(onRejected) ? onRejected : (reason) => reason

        switch (this.status) {
            case FULFILLED:
                fulfilledFn(this.value)
                break;

            case REJECTED:
                rejectedFn(this.reason)
                break;

            case PENDING:
                this.FULFILLED_CALLBACK_LIST.push(fulfilledFn)
                this.REJECTED_CALLBACK_LIST.push(rejectedFn)
                break 
        }
    }
    // resolvePromise() {

    // }

    // 判断是否为函数
    isFunction<T>(param: T): boolean {
        return typeof param === 'function'
    }
}

const test = new MyPromise((resolve: Function, reject: Function) => {
    resolve('成功')
    reject('失败')
})

