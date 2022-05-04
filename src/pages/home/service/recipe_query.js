import { gql } from '@apollo/client';

const RECIPE_LIST = gql`
   query recipeList($page: Int){
    recipeList(page:$page, pageSize:10){
        id
        title
        servings
        cookingTime
        instructions{
            id
            recipeId
            instruction
        }
        ingredients{
            id
            recipeId
            ingredient
        }
        image{
            id
            url
            recipeId
        }
        createdAt
        updatedAt
        deletedAt
    }
} `;

export default RECIPE_LIST;
