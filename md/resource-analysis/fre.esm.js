const updateElement = (dom, oldProps, newProps) => {
    for (let name in Object.assign(Object.assign({}, oldProps), newProps)) {
        let oldValue = oldProps[name];
        let newValue = newProps[name];
        if (oldValue == newValue || name === 'children') ;
        else if (name === 'style') {
            for (const k in Object.assign(Object.assign({}, oldValue), newValue)) {
                if (!(oldValue && newValue && oldValue[k] === newValue[k])) {
                    dom[name][k] = (newValue && newValue[k]) || '';
                }
            }
        }
        else if (name[0] === 'o' && name[1] === 'n') {
            name = name.slice(2).toLowerCase();
            if (oldValue)
                dom.removeEventListener(name, oldValue);
            dom.addEventListener(name, newValue);
        }
        else if (name in dom && !(dom instanceof SVGElement)) {
            dom[name] = newValue == null ? '' : newValue;
        }
        else if (newValue == null || newValue === false) {
            dom.removeAttribute(name);
        }
        else {
            dom.setAttribute(name, newValue);
        }
    }
};
const createElement = (fiber) => {
    const dom = fiber.type === 'text'
        ? document.createTextNode('')
        : fiber.tag === 4
            ? document.createElementNS('http://www.w3.org/2000/svg', fiber.type)
            : document.createElement(fiber.type);
    updateElement(dom, {}, fiber.props);
    return dom;
};

let cursor = 0;
const resetCursor = () => {
    cursor = 0;
};
const useState = (initState) => {
    return useReducer(null, initState);
};
const useReducer = (reducer, initState) => {
    const [hook, current] = getHook(cursor++);
    const setter = (value) => {
        let newValue = reducer
            ? reducer(hook[0], value)
            : isFn(value)
                ? value(hook[0])
                : value;
        if (newValue !== hook[0]) {
            hook[0] = newValue;
            scheduleWork(current);
        }
    };
    if (hook.length) {
        return [hook[0], setter];
    }
    else {
        hook[0] = initState;
        return [initState, setter];
    }
};
const useEffect = (cb, deps) => {
    return effectImpl(cb, deps, 'effect');
};
const useLayout = (cb, deps) => {
    return effectImpl(cb, deps, 'layout');
};
const effectImpl = (cb, deps, key) => {
    let [hook, current] = getHook(cursor++);
    if (isChanged(hook[1], deps)) {
        hook[0] = useCallback(cb, deps);
        hook[1] = deps;
        current.hooks[key].push(hook);
    }
};
const useMemo = (cb, deps) => {
    let hook = getHook(cursor++)[0];
    if (isChanged(hook[1], deps)) {
        hook[1] = deps;
        return (hook[0] = cb());
    }
    return hook[0];
};
const useCallback = (cb, deps) => {
    return useMemo(() => cb, deps);
};
const useRef = (current) => {
    return useMemo(() => ({ current }), []);
};
const getHook = (cursor) => {
    const current = getCurrentFiber();
    let hooks = current.hooks || (current.hooks = { list: [], effect: [], layout: [] });
    if (cursor >= hooks.list.length) {
        hooks.list.push([]);
    }
    return [hooks.list[cursor], current];
};
const isChanged = (a, b) => {
    return !a || b.some((arg, index) => arg !== a[index]);
};

let taskQueue = [];
let currentCallback;
let frameDeadline = 0;
const frameLength = 5;
const scheduleCallback = (callback) => {
    const currentTime = getTime();
    const timeout = 3000;
    const dueTime = currentTime + timeout;
    let newTask = {
        callback,
        dueTime
    };
    taskQueue.push(newTask);
    currentCallback = flush;
    planWork(null);
};
const flush = (iniTime) => {
    let currentTime = iniTime;
    let currentTask = peek(taskQueue);
    while (currentTask) {
        const timeout = currentTask.dueTime <= currentTime;
        if (!timeout && shouldYeild())
            break;
        let callback = currentTask.callback;
        currentTask.callback = null;
        let next = isFn(callback) && callback(timeout);
        next ? (currentTask.callback = next) : taskQueue.shift();
        currentTask = peek(taskQueue);
        currentTime = getTime();
    }
    return !!currentTask;
};
const peek = (queue) => {
    queue.sort((a, b) => a.dueTime - b.dueTime);
    return queue[0];
};
const flushWork = () => {
    if (isFn(currentCallback)) {
        let currentTime = getTime();
        frameDeadline = currentTime + frameLength;
        let more = currentCallback(currentTime);
        more ? planWork(null) : (currentCallback = null);
    }
};
const planWork = (() => {
    if (typeof MessageChannel !== 'undefined') {
        const { port1, port2 } = new MessageChannel();
        port1.onmessage = flushWork;
        return (cb) => cb ? requestAnimationFrame(cb) : port2.postMessage(null);
    }
    return (cb) => setTimeout(cb || flushWork);
})();
const shouldYeild = () => {
    return getTime() >= frameDeadline;
};
const getTime = () => performance.now();

