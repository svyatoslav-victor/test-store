import React from 'react';
import { Query } from '@apollo/client/react/components';
import { getProduct } from '../../Queries/Queries';
import { client } from '../../index'
import {
  Price,
  Attribute,
  AttributeSet,
  ProductInfo,
  ProductQuery
} from '../../types';
import classNames from 'classnames';

import './Product.scss';

type Props = {
  categoryName: string,
  productId: string,
  currency: string,
  fillCart: (props: ProductInfo) => void,
};

type State = {
  selectedIndex: number,
  selectedAttributes: Record<string, string>,
  warning: boolean,
  checkedAttributes: Record<string, string>,
  productInfo: ProductInfo,
  attributeCount: number,
  inStock: boolean,
};

export default class Product extends React.Component<Props, State> {
  state = {
    selectedIndex: 0,
    selectedAttributes: {
      name: '',
    },
    warning: true,
    checkedAttributes: {},
    productInfo: {
      id: '',
      brand: '',
      name: '',
      attributes: [],
      prices: [],
      gallery: [],
      imageIndex: -1,
      currency: '',
      itemCount: -1,
    },
    attributeCount: 0,
    inStock: true,
  };
  
  newAttributeSet: Record<string, string>[] = [];

  setAttributes = (event: React.MouseEvent<HTMLElement>) => {
    if (event.currentTarget.parentElement && this.state.inStock) {
      const name = event.currentTarget.parentElement.id;
      const value = event.currentTarget.id;
  
      this.newAttributeSet.push({ [name]: value });
  
      const checkedSet = this.newAttributeSet.reduce((acc, obj) => Object.assign(acc, obj), {});
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
          id: Object.values(attributeSet).length === 0
            ? Math.random().toString()
            : Object.values(attributeSet).sort().join(''),
          brand: result.data.product.brand,
          name: result.data.product.name,
          attributes: Object.values(this.state.selectedAttributes).sort(),
          prices: result.data.product.prices,
          gallery: result.data.product.gallery,
          imageIndex: 0,
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
        inStock: result.data.product.inStock,
        warning: result.data.product.attributes.length !== Object.keys(this.state.checkedAttributes).length,
      })
    ));
  }

  render() {
    const {
      productId,
      currency,
    } = this.props;

    const {
      selectedIndex,
      warning,
      checkedAttributes,
      inStock,
    } = this.state;

    const parser = new DOMParser();

    return (
      <div className="product_info">
        <Query<ProductQuery> query={getProduct} variables={{ id: productId }}>
          {({ data }) => {
            return (
              <div className="product">
                {data && (
                  <>
                    <div className="product__images_wrapper">
                      {!data.product.inStock && (
                        <h5
                          className="product__out-of-stock"
                        >
                          OUT OF STOCK
                        </h5>
                      )}

                      <div
                        className={classNames({
                          'product__images': data.product.inStock,
                          'product__images--out-of-stock': !data.product.inStock,
                        })}
                      >
                        <div className="product__images_all">
                          {data.product.gallery.map((image: string, index: number) => (
                            <div
                              className="product__images_all--image"
                              key={image}
                              style={{
                                cursor: data.product.inStock ? 'pointer' : 'default',
                              }}
                              onClick={() => (
                                data.product.inStock && (
                                  this.setState({
                                    selectedIndex: index,
                                  })
                                )
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
                        {data.product.attributes.map((attribute: AttributeSet) => (
                          attribute.name === 'Color' ? (
                          <div
                            className={classNames("attribute", {
                              'inactive': !data.product.inStock,
                            })}
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
                              {attribute.items.map((item: Attribute) => (
                                <div
                                  id={item.value}
                                  className={classNames('attribute__list--item', {
                                    'checked-color': Object.values(checkedAttributes).includes(item.value),
                                    'unavailable' : !inStock,
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
                            className={classNames("attribute", {
                              'inactive': !data.product.inStock,
                            })}
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
                              {attribute.items.map((item: Attribute) => (
                                item.value === 'Yes' || item.value === 'No'
                                  ? (<div
                                      id={`${attribute.name}:${item.value}`}
                                      className={classNames('attribute__list--text-item', {
                                        'checked': Object.values(checkedAttributes).includes(`${attribute.name}:${item.value}`),
                                        'unavailable' : !inStock,
                                      })}
                                      key={item.id}
                                      onClick={this.setAttributes}
                                    >
                                      {item.value}
                                    </div>)
                                  : (<div
                                      id={item.value}
                                      className={classNames('attribute__list--text-item', {
                                        'checked': Object.values(checkedAttributes).includes(item.value),
                                        'unavailable' : !inStock,
                                      })}
                                      key={item.id}
                                      onClick={this.setAttributes}
                                    >
                                      {item.value}
                                    </div>)
                              ))}
                            </div>
                          </div>
                          )
                        ))}
                      </div>

                      <div className="product__info_price">
                        <p className="price">PRICE:</p>
                        {data.product.prices.filter((price: Price) => price.currency.symbol === currency)
                            .map((price: Price) => (
                              <p
                                className="price--amount"
                                key={price.currency.label}
                              >
                                {price.currency.symbol}{price.amount.toFixed(2)}
                              </p>
                            )
                            )}
                      </div>

                      <div
                        className="warning"
                        hidden={!data.product.inStock}
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
                        {data.product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
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
  }
}
