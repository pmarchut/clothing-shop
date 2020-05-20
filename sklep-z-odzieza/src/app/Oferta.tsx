/*
 Oferta

 Przegląd oferty
*/

import React from 'react';

import { connect } from 'react-redux';

import { Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { Theme, withStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';

import { Koszyk1, 
  AppState, Actions, store } from '../appredux';

import { ListaProduktow, Produkt, produktService } from '../api';

// import { lista_prodoktow } from './ListaProduktow';
// import { galeria } from './Galeria';

import KartaProdukt from './KartaProdukt';

interface OfertaProps {
  classes? : any,
  page? : any
}

type OfertaState = {
  ladowanie: boolean,
  listaProduktowFilter: ListaProduktow
}

const comparator = (prop : any, desc : boolean = true, numeric : boolean = false) => (a : any, b : any) => {  
  const order = desc ? -1 : 1;
  const aprop = numeric ? parseInt(a[prop]) : a[prop];
  const bprop = numeric ? parseInt(b[prop]) : b[prop];
  if (aprop < bprop) {    
    return -1 * order;  
  }
  if (aprop > bprop) {    
    return 1 * order;  
  }
  return 0 * order; 
}

class Oferta extends React.Component<OfertaProps, OfertaState> {

    constructor(props : any) {
        super(props);
        this.state = {
          ladowanie: true,
          listaProduktowFilter: []
        } 
    }
    
    Ladowanie = () => {  
      const classes = this.props.classes;
  
      return this.state.ladowanie ? (    
        <CircularProgress className={classes.progress} />  
        ) : null; 
    }

    filtruj() {
      if(this.props.page.szukaj)
        this.setState({ ...this.state, listaProduktowFilter: 
          this.props.page.listaProduktow
            .filter((produkt: Produkt) => 
            !this.props.page.szukaj || 
            produkt.nazwa.toLowerCase().includes(this.props.page.szukaj)) });
      else if(this.props.page.pokazBestsellery)
        this.setState({ ...this.state, listaProduktowFilter: 
          this.props.page.listaProduktow
            .filter((produkt: Produkt) => produkt.bestseller) });
      else if(this.props.page.filtrujPoKategorii)
        this.setState({ ...this.state, listaProduktowFilter: 
          this.props.page.listaProduktow
            .filter((produkt: Produkt) => produkt.kategoriaId === this.props.page.filtrujPoKategorii) })
      else if(this.props.page.filtrujPoPodkategorii)
        this.setState({ ...this.state, listaProduktowFilter: 
          this.props.page.listaProduktow
            .filter((produkt: Produkt) => produkt.podkategoriaId === this.props.page.filtrujPoPodkategorii) })
    }

    filtrujExtra(lista_prodoktow : ListaProduktow) : ListaProduktow {
      if(parseInt(this.props.page.do))
        lista_prodoktow = lista_prodoktow
          .filter((produkt: Produkt) => 
            parseInt(produkt.cena) >= this.props.page.od && 
            parseInt(produkt.cena) <= this.props.page.do);

      if(this.props.page.sortujPo !== '')
        lista_prodoktow = lista_prodoktow
          .slice()        
            .sort(          
              comparator(            
                this.props.page.sortuj.sortujPo,            
                this.props.page.sortuj.desc,
                this.props.page.sortuj.numeric
            ));

      return lista_prodoktow;
    }

    async pobierzListeProdoktow() {
      produktService.getProdukty
          ({})
          .then(
              (res : ListaProduktow) => {
                store.dispatch(Actions.pageState.setListaProduktow(res));
                this.filtruj();
                this.setState({ ...this.state, ladowanie: false });     
              }
          ).catch( console.error  );
      // new Promise<ListaProduktow>(resolve => {
      //   setTimeout(() => resolve(lista_prodoktow), 1000);
      // }).then(lista_prodoktow => {
      //   store.dispatch(Actions.pageState.setListaProduktow(lista_prodoktow));
      //   this.filtruj();
      //   this.setState({ ...this.state, ladowanie: false });
      // });
    }

    // async pobierzGalerie() {
    //   new Promise<Galeria>(resolve => {
    //     setTimeout(() => resolve(galeria), 1000);
    //   }).then(galeria => {
    //     store.dispatch(Actions.pageState.setGaleria(galeria));
    //   });
    // }
  
    componentDidMount(){
      this.pobierzListeProdoktow();     
    }

    componentDidUpdate(prevProps: OfertaProps){
      if(this.props.page.panelSrodkowyTytul !== prevProps.page.panelSrodkowyTytul 
        || this.props.page.szukaj !== prevProps.page.szukaj
        || this.props.page.od !== prevProps.page.od
        || this.props.page.do !== prevProps.page.do
        || this.props.page.sortujPo !== prevProps.page.sortujPo){
          this.filtruj();
        }
        
    }
     
    render = () => {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper} elevation={4}>
          <Typography gutterBottom component="h2" variant="h5" color="primary" 
                      className={classes.tytul}>
            <b>{this.props.page.panelSrodkowyTytul}</b>      
          </Typography>  
        </Paper>
        {this.props.page.pokazKoszyk?
        this.props.page.koszyk.map((koszyk1: Koszyk1, index: any) => (
          <KartaProdukt produkt={koszyk1.produkt} key={index} index={index} 
                        rozmiar={koszyk1.wybranyRozmiar} /> 
        )) : 
        this.filtrujExtra(this.state.listaProduktowFilter)
          .map((produkt: Produkt, index: any) => (
          <KartaProdukt produkt={produkt} key={produkt.id} index={index} /> 
        ))}
        {this.Ladowanie()}
      </div>  
    );
 }
}

const styles = (theme : Theme) => ({
  paper: {
    marginBottom:"1em",
    paddingLeft: "14px",
    textAlign: 'initial' as 'initial'
  },  
  tytul: {
    margin: "0px"
  },
  progress: { 
    margin: theme.spacing(2) 
  },
  root: {
    textAlign: 'center' as 'center'
  } 
});

const mapStateToProps = (state : AppState) => ({
  page: state.pageState
});
 
export default connect(mapStateToProps)(withStyles(styles)(Oferta));