const options = {
    catchError(_, e) {
        throw e;
    }
};
let preCommit;
let currentFiber;
let WIP;
let updateQueue = [];
let commitQueue = [];
const render = (vnode, node, done) => {
    let rootFiber = {
        node,
        props: { children: vnode },
        done
    };
    scheduleWork(rootFiber);
};
const scheduleWork = (fiber) => {
    if (!fiber.dirty) {
        fiber.dirty = true;
        updateQueue.push(fiber);
    }
    scheduleCallback(reconcileWork);
};
const reconcileWork = (timeout) => {
    if (!WIP)
        WIP = updateQueue.shift();
    while (WIP && (!shouldYeild() || timeout)) {
        WIP = reconcile(WIP);
    }
    if (WIP && !timeout) {
        return reconcileWork.bind(null);
    }
    if (preCommit)
        commitWork(preCommit);
    return null;
};
const reconcile = (WIP) => {
    WIP.parentNode = getParentNode(WIP);
    if (isFn(WIP.type)) {
        try {
            updateHook(WIP);
        }
        catch (e) {
            options.catchError(WIP, e);
        }
    }
    else {
        updateHost(WIP);
    }
    WIP.dirty = WIP.dirty ? false : 0;
    commitQueue.push(WIP);
    if (WIP.child)
        return WIP.child;
    while (WIP) {
        if (!preCommit && WIP.dirty === false) {
            preCommit = WIP;
            return null;
        }
        if (WIP.sibling) {
            return WIP.sibling;
        }
        WIP = WIP.parent;
    }
};
const updateHook = (WIP) => {
    currentFiber = WIP;
    resetCursor();
    let children = WIP.type(WIP.props);
    if (isStr(children))
        children = createText(children);
    reconcileChildren(WIP, children);
};
const updateHost = (WIP) => {
    if (!WIP.node) {
        if (WIP.type === 'svg') {
            WIP.tag = 4;
        }
        WIP.node = createElement(WIP);
    }
    let p = WIP.parentNode || {};
    WIP.insertPoint = p.last || null;
    p.last = WIP;
    WIP.node.last = null;
    reconcileChildren(WIP, WIP.props.children);
};
const getParentNode = (WIP) => {
    while ((WIP = WIP.parent)) {
        if (!isFn(WIP.type))
            return WIP.node;
    }
};
const reconcileChildren = (WIP, children) => {
    delete WIP.child;
    const oldFibers = WIP.kids;
    const newFibers = (WIP.kids = hashfy(children));
    let reused = {};
    for (const k in oldFibers) {
        let newFiber = newFibers[k];
        let oldFiber = oldFibers[k];
        if (newFiber && newFiber.type === oldFiber.type) {
            reused[k] = oldFiber;
        }
        else {
            oldFiber.op = 3;
            commitQueue.push(oldFiber);
        }
    }
    let prevFiber;
    for (const k in newFibers) {
        let newFiber = newFibers[k];
        let oldFiber = reused[k];
        if (oldFiber) {
            oldFiber.op = 2;
            newFiber = Object.assign(Object.assign({}, oldFiber), newFiber);
            newFiber.lastProps = oldFiber.props;
            if (shouldPlace(newFiber))
                newFiber.op = 1;
        }
        else {
            newFiber.op = 1;
        }
        newFibers[k] = newFiber;
        newFiber.parent = WIP;
        if (prevFiber) {
            prevFiber.sibling = newFiber;
        }
        else {
            if (WIP.tag === 4) {
                newFiber.tag = 4;
            }
            WIP.child = newFiber;
        }
        prevFiber = newFiber;
    }
    if (prevFiber)
        prevFiber.sibling = null;
};
const shouldPlace = (fiber) => {
    let p = fiber.parent;
    if (isFn(p.type))
        return p.key && !p.dirty;
    return fiber.key;
};
const commitWork = (fiber) => {
    commitQueue.forEach(c => c.parent && commit(c));
    fiber.done && fiber.done();
    commitQueue.length = 0;
    preCommit = null;
    WIP = null;
};
const commit = (fiber) => {
    const { op, parentNode, node, ref, hooks } = fiber;
    if (op === 3) {
        hooks && hooks.list.forEach(cleanup);
        cleanupRef(fiber.kids);
        while (isFn(fiber.type))
            fiber = fiber.child;
        parentNode.removeChild(fiber.node);
    }
    else if (isFn(fiber.type)) {
        if (hooks) {
            side(hooks.layout);
            planWork(() => side(hooks.effect));
        }
    }
    else if (op === 2) {
        updateElement(node, fiber.lastProps, fiber.props);
    }
    else {
        let point = fiber.insertPoint ? fiber.insertPoint.node : null;
        let after = point ? point.nextSibling : parentNode.firstChild;
        if (after === node)
            return;
        if (after === null && node === parentNode.lastChild)
            return;
        parentNode.insertBefore(node, after);
    }
    refer(ref, node);
};
const hashfy = (c) => {
    const out = {};
    isArr(c)
        ? c.forEach((v, i) => isArr(v)
            ? v.forEach((vi, j) => (out[hs(i, j, vi.key)] = vi))
            : some(v) && (out[hs(i, null, v.key)] = v))
        : some(c) && (out[hs(0, null, c.key)] = c);
    return out;
};
const refer = (ref, dom) => {
    if (ref)
        isFn(ref) ? ref(dom) : (ref.current = dom);
};
const cleanupRef = (kids) => {
    for (const k in kids) {
        const kid = kids[k];
        refer(kid.ref, null);
        if (kid.kids)
            cleanupRef(kid.kids);
    }
};
const side = (effects) => {
    effects.forEach(cleanup);
    effects.forEach(effect);
    effects.length = 0;
};
const getCurrentFiber = () => currentFiber || null;
const effect = (e) => e[2] = e[0](currentFiber);
const cleanup = (e) => e[2] && e[2](currentFiber);
const isFn = (x) => typeof x === 'function';
const isStr = (s) => typeof s === 'number' || typeof s === 'string';
const some = (v) => v != null && v !== false && v !== true;
const hs = (i, j, k) => k != null && j != null
    ? '.' + i + '.' + k
    : j != null
        ? '.' + i + '.' + j
        : k != null
            ? '.' + k
            : '.' + i;

