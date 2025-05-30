/* eslint-disable @typescript-eslint/no-explicit-any */
import type resq from 'resq'

interface CustomWindow extends Window {
    resq: typeof resq
}

declare let window: CustomWindow

export const waitToLoadReact = function waitToLoadReact () {
    window.resq.waitToLoadReact()
}

export const react$ = function react$ (
    selector: string,
    props: Record<string, unknown>,
    state: Record<string, unknown>,
    reactElement?: HTMLElement
) {
    props = props || {}
    state = state || {}

    let element = window.resq.resq$(selector, reactElement)

    if (Object.keys(props).length) {
        // not yet typed https://github.com/baruchvlz/resq/issues/69
        element = (element as any).byProps(props)
    }

    if (Object.keys(state).length) {
        // not yet typed https://github.com/baruchvlz/resq/issues/69
        element = (element as any).byState(state)
    }

    if (!element.name) {
        return { message: `React element with selector "${selector}" wasn't found` }
    }

    // resq returns an array of HTMLElements if the React component is a fragment
    // if the element is a fragment, we return the first child to be passed into the driver
    return element.isFragment && element.node
        ? (element.node as unknown as HTMLElement[])[0]
        : element.node
}

export const react$$ = function react$$ (
    selector: string,
    props: Record<string, unknown>,
    state: Record<string, unknown>,
    reactElement?: HTMLElement
) {
    let elements = window.resq.resq$$(selector, reactElement)

    if (Object.keys(props).length) {
        // not yet typed https://github.com/baruchvlz/resq/issues/69
        elements = (elements as any).byProps(props)
    }

    if (Object.keys(state).length) {
        // not yet typed https://github.com/baruchvlz/resq/issues/69
        elements = (elements as any).byState(state)
    }

    if (!elements.length) {
        return []
    }

    // resq returns an array of HTMLElements if the React component is a fragment
    // this avoids having nested arrays of nodes which the driver does not understand
    // [[div, div], [div, div]] => [div, div, div, div]
    let nodes: HTMLElement[] = []

    elements.forEach(function (element) {
        if (element.isFragment) {
            nodes = nodes.concat(element.node || [])
        } else if (element.node) {
            nodes.push(element.node)
        }
    })

    return [...nodes]
}
