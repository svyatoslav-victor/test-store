import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Query } from '@apollo/client/react/components';
import { getCurrencies, getCategoryNames } from '../../Queries/Queries';
import cartIcon from '../../../src/cart.png';

import MiniCart from '../MiniCart/MiniCart';

import './Header.scss';

type Props = {
  currency: string | null,
  showCurrencies: boolean,
  setCurrency: (event: React.MouseEvent<HTMLElement>) => void,
  closeCurrencyList: () => void,
  setShowMiniCart: () => void,
  showMiniCart: boolean,
  productCount: number,
  cart: any[],
  addItem: (props: number) => void,
  removeItem: (props: number) => void,
  clearCart: () => void,
};

export default class Header extends React.Component<Props, {}> {
  render() {

    const {
      currency,
      showCurrencies,
      setCurrency,
      closeCurrencyList,
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
        className="header"
        id="header"
      >
        <Query<any> query={getCategoryNames}>
          {({ data }) => {
            return (
              <>
                {data && (
                  <ul className="header__navigation">
                    {data.categories.map((category: any) => (
                      <li
                        className="header__navigation_item"
                        key={category.name}
                      >
                        <NavLink
                          className="header__navigation_item--link"
                          to={`/${category.name}`}
                        >
                          {category.name.toUpperCase()}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )
          }}
        </Query>

        <Link
          to={'/'}
          className="header__logo"
        >
          &#9730;
        </Link>

        <div className="header__control">
            <Query<any> query={getCurrencies}>
              {({ data }) => {
                return (
                  <div className="header__control_currencies">
                    <div
                      className="currency_picker"
                      onClick={closeCurrencyList}
                    >
                      {currency} &#x2038;
                    </div>
                    <ul
                      className="currency_list"
                      hidden={!showCurrencies}
                      style={{
                        listStyleType: 'none',
                      }}
                    >
                      {data && (
                        data.currencies.map((currency: any) => (
                          <li
                            className="currency_list--item"
                            key={currency.label}
                            id={currency.symbol}
                            onClick={(event) => setCurrency(event)}
                          >
                            {currency.symbol} {currency.label}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                )
              }}

            </Query>
          <div className="header__control_cart">
            <span
              className="product-count"
              hidden={productCount === 0}
            >
              {productCount}
            </span>
            <div
              className="minicart"
            >
              <img
                className="minicart__cart"
                src={cartIcon}
                alt="/"
                onClick={setShowMiniCart}
              />
                <MiniCart
                  currency={currency}
                  showCurrencies={showCurrencies}
                  setCurrency={setCurrency}
                  closeCurrencyList={closeCurrencyList}
                  productCount={productCount}
                  cart={cart}
                  showMiniCart={showMiniCart}
                  setShowMiniCart={setShowMiniCart}
                  addItem={addItem}
                  removeItem={removeItem}
                  clearCart={clearCart}
                />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
