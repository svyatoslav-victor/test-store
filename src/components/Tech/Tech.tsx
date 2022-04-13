import React from 'react';
import { Link } from 'react-router-dom';
import { Query } from '@apollo/client/react/components';
import { getTech } from '../../Queries/Queries';
import classNames from 'classnames';

import '../MainStyle.scss';

type Props = {
  currency: string,
  setId: (event: React.MouseEvent<HTMLElement>) => void,
};

export default class All extends React.Component<Props, {}> {
  componentDidMount() {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  };

  render() {
    const { currency, setId } = this.props;

    return (
      <Query<any> query={getTech}>
        {({ data }) => {
          return (
            <div className="main">
              {data && (
                <>
                  <h2 className="main__name">
                    {data.category.name[0].toUpperCase() + data.category.name.slice(1)}
                  </h2>
                  <div className="main__content">
                    {data.category.products.map((product: any) => (
                      <Link
                        to={`/tech/${product.id}`}
                        className="item"
                        key={product.id}
                        style={{
                          pointerEvents: product.inStock ? 'auto' : 'none',
                        }}
                      >
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
                          {product.prices.filter((price: any) => price.currency.symbol === currency)
                            .map((item: any) => (
                              <p
                                className="item__price--amount"
                                key={item.currency.label}
                              >
                                {item.currency.symbol}{item.amount.toFixed(2)}
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