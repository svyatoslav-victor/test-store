import { gql } from "@apollo/client";

export const getCurrencies = gql`
  {
    currencies {
      label
      symbol
    }
  }
`;

export const getCategoryNames = gql`
  {
    categories {
      name
    }
  }
`;

export const getGoods = gql`
  query getGoods($title: String!) {
    category(input: {title: $title}) {
      name
      products {
        id
        name
        brand
        inStock
        attributes {
          id
          name
          type
          items {
            id
            value
            displayValue
          }
        }
        prices {
          amount
          currency {
            label
            symbol
          }
        }
        description
        gallery
      }
    }
  }
`;

export const getProduct = gql`
  query getProduct($id: String!) {
    product(id: $id) {
      id
      name
      brand
      inStock
      attributes {
        id
        name
        type
        items {
          id
          value
          displayValue
        }
      }
      prices {
        amount
        currency {
          label
          symbol
        }
      }
      description
      gallery
    }
  }
`;
