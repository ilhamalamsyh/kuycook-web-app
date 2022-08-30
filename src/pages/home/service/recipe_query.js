import { gql } from '@apollo/client';

const RECIPE_LIST = gql`
   query recipeList($page: Int){
    recipeList(page:$page, pageSize:10){
        recipes{
            id
            title
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
            instructions {
                id
                recipeId
                instruction
            }
            ingredients {
                id
                recipeId
                ingredient
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
            meta{
                currentPage
                pageSize
                total
                totalPage
        }
    }
} `;

export default RECIPE_LIST;
