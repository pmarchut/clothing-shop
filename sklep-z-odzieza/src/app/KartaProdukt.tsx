//import Icon from '@material-ui/core/Icon';
//import FontIcon from '@material-ui/core/FontIcon';
// FontIcon wymaga dod. google Module not found: Can't resolve '@material-ui/core/FontIcon'
// https://material-ui.com/style/icons/
/*
import SvgIcon from '@material-ui/core/SvgIcon';
  <SvgIcon>
    <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
  </SvgIcon>
*/

import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { Button } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import { Theme } from "@material-ui/core/styles";

import { Produkt, AppState, Actions, store, Koszyk1 } from '../appredux';

import DialogOK from './DialogOK';
import GaleriaComponent from './GaleriaComponent';

import { connect } from 'react-redux';

import { Draggable } from '../App';

interface KartaProduktProps {
    classes? : any,
    produkt : Produkt,
    page? : any,
    rozmiar? : string,
    index : number 
}

type KartaProduktState = {
  rozmiar: string,
  dialogOpen: boolean
}

const AddItem = (id: number, rozmiar : string) : any => {
  let lista_produktow = store.getState().pageState.listaProduktow;
  let koszyk = store.getState().pageState.koszyk;
  const index = lista_produktow.findIndex(produkt => produkt.id === id);

    if (index<0) return;

  const koszyk1 : Koszyk1 = {
      produkt: lista_produktow[index],
      wybranyRozmiar: rozmiar       
  };

  koszyk.push(koszyk1);
  store.dispatch(Actions.pageState.updateKoszyk(koszyk));
}

const UpdateItemRozmiar = (id: number, rozmiar : string) : any => {
  let koszyk = store.getState().pageState.koszyk;

    if (id<0) return;

  koszyk[id].wybranyRozmiar = rozmiar;       
  store.dispatch(Actions.pageState.updateKoszyk(koszyk));
}

const  DelItem = (id: number) : any => {
  let koszyk = store.getState().pageState.koszyk;

  if (id > -1) {
    koszyk.splice(id, 1);
  }

  store.dispatch(Actions.pageState.updateKoszyk(koszyk));
}

class KartaProdukt extends React.Component<KartaProduktProps, KartaProduktState> {

  constructor(props : KartaProduktProps) {
    super(props);
    this.state = {
      rozmiar: (props.page.pokazKoszyk && props.rozmiar)? props.rozmiar : props.produkt.rozmiary[0],
      dialogOpen: false
    }
  }

  zmienRozmiar = (event: React.ChangeEvent<{ name?: string; value: any }>) => {
    if(this.props.page.pokazKoszyk)
      UpdateItemRozmiar(this.props.index, event.target.value);

    this.setState({
      ...this.setState,
      rozmiar: event.target.value,
    });
  }

  onDialogOpen = () => {    
    this.setState({
      ...this.setState,
      dialogOpen: true
    });  
  };

  onDialogClose = () => {    
    this.setState({
      ...this.setState,
      dialogOpen: false
    });
  }

  componentDidUpdate(){
    if(this.props.rozmiar)
      if(this.state.rozmiar !== this.props.rozmiar)
        this.setState({
          ...this.setState,
          rozmiar: this.props.rozmiar
        });
  }

  render(){
    const { classes }  = this.props;

    return (
      <Draggable data={{id: this.props.produkt.id, rozmiar: this.state.rozmiar}}
                obrazek={this.props.produkt.obrazek}>
        <div className={classes.root} >
          <DialogOK open={this.state.dialogOpen} onClose={this.onDialogClose} 
                    title={this.props.produkt.nazwa} 
                    dialogContent={this.props.produkt.opisPunkty} />
          <Card className={classes.card} elevation={4}>
            <Grid container spacing={2}>
              <Grid item>
                <CardMedia
                  className={classes.cover}
                  image={this.props.produkt.obrazek}
                  title={this.props.produkt.nazwa}
                />
              </Grid>
              <Grid item xs={12} sm container>
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item xs>
                    <CardHeader title={this.props.produkt.nazwa} />
                    <CardContent>
                      <Typography>
                        {this.props.produkt.opis}
                      </Typography>
                    </CardContent> 
                  </Grid>
                  <Grid item xs>
                    <CardActions className={classes.actions}>
                      <Button variant='text' size='small' color='primary'
                              onClick={this.onDialogOpen}>
                        <b>Szczegóły</b>
                      </Button>
                      <GaleriaComponent title='Zdjęcia' 
                                        produktId={this.props.produkt.id} 
                                        produktNazwa={this.props.produkt.nazwa}/>
                      {this.props.page.pokazKoszyk?
                      <Button variant='contained' size='small' color='secondary'
                              onClick={() => DelItem(this.props.index)}>
                        <b>Usuń z koszyka</b>
                      </Button> :
                      <Button variant='contained' size='small' color='primary'
                              onClick={() => AddItem(this.props.produkt.id, this.state.rozmiar)}>
                        <b>Dodaj do koszyka</b>
                      </Button>}
                    </CardActions>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1"
                              style={{width: '95.525px'}}>{this.props.produkt.cena}</Typography>
                  {this.props.produkt.rozmiary.length !== 0? 
                (<FormControl className={classes.formControl}>
                    <InputLabel shrink>
                      Rozmiar
                    </InputLabel>
                    <Select value={this.state.rozmiar}
                          onChange={this.zmienRozmiar}
                          style={{width: '79.525px'}}
                          input={<OutlinedInput labelWidth={0}/>}
                        > 
                          {this.props.produkt.rozmiary.map((rozmiar: string, index: any) => (
                            <MenuItem value={rozmiar} key={rozmiar}>{rozmiar}</MenuItem> 
                          ))}             
                    </Select>
                  </FormControl>) : null}  
                </Grid> 
              </Grid>       
            </Grid>
          </Card>
        </div>
      </Draggable>  
    );
  }
}

const styles = (theme : Theme) => ({
  card: {
      padding: theme.spacing(2),
      margin: 'auto',
      marginBottom: '1em'
  },
  cover: {
    width: 151,
    height: 226.5
  },
  root: {
    flexGrow: 1
  },
  formControl: {
    margin: theme.spacing(1)
  },
  actions: {
    justifyContent: 'center'
  }
});

const mapStateToProps = (state : AppState) => ({
  page: state.pageState
});
 
export default connect(mapStateToProps)(withStyles(styles)(KartaProdukt));

export {AddItem}