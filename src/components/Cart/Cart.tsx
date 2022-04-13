import React from 'react';

import './Cart.scss';

type Props = {
  currency: string,
  cart: any[],
  addItem: (props: number) => void,
  removeItem: (props: number) => void,
  clearCart: () => void,
};

type State = {
  index: number,
};

export default class Cart extends React.Component<Props, State> {
  state = {
    index: 0,
  };

  prevImage = () => {
    this.setState(prevState => ({
      index: prevState.index - 1,
    }));
  };

  nextImage = () => {
    this.setState(prevState => ({
      index: prevState.index + 1,
    }));
  };

  render() {
    const {
      cart,
      currency,
      addItem,
      removeItem,
      clearCart,
    } = this.props;

    const { index } = this.state;

    return (
      <div className="cart">
        <div className="cart__header">
        <h3>CART</h3>

        <button
          className="cart__header_clear"
          hidden={cart.length === 0}
          onClick={clearCart}
        >
          X
        </button>
        </div>

        <div className="cart__products">
          {cart.length === 0 && (
          <h3
            className="minicart__products--empty"
          >
            YOUR CART IS EMPTY
          </h3>
        )}
          {cart.map(product => (
            <div
              key={product.id}
              className="cart__products_product"
            >
              <div className="product__data">
                <p className="product__data_brand">{product.brand}</p>
                <p className="product__data_name">{product.name}</p>
                <p className="product__data_price">
                  {currency}
                  {+product.prices
                    .filter((price: any) => price.currency.symbol === currency)
                    .map((price: any) => price.amount)}
                </p>

                <div className="product__data_attributes">
                  {product.attributes.map((value: string) => (
                    value[0] === '#' ? (
                      <div
                        key={value}
                        className="product__data_attributes--swatch"
                        style={{ backgroundColor: value }}
                      >
                      </div>
                    ) : (
                      <div
                        key={value}
                        className="product__data_attributes--text"
                      >
                        {value}
                      </div>
                    )
                  ))}
                </div>
              </div>

              <div className="product__data_itemQuantity">
                <button
                  className="product__data_itemQuantity--add"
                  onClick={(event) => {
                    event.stopPropagation();
                    addItem(product.id);
                  }}
                >
                  +
                </button>
                <p
                  className="product__data_itemQuantity--total"
                >
                  {product.itemCount}
                </p>
                <button
                  className="product__data_itemQuantity--subtract"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(product.id);
                  }}
                >
                  -
                </button>
              </div>

              <div className="product__data_gallery">
                <button
                  className="button button--back"
                  hidden={product.gallery.length === 1}
                  disabled={index === 0}
                  onClick={this.prevImage}
                >
                  &#60;
                </button>

                <div className="product__data_gallery--pic">
                  <img
                    className="image"
                    src={
                      product.gallery.length === 1
                        ? product.gallery[0]
                        : product.gallery[index]
                    }
                    alt="/"
                    width='150px'
                    height='150px'
                  />
                </div>

                <button
                  className="button button--forward"
                  hidden={product.gallery.length === 1}
                  disabled={index === product.gallery.length -  1}
                  onClick={this.nextImage}
                >
                  &#62;
                </button>
              </div>
            </div>
          ))}
        </div>

        <div
          className="cart__products_total"
        >
          <p>Total: </p>
          <p>
          {currency}
          {cart.map(item => (
            +item.prices
              .filter((p: any) => p.currency.symbol === currency)
              .map((i: any) => i.amount)
            ) * item.itemCount).reduce((total, amount) => total + amount, 0).toFixed(2)}
          </p>
        </div>
      </div>
    )
  };
};
