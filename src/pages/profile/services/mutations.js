import { gql } from '@apollo/client';

export const USER_UPDATE = gql`
    mutation userUpdate($id: ID!, $input: UserUpdate!){
        userUpdate(id:$id, input:$input){
            id
            fullname
            birthDate
            gender
            email
            createdAt
            updatedAt
            deletedAt
        }
    }
`;