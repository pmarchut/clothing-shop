/*
 PanelSrodkowy

 Sklep z odzieza - z wykorzystaniem Redux (implementacja w appredux)
 Stan nawigacji: (store.pageState)
 Wywołanie akcji: ??store.dispatch(??
   Actions.nazwaAkcj(<parametry>));
*/

import * as React from "react"

import { connect } from 'react-redux';

import { AppState } from '../appredux';

import Oferta from './Oferta';

class PanelSrodkowy extends React.Component<any, any>  {

    constructor(props : any) {
      super(props);
      this.state = {
        
      } 
    }    

    render = () => {

      return(
        <Oferta />
      )
    }
}

// połączenie z Redux
// wstrzykiwanie store.pageState do props.state
const mapStateToProps = (state : AppState) => ({
  page: state.pageState
});

export  default connect(mapStateToProps)(PanelSrodkowy);
 