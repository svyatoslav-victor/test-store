import React from 'react';
import { Query } from '@apollo/client/react/components';
import { getProduct } from '../../Queries/Queries';
import { client } from '../../index';
import classNames from 'classnames';

import './Product.scss';

type Props = {
  productId: string,
  currency: string,
  fillCart: (props: {}) => void,
};

type State = {
  selectedIndex: number,
  selectedAttributes: {},
  warning: boolean,
  checkedAttributes: {},
  productInfo: {},
  attributeCount: number,
};

export default class Product extends React.Component<Props, State> {
  state = {
    selectedIndex: 0,
    selectedAttributes: {},
    warning: true,
    checkedAttributes: {},
    productInfo: {},
    attributeCount: 0,
  };
  
  newAttributeSet: any[] = [];

  setAttributes = (event: React.MouseEvent<HTMLElement>) => {
    let name = event.currentTarget.parentElement!.id;
    let value = event.currentTarget.id;

    this.newAttributeSet.push({ [name]: value });

    let checkedSet = this.newAttributeSet.reduce((acc, obj) => Object.assign(acc, obj), {});
    this.setState({
      checkedAttributes: checkedSet,
    });

    if (Object.keys(checkedSet).length > 0 && Object.keys(checkedSet).length !== this.state.attributeCount) {
      this.setState({
        warning: true,
      });
    } else {
      this.setState({
        warning: false,
      });
    }
  };

  addToCart = () => {
    const attributeSet = this.newAttributeSet.reduce((acc, obj) => Object.assign(acc, obj), {});
    this.setState({
      selectedAttributes: attributeSet,
      checkedAttributes: {},
    });

    if (this.state.attributeCount === 0) {
      this.setState({
        warning: false,
      });
    } else {
      this.setState({
        warning: this.state.attributeCount === Object.keys(this.state.checkedAttributes).length,
      })
    }

    this.newAttributeSet.length = 0;

    client.query({
      query: getProduct,
      variables: { id: this.props.productId }
    }).then(result => {
      this.setState({
        productInfo: {
          id: Math.random(),
          brand: result.data.product.brand,
          name: result.data.product.name,
          attributes: Object.values(this.state.selectedAttributes),
          prices: result.data.product.prices,
          gallery: result.data.product.gallery,
          currency: this.props.currency,
          itemCount: 1,
        },
      });

      this.props.fillCart(this.state.productInfo);
    });
  };

  componentDidMount() {
    client.query({
      query: getProduct,
      variables: { id: this.props.productId }
    }).then(result => (
      this.setState({
        attributeCount: result.data.product.attributes.length,
        warning: result.data.product.attributes.length !== Object.keys(this.state.checkedAttributes).length,
      })
    ));
  };

  render() {
    const {
      productId,
      currency,
      fillCart,
    } = this.props;

    const {
      selectedIndex,
      selectedAttributes,
      warning,
      checkedAttributes,
      productInfo,
      attributeCount,
    } = this.state;

    const parser = new DOMParser();

    return (
      <div className="product_info">
        <Query<any> query={getProduct} variables={{ id: productId }}>
          {({ data }) => {
            return (
              <div className="product">
                {data && (
                  <>
                    <div
                      className="product__images"
                    >
                      <div className="product__images_all">
                        {data.product.gallery.map((image: string, index: number) => (
                          <div
                            className="product__images_all--image"
                            key={image}
                            onClick={() => (
                              this.setState({
                                selectedIndex: index,
                              })
                            )}
                          >
                            <img
                              className="pic"
                              src={image} alt="/"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="product__images_first">
                        <img
                          className="first-pic"
                          src={data.product.gallery[selectedIndex]} alt="/"
                        />
                      </div>
                    </div>

                    <div className="product__info">
                      <h1 className="product__info_brand">
                        {data.product.brand}
                      </h1>
                      <h2
                        className="product__info_name"
                      >
                        {data.product.name}
                      </h2>

                      <div className="product__info_attributes">
                        {data.product.attributes.map((attribute: any) => (
                          attribute.name === 'Color' ? (
                          <div
                            className="attribute"
                            key={attribute.id}
                          >
                            <p
                              className="attribute__name"
                            >
                              {(attribute.name).toUpperCase()}:
                            </p>
                            <div
                              id={attribute.name}
                              className="attribute__list"
                            >
                              {attribute.items.map((item: any) => (
                                <div
                                  id={item.value}
                                  className={classNames('attribute__list--item', {
                                    'checked-color': Object.values(checkedAttributes).includes(item.value),
                                  })}
                                  key={item.id}
                                  style={{
                                    backgroundColor: `${item.value}`,
                                  }}
                                  onClick={this.setAttributes}
                                >
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div
                            className="attribute"
                            key={attribute.id}
                          >
                            <p
                              className="attribute__name"
                            >
                              {(attribute.name).toUpperCase()}:
                            </p>
                            <div
                              id={attribute.name}
                              className="attribute__list"
                            >
                              {attribute.items.map((item: any) => (
                                <div
                                  id={item.value}
                                  className={classNames('attribute__list--text-item', {
                                    'checked': Object.values(checkedAttributes).includes(item.value),
                                  })}
                                  key={item.id}
                                  onClick={this.setAttributes}
                                >
                                  {item.value}
                                </div>
                              ))}
                            </div>
                          </div>
                          )
                        ))}
                      </div>

                      <div className="product__info_price">
                        <p className="price">PRICE:</p>
                        {data.product.prices.filter((price: any) => price.currency.symbol === currency)
                            .map((item: any) => (
                              <p
                                className="price--amount"
                                key={item.currency.label}
                              >
                                {item.currency.symbol}{item.amount.toFixed(2)}
                              </p>
                            )
                            )}
                      </div>

                      <div
                        className="warning"
                        style={{
                          visibility: warning ? "visible" : "collapse",
                        }}
                      >
                        {data.product.attributes.length > 0 && (
                          <p className="warning__message">
                            Please configure your product!
                          </p>
                        )}
                      </div>

                      <button
                        className={classNames({
                          'add-to-cart': !warning,
                          'add-to-cart--disabled': warning,
                        })}
                        disabled={warning}
                        onClick={this.addToCart}
                      >
                        ADD TO CART
                      </button>

                      <div
                        className="product__info_description"
                        dangerouslySetInnerHTML={
                          {__html: parser
                            .parseFromString(data.product.description, 'text/html')
                            .body.innerHTML}
                        }
                      >

                      </div>

                    </div>
                  </>
                )}
              </div>
            )
          }}
        </Query>
      </div>
    )
  };
};
