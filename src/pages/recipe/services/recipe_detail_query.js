import { gql } from '@apollo/client';

const RECIPE_DETAIL = gql `
   query recipeDetail($id: ID!){
  recipeDetail(id:$id){
    id
    title
    description
    isFavorite
    servings
    cookingTime
    author {
      id
      fullname
      gender
      email
      birthDate
      createdAt
      updatedAt
      deletedAt
    }
    instructions{
      id
      instruction
      recipeId
      createdAt
      updatedAt
      deletedAt
    }
    ingredients{
      id
      ingredient
      recipeId
      createdAt
      updatedAt
      deletedAt
    }
    image{
      id
      url
      recipeId
      createdAt
      updatedAt
      deletedAt
    }
    createdAt
    updatedAt
    deletedAt
  }
}
`;

export default RECIPE_DETAIL;