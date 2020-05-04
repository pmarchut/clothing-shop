import * as React from "react"

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import { withStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';

import { AppState } from '../appredux'

import { connect } from 'react-redux';

type opisPunkt = {
  punkt: string
}

type opisPunkty = opisPunkt[]

type ModalProps = {
    classes? : any,
    title? : string,
    page? : any,
    dialogContent : opisPunkty,
    open : boolean,
    onClose? : any
}

const wciecie : string = '  * ';

class DialogOK extends React.Component<ModalProps, any> {
     
    render() {
      const classes = this.props.classes;
       
      return (
    <Dialog
      onClose={this.props.onClose}
      maxWidth="xs"
      open={this.props.open}
    >
      <DialogTitle disableTypography>
        <Typography variant="h6" component="h2" color="primary">
          <b>{this.props.title}</b>
        </Typography>
        <hr className={classes.hr} />
      </DialogTitle>
      <DialogContent>
        {this.props.dialogContent.map((text: any, index: any) => (
          <DialogContentText key={index}>
            {wciecie + text.punkt}
          </DialogContentText>      
        ))} 
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" size="small"
                onClick={this.props.onClose}>
          <b>ok</b>
        </Button>      
      </DialogActions>     
    </Dialog>
      ); 
    }
  }

  const styles = (theme : Theme) => ({
    hr: {
      marginTop: '10px'
    }  
});
  
const mapStateToProps = (state : AppState) => ({
  page: state.pageState
});

export default connect(mapStateToProps)(withStyles(styles)(DialogOK));