import React, { Fragment } from 'react';

import { fade, Theme, withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ExpandLessIcon from '@material-ui/icons/ExpandLess'; 
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Drawer from '@material-ui/core/Drawer'; 
import List from '@material-ui/core/List'; 
import ListItem from '@material-ui/core/ListItem'; 
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputBase from '@material-ui/core/InputBase';
import MenuIcon from '@material-ui/icons/Menu'; 
import IconButton from '@material-ui/core/IconButton';

import { kategorie } from './app/Kategorie';
import { podkategorie } from './app/Podkategorie';

import { Kategoria, Podkategoria, Kategorie, Podkategorie, 
  AppState, Actions, store } from './appredux/index';

import PanelSrodkowy from './app/PanelSrodkowy';
import { AddItem } from './app/KartaProdukt';
import PanelPrawy from './app/PanelPrawy';
import PanelLewy from './app/PanelLewy';

import { connect } from 'react-redux';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import SearchIcon from '@material-ui/icons/Search';

interface AppProps {
  classes? : any,
  page? : any
}

type AppComponentState = {
  expanded: boolean;
  kategorie: any;
  podkategorie: any;
  ladowanie: boolean;
  szukaj: string;
  width: number;
}

const wciecie : string = '  * ';

const Draggable = (props: any) => {

  function onDragStart(e: React.DragEvent){
    if(props.obrazek){
      let img = new Image();
      img.src = props.obrazek;
      e.dataTransfer.setDragImage(img,10,10);
    }

    e.dataTransfer.setData('id', props.data.id);
    e.dataTransfer.setData('rozmiar', props.data.rozmiar);
  }

  return <div draggable='true' onDragStart={onDragStart}>{props.children}</div>
}

const Droppable = (props: any) => {

  function onDragOver(e: React.DragEvent){
    e.preventDefault();
  }

  function onDrop(e: React.DragEvent){
    let id = e.dataTransfer.getData('id');
    let rozmiar = e.dataTransfer.getData('rozmiar');
    props.onDrop(id, rozmiar, e);
  }

  return <div onDragOver={onDragOver} onDrop={onDrop}
              className={props.className}>{props.children}</div>
}

class App extends React.Component<AppProps, AppComponentState> {

  constructor(props: AppProps) {
    super(props);
    this.state = {
      expanded: false,
      kategorie: [],
      podkategorie: [],
      ladowanie: true,
      szukaj: '',
      width: window.innerWidth
    };
  }

  toggleExpanded = () => {
    this.setState({ ...this.state, expanded: !this.state.expanded });
  };

  onBestselleryClick = () => {
      store.dispatch(Actions.pageState.setFiltrujPoKategorii(0));
      store.dispatch(Actions.pageState.setPokazBestsellery(true));
      store.dispatch(Actions.pageState.setFiltrujPoPodkategorii(0));
      store.dispatch(Actions.pageState.setPokazKoszyk(false));
      store.dispatch(Actions.pageState.setPanelSrodkowyTytul('Bestsellery'));

        if(this.state.width <= 600)
          this.toggleExpanded();
  };

  ExpandIcon = (expanded: boolean | undefined) => {
    return expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />;
  }

  NavListItem = (text: string, kategoriaId: number) => {
    return (   
        <ListItem button key={kategoriaId}
                  onClick={() => {
                    store.dispatch(Actions.pageState.setFiltrujPoKategorii(kategoriaId));
                    store.dispatch(Actions.pageState.setPokazBestsellery(false));
                    store.dispatch(Actions.pageState.setFiltrujPoPodkategorii(0));
                    store.dispatch(Actions.pageState.setPokazKoszyk(false));
                    store.dispatch(Actions.pageState.setPanelSrodkowyTytul(text));

                      if(this.state.width <= 600)
                        this.toggleExpanded();
                    }}>      
          <ListItemText>{text}</ListItemText>    
        </ListItem> 
    ) 
  }

  ListItems = ( kategoriaId: number/*, onClick*/ ) => {
    const classes = this.props.classes

    return( 
      this.state.podkategorie
        .filter((podkategoria: Podkategoria) => podkategoria.kategoriaId === kategoriaId)
        .map((podkategoria: Podkategoria, index: any) => (      
          <ListItem button key={podkategoria.id} className={classes.pre} 
                    onClick={() => {
                      store.dispatch(Actions.pageState.setFiltrujPoKategorii(0));
                      store.dispatch(Actions.pageState.setPokazBestsellery(false));
                      store.dispatch(Actions.pageState.setFiltrujPoPodkategorii(podkategoria.id));
                      store.dispatch(Actions.pageState.setPokazKoszyk(false));
                      store.dispatch(Actions.pageState.setPanelSrodkowyTytul(podkategoria.nazwa));

                        if(this.state.width <= 600)
                          this.toggleExpanded();
                      }}>        
            <ListItemText>{wciecie + podkategoria.nazwa}</ListItemText>      
          </ListItem>    
    ))) 
  }

  Ladowanie = () => {  
    const classes = this.props.classes;

    return this.state.ladowanie ? (    
      <CircularProgress className={classes.progress} />  
      ) : null; 
  }

  async pobierzKategorie() {
    new Promise<Kategorie>(resolve => {
      setTimeout(() => resolve(kategorie), 1000);
    }).then(kategorie => {
      this.setState({ ...this.state, kategorie: kategorie });
    });
    new Promise<Podkategorie>(resolve => {
      setTimeout(() => resolve(podkategorie), 1000);
    }).then(podkategorie => {
      this.setState({ ...this.state, podkategorie: podkategorie, ladowanie: false });
    });
  }

  onSzukajChange = (event: React.ChangeEvent<{ name?: string; value: any }>) => {
    this.setState({ ...this.state, szukaj: event.target.value });
    
    setTimeout(() => {
      if(this.state.szukaj.length > 2){
        store.dispatch(Actions.pageState.setSzukaj(this.state.szukaj.toLowerCase()));
        store.dispatch(Actions.pageState.setPokazKoszyk(false));
        store.dispatch(Actions.pageState.setPanelSrodkowyTytul('Wyniki wyszukiwania'));
      }  
      else if(this.props.page.szukaj !== ''){
        store.dispatch(Actions.pageState.setSzukaj(''));

          if(!this.props.page.pokazKoszyk){
          store.dispatch(Actions.pageState.setPokazBestsellery(true));
          store.dispatch(Actions.pageState.setPanelSrodkowyTytul('Bestsellery'));
        }
      }  
    }, 1000);    
  }

  updateWindowWidth = () => {
    this.setState({ ...this.state, width: window.innerWidth });
  }

  componentDidMount(){
    this.updateWindowWidth();
    window.addEventListener('resize', this.updateWindowWidth);
    this.pobierzKategorie();
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.aboveDrawer}>
          <Toolbar>
            {this.state.width <= 600 ? 
              <IconButton                
                className={classes.title}                
                color="inherit"                
                aria-label="Menu"                
                onClick={this.toggleExpanded}              
                >
                <MenuIcon />              
              </IconButton> : null}
            <Typography
              variant="h6"
              component="h2"
              color="inherit"
              className={classes.title}
            >
              <b>ClothingShop</b>
            </Typography>
            {this.state.width <= 600? null :
            <Fragment> 
              <Button color="inherit" onClick={this.toggleExpanded} 
                      className={classes.flex}>
                Kategorie
                {this.ExpandIcon(this.state.expanded)}    
              </Button>
              <Button color="inherit" 
                      onClick={this.onBestselleryClick}>
                Bestsellery
              </Button>
            </Fragment>}
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Szukaj…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'szukaj' }}
                value={this.state.szukaj}
                onChange={this.onSzukajChange}
              />
            </div>
            <Droppable onDrop={(id: string, rozmiar: string) => AddItem(parseInt(id), rozmiar)}
                      className={classes.koszyk}>
              <Button color="inherit" className={classes.pre}
                      onClick={() => {
                        store.dispatch(Actions.pageState.setPokazKoszyk(true));
                        store.dispatch(Actions.pageState.setPanelSrodkowyTytul('Koszyk'));
                        }}>
                <ShoppingCartIcon />  
                {' Koszyk ' + this.props.page.koszyk.length}   
              </Button>
            </Droppable>
          </Toolbar>
        </AppBar>
        <div className={classes.toolbarMargin} />
        <Drawer open={this.state.expanded} onClose={this.toggleExpanded} 
                variant="persistent">
          <div className={classes.toolbarMargin} />
          <List>
            {this.state.width <= 600? 
            <ListItem button key={0}
                      onClick={this.onBestselleryClick}>      
              <ListItemText>Bestsellery</ListItemText>    
            </ListItem> : null}
            {this.state.kategorie.map((kategoria: Kategoria, index: any) => (
              <Fragment key={kategoria.id}>
                {this.NavListItem(kategoria.nazwa, kategoria.id)}
                {this.ListItems(kategoria.id)}
              </Fragment>  
            ))}
          </List>
          {this.Ladowanie()}
        </Drawer>
        <Grid container spacing={1} className={classes.container} style={{width: "100%"}}>
          <Grid item xs={12} sm={3} className={classes.leftPanel} style={{paddingLeft: "15px"}} >
            <div className={classes.leftPanelInner}>
              <PanelLewy />
            </div>
          </Grid>
          <Grid item xs={12} sm={6} style={{paddingLeft: "15px"}}>
            <PanelSrodkowy />
          </Grid>
          <Grid item xs={12} sm={3} className={classes.rightPanel} style={{paddingLeft: "15px", paddingRight: "15px"}}>
            <div className={classes.leftRightInner}>
              <PanelPrawy />    
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  root: { 
    backgroundColor: theme.palette.background.paper
  },
  koszyk: {
    marginLeft: 'auto'
  },
  title: {
    marginLeft: -12,    
    marginRight: 20
  },  
  toolbarMargin: theme.mixins.toolbar,
  aboveDrawer: {  
    zIndex: theme.zIndex.drawer + 1 
  },
  pre: {
    whiteSpace: 'pre' as 'pre'
  },
  container: {
    margin: "0em",
    paddingTop: "1em",
    padding:'0em',
  },
  progress: { 
    margin: theme.spacing(2) 
  },
  leftPanel: {
    paddingTop: '2px!important',
  },
  rightPanel: {
    paddingTop: '2px!important'
  },
  leftPanelInner: {
    width: '100%',
    marginLeft:"0.5em",
    marginRight:"0.5em",
  },
  search: {
    position: 'relative' as 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute' as 'absolute',
    pointerEvents: 'none' as 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  }  
});

const mapStateToProps = (state : AppState) => ({
  page: state.pageState
});

export default connect(mapStateToProps)(withStyles(styles)(App));

export {Draggable}