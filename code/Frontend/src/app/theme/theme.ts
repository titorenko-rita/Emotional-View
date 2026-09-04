import { MantineThemeOverride } from '@mantine/core'

export const theme: MantineThemeOverride = {
    colorScheme: 'light',
    colors: {
        __red: [
            "#ffece7",
            "#ffd8d3",
            "#f4b1a8",
            "#eb8778",
            "#e46351",
            "#e04c37",
            "#df4029",
            "#c5321d",
            "#b12a18",
            "#9b1e11"
        ],
        __darkBrown: [
            "#f9f3f1",
            "#ece5e2",
            "#dac7bf",
            "#c9a89a",
            "#bb8d79",
            "#b37c64",
            "#af745a",
            "#9a6249",
            "#8a5640",
            "#794934"
        ],
        __biege: [
            "#fff4e5",
            "#f6e6d8",
            "#e5ccb6",
            "#d4b08f",
            "#c6986f",
            "#be8959",
            "#ba824e",
            "#a46f3e",
            "#926234",
            "#805328"
        ],
        __black:[
            "#f2f6f3",
            "#d7e5dc",
            "#afc9b9",
            "#87ad96",
            "#638d75",
            "#426c57",
            "#235347",
            "#163832",
            "#0B2B26",
            "#051F20"
        ],
        __green: [
            "#DAF1DE",
            "#CBE5D0",
            "#8EB69B",
            "#79A68A",
            "#5D8B73",
            "#3F6E5B",
            "#235347",
            "#163832",
            "#0B2B26",
            "#051F20"
        ],

    },
    primaryColor: '__green',
    white: '#fff',
    black: '#2C2A29',
    fontFamily: 'Verdana, sans-serif',
    fontFamilyMonospace: 'Monaco, Courier, monospace',
    headings: { fontFamily: 'Verdana, sans-serif', fontWeight: 500 },
    fontSizes: {
        xs: '0.6rem',
        sm: '0.75rem',
        md: '0.9rem',
        lg: '1rem',
        xl: '1.2rem',
    },
    components: {
        Button: {
            styles: {
                root: {
                    borderRadius: 6,
                    boxShadow: '0 3px 10px rgba(5, 31, 32, 0.12)',
                    transition: 'background-color 180ms ease, box-shadow 180ms ease, transform 180ms ease, filter 180ms ease',
                    '&:hover': {
                        backgroundColor: '#0B2B26',
                        boxShadow: '0 8px 18px rgba(5, 31, 32, 0.18)',
                        filter: 'saturate(1.08)',
                        transform: 'translateY(-2px)',
                    },
                    '&:active': {
                        boxShadow: '0 3px 8px rgba(5, 31, 32, 0.16)',
                        transform: 'translateY(0) scale(0.98)',
                    },
                },
                label: {
                    fontSize: '0.9rem',
                    fontWeight: 700,
                },
            },
        },
        Paper: {
            styles: {
                root: {
                    borderColor: '#8EB69B',
                    backgroundColor: '#DAF1DE',
                    boxShadow: '0 14px 34px rgba(5, 31, 32, 0.08)',
                },
            },
        },
        Input: {
            styles: {
                input: {
                    borderColor: '#8DBB99',
                    '&:focus': {
                        borderColor: '#235347',
                        boxShadow: '0 0 0 2px rgba(35, 83, 71, 0.12)',
                    },
                },
            },
        },
        AppShell: {
            styles: {
                main: {
                    padding: 0,
                },
            },
        },
    },
}
