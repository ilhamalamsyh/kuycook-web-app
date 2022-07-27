import { gql } from '@apollo/client';

export const USER_LOGIN = gql`
    mutation login($email: String!, $password: String!){
        login(email:$email, password:$password ){
            user{
            id
            fullname
            gender
            email
            birthDate
            createdAt
            updatedAt
            deletedAt
            }
            token
        }
    }
`;

export const USER_REGISTER = gql`
    mutation register($input: UserRegisterInput!){
        register(input:$input){
            token
            user{
            id
            fullname
            email
            gender
            birthDate
            createdAt
            updatedAt
            deletedAt
            }
            token
        }
    }
`;