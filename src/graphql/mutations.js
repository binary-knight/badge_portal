/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTinyURLMapping = /* GraphQL */ `
  mutation CreateTinyURLMapping(
    $input: CreateTinyURLMappingInput!
    $condition: ModelTinyURLMappingConditionInput
  ) {
    createTinyURLMapping(input: $input, condition: $condition) {
      id
      fileKey
      tinyUrl
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateTinyURLMapping = /* GraphQL */ `
  mutation UpdateTinyURLMapping(
    $input: UpdateTinyURLMappingInput!
    $condition: ModelTinyURLMappingConditionInput
  ) {
    updateTinyURLMapping(input: $input, condition: $condition) {
      id
      fileKey
      tinyUrl
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteTinyURLMapping = /* GraphQL */ `
  mutation DeleteTinyURLMapping(
    $input: DeleteTinyURLMappingInput!
    $condition: ModelTinyURLMappingConditionInput
  ) {
    deleteTinyURLMapping(input: $input, condition: $condition) {
      id
      fileKey
      tinyUrl
      createdAt
      updatedAt
      __typename
    }
  }
`;
