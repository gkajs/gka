class Event {
    constructor() {
        this._events = {};
        this.interceptOn = () => {};
        this.interceptEmit = () => {};
    }
    intercept({on, emit}) {
        this.interceptOn = on;
        this.interceptEmit = emit;
    }
    emit(type, ...opt) {
        let handler, handlers = this._events[type];

        if (!handlers) return false;

        return new Promise(async r => {
            while ((handler = handlers.shift())) {
                await new Promise(r => handler(...opt, r));
                this.interceptEmit(type, ...opt)
            }
            return r();
        })
    }
    on(type, listener){
        this._events[type] = this._events[type] || [];
        this._events[type].push(listener);
        this.interceptOn(type)
        return this;
    }
}

module.exports = Event;


/*
let ev = new Event();

function a(data, callback) {
    console.log('a')
    console.log(data)
    setTimeout(() => {
        console.log('a callback')
        callback();
    }, 1000);
}

function c(data1, data2, callback) {
    console.log('c')
    console.log(data1, data2)
    setTimeout(() => {
        console.log('c callback')
        callback();
    }, 0);
}

function b(data, callback) {
    console.log('b')
    setTimeout(() => {
        console.log('b callback')
        callback();
    }, 3000);
}

ev.on('b', b);
ev.on('b', a);
// on('b', c);

ev.on('a', c);

async function init() {
    ev.intercept({
        on(type) {
            console.log('on', type)
        },
        emit(type, ...opt) {
            console.log('emit', type, ...opt)
        },
    })

    var b = await ev.emit('b', 'data');
    console.log(333)
    await ev.emit('a', 'data2', 'data3');
    // emit('b', 'data3');
}

init()

*/