import { gql } from "@apollo/client";

  export const getAll = gql`
  {
    category(input: {title: "all"}) {
      name
      products {
        id
        name
        brand
        inStock
        prices {
          amount
          currency {
            label
            symbol
          }
        }
        gallery
      }
    }
  }
`;

  export const getClothes = gql`
    query getClothes {
      category(input: {title: "clothes"}) {
        name
        products {
          id
          name
          brand
          inStock
          prices {
            amount
            currency {
              label
              symbol
            }
          }
          gallery
        }
      }
    }
  `;

  export const getTech = gql`
    {
      category(input: {title: "tech"}) {
        name
        products {
          id
          name
          brand
          inStock
          prices {
            amount
            currency {
              label
              symbol
            }
          }
          gallery
        }
      }
    }
  `;

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