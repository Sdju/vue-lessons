import {
    createApp,
    getCurrentInstance,
    inject,
    nextTick,
    shallowRef
} from 'vue';

const states = new WeakMap();

/// TODO: use / useDebugValue / useId / useReducer / <StrictMode />
/// TODO: deps are optional
/// TODO: types

function getInstance() {
    const self = getCurrentInstance() as any;
    if (!self.bu) {
        self.vnode.shapeFlag |= 4;
        self.render = function (proxyToUse, renderCache, props) {
            return self.type(
                props,
                null
            );
        }
        self.bu = [() => self._count = 0]
        self._count = 0
    }
    return self
}

function addHook(instance: any, hook: string, listener: Function) {
    const hooks = instance[hook]
    if (!instance[hook]) {
        instance[hook] = [listener]
        return
    }

    if (!hooks.includes(listener)) {
        hooks.push(listener)
    }
}

function removeHook(instance: any, hook: string, listener: Function) {
    const hooks = instance[hook]
    if (!instance[hook]) {
        instance[hook] = [listener]
        return
    }

    if (!hooks.includes(listener)) {
        hooks.push(listener)
    }
}

function checkDeps(oldVal: unknown[], newVal: unknown[]) {
    for (const key in newVal) {
        if (!Object.is(newVal[key], oldVal[key])) return false;
    }
    return true;
}

function useState<T>(val: T | (() => T)): [T, (val: T) => void] {
    const self = getInstance()

    let stateArr = states.get(self);
    if (!stateArr) {
        const def = typeof val === 'function' ? (val as () => T)() : val;
        states.set(self, (stateArr = [shallowRef(def)]));
    }
    let state = stateArr[(self as any)._count += 1];
    if (!state) {
        const def = typeof val === 'function' ? (val as () => T)() : val;
        stateArr.push((state = shallowRef(def)));
    }

    return [
        state.value,
        (val: T | ((cur: T) => T)) => {
            if (typeof val === 'function') {
                state.value = (val as (cur: T) => T)(state.value);
            } else {
                state.value = val;
            }
        }
    ];
}

function useRef<T>(value: T): { current: T } {
    const self = getInstance()

    let stateArr = states.get(self)
    if (!stateArr) {
        states.set(self, stateArr = [{current: value}])
    }
    let state = stateArr[self._count += 1]
    if (!state) {
        stateArr.push(state = {current: value})
    }

    return state
}

function useMemo<T>(fn: () => T, deps: unknown[]) {
    const self = getInstance()

    let stateArr = states.get(self)
    if (!stateArr) {
        states.set(self, stateArr = [{mem: fn(), deps}])
    }
    let state = stateArr[self._count += 1]
    if (!state) {
        stateArr.push(state = {mem: fn(), deps})
    }

    if (!checkDeps(state.deps, deps)) {
        state.mem = fn()
        state.deps = deps
    }

    return state.mem
}

function useCallback(fn: Function, deps: unknown[]) {
    const self = getInstance()

    let stateArr = states.get(self)
    if (!stateArr) {
        states.set(self, stateArr = [{mem: fn, deps}])
    }
    let state = stateArr[self._count += 1]
    if (!state) {
        stateArr.push(state = {mem: fn, deps})
    }

    if (!checkDeps(state.deps, deps)) {
        state.mem = fn
        state.deps = deps
    }

    return state.mem
}

/// TODO: типизировать
function useEffect(fn: () => any, deps: unknown[]) {
    const self = getInstance()

    const stateArr = states.get(self)
    if (!stateArr) {
        const state = {
            deps,
            callback: fn,
            cleanup: null,
            hook: () => {
                state.cleanup = state.callback?.()
            }
        }

        // Vue прекэишрует хуки поэтому динамическое добавление хука mounted не будет работать
        nextTick().then(() => state.hook?.())
        addHook(self, 'um', () => {
            //@ts-ignore
            state.hook = null
            //@ts-ignore
            state.cleanup?.()
        })

        states.set(self, [state])

        return
    }
    const state = stateArr[self._count += 1]
    if (!state) {
        const state = {
            deps,
            callback: fn,
            cleanup: null,
            hook: () => {
                state.cleanup = state.callback?.()
            }
        }

        // Vue прекэишрует хуки поэтому динамическое добавление хука mounted не будет работать
        nextTick().then(() => state.hook?.())
        addHook(self, 'um', () => {
            //@ts-ignore
            state.hook = null
            //@ts-ignore
            state.cleanup?.()
        })
        stateArr.push(state)
        return
    }

    state.callback = fn
    if (!checkDeps(state.deps, deps)) {
        state.hook = () => {
            removeHook(self, 'u', state.hook)
            state.cleanup?.()
            state.cleanup = state.callback?.()
        }

        state.deps = deps
        addHook(self, 'u', state.hook)
    }
}

const ctx = Symbol('ctx')

function createContext(value?: unknown) {
    const symbol = Symbol('context')
    return {
        Provider(props: { value?: unknown }) {
            const instance = getCurrentInstance()

            let provides = instance.provides
            const parentProvides =
                instance.parent && instance.parent.provides
            if (parentProvides === provides) {
                provides = instance.provides = Object.create(parentProvides)
            }
            // TS doesn't allow symbol as index type
            provides[symbol] = 'value' in props ? props.value : value

            return instance.slots.default()
        },
        Consumer() {
            /// TODO: realize consumer API
        },
        [ctx]: symbol
    }
}

function useContext(context: ReturnType<typeof createContext>) {
    return inject(context[ctx])
}

function forwardRef<T extends Function>(Comp: T) {
    return (props: object) => {
        const ref = useRef(null)
        const instance = getInstance()
        const result = Comp(props, ref)
        instance.exposed = ref.current

        return result
    }
}

function useImperativeHandle(ref: { current: unknown }, callback: () => object, deps: unknown[]) {
    // да мне влом расписывать
    useMemo(() => {
        ref.current = callback()
    }, deps)
}

/// -------------- SOURCE ---------------------

const ThemeContext = createContext('dark')

const InputTest = forwardRef(function ({value, onChange}, ref) {
    const input = useRef<HTMLInputElement | null>(null)

    useImperativeHandle(ref, () => {
        return {
            focus() {
                input.current!.focus()
            }
        }
    }, [])

    return (
        <input
            ref={node => input.current = node as HTMLInputElement}
        />
    )
})

function OutputNumber({base, step}) {
    const [num, setNum] = useState(base);
    const fancy = useMemo(() => `[ ${num} ]`, [num])
    const theme = useContext(ThemeContext)
    console.log(theme)

    useEffect(() => {
        const intId = setInterval(() => {
            setNum((num) => num + step);
        }, 1000);

        return () => clearInterval(intId)
    }, [step])

    return (
        <div>
            {fancy}
        </div>
    );
}

function App() {
    const [counter, setCounter] = useState(1)
    const button = useRef<HTMLButtonElement | null>(null)
    const input = useRef<any>(null)

    useEffect(() => {
        console.log(button)
        console.log(input)
        input.current.focus()
    }, [])

    return (
        <ThemeContext.Provider>
            <div>
                {counter}
                <button
                    ref={node => button.current = node as HTMLButtonElement}
                    onClick={() => setCounter(counter + 1)}
                >
                    +
                </button>
                <OutputNumber base={0} step={counter}/>
                <InputTest
                    ref={node => {
                        input.current = node
                    }}
                />
            </div>
        </ThemeContext.Provider>
    )
}

createApp(App).mount('#app');
