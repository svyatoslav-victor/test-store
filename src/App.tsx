import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Header from './components/Header/Header';
import Goods from './components/Goods/Goods';
import Product from './components/Product/Product';
import Cart from './components/Cart/Cart';
import { ProductInfo } from './types';
import classNames from 'classnames';

import './App.scss';

type State = {
  currency: string,
  showCurrencies: boolean,
  showMiniCart: boolean,
  categoryName: string,
  id: string,
  isVisible: boolean,
  productCount: number,
  cart: ProductInfo[],
};

export default class App extends React.Component<Record<string, unknown>, State> {
  state = {
    currency: '$',
    showCurrencies: false,
    showMiniCart: false,
    categoryName: '',
    id: '',
    isVisible: false,
    productCount: 0,
    cart: [],
  };

  body = document.querySelector('body');

  componentDidMount() {
    this.setState({
      cart: JSON.parse(localStorage.cart || "[]"),
      productCount: +localStorage.productCount || 0,
      currency: localStorage.currency || "$",
      showCurrencies: false,
    });

    window.addEventListener('scroll', this.trackScroll);
    window.addEventListener('popstate', this.close);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.trackScroll);
  }

  trackScroll = () => {
    const element = document.documentElement;
    const totalScroll = element.scrollHeight - element.clientHeight;

    if ((element.scrollTop / totalScroll) > 0.80) {
      this.setState({
        isVisible: true,
      })
    } else {
      this.setState({
        isVisible: false,
      })
    }
  };

  setId = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({
      id: event.currentTarget.id,
    });
  };

  setCategory = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({
      categoryName: event.currentTarget.id,
    });
  };

  close = () => {
    if (this.state.showCurrencies) {
      this.setState({
        showCurrencies: false,
      });
    }

    if (this.state.showMiniCart) {
      this.setState({
        showMiniCart: false,
      });

      if (this.body) {
        this.body.style.overflow = 'overlay';
      }
    }
  };

  closeCurrencyList = () => {
    this.setState(prevState => ({
      showCurrencies: !prevState.showCurrencies,
    }));
  };

  setCurrency = (event: React.MouseEvent<HTMLElement>) => {
    localStorage.setItem('currency', event.currentTarget.id || '$');
    this.setState({
      currency: localStorage.currency,
      showCurrencies: false,
    });
  };

  setShowMiniCart = () => {
    this.setState(prevState => ({
      showMiniCart: !prevState.showMiniCart,
    }));

    if (this.state.showMiniCart && this.body) {
      this.body.style.overflow = 'overlay';
    } else if (this.body) {
      this.body.style.overflow = 'hidden';
    }
  };

  fillCart = (data: ProductInfo) => {
    if (this.state.cart.length === 0) {
      this.setState({
        cart: [...this.state.cart, data],
      });
  
      this.setState({
        productCount: 1,
      });
    } else {
      this.state.cart.forEach((product: ProductInfo) => {
        if (this.state.cart.find((product: ProductInfo) => product.id === data.id)) {
          if (product.id === data.id) {
            Object.assign(product, { itemCount: product.itemCount + 1 });
            this.setState({
              productCount: this.state.productCount + 1,
            });
          }
          return;
        } else {
          this.setState({
            cart: [...this.state.cart, data],
          });
      
          this.setState(prevState => ({
            productCount: prevState.productCount + 1,
          }));
        }
      })
    }

    localStorage.setItem('cart', JSON.stringify(this.state.cart));
    localStorage.setItem('productCount', this.state.productCount.toString());
  };

  addItem = (id: string) => {
    const cartCopy = [...this.state.cart].map(
      (product: ProductInfo) => (product.id === id
        ? Object.assign(product, { itemCount: product.itemCount + 1 })
        : product
      )
    );

    this.setState(prevState => ({
      productCount: prevState.productCount + 1,
    }));

    this.setState({
      cart: cartCopy,
    });
  };

  removeItem = (id: string) => {
    const cartCopy = [...this.state.cart].map(
      (product: ProductInfo) => (product.id === id
        ? Object.assign(product, { itemCount: +product.itemCount - 1 })
        : product
      )
    );

    this.setState(prevState => ({
      productCount: prevState.productCount - 1,
    }));

    this.setState({
      cart: cartCopy.filter((product: ProductInfo) => product.itemCount > 0),
    });
  };

  prevImage = (id: string) => {
    const cartCopy = [...this.state.cart].map(
      (product: ProductInfo) => (product.id === id
        ? Object.assign(product, { imageIndex: +product.imageIndex - 1 })
        : product
      )
    );

    this.setState({
      cart: cartCopy,
    });
  }

  nextImage = (id: string) => {
    const cartCopy = [...this.state.cart].map(
      (product: ProductInfo) => (product.id === id
        ? Object.assign(product, { imageIndex: product.imageIndex + 1 })
        : product
      )
    );

    this.setState({
      cart: cartCopy,
    });
  };

  clearCart = () => {
    this.setState({
      cart: [],
      productCount: 0,
    });

    localStorage.removeItem('cart');
    localStorage.removeItem('productCount');
  };

  render() {
    const { currency, showCurrencies, isVisible } = this.state;

    return (
      <div
        className="wrapper"
        onClick={this.close}
      >
        <div
          className={classNames({
            'overlay-visible': this.state.showMiniCart,
            'overlay-hidden': !this.state.showMiniCart,
          })}
        >
        </div>
        <div className="content">
          <div
            className="scrollToTop"
          >
            <button
              className="scrollToTop__button"
              style={{
                opacity: !isVisible ? 0 : 1,
              }}
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                });
              }}
            >
              &#8673;
            </button>
          </div>

          <Header
            currency={currency}
            showCurrencies={showCurrencies}
            setCurrency={this.setCurrency}
            closeCurrencyList={this.closeCurrencyList}
            productCount={this.state.productCount}
            setCategoryName={this.setCategory}
            cart={this.state.cart}
            showMiniCart={this.state.showMiniCart}
            setShowMiniCart={this.setShowMiniCart}
            addItem={this.addItem}
            removeItem={this.removeItem}
            clearCart={this.clearCart}
          />

          <Switch>
            <Route
              exact path='/'
              component={Home}
            />

            <Route
              path='/cart'
              render={() => (
                <Cart
                  cart={this.state.cart}
                  currency={this.state.currency}
                  addItem={this.addItem}
                  removeItem={this.removeItem}
                  prevImage={this.prevImage}
                  nextImage={this.nextImage}
                  clearCart={this.clearCart}
                />
              )}
            />

            <Route
              path={`/:categoryName/:productId`}
              render={(props) => (
                <Product
                  categoryName={props.match.params.categoryName}
                  productId={props.match.params.productId}
                  currency={currency}
                  fillCart={this.fillCart}
                />
              )}
            />

            <Route
              path={`/:categoryName`}
              render={(props) => (
                <Goods
                  categoryName={props.match.params.categoryName}
                  currency={currency}
                  setId={this.setId}
                  fillCart={this.fillCart}
                />
              )}
            />
          </Switch>

          <div className="footer">
            &#169; 2022
          </div>
        </div>
      </div>
    )
  }
}
