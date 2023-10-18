import {defineComponent, getCurrentInstance, h, ref, shallowRef} from 'vue';

export const counter = defineComponent((props) => {
    const value = ref(0);

    function increment() {
        value.value ++;
    }

    return () => {
        return h('div', null, [
            h('button', {
                onClick() {
                    increment()
                }
            }, ['+']),
            value.value
        ])
    }
}, { props: {} })

const states = new WeakMap()

function getInstance() {
    const self = getCurrentInstance() as any;
    if (!self.bu) {
        self.bu = [() => self._count = 0]
        self._count = 0
    }
    return self
}

function useState<T>(val: T | (() => T)): [T, (val: T) => void] {
    const self = getInstance()

    let stateArr = states.get(self)
    if (!stateArr) {
        const def = typeof val === 'function' ? (val as () => T)() : val
        states.set(self, stateArr = [shallowRef(def)])
    }
    let state = stateArr[(self as any)._count]
    if (!state) {
        const def = typeof val === 'function' ? (val as () => T)() : val
        stateArr.push(state = shallowRef(def))
    }

    self._count += 1

    return [state.value, (val: T | ((cur: T) => T)) => {
        if (typeof val === 'function') {
            state.value = (val as (cur: T) => T)(state.value)
        } else {
            state.value = val
        }
    }]
}

const refs = new WeakMap()
function useRef<T>(value: T): { current: T } {
    const self = getInstance()

    let stateArr = states.get(self)
    if (!stateArr) {
        states.set(self, stateArr = [{ current: value }])
    }
    let state = stateArr[(self as any)._count]
    if (!state) {
        stateArr.push(state = { current: value })
    }

    self._count += 1
    return state
}

export function OutputNumber() {
    const [num, setNum] = useState(0);
    const [num2, setNum2] = useState(0);
    const [num3, setNum3] = useState(0);
    const [num3, setNum3] = useRef({});

    setTimeout(() => {
        console.log(num, num2, num3);
        setNum((num) => num + 1);
        setNum2(num2 + 2);
        setNum3(num3 + 3);
    }, Math.random() * 1000);

    return h("div", null, [`${num} ${num2} ${num3}`]);
}
