import React from 'react';
import { Link } from 'react-router-dom';
import {
  Price,
  ProductInfo
} from '../../types';

import './MiniCart.scss';

type Props = {
  currency: string | null,
  showCurrencies: boolean,
  setCurrency: (event: React.MouseEvent<HTMLElement>) => void,
  closeCurrencyList: () => void,
  setShowMiniCart: () => void,
  showMiniCart: boolean,
  productCount: number,
  cart: ProductInfo[],
  addItem: (props: string) => void,
  removeItem: (props: string) => void,
  clearCart: () => void,
};

export default class MiniCart extends React.Component<Props, Record<string, unknown>> {
  render() {

    const {
      currency,
      setShowMiniCart,
      showMiniCart,
      productCount,
      cart,
      addItem,
      removeItem,
      clearCart,
    } = this.props;

    return (
      <div
        className="minicart__products"
        style={{
          visibility: showMiniCart ? 'visible' : 'hidden',
        }}
      >
        <p
          className="bag-contents"
        >
          My Bag:&nbsp;
          <span
            className="items-count"
          >
            {productCount} {productCount === 1 ? 'Item' : 'Items'}
          </span>
        </p>
        {productCount === 0 && (
          <h3
            className="minicart__products--empty"
          >
            YOUR CART IS EMPTY
          </h3>
        )}
        <div className="minicart__products_contents">
          {cart.map((item, index) => (
            <div
              key={index}
              className="contents--item"
            >
              <div className="item_info">
                <p className="item_info--brand">{item.brand}</p>
                <p className="item_info--name">{item.name}</p>
                <p className="item_info--price">
                  {currency}{+(item.prices.filter((price: Price) => (
                    price.currency.symbol === currency))
                    .map((price: Price) => price.amount)
                  )}
                </p>
                <div className="item_info--attributes">
                  {item.attributes.map((value: string) => (
                    value[0] === '#' ? (
                      <div
                        key={value}
                        className="item_info--attributes-swatch"
                        style={{ backgroundColor: value }}
                      >
                      </div>
                    ) : (
                      value.includes('No')
                        ? null
                        : (
                          <div
                            key={value}
                            className="item_info--attributes-text"
                            style={{
                              fontSize: value.includes('Yes') ? '9px' : '12px',
                              textAlign: 'center',
                            }}
                          >
                            {value.includes('Yes') ? value.slice(0, value.indexOf(':')) : value}
                          </div>
                        )
                    )
                  ))}
                </div>
              </div>
              <div className="item_quantity">
                <button
                  className="item_quantity--add"
                  onClick={(event) => {
                    event.stopPropagation();
                    addItem(item.id);
                  }}
                >
                  +
                </button>
                <p
                  className="item_quantity--total"
                >
                  {item.itemCount}
                </p>
                <button
                  className="item_quantity--subtract"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(item.id);
                  }}
                >
                  -
                </button>
              </div>
              <div className="item_gallery">
                <img
                  className="item_gallery--pic"
                  src={item.gallery[0]}
                  alt="/"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="bag-total">
          <span>Total:</span>
          <span>
            {currency}{
              cart.map(item => (
                +item.prices
                  .filter((price: Price) => price.currency.symbol === currency)
                  .map((price: Price) => price.amount)
                ) * item.itemCount).reduce((total, cost) => total + cost, 0).toFixed(2)
            }
          </span>
        </div>
        <div className="minicart__buttons">
          <Link
            to={'/cart'}
          >
            <button
              className="button button__view-bag"
              onClick={setShowMiniCart}
            >
              VIEW BAG
            </button>
          </Link>
          <button
            className="button button__checkout"
            onClick={clearCart}
          >
            CHECKOUT
          </button>
        </div>
      </div>
    )
  }
}
