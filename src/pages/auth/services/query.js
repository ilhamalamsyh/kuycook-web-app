import { gql } from '@apollo/client';

const CURRENT_USER = gql`
   query currentUser{
    currentUser{
        id
        fullname
        gender
        email
        birthDate
        image
        createdAt
        updatedAt
        deletedAt
    }
}`;

export default CURRENT_USER;
