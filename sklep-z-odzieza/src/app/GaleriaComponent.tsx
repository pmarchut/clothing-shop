import React, { Fragment } from 'react';
import Viewer from 'react-viewer';
import Button from '@material-ui/core/Button';

import { AppState, store } from '../appredux'
import { connect } from 'react-redux';

import theme from '../themes';

export interface GaleriaProps {
  page? : any,
  title : string,
  produktId : number,
  produktNazwa : string
}

type TImage = {
    src: string;
    alt: string;
}

type GaleriaState = {
   visible : boolean;
   images? : TImage[];
}

class GaleriaComponent extends React.Component<GaleriaProps, GaleriaState> {

  constructor(props : GaleriaProps) {
    super(props, {});
    this.state = {
      visible: false,
      images: []
    };
  }
  
  prepare() {
    let gal = store.getState().pageState.galeria;
    const index : number = gal.findIndex(item => item.id === this.props.produktId)
    
      if(index > 0){ 
        let images : TImage[] = [];
        if (gal[index].obrazki)
          for (const g of gal[index].obrazki) {
            images.push({
              src: g.src,
              alt: this.props.produktNazwa
            });
          }
        this.setState({ ...this.state, visible: true, images: images});
      } 
  }

switchVisible(newVisible : boolean) {
  if (newVisible !== this.state.visible) {
    if(newVisible) this.prepare();
    else this.setState({...this.state, visible:newVisible});
  }
}  

  render() {
      return (
        <Fragment>
          <Button variant='text' size='small' color='primary'
                  onClick={ () => { this.switchVisible( true ); } }>
            <b>{ this.props.title }</b>
          </Button>   
          <Viewer
                visible={this.state.visible}
                onClose={() => { this.switchVisible( false ); } }
                images={this.state.images}
                onMaskClick={() => { this.switchVisible( false ); } }
                zIndex={theme.zIndex.drawer + 2}
          />
        </Fragment>    
      )
  }
}

const mapStateToProps = (state : AppState) => ({
  page: state.pageState
});

export default 
  connect(mapStateToProps)(GaleriaComponent);
