import { gql } from '@apollo/client';

export const CREATE_RECIPE = gql`
    mutation createRecipe($input: RecipeInput!) {
        recipeCreate(input: $input) {
            id
            title
            servings
            cookingTime
            description
            ingredients {
                id
                ingredient
                recipeId
            }
            instructions {
                id
                recipeId
                instruction
            }
            image {
                id
                recipeId
            }
            isFavorite
            createdAt
            updatedAt
            deletedAt
        }
    }
`;

export const UPDATE_RECIPE = gql`
    mutation updateRecipe($id: ID!, $input: RecipeInput!) {
        recipeUpdate(
            id: $id,
            input: $input
            ) 
        {
            id
            title
            servings
            cookingTime
            description
            isFavorite
            ingredients {
                id
                recipeId
                ingredient
            }
            instructions {
                id
                recipeId
                instruction
            }
            image {
                id
                url
                recipeId
            }
            createdAt
            updatedAt
            deletedAt
        }
    }
`;