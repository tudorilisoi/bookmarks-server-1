import * as yup from 'yup'
import { getValidationErrors } from '../../helpers';

export const validateBookmark = () => {
    const schema = yup.object().shape({
        title: yup.string()
            .label('Title')
            .required(),
        url: yup.string().url(),
        rating: yup.number().required().positive().integer(),
    })
    return schema
}

