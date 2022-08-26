import { styled } from '@mui/material/styles';
import MuiButton from '@mui/material/Button';

export const PrimaryButton = styled(MuiButton)(({theme, pill})=> ({
	borderRadius: pill ? theme.shape.pillRadius : theme.shape.borderRadius
}));