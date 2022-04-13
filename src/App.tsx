import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Header from './components/Header/Header';
import All from './components/All/All';
import Clothes from './components/Clothes/Clothes';
import Tech from './components/Tech/Tech';
import Product from './components/Product/Product';
import Cart from './components/Cart/Cart';
import classNames from 'classnames';

import './App.scss';

type State = {
  currency: string,
  showCurrencies: boolean,
  showMiniCart: boolean,
  id: string,
  isVisible: boolean,
  productCount: number,
  cart: any[],
};

export default class App extends React.Component<{}, State> {
  state = {
    currency: '$',
    showCurrencies: false,
    showMiniCart: false,
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
      currency: localStorage.currency,
      showCurrencies: false,
    });

    window.addEventListener('scroll', this.trackScroll);
    window.addEventListener('popstate', this.close);
  };

  componentWillUnmount() {
    window.removeEventListener('scroll', this.trackScroll);
  }

  trackScroll = () => {
    let element = document.documentElement;
    let totalScroll = element.scrollHeight - element.clientHeight;

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

      this.body!.style.overflow = 'overlay';
    }
  };

  closeCurrencyList = () => {
    this.setState(prevState => ({
      showCurrencies: !prevState.showCurrencies,
    }));
  };

  setCurrency = (event: React.MouseEvent<HTMLElement>) => {
    localStorage.setItem('currency', event.currentTarget.id);
    this.setState({
      currency: localStorage.currency,
      showCurrencies: false,
    });
  };

  setShowMiniCart = () => {
    this.setState(prevState => ({
      showMiniCart: !prevState.showMiniCart,
    }));

    if (this.state.showMiniCart) {
      this.body!.style.overflow = 'overlay';
    } else {
      this.body!.style.overflow = 'hidden';
    }
  };

  fillCart = (data: {}) => {
    this.setState({
      cart: [...this.state.cart, data],
    });

    this.setState({
      productCount: this.state.cart.length,
    });

    localStorage.setItem('cart', JSON.stringify(this.state.cart));
    localStorage.setItem('productCount', this.state.productCount.toString());
  };

  addItem = (id: number) => {
    const cartCopy = [...this.state.cart].map(
      (product: any) => (product.id === id
        ? Object.assign(product, { itemCount: product.itemCount + 1 })
        : product
      )
    );

    this.setState({
      cart: cartCopy,
    });
  };

  removeItem = (id: number) => {
    const cartCopy = [...this.state.cart].map(
      (product: any) => (product.id === id
        ? Object.assign(product, { itemCount: product.itemCount - 1 })
        : product
      )
    );

    if (this.state.cart.some((product: any) => product.itemCount === 0)) {
      this.setState({
        productCount: this.state.cart.length - 1,
      })
    }

    this.setState({
      cart: cartCopy.filter((product: any) => product.itemCount > 0),
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
      <div className="wrapper" onClick={this.close}>
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
              path={`/all/:productId`}
              render={(props) => (
                <Product
                  productId={props.match.params.productId}
                  currency={currency}
                  fillCart={this.fillCart}
                />
              )}
            />

            <Route
              path='/all'
              render={() => <All currency={currency} setId={this.setId} />}
            />

            <Route
              path={`/clothes/:productId`}
              render={(props) => (
                <Product
                  productId={props.match.params.productId}
                  currency={currency}
                  fillCart={this.fillCart}
                />
              )}
            />

            <Route
              path='/clothes'
              render={() => <Clothes currency={currency} setId={this.setId} />}
            />

            <Route
              path={`/tech/:productId`}
              render={(props) => (
                <Product
                  productId={props.match.params.productId}
                  currency={currency}
                  fillCart={this.fillCart}
                />
              )}
            />

            <Route
              path='/tech'
              render={() => <Tech currency={currency} setId={this.setId} />}
            />

            <Route
              path='/cart'
              render={() => (
                <Cart
                  cart={this.state.cart}
                  currency={this.state.currency}
                  addItem={this.addItem}
                  removeItem={this.removeItem}
                  clearCart={this.clearCart}
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
  };
};
