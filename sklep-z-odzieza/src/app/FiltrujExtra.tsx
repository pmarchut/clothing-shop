import * as React from "react"

import { connect } from 'react-redux';

import { Paper } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import DialogActions from '@material-ui/core/DialogActions';
import { Button } from '@material-ui/core';

import { Theme, withStyles } from "@material-ui/core/styles";

import { AppState, Actions, store } from '../appredux';

interface FiltrujExtraProps {
    classes? : any,
    page? : any
}

type FiltrujExtraState = {
  od: number,
  do: number,
  sortujPo: string
}

class FiltrujExtra extends React.Component<FiltrujExtraProps, FiltrujExtraState>  {

    constructor(props : any) {
      super(props);
      this.state = {
        od: 0,
        do: 0,
        sortujPo: ''
      } 
    }
    
    zmienOd = (event: React.ChangeEvent<{ name?: string; value: any }>) => {
      if(event.target.value < 0)
        return;
  
      this.setState({
        ...this.setState,
        od: event.target.value,
      });
    }

    zmienDo = (event: React.ChangeEvent<{ name?: string; value: any }>) => {
      if(event.target.value < 0)
        return;
  
      this.setState({
        ...this.setState,
        do: event.target.value,
      });
    }

    zmienSortujPo = (event: React.ChangeEvent<{ name?: string; value: any }>) => {
      this.setState({
        ...this.setState,
        sortujPo: event.target.value,
      });
    }

    Filtruj = () => {
      store.dispatch(Actions.pageState.setOd(this.state.od));
      store.dispatch(Actions.pageState.setDo(this.state.do));

      if(this.state.sortujPo === 'Nazwa (A-Z)')
        store.dispatch(Actions.pageState.setSortuj({
          sortujPo: 'nazwa', desc: false, numeric: false}));
      else if(this.state.sortujPo === 'Nazwa (Z-A)')
        store.dispatch(Actions.pageState.setSortuj({
          sortujPo: 'nazwa', desc: true, numeric: false}));
      else if(this.state.sortujPo === 'Cena (od najniższej)')
        store.dispatch(Actions.pageState.setSortuj({
          sortujPo: 'cena', desc: false, numeric: true}));
      else if(this.state.sortujPo === 'Cena (od najwyższej)')
        store.dispatch(Actions.pageState.setSortuj({
          sortujPo: 'cena', desc: true, numeric: true}));
      else 
        store.dispatch(Actions.pageState.setSortuj({
          sortujPo: '', desc: true, numeric: false}));
    }

    render = () => {
    const { classes } = this.props;
    let sum : number = 0;
    
    for (const itm of this.props.page.koszyk)
      sum = sum + parseInt(itm.produkt.cena);

      return(
        <Paper className={classes.paper} elevation={4}>
          <FormControl margin='normal' className={classes.formControl}>
            <FormLabel className={classes.labelFirst}>Cena od</FormLabel>
            <TextField variant='outlined' type='number' 
                      className={classes.textField}
                      InputProps={{classes: {input: classes.textFieldInput}}}
                      value={this.state.od}
                      onChange={this.zmienOd}/>
            <FormLabel>do</FormLabel>
            <TextField variant='outlined' type='number' 
                      className={classes.textField}
                      InputProps={{classes: {input: classes.textFieldInput}}}
                      value={this.state.do}
                      onChange={this.zmienDo}/>
          </FormControl>
          <FormControl margin='normal' style={{width: '100%'}}>
            <InputLabel shrink>
              Sortuj po
            </InputLabel>
            <Select 
              value={this.state.sortujPo}
              onChange={this.zmienSortujPo}
              input={<OutlinedInput labelWidth={0}/>}
              style={{width: '194px'}}
              renderValue={value => {return this.state.sortujPo?  
                          <div>{this.state.sortujPo}</div> : <div>Wybierz...</div>}}
              displayEmpty
            >
              <MenuItem value='Nie sortuj'>Nie sortuj</MenuItem> 
              <MenuItem value='Nazwa (A-Z)'>Nazwa (A-Z)</MenuItem>
              <MenuItem value='Nazwa (Z-A)'>Nazwa (Z-A)</MenuItem> 
              <MenuItem value='Cena (od najniższej)'>Cena (od najniższej)</MenuItem>
              <MenuItem value='Cena (od najwyższej)'>Cena (od najwyższej)</MenuItem>           
            </Select>
          </FormControl>
          <DialogActions>
            <Button 
              variant='outlined' color='secondary' size='small'
              onClick={this.Filtruj}
            >
              Filtruj
            </Button>
          </DialogActions>          
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
    },
    formControl: {
      flexDirection: 'row' as 'row',
      alignItems: 'center',
      //padding: theme.spacing(1, 0)
    },
    textField: {
      margin: '0px 12px'
    },
    textFieldInput: {
      padding: '6px 14px 7px'
    },
    labelFirst: {
      flex: 'none'
    }
});

// połączenie z Redux
// wstrzykiwanie store.pageState do props.state
const mapStateToProps = (state : AppState) => ({
  page: state.pageState
});

export default connect(mapStateToProps)(withStyles(styles)(FiltrujExtra));