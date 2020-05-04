/*
 
Skórki Material


*/

import * as M from '@material-ui/core';
import { red } from '@material-ui/core/colors';

const theme = M.createMuiTheme({
    palette: {   
        type: "dark", 
        primary: { main: "rgb(56, 142, 60)" },    
        secondary: { main: "rgb(255, 64, 129)" },
        error: { main: red[600]}  
    },
 }
)
  
export default theme
