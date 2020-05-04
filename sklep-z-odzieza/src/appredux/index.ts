/*
 Stan strony z ofertą / sklepem z odzieza
 
 Redux (z użyciem redux-compact)
 https://github.com/maciekwawro/redux-compact

 */

import { applyMiddleware, createStore, Store } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import { definition, create, combine, StateOf } from 'redux-compact';
import { setValueReducer } from 'redux-compact/plugins';

export type Kategoria = {
    id: number;
    nazwa: string;
  };
  
export type Podkategoria = {
    id: number;
    nazwa: string;
    kategoriaId: number;
};

type opisPunkt = {
    punkt: string;
}

export type Produkt = {
    id: number;
    nazwa: string;
    opis: string;
    opisPunkty: opisPunkt[];
    cena: string;
    rozmiary: string[];
    bestseller: boolean;
    obrazek: string;
    kategoriaId: number;
    podkategoriaId: number;
};

export type Obrazek = {
    src: string;
};

export type Galeria1 = {
    id: number,
    obrazki: Obrazek[]
}

export type Koszyk1 = { 
    produkt: Produkt,
    wybranyRozmiar: string 
}

export type Sortuj = {
    sortujPo: string,
    desc: boolean,
    numeric: boolean
}

export type Kategorie = Kategoria[];
export type Podkategorie = Podkategoria[];
export type ListaProduktow = Produkt[];
export type Galeria = Galeria1[];
export type Koszyk = Koszyk1[];

interface IPageState {
    listaProduktow: ListaProduktow;
    pokazBestsellery: boolean;
    filtrujPoKategorii: number;
    filtrujPoPodkategorii: number;
    panelSrodkowyTytul: string;
    galeria: Galeria; 
    koszyk: Koszyk;
    pokazKoszyk: boolean;
    szukaj: string;
    od: number;
    do: number;
    sortuj: Sortuj; 
};

const pageState = definition<IPageState>()
.setDefault(
{ 
    listaProduktow: [],
    pokazBestsellery: true,
    filtrujPoKategorii: 0,
    filtrujPoPodkategorii: 0,
    panelSrodkowyTytul: "Bestsellery",
    galeria: [],
    koszyk: [],
    pokazKoszyk: false,
    szukaj: '',
    od: 0,
    do: 0,
    sortuj: {
        sortujPo: '',
        desc: true,
        numeric: false
    }
})
.addReducers({
    setListaProduktow : (pageState: IPageState, nowaListaProduktow : ListaProduktow) => 
    {   
        return({...pageState, listaProduktow: nowaListaProduktow })
    },
    setPokazBestsellery : (pageState: IPageState, nowaPokazBestsellery : boolean) => 
    {   
        return({...pageState, pokazBestsellery: nowaPokazBestsellery })
    },
    setFiltrujPoKategorii : (pageState: IPageState, nowaFiltrujPoKategorii : number) => 
    {   
        return({...pageState, filtrujPoKategorii: nowaFiltrujPoKategorii })
    },
    setFiltrujPoPodkategorii : (pageState: IPageState, nowaFiltrujPoPodkategorii : number) => 
    {   
        return({...pageState, filtrujPoPodkategorii: nowaFiltrujPoPodkategorii })
    },
    setPanelSrodkowyTytul : (pageState: IPageState, nowyPanelSrodkowyTytul : string) => 
    {   
        return({...pageState, panelSrodkowyTytul: nowyPanelSrodkowyTytul })
    },
    setGaleria : (pageState: IPageState, nowaGaleria : Galeria) => 
    {   
        return({...pageState, galeria: nowaGaleria })
    },
    updateKoszyk : (pageState: IPageState, nowyKoszyk : Koszyk) => 
    {   
        return({...pageState, koszyk: nowyKoszyk })
    },
    setPokazKoszyk : (pageState: IPageState, nowaPokazKoszyk : boolean) => 
    {   
        return({...pageState, pokazKoszyk: nowaPokazKoszyk })
    },
    setSzukaj : (pageState: IPageState, nowaSzukaj : string) => 
    {   
        return({...pageState, szukaj: nowaSzukaj })
    },
    setOd : (pageState: IPageState, nowaOd : number) => 
    {   
        return({...pageState, od: nowaOd })
    },
    setDo : (pageState: IPageState, nowaDo : number) => 
    {   
        return({...pageState, do: nowaDo })
    },
    setSortuj : (pageState: IPageState, nowaSortuj : Sortuj) => 
    {   
        return({...pageState, sortuj: nowaSortuj })
    },
});

const auth = definition<string | undefined>()
.setDefault(window.localStorage.getItem('accessToken') || undefined)
.use(setValueReducer).addActionCreators({
login: function (accessToken: string) {
 window.localStorage.setItem('accessToken', accessToken);
 return this.setValue(accessToken);
},
logout: function () {
 window.localStorage.removeItem('accessToken');
 return this.setValue(undefined)
}
});

const appState = combine({
auth,
pageState
});

const { Actions, reduce } = create(appState);
export type AppState = StateOf<typeof appState>;

export const store: Store<AppState> = createStore( reduce,
applyMiddleware(thunk, logger),
);

export { Actions };
