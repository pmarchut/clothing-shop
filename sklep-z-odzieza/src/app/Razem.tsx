import * as React from "react"

import { connect } from 'react-redux';

import { AppState } from '../appredux';

import { Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import FormLabel from '@material-ui/core/FormLabel';

import { Theme, withStyles } from "@material-ui/core/styles";

interface RazemProps {
    classes? : any,
    page? : any
}

class Razem extends React.Component<RazemProps, any>  {

    constructor(props : any) {
      super(props);
      this.state = {
        
      } 
    }    

    render = () => {
    const { classes } = this.props;
    let sum : number =0;
    
    for (const itm of this.props.page.koszyk)
      sum = sum + parseInt(itm.produkt.cena);

      return(
        <Paper className={classes.paper} elevation={4}>
            <Typography gutterBottom component="h2" variant="h5" color="primary">
              <FormLabel color='secondary' 
                        classes={{colorSecondary: classes.secondary}}>
                <b>Razem:</b>
              </FormLabel>
              <b className={classes.sum}>{sum + ',00 zł'}</b>      
            </Typography>  
        </Paper>
      )
    }
}

const styles = (theme : Theme) => ({
    paper: {
      marginBottom:"1em",
      paddingLeft: "14px",
      paddingRight: "14px",
      textAlign: 'initial' as 'initial'
    },
    sum: {
      float: 'right' as 'right'
    },
    secondary: {
      color: theme.palette.secondary.main
    }
});

// połączenie z Redux
// wstrzykiwanie store.pageState do props.state
const mapStateToProps = (state : AppState) => ({
  page: state.pageState
});

export default connect(mapStateToProps)(withStyles(styles)(Razem));