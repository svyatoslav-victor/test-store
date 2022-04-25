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
  setCategoryName: (event: React.MouseEvent<HTMLElement>) => void,
  cart: unknown[],
  addItem: (props: string) => void,
  removeItem: (props: string) => void,
  clearCart: () => void,
};

export default class Header extends React.Component<Props, Record<string, unknown>> {
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
        <Query<Record<string, any>> query={getCategoryNames}>
          {({ data }) => {
            return (
              <>
                {data && (
                  <ul className="header__navigation">
                    {data.categories.map((category: Record<string, string>) => (
                      <li
                        id={category.name}
                        className="header__navigation_item"
                        key={category.name}
                        onClick={this.props.setCategoryName}
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
            <Query<Record<string, any>> query={getCurrencies}>
              {({ data }) => {
                return (
                  <div className="header__control_currencies">
                    <div
                      className="currency_picker"
                      onClick={closeCurrencyList}
                    >
                      {currency}
                      <span
                        className="currency_picker_arrow"
                        style={{
                          transform: showCurrencies ? 'rotate(90deg)' : 'rotate(270deg)',
                        }}
                      >
                        &#60;
                      </span>
                    </div>
                    <ul
                      className="currency_list"
                      hidden={!showCurrencies}
                      style={{
                        listStyleType: 'none',
                      }}
                    >
                      {data && (
                        data.currencies.map((currency: Record<string, string>) => (
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
