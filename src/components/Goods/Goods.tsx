import React from 'react';
import { Link } from 'react-router-dom';
import { Query } from '@apollo/client/react/components';
import { client } from '../../index';
import { getGoods } from '../../Queries/Queries';
import {
  Price,
  AttributeSet,
  ProductType,
  ProductInfo,
  GoodsQuery
} from '../../types';
import classNames from 'classnames';

import './Goods.scss';

type Props = {
  categoryName: string,
  currency: string,
  setId: (event: React.MouseEvent<HTMLElement>) => void,
  fillCart: (props: ProductInfo) => void,
};

type State = {
  productInfo: ProductInfo,
};

export default class All extends React.Component<Props, State> {
  state = {
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
  };

  componentDidMount() {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  }

  addDefault = (id: string) => {
    client.query({
      query: getGoods,
      variables: { title: this.props.categoryName }
    }).then(result => {
      result.data.category.products.map((product: ProductType) => {
        if (product.id === id) {
          this.setState({
            productInfo: {
              id: product.attributes.length === 0
                ? Math.random().toString()
                : product.attributes.map((attribute: AttributeSet) => attribute.items[0].value).sort().join(''),
              brand: product.brand,
              name: product.name,
              attributes: product.attributes.map((attribute: AttributeSet) => attribute.items[0].value).sort(),
              prices: product.prices,
              gallery: product.gallery,
              imageIndex: 0,
              currency: this.props.currency,
              itemCount: 1,
            }
          });

          this.props.fillCart(this.state.productInfo);
        }
      })
    });
  };

  render() {
    const { categoryName, currency, setId } = this.props;

    return (
      <Query<GoodsQuery> query={getGoods} variables={{ title: categoryName }}>
        {({ data }) => {
          return (
            <div className="main">
              {data && (
                <>
                  <h2 className="main__name">
                    {data.category.name[0].toUpperCase() + data.category.name.slice(1)}
                  </h2>
                  <div className="main__content">
                    {data.category.products.map((product: ProductType) => (
                      <Link
                        to={`/${categoryName}/${product.id}`}
                        className="item"
                        key={product.id}
                      >
                        <button
                          className="item__addDefault"
                          hidden={!product.inStock}
                          onClick={(event) => {
                            event.preventDefault();
                            this.addDefault(product.id);
                          }}
                        >
                        </button>

                        <div
                          className="item__wrapper"
                        >
                          {!product.inStock && (
                            <h5
                              className="item__out-of-stock"
                            >
                              OUT OF STOCK
                            </h5>
                          )}

                          <div
                            className={classNames({
                              'item__image': product.inStock,
                              'item__image--out-of-stock': !product.inStock,
                            })}
                            style={{
                              backgroundImage: `url(${product.gallery[0]})`
                            }}
                            onClick={setId}
                          >
                          </div>

                        </div>
                        <p className="item__name">{product.brand} {product.name}</p>

                        <h3
                          className="item__price"
                        >
                          {product.prices.filter((price: Price) => price.currency.symbol === currency)
                            .map((price: Price) => (
                              <p
                                className="item__price--amount"
                                key={price.currency.label}
                              >
                                {price.currency.symbol}{price.amount.toFixed(2)}
                              </p>
                            )
                            )}
                        </h3>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          )
        }}
      </Query>
    )
  }
}
