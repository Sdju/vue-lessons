import { provide, inject } from 'vue'

const symbol = Symbol('theme')

export function defineTheme(theme: 'dark' | 'light') {
    provide(symbol, theme)
}

export function useTheme(): 'dark' | 'light' {
    return 
}
