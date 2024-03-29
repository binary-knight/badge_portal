/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTinyURLMapping = /* GraphQL */ `
  query GetTinyURLMapping($id: ID!) {
    getTinyURLMapping(id: $id) {
      id
      fileKey
      tinyUrl
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listTinyURLMappings = /* GraphQL */ `
  query ListTinyURLMappings(
    $filter: ModelTinyURLMappingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTinyURLMappings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        fileKey
        tinyUrl
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
