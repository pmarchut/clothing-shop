/*
 PanelLewy

 Sklep z odzieza - z wykorzystaniem Redux (implementacja w appredux)
 Stan nawigacji: (store.pageState)
 Wywołanie akcji: ??store.dispatch(??
   Actions.nazwaAkcj(<parametry>));
*/

import * as React from "react"

import { connect } from 'react-redux';

import { AppState } from '../appredux';

import FiltrujExtra from './FiltrujExtra';

interface PanelLewyProps {
    page? : any
}

class PanelLewy extends React.Component<PanelLewyProps, any>  {

    constructor(props : any) {
      super(props);
      this.state = {
        
      } 
    }    

    render = () => {

        return(
            <FiltrujExtra />
        )
    }
}

// połączenie z Redux
// wstrzykiwanie store.pageState do props.state
const mapStateToProps = (state : AppState) => ({
  page: state.pageState
});

export  default connect(mapStateToProps)(PanelLewy);