const h = function (type, attrs) {
    let props = attrs || {};
    let key = props.key || null;
    let ref = props.ref || null;
    let children = [];
    for (let i = 2; i < arguments.length; i++) {
        let vnode = arguments[i];
        if (some(vnode)) {
            while (isArr(vnode) && vnode.some(v => isArr(v))) {
                vnode = [].concat(...vnode);
            }
            if (isStr(vnode)) {
                vnode = createText(vnode);
            }
            children.push(vnode);
        }
    }
    if (children.length) {
        props.children = children.length === 1 ? children[0] : children;
    }
    delete props.key;
    delete props.ref;
    return { type, props, key, ref };
};
function createText(vnode) {
    return { type: 'text', props: { nodeValue: vnode } };
}
const Fragment = (props) => {
    return props.children;
};
const isArr = Array.isArray;

const Fre = {
    h,
    createElement: h,
    render,
    scheduleWork,
    useState,
    useReducer,
    useEffect,
    useMemo,
    useCallback,
    useRef,
    Fragment,
    getCurrentFiber,
    options
};

export default Fre;
export { Fragment, h as createElement, getCurrentFiber, h, options, render, scheduleWork, useCallback, useEffect, useLayout, useLayout as useLayoutEffect, useMemo, useReducer, useRef, useState };
//# sourceMappingURL=fre.esm.js.map
