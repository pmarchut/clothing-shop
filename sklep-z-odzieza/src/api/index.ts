import axiosStatic, { AxiosPromise, AxiosInstance } from 'axios';
import CONFIG from '../cfg/config';

let serverUrl = () => {
   return CONFIG.apiURL;
}

export interface IRequestOptions {
  headers?: any;
}

interface IRequestConfig {
  method?: any;
  headers?: any;
  url?: any;
  data?: any;
  params?: any;
}

// Add options interface
export interface ServiceOptions {
  axios?: AxiosInstance;
}

// Add default options
export const serviceOptions: ServiceOptions = {};

// Instance selector
function axios(configs: IRequestConfig): AxiosPromise {
  return serviceOptions.axios ? serviceOptions.axios.request(configs) : axiosStatic(configs);
}

export class produktService {

  static getKategorie(
    options: IRequestOptions = {}
  ): Promise<Kategorie> {
    return new Promise((resolve, reject) => {
      const configs: IRequestConfig = { ...options, method: 'get' };
      configs.headers = {
        ...options.headers,
        'Content-Type': 'application/json'
      };
      let url = serverUrl() + '/api/categories';

      configs.url = url;
      let data = null;

      configs.data = data;
      axios(configs)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static getPodkategorie(
    options: IRequestOptions = {}
  ): Promise<Podkategorie> {
    return new Promise((resolve, reject) => {
      const configs: IRequestConfig = { ...options, method: 'get' };
      configs.headers = {
        ...options.headers,
        'Content-Type': 'application/json'
      };
      let url = serverUrl() + '/api/subcategories';

      configs.url = url;
      let data = null;

      configs.data = data;
      axios(configs)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static getProdukty(
    options: IRequestOptions = {}
  ): Promise<ListaProduktow> {
    return new Promise((resolve, reject) => {
      const configs: IRequestConfig = { ...options, method: 'get' };
      configs.headers = {
        ...options.headers,
        'Content-Type': 'application/json'
      };
      let url = serverUrl() + '/api/products';

      configs.url = url;
      let data = null;

      configs.data = data;
      axios(configs)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static getGaleria(
    params: {
      /**  */
      productId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Galeria1> {
    return new Promise((resolve, reject) => {
      const configs: IRequestConfig = { ...options, method: 'get' };
      configs.headers = {
        ...options.headers,
        'Content-Type': 'application/json'
      };
      let url = serverUrl() + '/api/product/' + params['productId'] + '/images';

      configs.url = url;
      let data = null;

      configs.data = data;
      axios(configs)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

export class Kategoria {
  /**  */
  id: number = 0;

  /**  */
  nazwa: string = '';

  constructor(data?: any) {
    if (data) {
      this['id'] = data['id'];
      this['nazwa'] = data['nazwa'];
    }
  }
}

export type Kategorie = Kategoria[];

export class Podkategoria {
    /**  */
    id: number = 0;
  
    /**  */
    nazwa: string = '';

    /**  */
    kategoriaId: number = 0;
  
    constructor(data?: any) {
      if (data) {
        this['id'] = data['id'];
        this['nazwa'] = data['nazwa'];
        this['kategoriaId'] = data['kategoriaId'];
      }
    }
}
  
export type Podkategorie = Podkategoria[];

type opisPunkt = {
  punkt: string;
}

export class Produkt {
  /**  */
  id: number = 0;

  /**  */
  nazwa: string = '';

  /**  */
  opis: string = '';

  /**  */
  opisPunkty: opisPunkt[] = [];

  /**  */
  cena: string = '';

  /**  */
  rozmiary: string[] = [];

  /**  */
  bestseller: boolean = false;

  /**  */
  obrazek: string = '';

  /**  */
  kategoriaId: number = 0;

  /**  */
  podkategoriaId: number = 0;

  constructor(data?: any) {
    if (data) {
      this['id'] = data['id'];
      this['nazwa'] = data['nazwa'];
      this['opis'] = data['opis'];
      this['opisPunkty'] = data['opisPunkty'];
      this['cena'] = data['cena'];
      this['rozmiary'] = data['rozmiary'];
      this['bestseller'] = data['bestseller'];
      this['obrazek'] = data['obrazek'];
      this['kategoriaId'] = data['kategoriaId'];
      this['podkategoriaId'] = data['podkategoriaId'];
    }
  }
}

export type ListaProduktow = Produkt[];

export type Obrazek = {
  src: string;
};

export class Galeria1 {
  /**  */
  id: number = 0;

  /**  */
  obrazki: Obrazek[] = [];

  constructor(data?: any) {
    if (data) {
      this['id'] = data['id'];
      this['obrazki'] = data['obrazki'];
    }
  }
}
