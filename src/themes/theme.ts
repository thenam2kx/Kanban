import { alpha, createTheme } from '@mui/material/styles'
import { brand, gray, green, orange, red } from './color.custom'
import { typography } from './custom.typography';

declare module '@mui/material/styles' {
  interface Theme {
    nexthub: {
      appHeader: string
      appFooter: string
      appAside: string
    };
  }
  interface ThemeOptions {
    nexthub?: {
      appHeader?: string
      appFooter?: string
      appAside?: string
    };
  }
}

const APP_HEADER = '56px'
const APP_FOOTER = '40px'
const APP_ASIDE = '360px'

// A custom theme for this app
const theme = createTheme({
  nexthub: {
    appHeader: APP_HEADER,
    appFooter: APP_FOOTER,
    appAside: APP_ASIDE
  },

  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: brand[400],
          light: brand[200],
          dark: brand[700],
          contrastText: brand[50]
        },
        secondary: {
          main: '#14171A'
        },
        background: {
          default: '#F5F8FA',
          paper: '#FFFFFF'
        },
        info: {
          light: brand[100],
          main: brand[300],
          dark: brand[600],
          contrastText: gray[50]
        },
        warning: {
          light: orange[300],
          main: orange[400],
          dark: orange[800]
        },
        error: {
          light: red[300],
          main: red[400],
          dark: red[800]
        },
        success: {
          light: green[300],
          main: green[400],
          dark: green[800]
        },
        grey: {
          ...gray
        },
        divider: alpha(gray[300], 0.4),
        text: {
          primary: gray[800],
          secondary: gray[600]
        },
        action: {
          hover: alpha(gray[200], 0.2),
          selected: alpha(gray[200], 0.3)
        }
      }
    },
    dark: {
      palette: {
        primary: {
          main: '#1DA1F2'
        },
        secondary: {
          main: '#AAB8C2'
        },
        background: {
          default: '#15202B',
          paper: '#192734'
        },
        text: {
          primary: '#E1E8ED',
          secondary: '#AAB8C2'
        },
        info: {
          contrastText: brand[300],
          light: brand[500],
          main: brand[700],
          dark: brand[900]
        },
        warning: {
          light: orange[400],
          main: orange[500],
          dark: orange[700]
        },
        error: {
          light: red[400],
          main: red[500],
          dark: red[700]
        },
        success: {
          light: green[400],
          main: green[500],
          dark: green[700]
        },
        grey: {
          ...gray
        },
        divider: alpha(gray[700], 0.6),
        action: {
          hover: alpha(gray[600], 0.2),
          selected: alpha(gray[600], 0.3)
        }
      }
    }
  },

  typography: {
    ...typography
  },

  shape: {
    borderRadius: 4
  },

  components: {
    // MuiButton: {
    //   styleOverrides: {
    //     root: {
    //       textTransform: 'none',
    //       borderWidth: '0.5px',
    //       '&:hover': { borderWidth: '1px' }
    //     }
    //   }
    // },

    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth'
        },
        body: {
          '*::-webkit-scrollbar': {
            width: '6px',
            height: '6px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#092454',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#002467',
            cursor: 'pointer'
          },
          // '*': {
          //   scrollbarWidth: 'thin',
          //   borderRadius: '8px',
          //   scrollbarColor: '#8750f7 #2a1454'
          // }
          scrollbarWidth: 'thin',
          scrollbarColor: '#8750f7 #2a1454'
        }
      }
    }
  }
})

export default theme